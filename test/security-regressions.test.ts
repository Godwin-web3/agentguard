import { testSql } from "./support/db.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { Store } from "../src/store.ts";
import { enrol, signer, revoker } from "./support/passkey.ts";
import { Gateway, verifyObserved } from "../src/gateway.ts";
import { HeuristicRiskAnalyzer } from "../src/risk.ts";
import type { PaymentRail, AuthorizeInput, AuthorizationState } from "../src/paypal.ts";
import type { PaymentProposal } from "../src/types.ts";

type Observed = { merchant_id?: string; email_address?: string };
class Rail implements PaymentRail {
  calls: string[] = [];
  observedPayee?: (i: AuthorizeInput) => Observed;
  onAuthorize?: (i: AuthorizeInput) => void;
  async authorize(i: AuthorizeInput) {
    this.calls.push(`authorize:${JSON.stringify(i.payee)}`);
    this.onAuthorize?.(i);
    const payee = this.observedPayee ? this.observedPayee(i) : { merchant_id: i.payee.merchant_id, email_address: i.payee.email_address };
    return { order_id: "O-" + i.referenceId, authorization_id: "A-" + i.referenceId, status: "CREATED",
      observed: { currency: i.currency, amountMinor: i.amountMinor, payee } };
  }
  async capture(id: string) { this.calls.push(`capture:${id}`); return { capture_id: "C-" + id, status: "COMPLETED" }; }
  async void(id: string) { this.calls.push(`void:${id}`); }
  async getAuthorization(_id: string): Promise<AuthorizationState> { return { status: "CREATED" }; }
}

async function setup(allow: string[] = ["store@legit.com"]) {
  const store = new Store(await testSql()); const rail = new Rail();
  const { passkeys, auths } = await enrol(store);
  const gw = new Gateway({ store, passkeys, risk: new HeuristicRiskAnalyzer(), rail });
  await gw.linkWallet("u1", "V"); await gw.registerAgent("u1", "shopper");
  const d = await gw.draftMandate({ user_id: "u1", agent_id: "shopper", purpose: "Buy one laptop",
    constraints: { currency: "USD", max_total: "900.00", max_transactions: 1, payee_allowlist: allow } });
  const sign = signer(gw, auths);
  await sign(d.mandate.mandate_id, d.mandate_hash);
  return { store, rail, gw, mid: d.mandate.mandate_id, sign, auths };
}
const prop = (mid: string, payee: PaymentProposal["payee"]): PaymentProposal => ({ mandate_id: mid, agent_id: "shopper", idempotency_key: "k",
  currency: "USD", payee, items: [{ name: "laptop", quantity: 1, unit_amount: "850.00", category: "PHYSICAL_GOODS" }] });

test("PoC: mixed payee ids (attacker merchant_id + allowlisted email) is rejected and never reaches PayPal", async () => {
  const { gw, rail, mid, sign } = await setup();
  const r = await gw.propose("shopper", prop(mid, { merchant_id: "ATTACKER123", email_address: "store@legit.com" }));
  assert.equal(r.decision, "reject"); assert.equal(r.status, "rejected");
  assert.ok(r.evaluation.reasons.some(x => x.includes("attacker123")));
  assert.deepEqual(rail.calls, []);
});

test("fully allowlisted payee still captures", async () => {
  const { gw, rail, mid, sign } = await setup(["store@legit.com", "LEGITM1"]);
  const r = await gw.propose("shopper", prop(mid, { merchant_id: "LEGITM1", email_address: "store@legit.com" }));
  assert.equal(r.status, "captured"); assert.equal(rail.calls.filter(c => c.startsWith("capture")).length, 1);
});

test("PayPal reporting no payee voids the authorization (fail closed)", async () => {
  const { gw, rail, mid, sign } = await setup();
  rail.observedPayee = () => ({});
  const r = await gw.propose("shopper", prop(mid, { email_address: "store@legit.com" }));
  assert.equal(r.status, "voided"); assert.match(r.error!, /no payee/);
  assert.ok(rail.calls.some(c => c.startsWith("void:"))); assert.ok(!rail.calls.some(c => c.startsWith("capture")));
});

test("PayPal reporting a different payee voids the authorization", async () => {
  const { gw, rail, mid, sign } = await setup();
  rail.observedPayee = () => ({ email_address: "evil@x.com" });
  const r = await gw.propose("shopper", prop(mid, { email_address: "store@legit.com" }));
  assert.equal(r.status, "voided"); assert.ok(!rail.calls.some(c => c.startsWith("capture")));
});

test("verifyObserved: merchant_id must match exactly; conflicting email also fails", () => {
  const p = prop("m", { merchant_id: "M1", email_address: "a@b.com" });
  assert.deepEqual(verifyObserved(p, 85000, { currency: "USD", amountMinor: 85000, payee: { merchant_id: "M1", email_address: "a@b.com" } }), []);
  assert.ok(verifyObserved(p, 85000, { currency: "USD", amountMinor: 85000, payee: { email_address: "a@b.com" } }).length);
  assert.ok(verifyObserved(p, 85000, { currency: "USD", amountMinor: 85000, payee: { merchant_id: "M1", email_address: "z@b.com" } }).length);
});

test("if recovery marks the payment failed mid-authorize, execute voids and never captures", async () => {
  const { gw, rail, store, mid, sign } = await setup();
  rail.onAuthorize = async (i) => { await store.transition(i.referenceId, ["reserved"], "failed", { error: "recovery: never authorized" }); };
  const r = await gw.propose("shopper", prop(mid, { email_address: "store@legit.com" }));
  assert.equal(r.status, "failed");                       // recovery's verdict stands; budget hold stays released
  assert.ok(rail.calls.some(c => c.startsWith("void:")));
  assert.ok(!rail.calls.some(c => c.startsWith("capture")));
  assert.equal((await store.spendState(mid)).spent_minor, 0);
});
