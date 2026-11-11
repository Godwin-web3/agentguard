// Source of truth for /openapi.json and the API reference page. test/docs.test.ts checks it against the app's route table.
const S = (props, required = []) => ({ type: "object", properties: props, ...(required.length ? { required } : {}) });
const str = (d, ex) => ({ type: "string", ...(d ? { description: d } : {}), ...(ex !== undefined ? { example: ex } : {}) });
const obj = d => ({ type: "object", additionalProperties: true, ...(d ? { description: d } : {}) });
const nstr = d => ({ type: ["string", "null"], ...(d ? { description: d } : {}) });
const nref = (r, d) => ({ anyOf: [{ $ref: `#/components/schemas/${r}` }, { type: "null" }], ...(d ? { description: d } : {}) });
const int = d => ({ type: "integer", ...(d ? { description: d } : {}) });
const bool = d => ({ type: "boolean", ...(d ? { description: d } : {}) });
const assertion = obj("WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching *-request call");

// [method, path, auth, tag, summary, {body, required, query, desc, responses}]
export const ENDPOINTS = [
  ["GET", "/health", "none", "Meta", "Health: ok, stuck payment count, last recovery run"],
  ["GET", "/healthz", "none", "Meta", "Liveness probe (plain 200)"],
  ["HEAD", "/healthz", "none", "Meta", "Liveness probe, no body"],
  ["GET", "/api/cron/anchor", "cron", "Jobs", "Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)"],
  ["POST", "/api/cron/anchor", "cron", "Jobs", "Same as GET, for pg_net callers"],
  ["GET", "/api/cron/maintenance", "cron", "Jobs", "Expire recovery locks, retry notifications, converge stuck payments"],
  ["POST", "/api/cron/maintenance", "cron", "Jobs", "Same as GET, for pg_net callers"],
  ["GET", "/.well-known/agentguard-key", "none", "Keys", "Active issuer public key (legacy single-key form)"],
  ["GET", "/.well-known/agentguard-keys", "none", "Keys", "Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this."],
  ["GET", "/v1/public/receipts/{id}", "none", "Receipts", "Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)"],
  ["POST", "/v1/agents", "admin", "Setup", "Register an agent and return its API key (shown once)", { body: S({ user_id: str("Owner user id", "demo-user"), agent_id: str("Agent id", "shopper") }, ["user_id", "agent_id"]) }],
  ["POST", "/v1/wallets/setup", "admin", "Setup", "Start PayPal wallet vaulting; returns the setup token with the buyer consent link", { body: S({ user_id: str() }, ["user_id"]) }],
  ["GET", "/v1/wallets/return", "none", "Setup", "PayPal redirect target after buyer consent; links the vaulted wallet", { query: { state: "One-time state from /v1/wallets/setup", approval_token_id: "PayPal setup token id" } }],
  ["POST", "/v1/wallets/link", "admin", "Setup", "Link an existing PayPal vault id to a user", { body: S({ user_id: str(), vault_id: str(), payer_email: str() }, ["user_id", "vault_id"]) }],
  ["POST", "/v1/mandates", "admin", "Mandates", "Create a draft mandate from structured constraints", { body: S({ user_id: str(), agent_id: str(), purpose: str(), ttl_minutes: int(), constraints: { $ref: "#/components/schemas/MandateConstraints" } }, ["user_id", "agent_id", "purpose"]) }],
  ["POST", "/v1/mandates/draft-from-text", "admin", "Mandates", "Draft a mandate from plain English (model proposes, deterministic parser bounds it)", { body: S({ user_id: str(), agent_id: str(), text: str(undefined, "Buy API credits from shop@example.com, at most $25 total, ask me above $5") }, ["user_id", "agent_id", "text"]) }],
  ["GET", "/v1/mandates", "admin", "Mandates", "List mandates with spend state and summary"],
  ["GET", "/v1/mandates/{id}", "admin", "Mandates", "Mandate, status and spend"],
  ["POST", "/v1/mandates/{id}/sign-request", "admin", "Mandates", "Get WebAuthn options whose challenge is the mandate hash"],
  ["POST", "/v1/mandates/{id}/confirm", "admin", "Mandates", "Activate a mandate with the user's passkey assertion", { body: S({ mandate_hash: str(), assertion }, ["mandate_hash", "assertion"]) }],
  ["POST", "/v1/mandates/{id}/revoke-request", "admin", "Mandates", "Get WebAuthn options for revocation"],
  ["POST", "/v1/mandates/{id}/revoke", "admin", "Mandates", "Revoke with the user's passkey (drafts can be discarded without one)", { body: S({ assertion, reason: str() }) }],
  ["GET", "/v1/users/{id}/passkey", "admin", "Passkeys", "Whether the user has a passkey, and its credential id"],
  ["POST", "/v1/users/{id}/enrollments", "admin", "Passkeys", "Issue a single-use enrollment link (15 min default)", { body: S({ issued_by: str(), ttl_minutes: int() }) }],
  ["POST", "/v1/enroll/options", "none", "Passkeys", "Redeem step 1: registration options for an enrollment token", { body: S({ token: str() }, ["token"]) }],
  ["POST", "/v1/enroll", "none", "Passkeys", "Redeem step 2: register the passkey", { body: S({ token: str(), response: obj("navigator.credentials.create response") }, ["token", "response"]) }],
  ["POST", "/v1/users/{id}/reenroll-request", "admin", "Passkeys", "Options for replacing a passkey with the current one"],
  ["POST", "/v1/users/{id}/reenroll", "admin", "Passkeys", "Mint a re-enrollment token authorized by the current passkey", { body: S({ assertion }, ["assertion"]) }],
  ["GET", "/v1/users/{id}/recovery", "admin", "Passkeys", "Time-locked recovery state"],
  ["POST", "/v1/users/{id}/recovery/cancel-request", "none", "Passkeys", "Options to cancel a recovery with the current passkey"],
  ["POST", "/v1/users/{id}/recovery/cancel", "none", "Passkeys", "Cancel a pending recovery", { body: S({ assertion }, ["assertion"]) }],
  ["GET", "/v1/approvals", "admin", "Approvals", "Payments held for the owner"],
  ["POST", "/v1/approvals/{id}/request", "admin", "Approvals", "Approval statement and WebAuthn options (5-minute nonce)", { body: S({ approve: bool() }, ["approve"]) }],
  ["POST", "/v1/approvals/{id}", "admin", "Approvals", "Approve or deny with the user's passkey. The admin token alone is refused.", { body: S({ approve: bool(), assertion, approver: str() }, ["approve", "assertion"]) }],
  ["POST", "/v1/agent/payments", "agent", "Agent", "Propose a payment (30/min per agent; 429 above)", { body: S({ mandate_id: str(), agent_id: str(), idempotency_key: str(), paypal_order_id: str("Merchant-created AUTHORIZE order (preferred). Do not combine with payee/currency/items."), payee: { type: "object", properties: { merchant_id: str(), email_address: str(), display_name: str() }, description: "Vaulted path only (untrusted)" }, currency: str("Vaulted path only"), items: { type: "array", items: obj("LineItem: name, sku, category, quantity, unit_amount"), description: "Vaulted path only (untrusted)" }, context: { type: "array", items: S({ source_url: str(), excerpt: str() }), description: "Untrusted context the agent saw; scored for injection, advisory only" }, agent_rationale: str() }, ["mandate_id", "agent_id", "idempotency_key"]) }],
  ["POST", "/v1/agent/products/search", "agent", "Agent", "Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never pays)", { body: S({ mandate_id: str(), query: str(undefined, "65W USB-C charger"), limit: int("1-30, default 8"), page_token: str("next_page_token from a previous search") }, ["mandate_id", "query"]) }],
  ["GET", "/v1/agent/payments/{id}", "agent", "Agent", "Payment status (the calling agent's own only)"],
  ["GET", "/v1/agent/payments/{id}/receipt", "agent", "Agent", "Proof-of-Intent receipt for a captured payment"],
  ["GET", "/v1/agent/mandates/{id}", "agent", "Agent", "The agent's own mandate, status and spend"],
  ["POST", "/v1/products/search", "admin", "Catalog", "Owner view of the same Channel3 search, with an advisory mandate-fit check per product", { body: S({ mandate_id: str(), query: str(undefined, "laptop stand"), limit: int(), page_token: str() }, ["mandate_id", "query"]) }],
  ["GET", "/v1/products/status", "admin", "Catalog", "Whether Channel3 product search is configured (CHANNEL3_API_KEY)"],
  ["GET", "/v1/payments", "admin", "Payments", "List payments", { query: { limit: "Default 200" } }],
  ["GET", "/v1/payments/stuck", "admin", "Payments", "Payments in reserved/authorized older than a threshold", { query: { older_than_ms: "Default 60000" } }],
  ["POST", "/v1/recover", "admin", "Payments", "Converge stuck payments with PayPal now", { body: S({ older_than_ms: int() }) }],
  ["GET", "/v1/payments/{id}/receipt", "admin", "Receipts", "Receipt for a payment"],
  ["GET", "/v1/receipts", "admin", "Receipts", "List receipts", { query: { limit: "Default 100" } }],
  ["GET", "/v1/receipts/{id}", "admin", "Receipts", "Receipt by id"],
  ["POST", "/v1/keys/rotate", "admin", "Keys", "Retire the active issuer key and create a new one (audited)"],
  ["POST", "/v1/keys/{kid}/compromised", "admin", "Keys", "Mark a key compromised as of `at` (rotates first if active)", { body: S({ at: str("ISO time; default now") }) }],
  ["GET", "/v1/control/pause", "admin", "Control", "Kill-switch state"],
  ["POST", "/v1/control/pause", "admin", "Control", "Block every new proposal and approval (503)", { body: S({ reason: str(), by: str() }) }],
  ["POST", "/v1/control/resume", "admin", "Control", "Lift the kill-switch", { body: S({ by: str() }) }],
  ["GET", "/v1/audit", "admin", "Audit", "Hash-chained audit log", { query: { limit: "Default 200" } }],
  ["GET", "/v1/audit/verify", "admin", "Audit", "Recompute and verify the whole chain"],
  ["GET", "/v1/audit/attestation", "admin", "Audit", "Chain head signed with the active issuer key"],
  ["POST", "/v1/audit/anchor", "admin", "Audit", "Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)"],
  ["GET", "/v1/audit/anchors", "none", "Audit", "Published anchors; keep copies to detect forks", { query: { limit: "Default 100" } }],
];


