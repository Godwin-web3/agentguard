import { testSql } from "./support/db.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setup, pay, order, approver } from "./support/orders.ts";
import { SoftAuthenticator } from "./support/softauth.ts";
import { RP } from "./support/passkey.ts";
import { Store } from "../src/store.ts";
import { PasskeyService, tokenHash } from "../src/passkeys.ts";
import { KeyRing, Signer } from "../src/keys.ts";
import { canonical } from "../src/canonical.ts";
import { verifyReceipt } from "../packages/intent-verifier/src/index.ts";

const STAND = { name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "39.00" };
const failed = (v: any) => v.checks.filter((c: any) => !c.pass).map((c: any) => c.check);
async function held(o: any = {}) {
  const ctx = await setup({ require_human_approval_over: "20.00" }, o);
  ctx.rail.orders.set("ORDHELD1", order("ORDHELD1", [STAND]));
  const r = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDHELD1"));
  assert.equal(r.status, "needs_human");
  return { ...ctx, r };
}

// ---------- 1. passkey-signed human approvals ----------
test("approval: admin token alone (no assertion) cannot approve or deny", async () => {
  const { gw, r, rail } = await held();
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, undefined, "owner"), /passkey assertion .* required/);
  await assert.rejects(gw.resolveApproval(r.approval_id!, false, undefined, "owner"), /passkey assertion .* required/);
  // A request alone (what an admin can do) still needs the user's signature.
  await gw.approvalRequest(r.approval_id!, true);
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, undefined, "owner"), /passkey assertion .* required/);
  assert.ok(!rail.calls.some(c => c.startsWith("authorizeOrder")));
});

test("approval: replayed assertion, other approval's assertion, flipped decision, wrong passkey, expired request all rejected", async () => {
  const { gw, r, rail, auths, store } = await held();
  const a = auths.get("u1")!;
  // Signature for "deny" cannot be used to approve.
  const denyReq = await gw.approvalRequest(r.approval_id!, false);
  const denySig = a.assert(denyReq.options.challenge);
  const appReq = await gw.approvalRequest(r.approval_id!, true);
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, denySig as any), /signature rejected/);
  // An assertion over a stale nonce (superseded request) is rejected.
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, a.assert(denyReq.options.challenge) as any), /signature rejected/);
  // Someone else's authenticator.
  const evil = new SoftAuthenticator(RP.rpID, RP.origin); (evil as any).credId = (a as any).credId;
  const req2 = await gw.approvalRequest(r.approval_id!, true);
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, evil.assert(req2.options.challenge) as any), /rejected/);
  // Expired signing request.
  const req3 = await gw.approvalRequest(r.approval_id!, true);
  await store.db.prepare("UPDATE approvals SET nonce_expires_at=? WHERE approval_id=?").run(new Date(Date.now() - 1000).toISOString(), r.approval_id);
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, a.assert(req3.options.challenge) as any), /expired/);
  // Valid approval; then replaying the very same assertion fails.
  const ok = await gw.approvalRequest(r.approval_id!, true);
  const sig = a.assert(ok.options.challenge);
  assert.equal((await gw.resolveApproval(r.approval_id!, true, sig as any)).status, "captured");
  await assert.rejects(gw.resolveApproval(r.approval_id!, true, sig as any), /already resolved/);
  assert.equal(appReq.statement.amount_minor, 3900); assert.equal(ok.statement.paypal_order_id, "ORDHELD1");
  assert.equal(rail.calls.filter(c => c.startsWith("capture")).length, 1);
});

test("approval: an assertion for one held payment cannot approve another", async () => {
  const { gw, r, rail, mid, auths } = await held();
  rail.orders.set("ORDHELD2", order("ORDHELD2", [STAND]));
  const r2 = await gw.propose("shopper", pay(mid, "ORDHELD2"));
  const q1 = await gw.approvalRequest(r.approval_id!, true); await gw.approvalRequest(r2.approval_id!, true);
  await assert.rejects(gw.resolveApproval(r2.approval_id!, true, auths.get("u1")!.assert(q1.options.challenge) as any), /signature rejected/);
});

