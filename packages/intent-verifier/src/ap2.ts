import { canonical, sha256Bytes, toMinor } from "./canonical.ts";
import { orderFacts } from "./order.ts";

/**
 * AP2 (Agent Payments Protocol, github.com/google-agentic-commerce/AP2) views of an AgentGuard Proof-of-Intent receipt.
 *
 * Shapes follow the AP2 JSON schemas in code/sdk/schemas/ap2 (vct mandate.checkout.open.1, mandate.payment.open.1,
 * mandate.checkout.1, mandate.payment.1, plus checkout/payment receipts) as of AP2 commit e1ea56d (2026-04-29).
 * AP2 v0.1 called the user-intent mandate "Intent Mandate" and the merchant cart "Cart Mandate"; in the current spec
 * those roles are the Open Checkout/Payment Mandates and the closed Checkout Mandate. Both names are given below.
 *
 * The views are a pure, deterministic function of the native receipt, so any verifier can recompute them and the
 * issuer's Ed25519 signature over the receipt covers them. They are NOT SD-JWT credentials: see AP2_CAVEATS.
 */
export const AP2_PROFILE = "agentguard.ap2-view/v1";
export const AP2_SPEC_REF = "google-agentic-commerce/AP2@e1ea56d";
export const AP2_CAVEATS = [
  "Mandates are plain JSON claim sets, not SD-JWT/KB-JWT; no selective disclosure.",
  "User authority is a WebAuthn passkey assertion over sha256(canonical(AgentGuard mandate)), carried as user_authorization, not an SD-JWT issuer signature over the AP2 open mandates; the open mandates are derived from (and pinned to) that signed mandate.",
  "checkout_jwt is an unsecured JWT (alg none) of PayPal's order as AgentGuard read it via GET /v2/checkout/orders/{id}; merchant authenticity comes from PayPal's API, not a merchant JWS.",
  "cnf uses {kid: agent id}, not an agent JWK.",
  "network_confirmation_id carries the PayPal authorization id (PayPal is both PSP and network here).",
];

const b64u = (s: string | Buffer) => Buffer.from(s).toString("base64url");
export const ap2Hash = (s: string) => sha256Bytes(s).toString("base64url");
const epoch = (iso: string) => Math.floor(new Date(iso).getTime() / 1000);
const merchant = (id: string) => ({ id, name: id });