// Stable, SDK-friendly operation ids (APIMatic and other generators turn these into method names).
const OPS = {
  "GET /health": "getHealth", "GET /healthz": "getLiveness", "HEAD /healthz": "headLiveness",
  "GET /api/cron/anchor": "runAnchorJob", "POST /api/cron/anchor": "runAnchorJobPost", "GET /api/cron/maintenance": "runMaintenanceJob", "POST /api/cron/maintenance": "runMaintenanceJobPost",
  "GET /.well-known/agentguard-key": "getIssuerKey", "GET /.well-known/agentguard-keys": "getIssuerKeySet", "GET /v1/public/receipts/{id}": "getPublicReceipt",
  "POST /v1/agents": "registerAgent", "POST /v1/wallets/setup": "startWalletSetup", "GET /v1/wallets/return": "completeWalletSetup", "POST /v1/wallets/link": "linkWallet",
  "POST /v1/mandates": "createMandate", "POST /v1/mandates/draft-from-text": "draftMandateFromText", "GET /v1/mandates": "listMandates", "GET /v1/mandates/{id}": "getMandate",
  "POST /v1/mandates/{id}/sign-request": "getMandateSigningOptions", "POST /v1/mandates/{id}/confirm": "confirmMandate",
  "POST /v1/mandates/{id}/revoke-request": "getMandateRevocationOptions", "POST /v1/mandates/{id}/revoke": "revokeMandate",
  "GET /v1/users/{id}/passkey": "getUserPasskey", "POST /v1/users/{id}/enrollments": "createEnrollmentLink", "POST /v1/enroll/options": "getEnrollmentOptions", "POST /v1/enroll": "enrollPasskey",
  "POST /v1/users/{id}/reenroll-request": "getReenrollmentOptions", "POST /v1/users/{id}/reenroll": "reenrollPasskey", "GET /v1/users/{id}/recovery": "getRecoveryState",
  "POST /v1/users/{id}/recovery/cancel-request": "getRecoveryCancelOptions", "POST /v1/users/{id}/recovery/cancel": "cancelRecovery",
  "GET /v1/approvals": "listApprovals", "POST /v1/approvals/{id}/request": "getApprovalOptions", "POST /v1/approvals/{id}": "resolveApproval",
  "POST /v1/agent/payments": "proposePayment", "POST /v1/agent/products/search": "searchProducts", "GET /v1/agent/payments/{id}": "getAgentPayment",
  "GET /v1/agent/payments/{id}/receipt": "getAgentPaymentReceipt", "GET /v1/agent/mandates/{id}": "getAgentMandate",
  "POST /v1/products/search": "searchProductsForMandate", "GET /v1/products/status": "getProductSearchStatus",
  "GET /v1/payments": "listPayments", "GET /v1/payments/stuck": "listStuckPayments", "POST /v1/recover": "recoverPayments", "GET /v1/payments/{id}/receipt": "getPaymentReceipt",
  "GET /v1/receipts": "listReceipts", "GET /v1/receipts/{id}": "getReceipt", "POST /v1/keys/rotate": "rotateIssuerKey", "POST /v1/keys/{kid}/compromised": "markKeyCompromised",
  "GET /v1/control/pause": "getPauseState", "POST /v1/control/pause": "pause", "POST /v1/control/resume": "resume",
  "GET /v1/audit": "listAuditEntries", "GET /v1/audit/verify": "verifyAuditChain", "GET /v1/audit/attestation": "getAuditAttestation", "POST /v1/audit/anchor": "anchorAuditChain", "GET /v1/audit/anchors": "listAuditAnchors",
};
// Typed 200 responses for the calls agents and verifiers make most; the rest stay open objects.
const RES = {
  "GET /health": "Health", "POST /v1/agents": "AgentCredentials", "POST /v1/agent/payments": "PaymentDecision", "GET /v1/agent/payments/{id}": "PaymentDecision",
  "GET /v1/agent/mandates/{id}": "AgentMandate", "POST /v1/agent/products/search": "ProductSearchResult", "POST /v1/products/search": "ProductSearchResult",
  "GET /v1/agent/payments/{id}/receipt": "ReceiptEnvelope", "GET /v1/payments/{id}/receipt": "ReceiptEnvelope", "GET /v1/receipts/{id}": "ReceiptEnvelope", "GET /v1/public/receipts/{id}": "ReceiptEnvelope",
  "GET /.well-known/agentguard-keys": "IssuerKeySet", "GET /v1/audit/verify": "AuditVerification", "GET /v1/control/pause": "PauseState",
  "GET /v1/audit": { type: "array", items: { $ref: "#/components/schemas/AuditEntry" } }, "GET /v1/receipts": { type: "array", items: { $ref: "#/components/schemas/ReceiptSummary" } },
};
const resSchema = key => { const r = RES[key]; return !r ? { type: "object", additionalProperties: true } : typeof r === "string" ? { $ref: `#/components/schemas/${r}` } : r; };

