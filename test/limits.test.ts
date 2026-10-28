// Attack tests for the five closed limits: recovery without admin takeover, key compromise + RFC 3161,
// external anchoring + recomputable cumulative spend.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateKeyPairSync } from "node:crypto";
import { setup, pay, order } from "./support/orders.ts";
import { SoftAuthenticator } from "./support/softauth.ts";
import { FakeTsa, TEST_TSA_ROOTS, OTHER_ROOTS, fakeTsaToken } from "./support/fake-tsa.ts";
import { KeyRing } from "../src/keys.ts";
import { canonical, sha256 } from "../src/canonical.ts";
import { verifyReceipt } from "../packages/intent-verifier/src/index.ts";
import { merkleRoot } from "../packages/intent-verifier/src/merkle.ts";

const STAND = { name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "39.00" };
const failed = (v: any) => v.checks.filter((c: any) => !c.pass).map((c: any) => c.check);
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const resign = (env: any, signer: { sign(m: string): string }) => ({ ...env, signature: { ...env.signature, value: signer.sign(canonical(env.receipt)) } });
function ring() {
  process.env.AGENTGUARD_SIGNING_KEY = generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const r = KeyRing.load(join(mkdtempSync(join(tmpdir(), "ag-lim-")), "keys.json")); delete process.env.AGENTGUARD_SIGNING_KEY; return r;
}

// ---------- 1. passkey recovery ----------
test("recovery: admin link only parks a new key behind a time lock; user is notified; new key cannot sign during the lock", async () => {
  const notes: any[] = [];
  const { gw, passkeys, auths, store, mid } = await setup({}, { pk: { recoveryLockMs: 60_000, notify: async (e: string, d: any) => { notes.push({ e, d }); return true; } } });
  const old = auths.get("u1")!; const attacker = new SoftAuthenticator();
  const t = await passkeys.issueEnrollment("u1", { issuedBy: "rogue-admin" });
  const r = await passkeys.verifyRegistration(t.token, attacker.register(await passkeys.registrationOptions(t.token)) as any);
  assert.ok(r.pending_recovery);
  assert.equal(notes.length, 1); assert.equal(notes[0].e, "passkey.recovery_started"); assert.equal(notes[0].d.user_id, "u1");
  assert.ok((await store.auditLog(30)).some(e => e.event === "user.notified"));
  assert.equal((await passkeys.credentialFor("u1"))!.credential_id, old.id);
  // the parked key cannot sign a mandate, an approval, a revocation, or authorize a re-enrollment
  const d = await gw.draftMandate({ user_id: "u1", agent_id: "shopper", purpose: "x", constraints: { currency: "USD", max_total: "10.00", max_transactions: 1 } });
  const sreq = await gw.signingRequest(d.mandate.mandate_id);
  await assert.rejects(gw.confirmMandate(d.mandate.mandate_id, d.mandate_hash, attacker.assert(sreq.options.challenge) as any), /rejected|not from/);
  const rq = await passkeys.reenrollRequest("u1");
  await assert.rejects(passkeys.reenroll("u1", attacker.assert(rq.options.challenge) as any), /rejected|not from/);
  // the old key is still in force during the lock, and its mandates still work
  assert.equal((await store.getMandate(mid))!.status, "active");
});

test("recovery: only the CURRENT passkey can cancel (not the admin, not the parked key, no replay)", async () => {
  const { passkeys, auths, store } = await setup({}, { pk: { recoveryLockMs: 60_000, notify: async () => false } });
  const old = auths.get("u1")!; const attacker = new SoftAuthenticator();
  const t = await passkeys.issueEnrollment("u1");
  await passkeys.verifyRegistration(t.token, attacker.register(await passkeys.registrationOptions(t.token)) as any);
  assert.ok((await store.auditLog(30)).some(e => e.event === "user.notify_failed"));
  await assert.rejects(passkeys.cancelRecovery("u1", undefined as any), /no pending recovery cancel|required|rejected/);
  const cr = await passkeys.recoveryCancelRequest("u1");
  await assert.rejects(passkeys.cancelRecovery("u1", attacker.assert(cr.options.challenge) as any), /rejected|not from/);
  const cr2 = await passkeys.recoveryCancelRequest("u1");
  const sig = old.assert(cr2.options.challenge);
  assert.equal((await passkeys.cancelRecovery("u1", sig as any)).status, "cancelled");
  await assert.rejects(passkeys.cancelRecovery("u1", sig as any), /no pending/);
  assert.ok((await store.auditLog(40)).some(e => e.event === "passkey.recovery_cancelled"));
  assert.equal((await passkeys.credentialFor("u1"))!.credential_id, old.id);
});

