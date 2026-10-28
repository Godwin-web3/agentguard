import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { timingSafeEqual, randomBytes } from "node:crypto";
import { Store } from "./store.ts";
import { Signer } from "./keys.ts";
import { Gateway, GatewayError } from "./gateway.ts";
import { PasskeyService } from "./passkeys.ts";
import { HeuristicRiskAnalyzer, LLMRiskAnalyzer, CompositeRiskAnalyzer, type RiskAnalyzer } from "./risk.ts";
import { PayPalClient, lazyPayPalRail, type PaymentRail } from "./paypal.ts";
import { draftFromText, summarize, type LLMConfig } from "./drafter.ts";
import { readFileSync } from "node:fs";
import { canonical } from "./canonical.ts";

const PORT = Number(process.env.PORT ?? 8787);
const PUBLIC_URL = process.env.AGENTGUARD_PUBLIC_URL ?? `http://localhost:${PORT}`;
const ADMIN = process.env.AGENTGUARD_ADMIN_TOKEN ?? "";
if (!ADMIN || ADMIN.length < 24) { console.error("Set AGENTGUARD_ADMIN_TOKEN (>=24 chars). It guards the user/owner endpoints."); process.exit(1); }

let paypal: PayPalClient | null = null;
const pp = () => (paypal ??= new PayPalClient());
const rail: PaymentRail = lazyPayPalRail(pp);

const risk: RiskAnalyzer = process.env.LLM_API_KEY
  ? new CompositeRiskAnalyzer(new HeuristicRiskAnalyzer(), new LLMRiskAnalyzer({ baseUrl: process.env.LLM_BASE_URL ?? "https://api.openai.com/v1",
      apiKey: process.env.LLM_API_KEY, model: process.env.LLM_MODEL ?? "gpt-4o-mini" }))
  : new HeuristicRiskAnalyzer();

const llm: LLMConfig | undefined = process.env.LLM_API_KEY
  ? { baseUrl: process.env.LLM_BASE_URL ?? "https://api.openai.com/v1", apiKey: process.env.LLM_API_KEY, model: process.env.LLM_MODEL ?? "gpt-4o-mini" } : undefined;
const CONSOLE_HTML = readFileSync(new URL("./console.html", import.meta.url), "utf8");

const store = new Store();
const WALLET_SETUP_TTL_MS = 30 * 60 * 1000;
store.db.exec("CREATE TABLE IF NOT EXISTS wallet_setups (state TEXT PRIMARY KEY, user_id TEXT NOT NULL, setup_token_id TEXT NOT NULL, expires_at TEXT NOT NULL)");
// The server key signs audit-log attestations only. Mandates and revocations are signed by the user's passkey.
const signer = Signer.load();
const RP_ID = process.env.AGENTGUARD_RP_ID ?? new URL(PUBLIC_URL).hostname;
const passkeys = new PasskeyService(store, { rpID: RP_ID, rpName: process.env.AGENTGUARD_RP_NAME ?? "AgentGuard", origin: new URL(PUBLIC_URL).origin });
const gw = new Gateway({ store, passkeys, risk, rail });