/** Build the AP2 views from a native receipt (any `ap2` field on it is ignored). Throws on an unusable order snapshot. */
export function buildAp2(receipt: any): any {
  const m = receipt.mandate.body; const c = m.constraints ?? {};
  const f = orderFacts(receipt.order.snapshot);
  const payeeId = f.payee.merchant_id ?? f.payee.email_address ?? "unknown";
  const iat = epoch(m.created_at), exp = epoch(m.expires_at);
  const bind = { agentguard_mandate_id: m.mandate_id, agentguard_mandate_hash: m.hash ?? receipt.mandate.hash };
  const cnf = { kid: `agentguard-agent:${m.agent_id}` };

  // "Intent Mandate" (v0.1) == Open Checkout + Open Payment Mandates (current).
  const ocm: any = { vct: "mandate.checkout.open.1", constraints: [] as any[], cnf, iat, exp, ...bind, purpose: m.purpose };
  if (c.payee_allowlist?.length) ocm.constraints.push({ type: "checkout.allowed_merchants", allowed: c.payee_allowlist.map(merchant) });
  // AP2 requires a line_items constraint. With a SKU allowlist it is exact; without one, items are the order's (approximate).
  const skus: string[] = c.sku_allowlist?.length ? c.sku_allowlist : f.items.map(i => i.sku ?? i.name);
  ocm.constraints.push({ type: "checkout.line_items", items: [{ id: "agentguard-line-1", acceptable_items: skus.map(s => ({ id: s, title: s })), quantity: Math.max(1, c.max_quantity_per_item ?? Math.max(...f.items.map(i => i.quantity), 1)) }] });
  ocm.agentguard_constraint_source = c.sku_allowlist?.length ? "sku_allowlist" : "order_items";
  const opm: any = { vct: "mandate.payment.open.1", constraints: [] as any[], cnf, iat, exp, ...bind };
  opm.constraints.push({ type: "payment.reference", conditional_transaction_id: ap2Hash(canonical(ocm)) });
  opm.constraints.push({ type: "payment.amount_range", currency: c.currency, max: toMinor(c.max_per_transaction ?? c.max_total) });
  opm.constraints.push({ type: "payment.budget", currency: c.currency, max: toMinor(c.max_total) / 100 });
  opm.constraints.push({ type: "payment.agent_recurrence", frequency: "ON_DEMAND", max_occurrences: c.max_transactions });
  opm.constraints.push({ type: "payment.execution_date", not_before: m.created_at, not_after: m.expires_at });
  if (c.payee_allowlist?.length) opm.constraints.push({ type: "payment.allowed_payees", allowed: c.payee_allowlist.map(merchant) });

  // "Cart Mandate" (v0.1) == closed Checkout Mandate over the merchant-created PayPal order.
  const checkout = {
    iss: "paypal:orders-v2", sub: f.order_id, order_digest: f.digest, merchant: merchant(payeeId),
    line_items: f.items.map(i => ({ item: { id: i.sku ?? i.name, title: i.name }, quantity: i.quantity, unit_amount: toMinor(i.unit_amount), category: i.category })),
    total: { amount: f.amount_minor, currency: f.currency },
  };
  const checkout_jwt = `${b64u(JSON.stringify({ alg: "none", typ: "JWT", cty: "paypal-order-snapshot" }))}.${b64u(canonical(checkout))}.`;
  const checkout_hash = ap2Hash(checkout_jwt);
  const cm = { vct: "mandate.checkout.1", checkout_jwt, checkout_hash, iat: epoch(receipt.decision.evaluated_at), exp, ...bind };

  const p = receipt.payment;
  const pm = {
    vct: "mandate.payment.1", transaction_id: checkout_hash, payee: merchant(payeeId),
    payment_amount: { amount: p.amount_minor, currency: p.currency },
    payment_instrument: { id: `paypal-vault:${m.user_id}`, type: "PAYPAL_WALLET", description: "User's vaulted PayPal wallet (token held by AgentGuard, never by the agent)" },
    risk_data: { agentguard_decision: receipt.decision.decision, agentguard_risk: receipt.decision.risk ?? null },
    iat: epoch(receipt.decision.evaluated_at), exp, ...bind,
  };
  const iss = receipt.issuer.name;
  const checkout_receipt = { status: "Success", iss, iat: epoch(p.captured_at), reference: checkout_hash, order_id: f.order_id };
  const payment_receipt = { status: "Success", iss, iat: epoch(p.captured_at), reference: ap2Hash(canonical(pm)), payment_id: p.payment_id,
    psp_confirmation_id: p.capture_id, network_confirmation_id: p.authorization_id };
  return {
    profile: AP2_PROFILE, spec: AP2_SPEC_REF,
    intent_mandate: { open_checkout_mandate: ocm, open_payment_mandate: opm },
    cart_mandate: { checkout_mandate: cm },
    payment_mandate: pm,
    receipts: { checkout_receipt, payment_receipt },
    user_authorization: { method: "webauthn-passkey", signed_digest_sha256: receipt.mandate.hash, credential_id: receipt.mandate.user_signature?.credential_id ?? null,
      note: "Passkey assertion over the AgentGuard mandate hash; open mandates carry the same agentguard_mandate_hash." },
    caveats: AP2_CAVEATS,
  };
}

export interface Ap2Check { check: string; pass: boolean; detail: string }
const decodeJwtPayload = (jwt: string) => JSON.parse(Buffer.from(jwt.split(".")[1] ?? "", "base64url").toString());

