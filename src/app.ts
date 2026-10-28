import type { IncomingMessage, ServerResponse } from "node:http";
import { timingSafeEqual, randomBytes } from "node:crypto";
import { Store } from "./store.ts";
import { openSql, type Sql } from "./db.ts";
import { KeyRing } from "./keys.ts";
import { ReceiptService, keyId } from "./receipt.ts";
import { Gateway, GatewayError } from "./gateway.ts";
import { PasskeyService, webhookNotifier } from "./passkeys.ts";
import { TsaClient } from "./timestamp.ts";
import { AnchorService } from "./anchor.ts";
import { HeuristicRiskAnalyzer, LLMRiskAnalyzer, CompositeRiskAnalyzer, type RiskAnalyzer } from "./risk.ts";
import { PayPalClient, lazyPayPalRail, type PaymentRail } from "./paypal.ts";
import { draftFromText, summarize, type LLMConfig } from "./drafter.ts";
import { readFileSync } from "node:fs";
import { canonical } from "./canonical.ts";

export interface App {
  handler: (rq: IncomingMessage, res: ServerResponse) => Promise<unknown>;
  runAnchor: () => Promise<unknown>;
  runMaintenance: () => Promise<unknown>;
  store: Store;
  close: () => Promise<void>;
}

/**
 * Builds the AgentGuard HTTP handler. Used by src/server.ts (long-running Node, timers) and by the Vercel function
 * (api/index), where background work runs from cron routes guarded by CRON_SECRET instead of timers.
 */