test("approval: passkey-signed deny is recorded; receipt of an approved payment carries a verifiable passkey approval", async () => {
  const { gw, r, auths, receipts, issuer, rail, mid, store } = await held();
  await approver(gw, auths, r.approval_id!, true, "owner");
  const env = (await receipts.forPayment(r.payment_id))!;
  assert.equal(env.receipt.approval.method, "passkey");
  assert.equal(env.receipt.approval.statement.decision, "approve");
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.equal(v.ok, true, JSON.stringify(failed(v)));
  for (const c of ["approval.credential", "approval.passkey.signature", "approval.statement", "approval.time"]) assert.ok(v.checks.some(x => x.check === c && x.pass), c);
  // Tampering with the approval statement (even if the issuer re-signs) breaks the user's signature.
  const t = structuredClone(env); t.receipt.approval.statement.amount_minor = 1;
  const s2 = { receipt: t.receipt, signature: { ...t.signature, value: issuer.sign(canonical(t.receipt)) } };
  const v2 = await verifyReceipt(s2, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.ok(failed(v2).includes("approval.passkey.client_data") && failed(v2).includes("approval.statement"));
  // An issuer downgrading to admin_token is rejected by default.
  const t3 = structuredClone(env); t3.receipt.approval.method = "admin_token"; t3.receipt.approval.assertion = null;
  const v3 = await verifyReceipt({ receipt: t3.receipt, signature: { ...t3.signature, value: issuer.sign(canonical(t3.receipt)) } }, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.ok(failed(v3).includes("approval.method"));
  // deny
  rail.orders.set("ORDHELD3", order("ORDHELD3", [STAND]));
  const r3 = await gw.propose("shopper", pay(mid, "ORDHELD3"));
  assert.equal((await approver(gw, auths, r3.approval_id!, false)).status, "denied");
  const ev = (await store.auditLog(50)).find(e => e.event === "approval.denied")!;
  assert.equal((ev.payload as any).method, "passkey");
});

// ---------- 2. enrollment tokens replace trust-on-first-use ----------
test("enrollment: tokens are hashed at rest, single-use, expiring and bound to one user", async () => {
  const store = new Store(await testSql()); const pk = new PasskeyService(store, RP);
  const t = await pk.issueEnrollment("alice", { issuedBy: "ops" });
  const dump = JSON.stringify(await store.db.prepare("SELECT * FROM enrollment_tokens").all()) + JSON.stringify(await store.auditLog(10));
  assert.ok(!dump.includes(t.token)); assert.ok(dump.includes(tokenHash(t.token)));
  const a = new SoftAuthenticator();
  const o = await pk.registrationOptions(t.token); assert.equal(o.user_id, "alice");
  await pk.verifyRegistration(t.token, a.register(o) as any);
  // reuse
  await assert.rejects(pk.registrationOptions(t.token), /already used/);
  // expired
  const e = await pk.issueEnrollment("bob");
  const eo = await pk.registrationOptions(e.token);
  await store.db.prepare("UPDATE enrollment_tokens SET expires_at=? WHERE token_hash=?").run(new Date(Date.now() - 1).toISOString(), tokenHash(e.token));
  await assert.rejects(pk.verifyRegistration(e.token, new SoftAuthenticator().register(eo) as any), /expired/);
  await assert.rejects(pk.registrationOptions(e.token), /expired/);
  // forged
  await assert.rejects(pk.registrationOptions("agenr_" + "A".repeat(43)), /invalid enrollment token/);
  assert.equal(await pk.credentialFor("bob"), null);
  assert.equal((await pk.enrollmentFor("alice"))!.via, "admin_link");
});

test("enrollment: an admin link cannot replace a passkey outright; the existing passkey can (logged, shown on receipts)", async () => {
  const { gw, passkeys, auths, store, rail, mid, receipts, issuer } = await setup();
  const old = auths.get("u1")!;
  // admin-issued link for a user who has a passkey only starts a time-locked recovery
  const t = await passkeys.issueEnrollment("u1", { issuedBy: "ops-alice" });
  assert.equal(t.replaces, old.id); assert.equal(t.via, "recovery");
  const parked = new SoftAuthenticator();
  const res = await passkeys.verifyRegistration(t.token, parked.register(await passkeys.registrationOptions(t.token)) as any);
  assert.ok(res.pending_recovery); assert.equal((await passkeys.credentialFor("u1"))!.credential_id, old.id);
  assert.ok(!(await store.auditLog(50)).some(e => e.event === "passkey.replaced"));
  // the user cancels with the current passkey
  const cr = await passkeys.recoveryCancelRequest("u1");
  await passkeys.cancelRecovery("u1", old.assert(cr.options.challenge) as any);
  assert.equal((await passkeys.recoveryFor("u1"))!.status, "cancelled");
  // passkey-authorized replacement: immediate, old-key mandates frozen until re-signed
  const r1 = await passkeys.reenrollRequest("u1");
  const minted = await passkeys.reenroll("u1", old.assert(r1.options.challenge) as any);
  assert.equal(minted.replaces, old.id);
  const fresh = new SoftAuthenticator();
  await passkeys.verifyRegistration(minted.token, fresh.register(await passkeys.registrationOptions(minted.token)) as any);
  assert.equal((await passkeys.enrollmentFor("u1"))!.via, "passkey");
  assert.ok((await store.auditLog(80)).some(e => e.event === "passkey.replaced"));
  assert.equal((await store.getMandate(mid))!.status, "frozen");
  rail.orders.set("ORDERREKY1", order("ORDERREKY1", [STAND]));
  assert.equal((await gw.propose("shopper", pay(mid, "ORDERREKY1"))).decision, "reject");
  // re-sign the frozen mandate with the new key: it is enforced again and the receipt shows the provenance
  const sreq = await gw.signingRequest(mid);
  const sm = (await store.getMandate(mid))!;
  await gw.confirmMandate(mid, sm.mandate_hash, fresh.assert(sreq.options.challenge) as any);
  assert.equal((await store.getMandate(mid))!.status, "active");
  rail.orders.set("ORDERREKY2", order("ORDERREKY2", [STAND]));
  const p = await gw.propose("shopper", pay(mid, "ORDERREKY2")); assert.equal(p.status, "captured");
  const env = (await receipts.forPayment(p.payment_id))!;
  assert.equal(env.receipt.mandate.passkey.enrollment.replaces, old.id);
  const v = await verifyReceipt(env, { issuerPublicKeyPem: issuer.publicKeyPem() });
  assert.equal(v.ok, true, JSON.stringify(failed(v))); assert.ok(v.checks.some(c => c.check === "passkey.provenance" && c.pass));
  // a stale link (issued before the swap) cannot be used; an old passkey cannot authorize re-enrollment
  const stale = await passkeys.issueEnrollment("u1");
  const so = await passkeys.registrationOptions(stale.token);
  const r2 = await passkeys.reenrollRequest("u1");
  const m2 = await passkeys.reenroll("u1", fresh.assert(r2.options.challenge) as any);
  await passkeys.verifyRegistration(m2.token, new SoftAuthenticator().register(await passkeys.registrationOptions(m2.token)) as any);
  await assert.rejects(passkeys.verifyRegistration(stale.token, new SoftAuthenticator().register(so) as any), /no pending|changed since/);
  const r3 = await passkeys.reenrollRequest("u1");
  await assert.rejects(passkeys.reenroll("u1", old.assert(r3.options.challenge) as any), /not from this user's passkey|rejected/);
});

// ---------- 3. issuer key rotation ----------
test("key rotation: kid-pinned key set; old receipts still verify, unknown kid and post-retirement signatures rejected", async () => {
  const path = join(mkdtempSync(join(tmpdir(), "ag-keys-")), "issuer-keys.json");
  process.env.AGENTGUARD_SIGNING_KEY = Signer.ephemeral() && (await import("node:crypto")).generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const ring = KeyRing.load(path); delete process.env.AGENTGUARD_SIGNING_KEY;
  assert.equal(statSync(path).mode & 0o777, 0o600);
  const kid1 = ring.activeKid();
  const ctx = await setup({}, { issuer: ring });
  ctx.rail.orders.set("ORDERKEYR1", order("ORDERKEYR1", [STAND]));
  const p1 = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERKEYR1"));
  const env1 = (await ctx.receipts.forPayment(p1.payment_id))!;
  assert.equal(env1.signature.kid, kid1);
  const rot = await ring.rotate();
  assert.equal(rot.retired, kid1); assert.notEqual(rot.active, kid1);
  const reloaded = KeyRing.load(path); assert.equal(reloaded.activeKid(), rot.active);
  assert.ok(!readFileSync(path, "utf8").includes("undefined"));
  const jwks = reloaded.jwks();
  assert.equal(jwks.keys.length, 2); assert.equal(jwks.keys[0].status, "retired"); assert.ok(jwks.keys[0].retired);
  assert.ok(!JSON.stringify(jwks).includes("PRIVATE"));
  ctx.rail.orders.set("ORDERKEYR2", order("ORDERKEYR2", [STAND]));
  const p2 = await ctx.gw.propose("shopper", pay(ctx.mid, "ORDERKEYR2"));
  const env2 = (await ctx.receipts.forPayment(p2.payment_id))!;
  assert.equal(env2.signature.kid, rot.active);
  for (const e of [env1, env2]) { const v = await verifyReceipt(e, { issuerKeys: jwks as any }); assert.equal(v.ok, true, JSON.stringify(failed(v))); assert.equal(v.trusted_issuer, true); }
  // JWK-only entries (x, no PEM) work too
  const xOnly = { keys: jwks.keys.map(({ public_key_pem, ...k }) => k) };
  assert.equal((await verifyReceipt(env2, { issuerKeys: xOnly as any })).ok, true);
  // wrong / unknown kid
  const other = KeyRing.ephemeral();
  const forged = { receipt: env2.receipt, signature: { ...env2.signature, kid: other.activeKid(), public_key_pem: other.publicKeyPem(), value: other.sign(canonical(env2.receipt)) } };
  const vf = await verifyReceipt(forged, { issuerKeys: jwks as any });
  assert.equal(vf.ok, false); assert.ok(failed(vf).includes("issuer.kid")); assert.equal(vf.trusted_issuer, false);
  // mislabeled kid (claims key 1 but signed by key 2): signature fails under the pinned key
  const mis = { receipt: env2.receipt, signature: { ...env2.signature, kid: kid1 } };
  assert.equal((await verifyReceipt(mis, { issuerKeys: jwks as any })).ok, false);
  // a retired key signing a receipt dated after its retirement (stolen old key) is rejected
  const old = structuredClone(env1); old.receipt.issued_at = new Date(Date.now() + 60_000).toISOString();
  const oldRing = JSON.parse(readFileSync(path, "utf8")).keys[0];
  const oldSigner = new Signer((await import("node:crypto")).createPrivateKey(oldRing.private_pem));
  const late = { receipt: old.receipt, signature: { ...old.signature, value: oldSigner.sign(canonical(old.receipt)) } };
  const vl = await verifyReceipt(late, { issuerKeys: jwks as any });
  assert.ok(failed(vl).includes("issuer.key_lifecycle"));
  // a key set entry whose kid does not match its key is not trusted
  const swapped = { keys: [{ ...jwks.keys[1], kid: kid1 }, jwks.keys[1]] };
  assert.ok(failed(await verifyReceipt(env1, { issuerKeys: swapped as any })).includes("issuer.kid"));
});

test("database key ring: keys sealed at rest, rotation visible to other instances, wrong master key fails", async () => {
  const sql = await testSql();
  process.env.AGENTGUARD_SIGNING_KEY = (await import("node:crypto")).generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const master = "m".repeat(40);
  try {
    const a = await KeyRing.fromDb(sql, master); const kid1 = a.activeKid();
    const b = await KeyRing.fromDb(sql, master); assert.equal(b.activeKid(), kid1);
    const rows = await sql.prepare("SELECT * FROM issuer_keys").all();
    assert.equal(rows.length, 1); assert.ok(!JSON.stringify(rows).includes("PRIVATE KEY"));
    const rot = await a.rotate(); assert.equal(rot.retired, kid1);
    await b.refresh(0); assert.equal(b.activeKid(), rot.active);
    assert.equal(b.jwks().keys.length, 2);
    await assert.rejects(KeyRing.fromDb(sql, "x".repeat(40)));
  } finally { delete process.env.AGENTGUARD_SIGNING_KEY; await sql.close(); }
});