const TAGS = {
  Meta: "Health and liveness", Jobs: "Scheduled jobs (Bearer CRON_SECRET)", Keys: "Issuer signing keys: publish, rotate, mark compromised",
  Receipts: "Signed Proof-of-Intent receipts for captured payments", Setup: "Agents and PayPal wallet vaulting", Mandates: "Spending mandates the user signs with a passkey",
  Passkeys: "Passkey enrollment, re-enrollment and time-locked recovery", Approvals: "Payments held for the user's passkey approval",
  Agent: "Calls an agent makes with its own key: product search, payments, receipts", Catalog: "Channel3 product search for the owner",
  Payments: "Payment log and crash recovery", Control: "Operator kill-switch", Audit: "Hash-chained audit ledger, attestations and anchors",
};
const SEC = { admin: [{ admin: [] }], agent: [{ agent: [] }], cron: [{ cron: [] }], none: [] };
const errorResp = d => ({ description: d, content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } });

export function buildOpenApi(version) {
  const paths = {};
  for (const [method, path, auth, tag, summary, x = {}] of ENDPOINTS) {
    const params = [...path.matchAll(/\{(\w+)\}/g)].map(m => ({ name: m[1], in: "path", required: true, schema: { type: "string" } }))
      .concat(Object.entries(x.query ?? {}).map(([name, description]) => ({ name, in: "query", description, schema: { type: "string" } })));
    const op = {
      operationId: OPS[`${method} ${path}`] ?? (method + path).toLowerCase().replace(/[{}]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/_$/, ""),
      description: summary,
      tags: [tag], summary, security: SEC[auth], ...(params.length ? { parameters: params } : {}),
      ...(x.body ? { requestBody: { required: (x.body.required ?? []).length > 0, content: { "application/json": { schema: x.body } } } } : {}),
      responses: { 200: method === "HEAD" ? { description: "OK" } : { description: "OK", content: { "application/json": { schema: resSchema(`${method} ${path}`) } } },
        400: errorResp("Bad request"), ...(auth !== "none" ? { 401: errorResp("Missing or wrong bearer token") } : {}), 404: errorResp("Not found"), 413: errorResp("Body over 256 KB"),
        ...(path === "/v1/agent/payments" ? { 429: errorResp("Rate limited"), 503: errorResp("Paused by operator kill-switch") } : {}), 500: errorResp("Internal error") },
    };
    (paths[path] ??= {})[method.toLowerCase()] = op;
  }
  return {
    openapi: "3.1.0",
    info: { title: "AgentGuard API", version, license: { name: "Apache-2.0", identifier: "Apache-2.0" },
      description: "Financial authorization gateway for AI agents paying through PayPal. Errors are `{\"error\": string}`. Responses are JSON with `cache-control: no-store`. Docs: https://agentguard-orcin.vercel.app/docs" },
    servers: [{ url: "https://agentguard-orcin.vercel.app", description: "Hosted demo (PayPal sandbox)" }, { url: "http://localhost:8787", description: "Local" }],
    tags: [...new Set(ENDPOINTS.map(e => e[3]))].map(name => ({ name, description: TAGS[name] ?? name })),
    components: {
      securitySchemes: {
        admin: { type: "http", scheme: "bearer", description: "AGENTGUARD_ADMIN_TOKEN (owner/operator)" },
        agent: { type: "http", scheme: "bearer", description: "Per-agent API key from POST /v1/agents" },
        cron: { type: "http", scheme: "bearer", description: "CRON_SECRET" },
      },
      schemas: {
        MandateConstraints: S({ currency: str("ISO 4217", "USD"), max_total: str(undefined, "25.00"), max_per_transaction: str(), max_transactions: int(),
          allowed_categories: { type: "array", items: { enum: ["PHYSICAL_GOODS", "DIGITAL_GOODS", "DONATION", "UNSPECIFIED"] } }, payee_allowlist: { type: "array", items: { type: "string" } },
          payee_blocklist: { type: "array", items: { type: "string" } }, max_quantity_per_item: int(), require_human_approval_over: str(), require_merchant_order: bool(),
          sku_allowlist: { type: "array", items: { type: "string" } } }, ["currency", "max_total", "max_transactions"]),
        Error: { type: "object", properties: { error: { type: "string" } }, required: ["error"] },
        Health: S({ ok: bool(), stuck: int("Payments stuck in reserved/authorized for over a minute"), last_recovery: { anyOf: [obj("Last reconciliation run"), { type: "null" }] } }, ["ok", "stuck"]),
        AgentCredentials: S({ agent_id: str(), api_key: str("Shown once; store it as the agent's secret") }, ["agent_id", "api_key"]),
        Check: S({ check: str(undefined, "per_transaction_limit"), pass: bool(), detail: str() }, ["check", "pass", "detail"]),
        RiskSignal: S({ signal: str(undefined, "catalog_price_above_market"), severity: { type: "string", enum: ["low", "medium", "high"] }, detail: str() }, ["signal", "severity", "detail"]),
        Evaluation: S({ decision: { type: "string", enum: ["approve", "reject", "needs_human"] }, proposal_hash: str("sha256 of the canonical proposal"), amount_minor: int("Amount in minor units, from the PayPal order"),
          checks: { type: "array", items: { $ref: "#/components/schemas/Check" } }, risk: { type: "array", items: { $ref: "#/components/schemas/RiskSignal" } }, reasons: { type: "array", items: { type: "string" } } },
          ["decision", "proposal_hash", "amount_minor", "checks", "risk", "reasons"]),
        PaymentDecision: S({ payment_id: str(undefined, "pay_…"), decision: { type: "string", enum: ["approve", "reject", "needs_human"] },
          status: { type: "string", enum: ["rejected", "needs_human", "reserved", "authorized", "captured", "voided", "failed"] }, evaluation: { $ref: "#/components/schemas/Evaluation" },
          approval_id: nstr("Set when the payment waits for the user's passkey approval"), paypal: S({ order_id: nstr(), authorization_id: nstr(), capture_id: nstr() }), error: nstr() },
          ["payment_id", "decision", "status", "evaluation"]),
        Spend: S({ spent_minor: int(), reserved_minor: int(), tx_count: int() }),
        Mandate: S({ mandate_id: str(), user_id: str(), agent_id: str(), purpose: str(), constraints: { $ref: "#/components/schemas/MandateConstraints" }, created_at: str(), expires_at: str(), version: int() },
          ["mandate_id", "user_id", "agent_id", "purpose", "constraints", "created_at", "expires_at"]),
        AgentMandate: S({ mandate: { $ref: "#/components/schemas/Mandate" }, status: { type: "string", enum: ["draft", "unsigned", "active", "frozen", "revoked", "exhausted", "expired"] }, spend: { $ref: "#/components/schemas/Spend" } }, ["mandate", "status"]),
        CatalogOffer: S({ domain: str(undefined, "bestbuy.com"), url: str("Retailer buy link"), price: str(undefined, "39.00"), price_minor: int(), currency: str(undefined, "USD"), availability: str(undefined, "InStock"), condition: nstr("new, used, refurbished; null when unknown") }, ["domain", "price", "currency"]),
        CatalogProduct: S({ product_id: str("Use as the PayPal order item sku", "channel3:2yh8WH5"), channel3_id: str(), title: str(), brand: nstr(), image: nstr(), category: nstr(),
          offers: { type: "array", items: { $ref: "#/components/schemas/CatalogOffer" } }, best_offer: nref("CatalogOffer", "Cheapest in-stock offer within the mandate's currency and ceiling"),
          mandate_fit: S({ fits: bool(), needs_approval: bool(), checks: { type: "array", items: { $ref: "#/components/schemas/Check" } } }) }, ["product_id", "title", "offers"]),
        ProductSearchResult: S({ provider: str(undefined, "channel3"), mandate_id: str(), query: str(), max_price: str("Price ceiling applied: min(per-payment cap, remaining budget)"), currency: str(),
          products: { type: "array", items: { $ref: "#/components/schemas/CatalogProduct" } }, next_page_token: nstr(), how_to_pay: str() }, ["provider", "products", "max_price", "currency"]),
        ReceiptEnvelope: S({ receipt: obj("agentguard.proof-of-intent/v1 receipt: mandate + passkey signature, PayPal order snapshot, decision, capture"),
          signature: S({ alg: str(undefined, "Ed25519"), kid: str(), key_id: str(), public_key_pem: str(), value: str() }, ["alg", "value"]),
          timestamps: { type: "array", items: obj("RFC 3161 timestamp token") }, anchor: obj("Merkle inclusion proof for the audit-chain anchor") }, ["receipt", "signature"]),
        ReceiptSummary: S({ receipt_id: str(), payment_id: str(), capture_id: str(), receipt_hash: str(), issued_at: str() }, ["receipt_id", "payment_id"]),
        IssuerKey: S({ kid: str(), kty: str(undefined, "OKP"), crv: str(undefined, "Ed25519"), x: str(), public_key_pem: str(), status: str(), created: str(), retired: nstr(), compromised_at: nstr() }, ["kid"]),
        IssuerKeySet: S({ issuer: str(), keys: { type: "array", items: { $ref: "#/components/schemas/IssuerKey" } } }, ["keys"]),
        AuditEntry: S({ seq: int(), ts: str(), event: str(undefined, "payment.captured"), ref: nstr(), payload: obj(), prev_hash: str(), hash: str("sha256(prev_hash|ts|event|ref|canonical(payload))") }, ["seq", "ts", "event", "prev_hash", "hash"]),
        AuditVerification: S({ ok: bool(), length: int(), brokenAt: int("First entry whose hash or link does not verify") }, ["ok", "length"]),
        PauseState: S({ paused: bool(), reason: str(), by: str(), since: str() }, ["paused"]) },
    },
    paths,
  };
}
