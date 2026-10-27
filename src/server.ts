import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { Store } from "./store.ts";
import { Signer } from "./keys.ts";
import { Gateway, GatewayError } from "./gateway.ts";
import { HeuristicRiskAnalyzer, LLMRiskAnalyzer, CompositeRiskAnalyzer, type RiskAnalyzer } from "./risk.ts";
import { PayPalClient, type PaymentRail } from "./paypal.ts";
import { draftFromText, summarize, type LLMConfig } from "./drafter.ts";
import { readFileSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 8787);
const PUBLIC_URL = process.env.AGENTGUARD_PUBLIC_URL ?? `http://localhost:${PORT}`;
const ADMIN = process.env.AGENTGUARD_ADMIN_TOKEN ?? "";
if (!ADMIN || ADMIN.length < 24) { console.error("Set AGENTGUARD_ADMIN_TOKEN (>=24 chars). It guards the user/owner endpoints."); process.exit(1); }

let paypal: PayPalClient | null = null;
const pp = () => (paypal ??= new PayPalClient());
const rail: PaymentRail = { authorize: i => pp().authorize(i), capture: (a, r) => pp().capture(a, r), void: a => pp().void(a) };

const risk: RiskAnalyzer = process.env.LLM_API_KEY
  ? new CompositeRiskAnalyzer(new HeuristicRiskAnalyzer(), new LLMRiskAnalyzer({ baseUrl: process.env.LLM_BASE_URL ?? "https://api.openai.com/v1",
      apiKey: process.env.LLM_API_KEY, model: process.env.LLM_MODEL ?? "gpt-4o-mini" }))
  : new HeuristicRiskAnalyzer();

const llm: LLMConfig | undefined = process.env.LLM_API_KEY
  ? { baseUrl: process.env.LLM_BASE_URL ?? "https://api.openai.com/v1", apiKey: process.env.LLM_API_KEY, model: process.env.LLM_MODEL ?? "gpt-4o-mini" } : undefined;
const CONSOLE_HTML = readFileSync(new URL("./console.html", import.meta.url), "utf8");

const store = new Store();
const signer = Signer.load();
const gw = new Gateway({ store, signer, risk, rail });

type Handler = (ctx: { req: IncomingMessage; body: any; params: string[]; query: URLSearchParams; agent?: { agent_id: string; user_id: string } }) => Promise<unknown> | unknown;
const routes: { method: string; re: RegExp; auth: "admin" | "agent" | "none"; h: Handler }[] = [];
const route = (method: string, path: string, auth: "admin" | "agent" | "none", h: Handler) =>
  routes.push({ method, re: new RegExp("^" + path.replace(/:\w+/g, "([^/]+)") + "$"), auth, h });

// ---- public ----
route("GET", "/health", "none", () => ({ ok: true }));
route("GET", "/.well-known/agentguard-key", "none", () => ({ alg: "Ed25519", public_key_pem: signer.publicKeyPem() }));

// ---- owner (the human delegating authority) ----
route("POST", "/v1/agents", "admin", ({ body }) => gw.registerAgent(req(body, "user_id"), req(body, "agent_id")));
route("POST", "/v1/wallets/setup", "admin", async ({ body }) => {
  const user = req(body, "user_id");
  return pp().createSetupToken(`${PUBLIC_URL}/v1/wallets/return?user_id=${encodeURIComponent(user)}`, `${PUBLIC_URL}/v1/wallets/cancel`);
});
// PayPal redirects the buyer here after consent; the setup token id arrives as approval_token_id.
route("GET", "/v1/wallets/return", "none", async ({ query }) => {
  const user = query.get("user_id"); const tok = query.get("approval_token_id");
  if (!user || !tok) throw new GatewayError(400, "missing user_id or approval_token_id");
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
route("POST", "/v1/mandates/:id/confirm", "admin", ({ params, body }) => gw.confirmMandate(params[0], req(body, "mandate_hash")));
route("POST", "/v1/mandates/:id/revoke", "admin", async ({ params, body }) => { await gw.revokeMandate(params[0], body?.reason); return gw.mandateView(params[0]); });
route("GET", "/v1/mandates", "admin", () => store.listMandates().map(m => ({ ...m, spend: store.spendState(m.mandate.mandate_id), summary: summarize(m.mandate.constraints) })));
route("GET", "/v1/mandates/:id", "admin", ({ params }) => gw.mandateView(params[0]));
route("GET", "/v1/approvals", "admin", () => store.pendingApprovals().map(a => ({ ...a, proposal: JSON.parse(a.proposal), evaluation: JSON.parse(a.evaluation) })));
route("POST", "/v1/approvals/:id", "admin", ({ params, body }) => gw.resolveApproval(params[0], body?.approve === true, body?.approver ?? "owner"));
route("GET", "/v1/payments", "admin", ({ query }) => store.listPayments(Number(query.get("limit") ?? 200)).map(p => ({ ...p, evaluation: JSON.parse(p.evaluation), proposal: JSON.parse(p.proposal) })));
route("GET", "/v1/audit", "admin", ({ query }) => store.auditLog(Number(query.get("limit") ?? 200)));
route("GET", "/v1/audit/verify", "admin", () => store.verifyAuditChain());

// ---- agent (holds only its own API key; never PayPal credentials) ----
route("GET", "/v1/agent/mandates/:id", "agent", ({ params, agent }) => {
  const v = gw.mandateView(params[0]);
  if (v.mandate.agent_id !== agent!.agent_id) throw new GatewayError(404, "mandate not found");
  return { mandate: v.mandate, status: v.status, spend: v.spend };
});
route("POST", "/v1/agent/payments", "agent", ({ body, agent }) => gw.propose(agent!.agent_id, body));
route("GET", "/v1/agent/payments/:id", "agent", ({ params, agent }) => {
  const v = gw.view(params[0]); const row = store.getPayment(params[0]);
  if (!row || row.agent_id !== agent!.agent_id) throw new GatewayError(404, "payment not found");
  return v;
});

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
