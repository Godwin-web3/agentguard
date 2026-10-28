import { createHash, createPublicKey, verify as edVerify } from "node:crypto";
import { canonical, sha256, sha256Bytes, toMinor } from "./canonical.ts";
import { verifyCose } from "./cose.ts";
import { orderFacts, substance, type Facts } from "./order.ts";

export const SUPPORTED_SCHEMAS = ["agentguard.proof-of-intent/v1"];

export interface Envelope { receipt: any; signature: { alg: string; key_id?: string; public_key_pem?: string; value: string } }
export interface Check { check: string; pass: boolean; detail: string }
export interface VerifyOptions {
  /** PEM of the AgentGuard issuer key you trust (from its /.well-known/agentguard-key). Without it, the embedded key is used and the result is not "trusted". */
  issuerPublicKeyPem?: string;
  /** WebAuthn origins you accept for the user's passkey assertion. Defaults to the origins the receipt declares. */
  expectedOrigins?: string[];
  /** Your PayPal merchant ids/emails: the order's payee must be one of them. */
  expectedPayee?: string[];
  /** Optional live re-check against PayPal using the merchant's own REST credentials. */
  paypal?: { clientId: string; clientSecret: string; apiBase?: string; fetch?: typeof fetch };
}
export interface VerifyResult {
  ok: boolean;               // every check passed
  trusted_issuer: boolean;   // signature verified under a pinned issuer key
  receipt_id?: string;
  summary?: { order_id: string; capture_id: string; amount: string; currency: string; payee: string; user_id: string; agent_id: string; captured_at: string };
  checks: Check[];
  warnings: string[];
}

const b64uBytes = (s: string) => Buffer.from(s, "base64url");
const keyIdOf = (pem: string) => createHash("sha256").update(createPublicKey(pem).export({ type: "spki", format: "der" })).digest("hex").slice(0, 32);
const fmt = (m: number) => `${Math.floor(m / 100)}.${String(m % 100).padStart(2, "0")}`;

/** Verify a WebAuthn assertion whose challenge must be exactly base64url(bytes of hexDigest). */
export function verifyPasskeyAssertion(a: { sig: any; cosePublicKey: string; hexDigest: string; rpId: string; origins: string[] }): Check[] {
  const out: Check[] = []; const add = (check: string, pass: boolean, detail: string) => out.push({ check, pass, detail });
  try {
    const cdj = b64uBytes(a.sig.client_data_json); const cd = JSON.parse(cdj.toString("utf8"));
    const want = Buffer.from(a.hexDigest, "hex").toString("base64url");
    add("passkey.client_data", cd.type === "webauthn.get" && cd.challenge === want,
      `type=${cd.type}; challenge ${cd.challenge === want ? "equals" : "DOES NOT equal"} the mandate hash`);
    add("passkey.origin", a.origins.includes(cd.origin), `origin ${cd.origin}${a.origins.includes(cd.origin) ? "" : ` not in ${a.origins.join(", ")}`}`);
    const ad = b64uBytes(a.sig.authenticator_data);
    add("passkey.rp_id", ad.length >= 37 && ad.subarray(0, 32).equals(sha256Bytes(a.rpId)), `rpIdHash ${ad.length >= 37 && ad.subarray(0, 32).equals(sha256Bytes(a.rpId)) ? "matches" : "does not match"} ${a.rpId}`);
    const flags = ad[32] ?? 0;
    add("passkey.user_verified", !!(flags & 0x01) && !!(flags & 0x04), `UP=${flags & 1 ? 1 : 0} UV=${flags & 4 ? 1 : 0}`);
    const ok = verifyCose(b64uBytes(a.cosePublicKey), Buffer.concat([ad, sha256Bytes(cdj)]), b64uBytes(a.sig.signature));
    add("passkey.signature", ok, ok ? "user's passkey signed the mandate hash" : "signature does not verify under the credential public key");
  } catch (e) { add("passkey.signature", false, `malformed assertion: ${(e as Error).message}`); }
  return out;
}

