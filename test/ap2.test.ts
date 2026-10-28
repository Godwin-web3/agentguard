import { test } from "node:test";
import assert from "node:assert/strict";
import { setup, pay, order } from "./support/orders.ts";
import { Signer } from "../src/keys.ts";
import { canonical } from "../src/canonical.ts";
import { verifyReceipt, verifyAp2, buildAp2, ap2Hash } from "../packages/intent-verifier/src/index.ts";

const STAND = { name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "39.00" };
const failed = (v: any) => v.checks.filter((c: any) => !c.pass).map((c: any) => c.check);
const resign = (env: any, s: Signer) => ({ receipt: env.receipt, signature: { ...env.signature, public_key_pem: s.publicKeyPem(), value: s.sign(canonical(env.receipt)) } });

async function captured(c: any = {}) {
  const ctx = await setup(c);
  ctx.rail.orders.set("ORDERAP2001", order("ORDERAP2001", [STAND], { tax: 300 }));
  const r = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERAP2001"));
  assert.equal(r.status, "captured");
  return { ...ctx, env: ctx.receipts.forPayment(r.payment_id)! as any };
}

test("receipt carries AP2 Intent/Cart/Payment mandates that chain correctly and verify", async () => {
  const { env, issuer } = await captured({ max_per_transaction: "50.00" });
  const a = env.receipt.ap2;
  const ocm = a.intent_mandate.open_checkout_mandate, opm = a.intent_mandate.open_payment_mandate, cm = a.cart_mandate.checkout_mandate, pm = a.payment_mandate;
  assert.equal(ocm.vct, "mandate.checkout.open.1"); assert.equal(opm.vct, "mandate.payment.open.1");
  assert.equal(cm.vct, "mandate.checkout.1"); assert.equal(pm.vct, "mandate.payment.1");
  assert.deepEqual(ocm.constraints.find((x: any) => x.type === "checkout.line_items").items[0].acceptable_items.map((i: any) => i.id), ["STAND-1", "CHARGER-65W"]);
  assert.equal(opm.constraints.find((x: any) => x.type === "payment.amount_range").max, 5000);
  assert.equal(opm.constraints.find((x: any) => x.type === "payment.reference").conditional_transaction_id, ap2Hash(canonical(ocm)));
  assert.equal(cm.checkout_hash, ap2Hash(cm.checkout_jwt));
  assert.equal(pm.transaction_id, cm.checkout_hash);
  assert.deepEqual(pm.payment_amount, { amount: 4200, currency: "USD" });
  assert.equal(a.receipts.payment_receipt.psp_confirmation_id, "C-A-ORDERAP2001");
  assert.equal(a.receipts.payment_receipt.reference, ap2Hash(canonical(pm)));
  for (const x of [ocm, opm, cm, pm]) assert.equal(x.agentguard_mandate_hash, env.receipt.mandate.hash);
  assert.ok(!JSON.stringify(a).includes("VAULT-1"), "vault token never exposed");
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem(), expectedOrigins: ["http://localhost:8787"] });
  assert.deepEqual(failed(v), []);
  assert.ok(v.checks.filter((c: any) => c.check.startsWith("ap2.")).length >= 10);
});

test("AP2 tamper: edits to any AP2 view fail, even when the issuer re-signs (derivation + linkage)", async () => {
  const { env } = await captured();
  const edits: [string, (a: any) => void, string][] = [
    ["amount", a => { a.payment_mandate.payment_amount.amount = 1; }, "ap2.payment_amount"],
    ["transaction_id", a => { a.payment_mandate.transaction_id = "x"; }, "ap2.payment_transaction_id"],
    ["checkout_jwt", a => { a.cart_mandate.checkout_mandate.checkout_jwt = a.cart_mandate.checkout_mandate.checkout_jwt.replace(/\.[^.]+\./, "." + Buffer.from("{}").toString("base64url") + "."); }, "ap2.checkout_hash"],
    ["budget", a => { a.intent_mandate.open_payment_mandate.constraints.find((x: any) => x.type === "payment.amount_range").max = 1; }, "ap2.amount_range"],
    ["open ref", a => { a.intent_mandate.open_checkout_mandate.purpose = "anything"; }, "ap2.open_payment_reference"],
    ["capture", a => { a.receipts.payment_receipt.psp_confirmation_id = "OTHER"; }, "ap2.payment_receipt"],
    ["user binding", a => { a.payment_mandate.agentguard_mandate_hash = "0".repeat(64); }, "ap2.user_binding"],
  ];
  const evil = Signer.ephemeral();
  for (const [name, edit, expectFail] of edits) {
    const t = structuredClone(env); edit(t.receipt.ap2);
    const unsigned = await verifyReceipt(t);
    assert.ok(failed(unsigned).includes("issuer.signature"), name);
    const v = await verifyReceipt(resign(t, evil));       // attacker-controlled issuer: signature ok, AP2 still fails
    assert.ok(failed(v).includes("ap2.derivation"), `${name}: derivation`);
    assert.ok(failed(v).includes(expectFail), `${name}: ${expectFail} (${failed(v)})`);
  }
});

test("AP2 views are a pure function of the receipt; native edits propagate into a mismatch", async () => {
  const { env } = await captured();
  const { ap2, ...core } = env.receipt;
  assert.equal(canonical(buildAp2(core)), canonical(ap2));
  const t = structuredClone(env.receipt); t.payment.capture_id = "C-OTHER";
  assert.ok(verifyAp2(t).some(c => !c.pass && c.check === "ap2.derivation"));
  assert.ok(verifyAp2(t).some(c => !c.pass && c.check === "ap2.payment_receipt"));
  // Legacy receipts (no ap2 block) still verify, with a warning.
  const legacy = structuredClone(env); delete legacy.receipt.ap2;
  const s = Signer.ephemeral(); const v = await verifyReceipt(resign(legacy, s), { issuerPublicKeyPem: s.publicKeyPem(), expectedOrigins: ["http://localhost:8787"] });
  assert.ok(!failed(v).some((c: string) => c.startsWith("ap2.")) && v.warnings.some(w => /no AP2/.test(w)));
});