// Per-agent sliding window on propose. Stops a compromised agent from flooding the gateway.
const RATE_LIMIT = Number(process.env.AGENTGUARD_AGENT_RATE_LIMIT ?? 30);
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, number[]>();
function checkRate(agentId: string): boolean {
  const now = Date.now();
  const window = (rateBuckets.get(agentId) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (window.length >= RATE_LIMIT) return false;
  window.push(now);
  rateBuckets.set(agentId, window);
  return true;
}

// Crash recovery: converge any payments left in reserved/authorized after a restart or network drop.
const RECOVER_INTERVAL_MS = Number(process.env.AGENTGUARD_RECOVER_INTERVAL_MS ?? 5 * 60_000);
let lastRecovery: { at: string; scanned: number; actions: string[]; error?: string } | null = null;
async function runRecover() {
  try {
    const r = await gw.reconcile();
    lastRecovery = { at: new Date().toISOString(), scanned: r.scanned, actions: r.actions };
    if (r.scanned) console.log(`[recover] scanned=${r.scanned} actions=${r.actions.join(",") || "none"}`);
  } catch (e) {
    lastRecovery = { at: new Date().toISOString(), scanned: 0, actions: [], error: (e as Error).message };
    console.error("[recover] failed", e);
  }
}
runRecover();
setInterval(runRecover, RECOVER_INTERVAL_MS).unref();

type Handler = (ctx: { req: IncomingMessage; body: any; params: string[]; query: URLSearchParams; agent?: { agent_id: string; user_id: string } }) => Promise<unknown> | unknown;
const routes: { method: string; re: RegExp; auth: "admin" | "agent" | "none"; h: Handler }[] = [];
const route = (method: string, path: string, auth: "admin" | "agent" | "none", h: Handler) =>
  routes.push({ method, re: new RegExp("^" + path.replace(/:\w+/g, "([^/]+)") + "$"), auth, h });

// ---- public ----
route("GET", "/health", "none", () => {
  const stuck = store.listStuck(new Date(Date.now() - 60_000).toISOString()).length;
  return { ok: stuck === 0 && !lastRecovery?.error, stuck, last_recovery: lastRecovery };
});
route("GET", "/.well-known/agentguard-key", "none", () => ({ alg: "Ed25519", use: "audit-attestation", public_key_pem: signer.publicKeyPem() }));

// ---- owner (the human delegating authority) ----
route("POST", "/v1/agents", "admin", ({ body }) => gw.registerAgent(req(body, "user_id"), req(body, "agent_id")));
route("POST", "/v1/wallets/setup", "admin", async ({ body }) => {
  const user = req(body, "user_id");
  // Bind the user to an unguessable one-time state value server-side; the return URL carries only that state.
  const state = randomBytes(24).toString("base64url");
  const t = await pp().createSetupToken(`${PUBLIC_URL}/v1/wallets/return?state=${state}`, `${PUBLIC_URL}/v1/wallets/cancel`);
  store.db.prepare("INSERT INTO wallet_setups (state, user_id, setup_token_id, expires_at) VALUES (?,?,?,?)")
    .run(state, user, t.id, new Date(Date.now() + WALLET_SETUP_TTL_MS).toISOString());
  return t;
});
// PayPal redirects the buyer here after consent; the setup token id arrives as approval_token_id.
route("GET", "/v1/wallets/return", "none", async ({ query }) => {
  const state = query.get("state"); const tok = query.get("approval_token_id");
  if (!state || !tok) throw new GatewayError(400, "missing state or approval_token_id");
  // Single-use: consume the state atomically. user_id comes from our record, never from the query string,
  // and the approval token must be the setup token we created for that user.
  const row = store.db.prepare("DELETE FROM wallet_setups WHERE state=? RETURNING user_id, setup_token_id, expires_at").get(state) as any;
  if (!row || row.setup_token_id !== tok || new Date() > new Date(row.expires_at)) throw new GatewayError(403, "invalid or expired wallet setup state");
  const user = row.user_id as string;
  const t = await pp().createPaymentToken(tok);
  gw.linkWallet(user, t.vault_id, t.payer_email);
  return { linked: true, user_id: user, payer_email: t.payer_email ?? null };
});
route("POST", "/v1/wallets/link", "admin", ({ body }) => { gw.linkWallet(req(body, "user_id"), req(body, "vault_id"), body.payer_email); return { linked: true }; });
route("POST", "/v1/mandates", "admin", ({ body }) => gw.draftMandate({ user_id: req(body, "user_id"), agent_id: req(body, "agent_id"),
  purpose: req(body, "purpose"), constraints: body.constraints, ttl_minutes: body.ttl_minutes }));
// AI proposes constraints from plain English; nothing is active until the owner confirms the returned hash.
route("POST", "/v1/mandates/draft-from-text", "admin", async ({ body }) => {
  let d; try { d = await draftFromText(req(body, "text"), llm); } catch (e: any) { throw e instanceof GatewayError ? e : new GatewayError(400, e.message); }
  const m = gw.draftMandate({ user_id: req(body, "user_id"), agent_id: req(body, "agent_id"), purpose: d.purpose, constraints: d.constraints, ttl_minutes: d.ttl_minutes });
  return { ...m, summary: d.summary, warnings: d.warnings, source: d.source };
});
// Passkeys: one per user, created from the owner console (navigator.credentials.create).
route("GET", "/v1/users/:id/passkey", "admin", ({ params }) => { const c = passkeys.credentialFor(params[0]); return { registered: !!c, credential_id: c?.credential_id ?? null }; });
route("POST", "/v1/users/:id/passkey/options", "admin", ({ params }) => pkCall(() => passkeys.registrationOptions(params[0])));
route("POST", "/v1/users/:id/passkey", "admin", ({ params, body }) => pkCall(() => passkeys.verifyRegistration(params[0], body?.response)));
// Mandate activation and revocation: the user's passkey signs; the admin token alone cannot do either.
route("POST", "/v1/mandates/:id/sign-request", "admin", ({ params }) => gw.signingRequest(params[0]));
route("POST", "/v1/mandates/:id/confirm", "admin", ({ params, body }) => gw.confirmMandate(params[0], req(body, "mandate_hash"), body?.assertion));
route("POST", "/v1/mandates/:id/revoke-request", "admin", ({ params }) => gw.revocationRequest(params[0]));
route("POST", "/v1/mandates/:id/revoke", "admin", async ({ params, body }) => { await gw.revokeMandate(params[0], body?.assertion, body?.reason); return gw.mandateView(params[0]); });
route("GET", "/v1/mandates", "admin", () => store.listMandates().map(m => ({ ...m, spend: store.spendState(m.mandate.mandate_id), summary: summarize(m.mandate.constraints) })));
route("GET", "/v1/mandates/:id", "admin", ({ params }) => gw.mandateView(params[0]));
route("GET", "/v1/approvals", "admin", () => store.pendingApprovals().map(a => ({ ...a, proposal: JSON.parse(a.proposal), evaluation: JSON.parse(a.evaluation) })));
route("POST", "/v1/approvals/:id", "admin", ({ params, body }) => gw.resolveApproval(params[0], body?.approve === true, body?.approver ?? "owner"));
route("GET", "/v1/payments", "admin", ({ query }) => store.listPayments(Number(query.get("limit") ?? 200)).map(p => ({ ...p, evaluation: JSON.parse(p.evaluation), proposal: JSON.parse(p.proposal) })));
route("GET", "/v1/payments/stuck", "admin", ({ query }) => {
  const older = Number(query.get("older_than_ms") ?? 60_000);
  return store.listStuck(new Date(Date.now() - older).toISOString()).map(p => ({ ...p, evaluation: JSON.parse(p.evaluation), proposal: JSON.parse(p.proposal) }));
});
route("POST", "/v1/recover", "admin", async ({ body }) => {
  const older = Number(body?.older_than_ms ?? 60_000);
  const r = await gw.reconcile(older);
  store.audit("recovery.manual", null, { older_than_ms: older, scanned: r.scanned, actions: r.actions });
  return r;
});
route("GET", "/v1/control/pause", "admin", () => gw.pauseState());
route("POST", "/v1/control/pause", "admin", ({ body }) => gw.pause(body?.reason, body?.by));
route("POST", "/v1/control/resume", "admin", ({ body }) => gw.resume(body?.by));
route("GET", "/v1/audit", "admin", ({ query }) => store.auditLog(Number(query.get("limit") ?? 200)));
route("GET", "/v1/audit/verify", "admin", () => store.verifyAuditChain());
// Signed checkpoint of the audit chain head: publish or archive these to detect any later rewrite of history.
route("GET", "/v1/audit/attestation", "admin", () => {
  const head = store.auditLog(1)[0];
  const statement = { v: 1, kind: "agentguard.audit.checkpoint", seq: head?.seq ?? 0, head_hash: head?.hash ?? "GENESIS",
    chain_ok: store.verifyAuditChain().ok, at: new Date().toISOString() };
  return { statement, signature: signer.sign(canonical(statement)), alg: "Ed25519", key: "/.well-known/agentguard-key" };
});

// ---- agent (holds only its own API key; never PayPal credentials) ----
route("GET", "/v1/agent/mandates/:id", "agent", async ({ params, agent }) => {
  const v = await gw.mandateView(params[0]);
  if (v.mandate.agent_id !== agent!.agent_id) throw new GatewayError(404, "mandate not found");
  return { mandate: v.mandate, status: v.status, spend: v.spend };
});
route("POST", "/v1/agent/payments", "agent", ({ body, agent }) => {
  if (!checkRate(agent!.agent_id)) throw new GatewayError(429, "rate limit exceeded");
  return gw.propose(agent!.agent_id, body);
});
route("GET", "/v1/agent/payments/:id", "agent", ({ params, agent }) => {
  const v = gw.view(params[0]); const row = store.getPayment(params[0]);
  if (!row || row.agent_id !== agent!.agent_id) throw new GatewayError(404, "payment not found");
  return v;
});

async function pkCall<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn(); } catch (e: any) { throw new GatewayError(e?.code ?? 400, e?.message ?? String(e)); }
}
function req(body: any, k: string): string { const v = body?.[k]; if (typeof v !== "string" || !v) throw new GatewayError(400, `${k} is required`); return v; }
function safeEq(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function send(res: ServerResponse, code: number, data: unknown) {
  res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" }); res.end(JSON.stringify(data, null, 2));
}

createServer(async (rq, res) => {
  const url = new URL(rq.url ?? "/", "http://x");
  if (rq.method === "GET" && (url.pathname === "/" || url.pathname === "/console")) {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store",
      "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'" });
    return res.end(CONSOLE_HTML);
  }
  const r = routes.find(r => r.method === rq.method && r.re.test(url.pathname));
  if (!r) return send(res, 404, { error: "not found" });
  try {
    const bearer = (rq.headers.authorization ?? "").replace(/^Bearer\s+/i, "");
    let agent: { agent_id: string; user_id: string } | undefined;
    if (r.auth === "admin" && !safeEq(bearer, ADMIN)) return send(res, 401, { error: "unauthorized" });
    if (r.auth === "agent") { agent = gw.authenticateAgent(bearer) ?? undefined; if (!agent) return send(res, 401, { error: "unauthorized" }); }
    let raw = ""; for await (const c of rq) { raw += c; if (raw.length > 256_000) return send(res, 413, { error: "body too large" }); }
    const body = raw ? JSON.parse(raw) : undefined;
    const params = (url.pathname.match(r.re) ?? []).slice(1).map(decodeURIComponent);
    send(res, 200, await r.h({ req: rq, body, params, query: url.searchParams, agent }));
  } catch (e: any) {
    const code = e instanceof GatewayError ? e.code : e instanceof SyntaxError ? 400 : 500;
    if (code === 500) console.error(e);
    send(res, code, { error: code === 500 ? "internal error" : e.message });
  }
}).listen(PORT, () => console.log(`AgentGuard listening on ${PORT}`));