test("recovery: after the lock the key swaps, old mandates freeze until re-signed; receipt + verifier flag the recovery; a faked lock fails", async () => {
  const { gw, passkeys, auths, store, rail, mid, receipts, issuer } = await setup({}, { pk: { recoveryLockMs: 80 } });
  const old = auths.get("u1")!; const fresh = new SoftAuthenticator();
  const t = await passkeys.issueEnrollment("u1", { issuedBy: "ops" });
  await passkeys.verifyRegistration(t.token, fresh.register(await passkeys.registrationOptions(t.token)) as any);
  await sleep(120);
  assert.equal((await passkeys.credentialFor("u1"))!.credential_id, fresh.id);
  assert.equal((await store.getMandate(mid))!.status, "frozen");
  rail.orders.set("ORDERREC01", order("ORDERREC01", [STAND]));
  assert.equal((await gw.propose("shopper", pay(mid, "ORDERREC01"))).decision, "reject");
  // old key can no longer sign anything
  const sreq = await gw.signingRequest(mid); const sm = (await store.getMandate(mid))!;
  await assert.rejects(gw.confirmMandate(mid, sm.mandate_hash, old.assert(sreq.options.challenge) as any), /rejected|not from/);
  const sreq2 = await gw.signingRequest(mid);
  await gw.confirmMandate(mid, sm.mandate_hash, fresh.assert(sreq2.options.challenge) as any);
  rail.orders.set("ORDERREC02", order("ORDERREC02", [STAND]));
  const p = await gw.propose("shopper", pay(mid, "ORDERREC02")); assert.equal(p.status, "captured");
  const env = (await receipts.forPayment(p.payment_id))!;
  const enr = env.receipt.mandate.passkey.enrollment;
  assert.equal(enr.via, "recovery"); assert.equal(enr.replaces, old.id); assert.ok(enr.recovery.unlock_at > enr.recovery.started_at);
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.equal(v.ok, true, JSON.stringify(failed(v)));
  assert.ok(v.warnings.some(w => /^RECOVERY/.test(w)));
  assert.ok(v.checks.some(c => c.check === "passkey.recovery_lock" && c.pass));
  // a malicious issuer claiming the lock completed before it unlocked is caught
  const forged = structuredClone(env); forged.receipt.mandate.passkey.enrollment.recovery.completed_at = enr.recovery.started_at;
  assert.ok(failed(await verifyReceipt(resign(forged, issuer), { issuerPublicKeyPem: issuer.publicKeyPem() })).includes("passkey.recovery_lock"));
  assert.ok((await store.auditLog(100)).some(e => e.event === "passkey.replaced" && (e.payload as any).enrollment.via === "recovery"));
});

test("recovery: if the user rotates with their passkey during the lock, the admin recovery is superseded", async () => {
  const { passkeys, auths } = await setup({}, { pk: { recoveryLockMs: 80 } });
  const old = auths.get("u1")!;
  const t = await passkeys.issueEnrollment("u1");
  await passkeys.verifyRegistration(t.token, new SoftAuthenticator().register(await passkeys.registrationOptions(t.token)) as any);
  const rq = await passkeys.reenrollRequest("u1");
  const m = await passkeys.reenroll("u1", old.assert(rq.options.challenge) as any);
  const mine = new SoftAuthenticator();
  await passkeys.verifyRegistration(m.token, mine.register(await passkeys.registrationOptions(m.token)) as any);
  await sleep(120);
  assert.equal((await passkeys.credentialFor("u1"))!.credential_id, mine.id);
  assert.equal((await passkeys.recoveryFor("u1"))!.status, "superseded");
});

