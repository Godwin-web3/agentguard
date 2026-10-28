import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isoCBOR } from "@simplewebauthn/server/helpers";
import { setup, pay, order } from "./support/orders.ts";
import { SoftAuthenticator } from "./support/softauth.ts";
import { Signer } from "../src/keys.ts";
import { canonical, sha256 } from "../src/canonical.ts";
import { receiptReference, RECEIPT_SCHEMA } from "../src/receipt.ts";
import { verifyReceipt, buildDisputeEvidence, submitDisputeEvidence } from "../packages/intent-verifier/src/index.ts";

const STAND = { name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "39.00" };
const failed = (v: any) => v.checks.filter((c: any) => !c.pass).map((c: any) => c.check);
const resign = (env: any, s: Signer) => ({ receipt: env.receipt, signature: { ...env.signature, public_key_pem: s.publicKeyPem(), value: s.sign(canonical(env.receipt)) } });

async function captured(extra: any = {}) {
  const ctx = await setup(extra.constraints);
  ctx.rail.orders.set("ORDERPOI001", order("ORDERPOI001", [STAND], { tax: 300 }));
  const r = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERPOI001"));
  return { ...ctx, r };
}

test("captured merchant-order payment gets a signed receipt that verifies offline with a pinned key", async () => {
  const { r, receipts, issuer, rail, store } = await captured();
  assert.equal(r.status, "captured");
  const env = receipts.forPayment(r.payment_id)!;
  assert.equal(env.receipt.schema, RECEIPT_SCHEMA);
  assert.equal(env.receipt.payment.capture_id, "C-A-ORDERPOI001");
  assert.equal(env.receipt.order.snapshot.id, "ORDERPOI001");
  assert.equal(env.receipt.mandate.user_signature.credential_id, env.receipt.mandate.passkey.credential_id);
  assert.match(env.receipt.audit.capture_entry_hash, /^[0-9a-f]{64}$/);
  // Receipt reference stamped on PayPal's capture.
  assert.deepEqual(rail.captureOpts.at(-1).invoice_id, receiptReference(env.receipt.receipt_id));
  assert.equal(env.receipt.payment.paypal_invoice_id, receiptReference(env.receipt.receipt_id));
  assert.deepEqual(receipts.get(env.receipt.receipt_id), env);
  assert.ok(issuer.verify(canonical(env.receipt), env.signature.value));
  assert.equal(store.verifyAuditChain().ok, true);
  assert.ok(store.db.prepare("SELECT 1 FROM audit WHERE event='receipt.issued' AND ref=?").get(r.payment_id));

  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem(), expectedOrigins: ["http://localhost:8787"], expectedPayee: ["M32J3M4A7KASQ"] });
  assert.deepEqual(failed(v), []); assert.equal(v.ok, true); assert.equal(v.trusted_issuer, true);
  assert.equal(v.summary!.amount, "42.00");
  // Unpinned: still valid, but not trusted and says so.
  const u = await verifyReceipt(env);
  assert.equal(u.ok, true); assert.equal(u.trusted_issuer, false); assert.ok(u.warnings.some(w => /not pinned/.test(w)));
});