export async function createApp(opts: { sql?: Sql; background?: boolean } = {}): Promise<App> {
const PORT = Number(process.env.PORT ?? 8787);
const PUBLIC_URL = process.env.AGENTGUARD_PUBLIC_URL ?? `http://localhost:${PORT}`;
const ADMIN = process.env.AGENTGUARD_ADMIN_TOKEN ?? "";
if (!ADMIN || ADMIN.length < 24) throw new Error("Set AGENTGUARD_ADMIN_TOKEN (>=24 chars). It guards the user/owner endpoints.");
const CRON_SECRET = process.env.CRON_SECRET ?? "";

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

const sql = opts.sql ?? await openSql();
const store = new Store(sql);
const WALLET_SETUP_TTL_MS = 30 * 60 * 1000;
store.db.ddl("CREATE TABLE IF NOT EXISTS wallet_setups (state TEXT PRIMARY KEY, user_id TEXT NOT NULL, setup_token_id TEXT NOT NULL, expires_at TEXT NOT NULL)");
// The server key signs audit-log attestations only. Mandates and revocations are signed by the user's passkey.
// Key ring: in the database (encrypted under AGENTGUARD_KEYRING_KEY) when that secret is set or on Postgres; else a local file.
const signer = process.env.AGENTGUARD_KEYRING_KEY || sql.dialect === "pg" ? await KeyRing.fromDb(sql) : KeyRing.load();
const RP_ID = process.env.AGENTGUARD_RP_ID ?? new URL(PUBLIC_URL).hostname;
// Admin-started passkey recovery is time-locked and announced to the user out of band (webhook; point it at an email relay).
const passkeys = new PasskeyService(store, { rpID: RP_ID, rpName: process.env.AGENTGUARD_RP_NAME ?? "AgentGuard", origin: new URL(PUBLIC_URL).origin,
  recoveryLockMs: process.env.AGENTGUARD_RECOVERY_LOCK_MS ? Number(process.env.AGENTGUARD_RECOVERY_LOCK_MS) : undefined,
  notify: webhookNotifier(process.env.AGENTGUARD_NOTIFY_WEBHOOK) });
const ISSUER = process.env.AGENTGUARD_ISSUER_NAME ?? new URL(PUBLIC_URL).host;
// External time: RFC 3161 TSAs stamp every receipt and periodically the audit-chain head (AGENTGUARD_TSA_URLS="" disables).
const tsa = new TsaClient();
const anchors = new AnchorService({ store, tsa, issuer: ISSUER });
const receipts = new ReceiptService({ store, signer, passkeys, issuer: ISSUER, tsa, anchors });
const ANCHOR_INTERVAL_MS = Number(process.env.AGENTGUARD_ANCHOR_INTERVAL_MS ?? 15 * 60_000);
let anchoring = false;
async function runAnchor() {
  if (anchoring) return null; anchoring = true;
  try { await receipts.stampPending(); return await anchors.anchor(); }
  catch (e) { await store.audit("audit.anchor_failed", null, { error: (e as Error).message.slice(0, 300) }); return null; }
  finally { anchoring = false; }
}
if (opts.background && ANCHOR_INTERVAL_MS > 0 && tsa.enabled) setInterval(runAnchor, ANCHOR_INTERVAL_MS).unref();
const gw = new Gateway({ store, passkeys, risk, rail, receipts });
// Receipts contain the user's mandate (purpose, limits). Unauthenticated read by receipt id is opt-in, for merchants.
const PUBLIC_RECEIPTS = process.env.AGENTGUARD_PUBLIC_RECEIPTS === "1";

// Per-agent sliding window on propose. Stops a compromised agent from flooding the gateway. Kept in the database so the
// limit holds across serverless instances, not just within one process.
const RATE_LIMIT = Number(process.env.AGENTGUARD_AGENT_RATE_LIMIT ?? 30);
const RATE_WINDOW_MS = 60_000;
store.db.ddl("CREATE TABLE IF NOT EXISTS agent_rate (agent_id TEXT NOT NULL, at TEXT NOT NULL)");
async function checkRate(agentId: string): Promise<boolean> {
  const now = new Date(), since = new Date(now.getTime() - RATE_WINDOW_MS).toISOString();
  return store.tx(async () => {
    await store.db.prepare("DELETE FROM agent_rate WHERE at < ?").run(since);
    const { n } = await store.db.prepare("SELECT COUNT(*) n FROM agent_rate WHERE agent_id=? AND at >= ?").get(agentId, since) as { n: number };
    if (Number(n) >= RATE_LIMIT) return false;
    await store.db.prepare("INSERT INTO agent_rate (agent_id, at) VALUES (?, ?)").run(agentId, now.toISOString());
    return true;
  });
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
/** Recovery-lock expiry, out-of-band notification retries and payment reconciliation (cron or timer). */
async function runMaintenance() {
  const finalized = await passkeys.finalizeRecoveries();
  const notified = await passkeys.retryNotifications();
  await runRecover();
  return { finalized_recoveries: finalized, notifications_sent: notified, recovery: lastRecovery };
}
if (opts.background) { void runMaintenance(); setInterval(() => void runMaintenance(), RECOVER_INTERVAL_MS).unref(); }

type Handler = (ctx: { req: IncomingMessage; body: any; params: string[]; query: URLSearchParams; agent?: { agent_id: string; user_id: string } }) => Promise<unknown> | unknown;
type Auth = "admin" | "agent" | "none" | "cron";
const routes: { method: string; re: RegExp; auth: Auth; h: Handler }[] = [];
const route = (method: string, path: string, auth: Auth, h: Handler) =>
  routes.push({ method, re: new RegExp("^" + path.replace(/:\w+/g, "([^/]+)") + "$"), auth, h });

// ---- public ----
route("GET", "/health", "none", async () => {
  const stuck = (await store.listStuck(new Date(Date.now() - 60_000).toISOString())).length;
  return { ok: stuck === 0 && !lastRecovery?.error, stuck, last_recovery: lastRecovery };
});
// ---- scheduled jobs (Supabase pg_cron + pg_net, Vercel cron as a daily backstop); Bearer CRON_SECRET ----
for (const m of ["GET", "POST"]) {
  route(m, "/api/cron/anchor", "cron", async () => ({ job: "anchor", anchor: await runAnchor(), at: new Date().toISOString() }));
  route(m, "/api/cron/maintenance", "cron", async () => ({ job: "maintenance", ...(await runMaintenance()), at: new Date().toISOString() }));
}
// Legacy single-key endpoint: the currently active issuer key. Prefer the key set below.
route("GET", "/.well-known/agentguard-key", "none", async () => ({ alg: "Ed25519", use: ["audit-attestation", "proof-of-intent-receipt"],
  key_id: keyId(signer.publicKeyPem()), public_key_pem: signer.publicKeyPem(), key_set: "/.well-known/agentguard-keys" }));
// JWKS-style issuer key set with lifecycle: verifiers pin by kid; retired keys stay listed for receipts they signed earlier.
route("GET", "/.well-known/agentguard-keys", "none", async () => ({ issuer: receipts.issuer, ...signer.jwks() }));
route("GET", "/v1/public/receipts/:id", "none", async ({ params }) => {
  if (!PUBLIC_RECEIPTS) throw new GatewayError(404, "public receipts are disabled (AGENTGUARD_PUBLIC_RECEIPTS=1)");
  const r = await receipts.get(decodeURIComponent(params[0])); if (!r) throw new GatewayError(404, "receipt not found"); return r;
});

// ---- owner (the human delegating authority) ----
route("POST", "/v1/agents", "admin", async ({ body }) => await gw.registerAgent(req(body, "user_id"), req(body, "agent_id")));
route("POST", "/v1/wallets/setup", "admin", async ({ body }) => {
  const user = req(body, "user_id");
  // Bind the user to an unguessable one-time state value server-side; the return URL carries only that state.
  const state = randomBytes(24).toString("base64url");
  const t = await pp().createSetupToken(`${PUBLIC_URL}/v1/wallets/return?state=${state}`, `${PUBLIC_URL}/v1/wallets/cancel`);
  await store.db.prepare("INSERT INTO wallet_setups (state, user_id, setup_token_id, expires_at) VALUES (?,?,?,?)")
    .run(state, user, t.id, new Date(Date.now() + WALLET_SETUP_TTL_MS).toISOString());
  return t;
});
// PayPal redirects the buyer here after consent; the setup token id arrives as approval_token_id.
route("GET", "/v1/wallets/return", "none", async ({ query }) => {
  const state = query.get("state"); const tok = query.get("approval_token_id");
  if (!state || !tok) throw new GatewayError(400, "missing state or approval_token_id");
  // Single-use: consume the state atomically. user_id comes from our record, never from the query string,
  // and the approval token must be the setup token we created for that user.
  const row = await store.db.prepare("DELETE FROM wallet_setups WHERE state=? RETURNING user_id, setup_token_id, expires_at").get(state) as any;
  if (!row || row.setup_token_id !== tok || new Date() > new Date(row.expires_at)) throw new GatewayError(403, "invalid or expired wallet setup state");
  const user = row.user_id as string;
  const t = await pp().createPaymentToken(tok);
  await gw.linkWallet(user, t.vault_id, t.payer_email);
  return { linked: true, user_id: user, payer_email: t.payer_email ?? null };
});
route("POST", "/v1/wallets/link", "admin", async ({ body }) => { await gw.linkWallet(req(body, "user_id"), req(body, "vault_id"), body.payer_email); return { linked: true }; });
route("POST", "/v1/mandates", "admin", async ({ body }) => await gw.draftMandate({ user_id: req(body, "user_id"), agent_id: req(body, "agent_id"),
  purpose: req(body, "purpose"), constraints: body.constraints, ttl_minutes: body.ttl_minutes }));
// AI proposes constraints from plain English; nothing is active until the owner confirms the returned hash.
route("POST", "/v1/mandates/draft-from-text", "admin", async ({ body }) => {
  let d; try { d = await draftFromText(req(body, "text"), llm); } catch (e: any) { throw e instanceof GatewayError ? e : new GatewayError(400, e.message); }
  const m = await gw.draftMandate({ user_id: req(body, "user_id"), agent_id: req(body, "agent_id"), purpose: d.purpose, constraints: d.constraints, ttl_minutes: d.ttl_minutes });
  return { ...m, summary: d.summary, warnings: d.warnings, source: d.source };
});
// Passkeys: one per user. Registration needs a single-use enrollment token (no trust-on-first-use).
route("GET", "/v1/users/:id/passkey", "admin", async ({ params }) => { const c = await passkeys.credentialFor(params[0]);
  return { registered: !!c, credential_id: c?.credential_id ?? null, enrollment: await passkeys.enrollmentFor(params[0]) }; });
// Admin issues an enrollment link (first passkey, or a logged replacement). Only its sha256 is stored.
route("POST", "/v1/users/:id/enrollments", "admin", async ({ params, body }) => {
  const t = await passkeys.issueEnrollment(params[0], { issuedBy: body?.issued_by ?? "admin", ttlMs: body?.ttl_minutes ? Number(body.ttl_minutes) * 60_000 : undefined });
  return { ...t, link: `${PUBLIC_URL}/console#enroll=${t.token}` };
});
// An admin link for a user who already has a passkey starts a time-locked recovery (it cannot replace the key outright).
route("GET", "/v1/users/:id/recovery", "admin", async ({ params }) => await passkeys.recoveryFor(params[0]));
// Cancelling needs only the user's CURRENT passkey (not the admin token, which is what a hostile operator would hold).
route("POST", "/v1/users/:id/recovery/cancel-request", "none", async ({ params }) => pkCall(() => passkeys.recoveryCancelRequest(params[0])));
route("POST", "/v1/users/:id/recovery/cancel", "none", async ({ params, body }) => pkCall(() => passkeys.cancelRecovery(params[0], body?.assertion)));
// Replacement authorized by the user's existing passkey instead of the admin.
route("POST", "/v1/users/:id/reenroll-request", "admin", async ({ params }) => pkCall(() => passkeys.reenrollRequest(params[0])));
route("POST", "/v1/users/:id/reenroll", "admin", async ({ params, body }) => {
  const t = await pkCall(() => passkeys.reenroll(params[0], body?.assertion)); return { ...t, link: `${PUBLIC_URL}/console#enroll=${t.token}` };
});
// Redeeming: the token is the credential, so these need no admin token (the enrollee may not be the operator).
route("POST", "/v1/enroll/options", "none", async ({ body }) => pkCall(() => passkeys.registrationOptions(req(body, "token"))));
route("POST", "/v1/enroll", "none", async ({ body }) => pkCall(() => passkeys.verifyRegistration(req(body, "token"), body?.response)));
// Mandate activation and revocation: the user's passkey signs; the admin token alone cannot do either.
route("POST", "/v1/mandates/:id/sign-request", "admin", async ({ params }) => gw.signingRequest(params[0]));
route("POST", "/v1/mandates/:id/confirm", "admin", async ({ params, body }) => gw.confirmMandate(params[0], req(body, "mandate_hash"), body?.assertion));
route("POST", "/v1/mandates/:id/revoke-request", "admin", async ({ params }) => gw.revocationRequest(params[0]));
route("POST", "/v1/mandates/:id/revoke", "admin", async ({ params, body }) => { await gw.revokeMandate(params[0], body?.assertion, body?.reason); return gw.mandateView(params[0]); });
route("GET", "/v1/mandates", "admin", async () => Promise.all((await store.listMandates()).map(async m => ({ ...m, spend: await store.spendState(m.mandate.mandate_id), summary: summarize(m.mandate.constraints) }))));
route("GET", "/v1/mandates/:id", "admin", async ({ params }) => gw.mandateView(params[0]));
route("GET", "/v1/approvals", "admin", async () => (await store.pendingApprovals()).map(a => ({ ...a, proposal: JSON.parse(a.proposal), evaluation: JSON.parse(a.evaluation) })));
// Human decisions are signed by the user's passkey over {payment, order, amount, decision, nonce, expiry}.
route("POST", "/v1/approvals/:id/request", "admin", async ({ params, body }) => gw.approvalRequest(params[0], body?.approve === true));
route("POST", "/v1/approvals/:id", "admin", async ({ params, body }) => gw.resolveApproval(params[0], body?.approve === true, body?.assertion, String(body?.approver ?? "owner").slice(0, 100)));
// Issuer key rotation (also: scripts/rotate-key.ts while the server is stopped). Old keys stay published.
route("POST", "/v1/keys/rotate", "admin", async () => { const r = await signer.rotate(); await store.audit("issuer.key_rotated", null, r); return { ...r, ...signer.jwks() }; });
route("POST", "/v1/keys/:kid/compromised", "admin", async ({ params, body }) => {
  const r = await signer.markCompromised(params[0], body?.at ? new Date(String(body.at)) : new Date());
  await store.audit("issuer.key_compromised", null, r); return { ...r, ...signer.jwks() };
});
route("GET", "/v1/payments", "admin", async ({ query }) => (await store.listPayments(Number(query.get("limit") ?? 200))).map(p => ({ ...p, evaluation: JSON.parse(p.evaluation), proposal: JSON.parse(p.proposal) })));
route("GET", "/v1/receipts", "admin", async ({ query }) => await receipts.list(Number(query.get("limit") ?? 100)));
route("GET", "/v1/receipts/:id", "admin", async ({ params }) => {
  const r = await receipts.get(decodeURIComponent(params[0])); if (!r) throw new GatewayError(404, "receipt not found"); return r;
});
route("GET", "/v1/payments/:id/receipt", "admin", async ({ params }) => {
  const r = await receipts.forPayment(params[0]); if (!r) throw new GatewayError(404, "no receipt for this payment (only captured merchant-order payments get one)"); return r;
});
route("GET", "/v1/payments/stuck", "admin", async ({ query }) => {
  const older = Number(query.get("older_than_ms") ?? 60_000);
  return (await store.listStuck(new Date(Date.now() - older).toISOString())).map(p => ({ ...p, evaluation: JSON.parse(p.evaluation), proposal: JSON.parse(p.proposal) }));
});
route("POST", "/v1/recover", "admin", async ({ body }) => {
  const older = Number(body?.older_than_ms ?? 60_000);
  const r = await gw.reconcile(older);
  await store.audit("recovery.manual", null, { older_than_ms: older, scanned: r.scanned, actions: r.actions });
  return r;
});
route("GET", "/v1/control/pause", "admin", async () => await gw.pauseState());
route("POST", "/v1/control/pause", "admin", async ({ body }) => await gw.pause(body?.reason, body?.by));
route("POST", "/v1/control/resume", "admin", async ({ body }) => await gw.resume(body?.by));
route("GET", "/v1/audit", "admin", async ({ query }) => await store.auditLog(Number(query.get("limit") ?? 200)));
route("GET", "/v1/audit/verify", "admin", async () => await store.verifyAuditChain());
route("POST", "/v1/audit/anchor", "admin", async () => { const a = await runAnchor(); if (!a) throw new GatewayError(502, "no TSA token obtained"); return a; });
// Public so anyone can keep copies (fork detection needs outside copies of the anchors).
route("GET", "/v1/audit/anchors", "none", async ({ query }) => ({ issuer: ISSUER, anchors: await anchors.list(Number(query.get("limit") ?? 100)) }));
// Signed checkpoint of the audit chain head: publish or archive these to detect any later rewrite of history.
route("GET", "/v1/audit/attestation", "admin", async () => {
  const head = (await store.auditLog(1))[0];
  const statement = { v: 1, kind: "agentguard.audit.checkpoint", seq: head?.seq ?? 0, head_hash: head?.hash ?? "GENESIS",
    chain_ok: (await store.verifyAuditChain()).ok, at: new Date().toISOString() };
  return { statement, signature: signer.sign(canonical(statement)), alg: "Ed25519", kid: signer.activeKid(), key: "/.well-known/agentguard-keys" };
});

// ---- agent (holds only its own API key; never PayPal credentials) ----
route("GET", "/v1/agent/mandates/:id", "agent", async ({ params, agent }) => {
  const v = await gw.mandateView(params[0]);
  if (v.mandate.agent_id !== agent!.agent_id) throw new GatewayError(404, "mandate not found");
  return { mandate: v.mandate, status: v.status, spend: v.spend };
});
route("POST", "/v1/agent/payments", "agent", async ({ body, agent }) => {
  if (!(await checkRate(agent!.agent_id))) throw new GatewayError(429, "rate limit exceeded");
  return gw.propose(agent!.agent_id, body);
});
route("GET", "/v1/agent/payments/:id", "agent", async ({ params, agent }) => {
  const v = await gw.view(params[0]); const row = await store.getPayment(params[0]);
  if (!row || row.agent_id !== agent!.agent_id) throw new GatewayError(404, "payment not found");
  return v;
});

route("GET", "/v1/agent/payments/:id/receipt", "agent", async ({ params, agent }) => {
  const row = await store.getPayment(params[0]);
  if (!row || row.agent_id !== agent!.agent_id) throw new GatewayError(404, "payment not found");
  const r = await receipts.forPayment(params[0]); if (!r) throw new GatewayError(404, "no receipt for this payment"); return r;
});

async function pkCall<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn(); } catch (e: any) { throw new GatewayError(e?.code ?? 400, e?.message ?? String(e)); }
}
function req(body: any, k: string): string { const v = body?.[k]; if (typeof v !== "string" || !v) throw new GatewayError(400, `${k} is required`); return v; }
function safeEq(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function send(res: ServerResponse, code: number, data: unknown) {
  res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" }); res.end(JSON.stringify(data, null, 2));
}

async function handler(rq: IncomingMessage, res: ServerResponse): Promise<unknown> {
  await signer.refresh();
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
    if (r.auth === "cron" && (CRON_SECRET.length < 24 || !safeEq(bearer, CRON_SECRET))) return send(res, 401, { error: "unauthorized" });
    if (r.auth === "agent") { agent = (await gw.authenticateAgent(bearer)) ?? undefined; if (!agent) return send(res, 401, { error: "unauthorized" }); }
    let raw = ""; for await (const c of rq) { raw += c; if (raw.length > 256_000) return send(res, 413, { error: "body too large" }); }
    const body = raw ? JSON.parse(raw) : undefined;
    const params = (url.pathname.match(r.re) ?? []).slice(1).map(decodeURIComponent);
    send(res, 200, await r.h({ req: rq, body, params, query: url.searchParams, agent }));
  } catch (e: any) {
    const code = e instanceof GatewayError ? e.code : e instanceof SyntaxError ? 400 : 500;
    if (code === 500) console.error(e);
    send(res, code, { error: code === 500 ? "internal error" : e.message });
  }
}
return { handler, runAnchor, runMaintenance, store, close: () => sql.close() };
}