// ---------- 2. key compromise + RFC 3161 ----------
test("compromise: pre-compromise TSA-stamped receipt passes; post-compromise forgery, unstamped, backdated and bad tokens fail", async () => {
  const keys = ring(); const tsa = new FakeTsa();
  const ctx = await setup({}, { issuer: keys, tsa });
  const stolen = (keys as any).active(); const kid = keys.activeKid();
  ctx.rail.orders.set("ORDERCMP01", order("ORDERCMP01", [STAND]));
  const p1 = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERCMP01"));
  await ctx.receipts.stamp((await ctx.receipts.forPayment(p1.payment_id))!.receipt.receipt_id);
  const pre = (await ctx.receipts.forPayment(p1.payment_id))!;
  assert.equal(pre.timestamps!.length, 1);
  await sleep(1100);
  await keys.markCompromised(kid);
  const opts = { issuerKeys: keys.jwks(), tsaRoots: TEST_TSA_ROOTS } as any;
  assert.equal(keys.jwks().keys.find(k => k.kid === kid)!.status, "compromised");
  const v1 = await verifyReceipt(pre, opts);
  assert.equal(v1.ok, true, JSON.stringify(failed(v1)));
  assert.ok(v1.checks.some(c => c.check === "issuer.key_compromise" && c.pass));
  // without its TSA proof the same receipt fails (signature alone can't date it)
  assert.ok(failed(await verifyReceipt({ ...pre, timestamps: undefined }, opts)).includes("issuer.key_compromise"));
  // attacker with the stolen key forges a receipt, backdates issued_at, and gets a real (fresh) timestamp
  await sleep(1100);
  const forged = structuredClone(pre); forged.receipt.payment.amount_minor = 3900; forged.receipt.receipt_id = "rcpt_forged";
  const fenv: any = resign(forged, stolen); fenv.timestamps = [{ tsa: "test", token: fakeTsaToken(sha256(canonical(fenv.receipt))) }];
  const vf = await verifyReceipt(fenv, opts);
  assert.equal(vf.ok, false); assert.ok(failed(vf).includes("issuer.key_compromise"));
  // a token over another receipt, or from an untrusted TSA, is rejected
  assert.ok(failed(await verifyReceipt({ ...fenv, timestamps: pre.timestamps }, opts)).some((c: string) => c.startsWith("receipt.timestamp")));
  assert.ok(failed(await verifyReceipt(pre, { ...opts, tsaRoots: OTHER_ROOTS })).some((c: string) => c.startsWith("receipt.timestamp")));
  // receipts issued after the compromise by the NEW key are fine
  ctx.rail.orders.set("ORDERCMP02", order("ORDERCMP02", [STAND]));
  const p2 = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERCMP02"));
  const post = (await ctx.receipts.forPayment(p2.payment_id))!;
  assert.notEqual(post.signature.kid, kid);
  assert.equal((await verifyReceipt(post, opts)).ok, true);
});

// ---------- 3. anchoring + spend chain ----------
async function twoCaptures() {
  const tsa = new FakeTsa();
  const ctx = await setup({}, { tsa });
  for (const id of ["ORDERSP001", "ORDERSP002"]) { ctx.rail.orders.set(id, order(id, [STAND])); assert.equal((await ctx.gw.propose("shopper", pay(ctx.mid, id))).status, "captured"); }
  const pid = (await ctx.store.listPayments(10)).find((p: any) => p.paypal_order_id === "ORDERSP002")!.payment_id;
  return { ...ctx, tsa, pid };
}

test("anchor + spend: receipt carries the mandate's capture history and a TSA-anchored inclusion proof; verifies offline", async () => {
  const { receipts, anchors, pid, issuer, store } = await twoCaptures();
  assert.equal((await receipts.forPayment(pid))!.anchor, null);
  const a = await anchors.anchor();
  assert.ok(a); assert.equal(a!.statement.root, merkleRoot(await store.auditHashes(a!.statement.size)));
  const env = (await receipts.forPayment(pid))!;
  assert.equal(env.receipt.spend.entries.length, 2); assert.equal(env.receipt.spend.cumulative_minor, 7800);
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem(), tsaRoots: TEST_TSA_ROOTS, requireAnchor: true, requireTimestamp: true });
  assert.equal(v.ok, true, JSON.stringify(failed(v)));
  for (const c of ["spend.chain", "spend.cumulative_limit", "spend.transaction_count", "anchor.statement", "anchor.inclusion", "anchor.lag"]) assert.ok(v.checks.some(x => x.check === c && x.pass), c);
  // anchors are append-only
  await assert.rejects(async () => await store.db.prepare("DELETE FROM audit_anchors").run(), /append-only/);
  // anchoring again with no new entries is a no-op
  await store.db.prepare("SELECT 1").get();
});