/** Re-check the PayPal order against the user's mandate constraints. Pure; usable on any snapshot. */
export function checkOrderAgainstMandate(f: Facts, mandate: any): Check[] {
  const out: Check[] = []; const add = (check: string, pass: boolean, detail: string) => out.push({ check, pass, detail });
  const c = mandate.constraints ?? {};
  add("mandate.currency", f.currency === c.currency, `${f.currency} vs ${c.currency}`);
  if (c.max_per_transaction) add("mandate.per_transaction_limit", f.amount_minor <= toMinor(c.max_per_transaction), `${fmt(f.amount_minor)} <= ${c.max_per_transaction}`);
  add("mandate.total_limit", f.amount_minor <= toMinor(c.max_total), `${fmt(f.amount_minor)} <= ${c.max_total} (this payment alone; cumulative spend is attested by the issuer)`);
  const ids = [f.payee.merchant_id, f.payee.email_address].filter(Boolean).map(s => s!.toLowerCase());
  if (c.payee_allowlist?.length) {
    const allow = c.payee_allowlist.map((s: string) => s.toLowerCase());
    add("mandate.payee_allowlist", ids.some(id => allow.includes(id)), `payee ${ids.join("/")}`);
  }
  if (c.payee_blocklist?.length) {
    const block = c.payee_blocklist.map((s: string) => s.toLowerCase());
    add("mandate.payee_blocklist", !ids.some(id => block.includes(id)), `payee ${ids.join("/")}`);
  }
  if (c.sku_allowlist?.length) {
    const bad = f.items.filter(i => !i.sku || !c.sku_allowlist.map((s: string) => s.trim()).includes(i.sku.trim()));
    add("mandate.sku_allowlist", f.items.length > 0 && bad.length === 0, bad.length ? `not allowlisted: ${bad.map(i => `${i.name} (${i.sku ?? "no sku"})`).join(", ")}` : "all skus allowlisted");
  }
  if (c.allowed_categories?.length) {
    const bad = f.items.filter(i => !c.allowed_categories.includes(i.category));
    add("mandate.category", bad.length === 0, bad.length ? `disallowed: ${bad.map(i => `${i.name} (${i.category})`).join(", ")}` : "ok");
  }
  if (c.max_quantity_per_item) {
    const over = f.items.filter(i => i.quantity > c.max_quantity_per_item);
    add("mandate.quantity", over.length === 0, over.length ? `over limit: ${over.map(i => `${i.name} x${i.quantity}`).join(", ")}` : "ok");
  }
  return out;
}

async function paypalRecheck(r: any, f: Facts, o: NonNullable<VerifyOptions["paypal"]>): Promise<Check[]> {
  const out: Check[] = []; const add = (check: string, pass: boolean, detail: string) => out.push({ check, pass, detail });
  const base = o.apiBase ?? "https://api-m.paypal.com"; const http = o.fetch ?? fetch;
  try {
    const t = await http(`${base}/v1/oauth2/token`, { method: "POST", body: "grant_type=client_credentials",
      headers: { authorization: "Basic " + Buffer.from(`${o.clientId}:${o.clientSecret}`).toString("base64"), "content-type": "application/x-www-form-urlencoded" } });
    if (!t.ok) { add("paypal.auth", false, `token request failed: HTTP ${t.status}`); return out; }
    const token = (await t.json() as any).access_token;
    const res = await http(`${base}/v2/checkout/orders/${encodeURIComponent(f.order_id)}`, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) { add("paypal.order_found", false, `GET order ${f.order_id}: HTTP ${res.status}`); return out; }
    const live = await res.json() as any;
    add("paypal.order_found", true, `order ${live.id} status ${live.status}`);
    let lf: Facts | null = null; try { lf = orderFacts(live); } catch (e) { add("paypal.order_matches_snapshot", false, (e as Error).message); }
    if (lf) add("paypal.order_matches_snapshot", substance(lf) === substance(f), substance(lf) === substance(f) ? "payee, amount, currency and items unchanged" : "PayPal's order differs from the receipt's snapshot");
    const caps: any[] = live.purchase_units?.[0]?.payments?.captures ?? [];
    const cap = caps.find(c => c.id === r.payment?.capture_id);
    add("paypal.capture_present", !!cap && cap.status === "COMPLETED", cap ? `capture ${cap.id} ${cap.status}` : `capture ${r.payment?.capture_id} not on this order`);
    if (cap) {
      const amt = cap.amount ? toMinor(String(cap.amount.value)) : -1;
      add("paypal.capture_amount", amt === f.amount_minor && cap.amount.currency_code === f.currency, `${cap.amount?.value} ${cap.amount?.currency_code}`);
      if (r.payment?.paypal_invoice_id) add("paypal.receipt_reference", cap.invoice_id === r.payment.paypal_invoice_id, `capture invoice_id ${cap.invoice_id ?? "(none)"}`);
    }
  } catch (e) { add("paypal.recheck", false, `error: ${(e as Error).message}`); }
  return out;
}