test("tampered receipt fails: any edit breaks the issuer signature; re-signing with another key fails under the pinned key", async () => {
  const { r, receipts, issuer } = await captured();
  const env = receipts.forPayment(r.payment_id)!;
  for (const edit of [
    (x: any) => { x.receipt.order.snapshot.purchase_units[0].amount.value = "4.20"; },
    (x: any) => { x.receipt.payment.capture_id = "OTHER"; },
    (x: any) => { x.receipt.mandate.body.constraints.max_total = "9999.00"; },
    (x: any) => { x.receipt.decision.decision = "approve"; x.receipt.decision.checks[0].detail = "x"; },
  ]) {
    const t = structuredClone(env); edit(t);
    const v = await verifyReceipt(t, { issuerPublicKeyPem: issuer.publicKeyPem() });
    assert.equal(v.ok, false); assert.ok(failed(v).includes("issuer.signature"));
  }
  const evil = Signer.ephemeral();
  const v = await verifyReceipt(resign(structuredClone(env), evil), { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.equal(v.ok, false); assert.ok(failed(v).includes("issuer.signature"));
});

test("swapped order fails even if the issuer itself re-signs it", async () => {
  const { r, receipts, issuer } = await captured();
  const env = structuredClone(receipts.forPayment(r.payment_id)!);
  // Same id, different contents (a different SKU and price than what was evaluated).
  env.receipt.order.snapshot = order("ORDERPOI001", [{ name: "Gift card", sku: "GIFT-500", category: "DIGITAL_GOODS", quantity: 1, unit: "39.00" }], { tax: 300 });
  let v = await verifyReceipt(resign(env, issuer), { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.equal(v.ok, false);
  for (const c of ["order.digest", "mandate.sku_allowlist", "mandate.category"]) assert.ok(failed(v).includes(c), c);
  // A different order id entirely: the decision's proposal hash no longer binds.
  const env2 = structuredClone(receipts.forPayment(r.payment_id)!);
  env2.receipt.order.snapshot = order("ORDERPOI002", [STAND], { tax: 300 }); env2.receipt.order.paypal_order_id = "ORDERPOI002";
  v = await verifyReceipt(resign(env2, issuer), { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.ok(failed(v).includes("decision.proposal_hash")); assert.ok(failed(v).includes("order.digest"));
  // Merchant pins its own payee: an order paying someone else is rejected.
  const env3 = structuredClone(receipts.forPayment(r.payment_id)!);
  v = await verifyReceipt(env3, { issuerPublicKeyPem: issuer.publicKeyPem(), expectedPayee: ["SOMEONE-ELSE"] });
  assert.ok(failed(v).includes("order.expected_payee"));
});

test("forged mandate fails: edited limits, a recomputed hash, or another passkey", async () => {
  const { r, receipts, issuer } = await captured();
  const base = receipts.forPayment(r.payment_id)!;
  // 1. Edit the mandate body: hash mismatch.
  let e = structuredClone(base); e.receipt.mandate.body.constraints.max_total = "5000.00";
  let v = await verifyReceipt(resign(e, issuer), { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.ok(failed(v).includes("mandate.hash"));
  // 2. Edit and recompute the hash: the user's passkey never signed that hash.
  e = structuredClone(base); e.receipt.mandate.body.purpose = "Buy anything"; e.receipt.mandate.hash = sha256(canonical(e.receipt.mandate.body));
  v = await verifyReceipt(resign(e, issuer), { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.ok(failed(v).includes("passkey.client_data")); assert.equal(v.ok, false);
  // 3. Attacker signs the forged mandate with their own passkey and swaps in its public key: issuer signature breaks.
  const atk = new SoftAuthenticator("localhost", "http://localhost:8787");
  const jwk = atk.priv.export({ format: "jwk" }) as any;
  const cose = Buffer.from(isoCBOR.encode(new Map<number, any>([[1, 2], [3, -7], [-1, 1], [-2, Buffer.from(jwk.x, "base64url")], [-3, Buffer.from(jwk.y, "base64url")]]))).toString("base64url");
  const a = atk.assert(Buffer.from(e.receipt.mandate.hash, "hex").toString("base64url"));
  e.receipt.mandate.user_signature = { credential_id: atk.id, authenticator_data: a.response.authenticatorData, client_data_json: a.response.clientDataJSON, signature: a.response.signature };
  e.receipt.mandate.passkey = { credential_id: atk.id, public_key_cose: cose };
  v = await verifyReceipt(e, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.ok(failed(v).includes("issuer.signature"));
  assert.ok(!failed(v).includes("passkey.signature"), "the attacker's own assertion is internally valid; only the issuer binding stops it");
  // 4. Wrong origin (phishing site) is rejected when the merchant pins the origin.
  v = await verifyReceipt(base, { issuerPublicKeyPem: issuer.publicKeyPem(), expectedOrigins: ["https://agentguard.example"] });
  assert.ok(failed(v).includes("passkey.origin"));
});

test("approval-held payment: receipt records the human approval; denied payments get no receipt", async () => {
  const { gw, rail, mid, receipts, issuer } = await setup({ require_human_approval_over: "20.00" });
  rail.orders.set("ORDERPOI009", order("ORDERPOI009", [STAND]));
  const r = await gw.propose("shopper", pay(mid, "ORDERPOI009"));
  assert.equal(r.status, "needs_human"); assert.equal(receipts.forPayment(r.payment_id), null);
  await gw.resolveApproval(r.approval_id!, true, "owner");
  const env = receipts.forPayment(r.payment_id)!;
  assert.equal(env.receipt.approval.resolution, "approved"); assert.equal(env.receipt.approval.approver, "owner");
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.equal(v.ok, true, JSON.stringify(failed(v))); assert.ok(v.warnings.some(w => /admin_token/.test(w)));

  rail.orders.set("ORDERPOIBAD", order("ORDERPOIBAD", [{ ...STAND, sku: "NOPE" }]));
  const d = await gw.propose("shopper", pay(mid, "ORDERPOIBAD"));
  assert.equal(d.decision, "reject"); assert.equal(receipts.forPayment(d.payment_id), null);
});

test("PayPal re-check with merchant keys: confirms capture and reference; flags a changed order", async () => {
  const { r, receipts, issuer } = await captured();
  const env = receipts.forPayment(r.payment_id)!;
  const live = structuredClone(env.receipt.order.snapshot); live.status = "COMPLETED";
  live.purchase_units[0].payments = { captures: [{ id: env.receipt.payment.capture_id, status: "COMPLETED", amount: { currency_code: "USD", value: "42.00" }, invoice_id: env.receipt.payment.paypal_invoice_id }] };
  const fake = (o: any) => (async (url: string) => url.endsWith("/token") ? new Response(JSON.stringify({ access_token: "t" })) : new Response(JSON.stringify(o))) as any;
  let v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem(), paypal: { clientId: "x", clientSecret: "y", fetch: fake(live) } });
  assert.deepEqual(failed(v), []);
  assert.ok(v.checks.some(c => c.check === "paypal.receipt_reference" && c.pass));
  const changed = structuredClone(live); changed.purchase_units[0].items[0].sku = "OTHER";
  v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem(), paypal: { clientId: "x", clientSecret: "y", fetch: fake(changed) } });
  assert.ok(failed(v).includes("paypal.order_matches_snapshot"));
});

test("dispute evidence: provide-evidence input + PDF, submitted as multipart with input and file1", async () => {
  const { r, receipts, issuer } = await captured();
  const env = receipts.forPayment(r.payment_id)!;
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem() });
  const ev = buildDisputeEvidence(env, v);
  assert.equal(ev.input.evidences[0].evidence_type, "PROOF_OF_RECEIPT_COPY");
  assert.ok(ev.input.evidences[0].notes.length <= 2000);
  assert.match(ev.input.evidences[0].documents[0].name, /^[A-Za-z0-9-_,\s]+[.]{1}[A-Za-z]+$/);
  assert.equal(ev.files[0].data.subarray(0, 5).toString(), "%PDF-");
  assert.ok(ev.files[0].data.toString("latin1").includes(env.receipt.payment.capture_id));
  let seen: any;
  const fake = (async (url: string, init: any) => {
    if (url.endsWith("/token")) return new Response(JSON.stringify({ access_token: "t" }));
    seen = { url, form: init.body as FormData }; return new Response(JSON.stringify({ links: [] }), { status: 200 });
  }) as any;
  const res = await submitDisputeEvidence("PP-D-1", ev, { clientId: "x", clientSecret: "y", apiBase: "https://api-m.sandbox.paypal.com", fetch: fake });
  assert.equal(res.status, 200);
  assert.equal(seen.url, "https://api-m.sandbox.paypal.com/v1/customer/disputes/PP-D-1/provide-evidence");
  assert.deepEqual(JSON.parse(await (seen.form.get("input") as Blob).text()), ev.input);
  assert.equal((seen.form.get("file1") as File).name, ev.files[0].name);
});

test("intent-verify CLI: exit 0 on a valid receipt, 1 on a tampered one", async () => {
  const { r, receipts, issuer } = await captured();
  const env = receipts.forPayment(r.payment_id)!;
  const dir = mkdtempSync(join(tmpdir(), "poi-"));
  writeFileSync(join(dir, "r.json"), JSON.stringify(env)); writeFileSync(join(dir, "k.pem"), issuer.publicKeyPem());
  const t = structuredClone(env); t.receipt.payment.amount_minor = 1; writeFileSync(join(dir, "t.json"), JSON.stringify(t));
  const cli = (f: string, ...a: string[]) => spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "packages/intent-verifier/src/cli.ts", ...a, join(dir, f), "--issuer-key", join(dir, "k.pem")], { encoding: "utf8" });
  const ok = cli("r.json"); assert.equal(ok.status, 0, ok.stdout + ok.stderr); assert.match(ok.stdout, /^VALID/);
  const bad = cli("t.json"); assert.equal(bad.status, 1); assert.match(bad.stdout, /^INVALID/);
  const ev = cli("r.json", "evidence", "--out", join(dir, "ev")); assert.equal(ev.status, 0, ev.stderr);
  assert.equal(readFileSync(join(dir, "ev", "provide-evidence.input.json"), "utf8").includes("PROOF_OF_RECEIPT_COPY"), true);
  void execFileSync;
});