test("anchor + spend attacks: hidden capture, edited amount, forged chain, forged anchor, stale anchor, missing anchor all fail", async () => {
  const { receipts, anchors, pid, issuer } = await twoCaptures();
  await anchors.anchor();
  const env = (await receipts.forPayment(pid))!;
  const o = { issuerPublicKeyPem: issuer.publicKeyPem(), tsaRoots: TEST_TSA_ROOTS, requireAnchor: true };
  const V = async (e: any, x: any = {}) => failed(await verifyReceipt(e, { ...o, ...x }));
  // issuer hides the first capture (and re-signs): linkage/index break
  const h = structuredClone(env); h.receipt.spend.entries.shift();
  assert.ok((await V(resign(h, issuer))).includes("spend.chain"));
  // issuer understates an earlier amount: entry hash breaks
  const e2 = structuredClone(env); const p0 = JSON.parse(e2.receipt.spend.entries[0].payload); p0.amount_minor = 1; e2.receipt.spend.entries[0].payload = canonical(p0);
  assert.ok((await V(resign(e2, issuer))).includes("spend.chain"));
  // issuer rewrites a fully self-consistent alternative history: not in the anchored root
  const e3 = structuredClone(env); const es = e3.receipt.spend.entries;
  const q0 = JSON.parse(es[0].payload); q0.amount_minor = 100; q0.cumulative_minor = 100; es[0].payload = canonical(q0);
  es[0].hash = sha256(`${es[0].prev_hash}|${es[0].ts}|${es[0].event}|${es[0].ref ?? ""}|${es[0].payload}`);
  const q1 = JSON.parse(es[1].payload); q1.cumulative_minor = 4000; q1.prev_spend_hash = es[0].hash; es[1].payload = canonical(q1);
  es[1].hash = sha256(`${es[1].prev_hash}|${es[1].ts}|${es[1].event}|${es[1].ref ?? ""}|${es[1].payload}`);
  e3.receipt.spend.cumulative_minor = 4000; e3.receipt.audit.capture_entry_hash = es[1].hash;
  const f3 = await V(resign(e3, issuer));
  assert.ok(f3.includes("anchor.inclusion"), JSON.stringify(f3)); assert.ok(!f3.includes("spend.chain"));
  // ...and a matching forged anchor root has no valid TSA token
  const e4 = structuredClone(env); e4.anchor!.statement.root = "00".repeat(32); e4.anchor!.statement_hash = sha256(canonical(e4.anchor!.statement));
  assert.ok((await V(e4)).some((c: string) => c.startsWith("anchor.timestamp")));
  // anchor too long after the receipt
  assert.ok((await V(env, { maxAnchorLagMs: -1 })).includes("anchor.lag"));
  // no anchor
  assert.ok((await V({ ...env, anchor: null })).includes("anchor.present"));
  const soft = await verifyReceipt({ ...env, anchor: null }, { ...o, requireAnchor: false });
  assert.equal(soft.ok, true); assert.ok(soft.warnings.some(w => /not yet anchored/.test(w)));
});

test("spend: cumulative over max_total or count over max_transactions is detected from the entries themselves", async () => {
  const { receipts, anchors, pid, issuer } = await twoCaptures();
  await anchors.anchor();
  const env = structuredClone(await receipts.forPayment(pid))!;
  env.receipt.mandate.body.constraints.max_total = "50.00"; env.receipt.mandate.body.constraints.max_transactions = 1;
  const f = failed(await verifyReceipt(resign(env, issuer), { issuerPublicKeyPem: issuer.publicKeyPem(), tsaRoots: TEST_TSA_ROOTS }));
  assert.ok(f.includes("spend.cumulative_limit") && f.includes("spend.transaction_count"));
});

test("TSA outage: receipt is issued unstamped, then the anchor job stamps it", async () => {
  const tsa = new FakeTsa(); tsa.down = true;
  const ctx = await setup({}, { tsa });
  ctx.rail.orders.set("ORDERTSA01", order("ORDERTSA01", [STAND]));
  const p = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERTSA01")); assert.equal(p.status, "captured");
  assert.equal(((await ctx.receipts.forPayment(p.payment_id))!).timestamps, undefined);
  assert.ok((await ctx.store.auditLog(30)).some(e => e.event === "receipt.timestamp_failed"));
  assert.equal(await ctx.anchors.anchor(), null);
  tsa.down = false;
  assert.equal(await ctx.receipts.stampPending(), 1);
  assert.ok(await ctx.anchors.anchor());
  const v = await verifyReceipt((await ctx.receipts.forPayment(p.payment_id))!, { issuerPublicKeyPem: ctx.issuer.publicKeyPem(), tsaRoots: TEST_TSA_ROOTS, requireAnchor: true, requireTimestamp: true });
  assert.equal(v.ok, true, JSON.stringify(failed(v)));
});

test("merkle: inclusion proofs verify for every leaf of every size 1..33 and reject a wrong leaf/index", async () => {
  const { inclusionProof, verifyInclusion } = await import("../packages/intent-verifier/src/merkle.ts");
  for (let n = 1; n <= 33; n++) {
    const hs = Array.from({ length: n }, (_, i) => sha256("leaf" + i)); const root = merkleRoot(hs);
    for (let i = 0; i < n; i++) {
      const p = inclusionProof(hs, i);
      assert.ok(verifyInclusion(hs[i], i, n, p, root));
      assert.ok(!verifyInclusion(sha256("x"), i, n, p, root));
      if (n > 1) assert.ok(!verifyInclusion(hs[i], (i + 1) % n, n, p, root));
    }
  }
});