/** Verify a receipt's AP2 views: exact recomputation plus explicit AP2 chain linkage and constraint checks. */
export function verifyAp2(receipt: any): Ap2Check[] {
  const out: Ap2Check[] = []; const add = (check: string, pass: boolean, detail: string) => out.push({ check, pass, detail });
  const a = receipt?.ap2;
  if (!a) return out;
  try {
    const { ap2: _, ...core } = receipt;
    const expect = buildAp2(core);
    add("ap2.derivation", canonical(expect) === canonical(a), canonical(expect) === canonical(a) ? "AP2 views recompute exactly from the signed receipt" : "AP2 views differ from what the receipt implies");
  } catch (e) { add("ap2.derivation", false, `cannot derive AP2 views: ${(e as Error).message}`); }
  try {
    const ocm = a.intent_mandate?.open_checkout_mandate, opm = a.intent_mandate?.open_payment_mandate, cm = a.cart_mandate?.checkout_mandate, pm = a.payment_mandate;
    const rc = a.receipts?.payment_receipt, cr = a.receipts?.checkout_receipt;
    add("ap2.vct", ocm?.vct === "mandate.checkout.open.1" && opm?.vct === "mandate.payment.open.1" && cm?.vct === "mandate.checkout.1" && pm?.vct === "mandate.payment.1", "vct claims");
    const mh = receipt.mandate?.hash;
    add("ap2.user_binding", [ocm, opm, cm, pm].every(x => x?.agentguard_mandate_hash === mh) && a.user_authorization?.signed_digest_sha256 === mh, "every AP2 mandate pins the passkey-signed mandate hash");
    const ref = (opm?.constraints ?? []).find((x: any) => x.type === "payment.reference");
    add("ap2.open_payment_reference", ref?.conditional_transaction_id === ap2Hash(canonical(ocm)), "open payment mandate references open checkout mandate digest");
    add("ap2.checkout_hash", cm?.checkout_hash === ap2Hash(cm?.checkout_jwt ?? ""), "checkout_hash = b64url(sha256(checkout_jwt))");
    const co = decodeJwtPayload(cm.checkout_jwt);
    const f = orderFacts(receipt.order.snapshot);
    add("ap2.checkout_order", co.sub === receipt.order.paypal_order_id && co.order_digest === receipt.order.digest && co.total?.amount === f.amount_minor && co.total?.currency === f.currency, `checkout = PayPal order ${co.sub}`);
    add("ap2.payment_transaction_id", pm?.transaction_id === cm?.checkout_hash, "payment mandate transaction_id = checkout_hash");
    add("ap2.payment_amount", pm?.payment_amount?.amount === co.total?.amount && pm?.payment_amount?.currency === co.total?.currency, `${pm?.payment_amount?.amount} ${pm?.payment_amount?.currency}`);
    const rng = (opm?.constraints ?? []).find((x: any) => x.type === "payment.amount_range");
    add("ap2.amount_range", !!rng && rng.currency === pm.payment_amount.currency && pm.payment_amount.amount <= rng.max && (rng.min == null || pm.payment_amount.amount >= rng.min), `amount ${pm?.payment_amount?.amount} <= max ${rng?.max}`);
    const payees = (opm?.constraints ?? []).find((x: any) => x.type === "payment.allowed_payees");
    if (payees) add("ap2.allowed_payees", payees.allowed.some((x: any) => String(x.id).toLowerCase() === String(pm.payee.id).toLowerCase() || String(x.id).toLowerCase() === (f.payee.email_address ?? "")), `payee ${pm.payee.id}`);
    add("ap2.payment_receipt", rc?.status === "Success" && rc.reference === ap2Hash(canonical(pm)) && rc.psp_confirmation_id === receipt.payment?.capture_id, `payment receipt -> capture ${rc?.psp_confirmation_id}`);
    add("ap2.checkout_receipt", cr?.status === "Success" && cr.reference === cm?.checkout_hash && cr.order_id === receipt.order?.paypal_order_id, `checkout receipt -> order ${cr?.order_id}`);
  } catch (e) { add("ap2.structure", false, `malformed AP2 views: ${(e as Error).message}`); }
  return out;
}