/** Verify a Proof-of-Intent receipt. Offline unless `opts.paypal` is set. Never throws on bad input: it fails checks. */
export async function verifyReceipt(env: Envelope, opts: VerifyOptions = {}): Promise<VerifyResult> {
  const checks: Check[] = []; const warnings: string[] = [];
  const add = (check: string, pass: boolean, detail: string) => checks.push({ check, pass, detail });
  const r = env?.receipt;
  if (!r || typeof r !== "object" || !env.signature?.value) return { ok: false, trusted_issuer: false, checks: [{ check: "format", pass: false, detail: "not a receipt envelope" }], warnings };
  add("schema", SUPPORTED_SCHEMAS.includes(r.schema), `schema ${r.schema}`);

  // 1. Issuer attestation (Ed25519 over canonical(receipt)).
  let trusted = false;
  const pem = opts.issuerPublicKeyPem ?? env.signature.public_key_pem;
  if (!opts.issuerPublicKeyPem) warnings.push("issuer key not pinned: verified with the key embedded in the receipt. Pin the issuer's /.well-known/agentguard-key key to trust the attestation.");
  try {
    const ok = env.signature.alg === "Ed25519" && !!pem && edVerify(null, Buffer.from(canonical(r)), createPublicKey(pem!), Buffer.from(env.signature.value, "base64"));
    add("issuer.signature", ok, ok ? `Ed25519 signature valid (key ${keyIdOf(pem!)})` : "issuer signature invalid: receipt altered or signed by another key");
    if (ok && r.issuer?.key_id) add("issuer.key_id", r.issuer.key_id === keyIdOf(pem!), `receipt names key ${r.issuer.key_id}`);
    trusted = ok && !!opts.issuerPublicKeyPem;
  } catch (e) { add("issuer.signature", false, `bad issuer key or signature: ${(e as Error).message}`); }

  // 2. The user's mandate and passkey signature over it.
  const m = r.mandate?.body;
  const mh = m ? sha256(canonical(m)) : "";
  add("mandate.hash", !!m && mh === r.mandate?.hash, mh === r.mandate?.hash ? `mandate hash ${mh.slice(0, 16)}…` : "mandate body does not match its hash");
  const sig = r.mandate?.user_signature; const pk = r.mandate?.passkey;
  add("passkey.credential", !!sig && !!pk && sig.credential_id === pk.credential_id, `credential ${pk?.credential_id ?? "?"}`);
  if (sig && pk) checks.push(...verifyPasskeyAssertion({ sig, cosePublicKey: pk.public_key_cose, hexDigest: mh,
    rpId: r.issuer?.webauthn_rp_id ?? "", origins: opts.expectedOrigins ?? r.issuer?.webauthn_origins ?? [] }));
  if (!opts.expectedOrigins) warnings.push(`passkey origin accepted from the receipt's own list (${(r.issuer?.webauthn_origins ?? []).join(", ")}); pass expectedOrigins to pin it.`);

  // 3. The PayPal order: snapshot integrity, binding to the decision, and compliance with the mandate.
  let f: Facts | null = null;
  try { f = orderFacts(r.order?.snapshot); } catch (e) { add("order.snapshot", false, `unusable order snapshot: ${(e as Error).message}`); }
  if (f) {
    add("order.snapshot", f.order_id === r.order.paypal_order_id && f.intent === "AUTHORIZE", `order ${f.order_id} intent ${f.intent}`);
    add("order.digest", f.digest === r.order.digest, f.digest === r.order.digest ? "snapshot matches the digest the decision was made on" : "snapshot does not match the evaluated order digest");
    checks.push(...checkOrderAgainstMandate(f, m ?? {}));
    add("payment.amount", r.payment?.amount_minor === f.amount_minor && r.payment?.currency === f.currency, `${fmt(r.payment?.amount_minor ?? 0)} ${r.payment?.currency}`);
    if (opts.expectedPayee?.length) {
      const ids = [f.payee.merchant_id, f.payee.email_address].filter(Boolean).map(s => s!.toLowerCase());
      add("order.expected_payee", ids.some(id => opts.expectedPayee!.map(s => s.toLowerCase()).includes(id)), `payee ${ids.join("/")}`);
    }
  }
  // 4. Decision binding and timing.
  const d = r.decision ?? {};
  const ph = m ? sha256(canonical({ kind: "paypal_order", mandate_id: m.mandate_id, agent_id: d.agent_id, idempotency_key: d.idempotency_key, paypal_order_id: r.order?.paypal_order_id })) : "";
  add("decision.proposal_hash", ph === d.proposal_hash, ph === d.proposal_hash ? "decision is bound to this mandate, agent and order" : "decision is not bound to this order/mandate");
  add("decision.agent", !!m && d.agent_id === m.agent_id, `agent ${d.agent_id} (mandate names ${m?.agent_id})`);
  const failed = (d.checks ?? []).filter((c: any) => !c.pass).map((c: any) => c.check);
  const approval = r.approval;
  const approved = d.decision === "approve" || (d.decision === "needs_human" && approval?.resolution === "approved" && approval?.proposal_hash === d.proposal_hash);
  add("decision.outcome", approved && failed.length === 0, `decision=${d.decision}${approval ? `, human approval ${approval.resolution} by ${approval.approver ?? "?"}` : ""}${failed.length ? `; failed checks: ${failed.join(", ")}` : ""}`);
  if (approval && approval.method !== "passkey") warnings.push(`human approval was authenticated by ${approval.method}, not by the user's passkey; it is attested by the issuer only.`);
  if (m) {
    const t = (s: string) => new Date(s).getTime();
    const inWin = t(m.created_at) <= t(d.evaluated_at) && t(d.evaluated_at) < t(m.expires_at) && t(r.payment?.captured_at) >= t(d.evaluated_at);
    add("mandate.time_window", inWin, `mandate ${m.created_at} – ${m.expires_at}; evaluated ${d.evaluated_at}; captured ${r.payment?.captured_at}`);
  }
  add("payment.capture", typeof r.payment?.capture_id === "string" && r.payment.capture_status === "COMPLETED", `capture ${r.payment?.capture_id} ${r.payment?.capture_status}`);
  add("audit.anchor", /^[0-9a-f]{64}$/.test(r.audit?.capture_entry_hash ?? ""), `audit entry #${r.audit?.capture_entry_seq} ${String(r.audit?.capture_entry_hash).slice(0, 16)}…`);

  // 5. Optional: ask PayPal, with the merchant's own keys, whether the order and capture are what the receipt says.
  if (opts.paypal && f) checks.push(...await paypalRecheck(r, f, opts.paypal));
  else if (!opts.paypal) warnings.push("PayPal not re-checked (offline). Pass merchant credentials to confirm the order and capture live.");

  const ok = checks.length > 0 && checks.every(c => c.pass);
  return { ok, trusted_issuer: trusted, receipt_id: r.receipt_id, checks, warnings,
    summary: f ? { order_id: f.order_id, capture_id: r.payment?.capture_id, amount: fmt(f.amount_minor), currency: f.currency,
      payee: [f.payee.merchant_id, f.payee.email_address].filter(Boolean).join(" / "), user_id: m?.user_id, agent_id: d.agent_id, captured_at: r.payment?.captured_at } : undefined };
}
