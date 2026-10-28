import { testSql } from "./support/db.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Store } from "../src/store.ts";
import { Gateway } from "../src/gateway.ts";
import { HeuristicRiskAnalyzer } from "../src/risk.ts";
import { mandateChallenge, revokeChallenge, PasskeyService } from "../src/passkeys.ts";
import { enrol, RP } from "./support/passkey.ts";
import { SoftAuthenticator } from "./support/softauth.ts";
import type { PaymentRail } from "../src/paypal.ts";

const rail = (): PaymentRail & { calls: string[] } => {
  const calls: string[] = [];
  return { calls,
    async authorize(i) { calls.push("authorize"); return { order_id: "O", authorization_id: "A-" + i.referenceId, status: "CREATED",
      observed: { currency: i.currency, amountMinor: i.amountMinor, payee: { merchant_id: i.payee.merchant_id } } }; },
    async capture(id) { calls.push("capture"); return { capture_id: "C-" + id, status: "COMPLETED" }; },
    async void() { calls.push("void"); }, async getAuthorization() { return { status: "CREATED" }; } };
};
async function setup() {
  const store = new Store(await testSql()); const r = rail();
  const { passkeys, auths } = await enrol(store, ["u1", "u2"]);
  const gw = new Gateway({ store, passkeys, risk: new HeuristicRiskAnalyzer(), rail: r });
  await gw.linkWallet("u1", "V"); await gw.registerAgent("u1", "shopper");
  const d = await gw.draftMandate({ user_id: "u1", agent_id: "shopper", purpose: "Buy one book", constraints: { currency: "USD", max_total: "50.00", max_transactions: 3 } });
  return { store, rail: r, gw, passkeys, auths, mid: d.mandate.mandate_id, hash: d.mandate_hash, u1: auths.get("u1")!, u2: auths.get("u2")! };
}
const book = (mid: string, k = "k1") => ({ mandate_id: mid, agent_id: "shopper", idempotency_key: k, currency: "USD",
  payee: { merchant_id: "BOOKS1" }, items: [{ name: "book", quantity: 1, unit_amount: "20.00", category: "PHYSICAL_GOODS" as const }] });

test("the admin token alone cannot activate a mandate: no assertion, someone else's passkey, wrong hash, wrong origin, no UV", async () => {
  const { gw, mid, hash, u1, u2 } = await setup();
  await assert.rejects(gw.confirmMandate(mid, hash, undefined as any), /assertion/);
  await assert.rejects(gw.confirmMandate(mid, hash, u2.assert(mandateChallenge(hash)) as any), /not from this user's passkey/);
  await assert.rejects(gw.confirmMandate(mid, hash, u1.assert(mandateChallenge("ab".repeat(32))) as any), /signature rejected/);
  await assert.rejects(gw.confirmMandate(mid, hash, u1.assert(mandateChallenge(hash), "https://evil.example") as any), /signature rejected/);
  u1.uv = false;
  await assert.rejects(gw.confirmMandate(mid, hash, u1.assert(mandateChallenge(hash)) as any), /signature rejected/);
  u1.uv = true;
  assert.equal((await gw.mandateView(mid)).status, "draft");
  const ok = await gw.confirmMandate(mid, hash, u1.assert(mandateChallenge(hash)) as any);
  assert.equal(ok.status, "active");
  const v = await gw.mandateView(mid);
  assert.equal(v.signature_valid, true);
  assert.ok(v.user_signature?.signature);
});

test("every proposal re-verifies the user's signature: a signature lifted from another mandate is rejected", async () => {
  const { gw, store, mid, hash, u1, rail } = await setup();
  await gw.confirmMandate(mid, hash, u1.assert(mandateChallenge(hash)) as any);
  // A second, bigger mandate drafted by whoever holds the admin token, given the first one's valid signature.
  const big = await gw.draftMandate({ user_id: "u1", agent_id: "shopper", purpose: "Buy anything", constraints: { currency: "USD", max_total: "5000.00", max_transactions: 50 } });
  await store.db.prepare("UPDATE mandates SET status='active', user_signature=(SELECT user_signature FROM mandates WHERE mandate_id=?) WHERE mandate_id=?").run(mid, big.mandate.mandate_id);
  const r = await gw.propose("shopper", book(big.mandate.mandate_id));
  assert.equal(r.decision, "reject");
  assert.ok(r.evaluation.checks.some(c => c.check === "mandate_signature" && !c.pass));
  assert.equal(rail.calls.length, 0);
  // The genuine mandate still works.
  assert.equal((await gw.propose("shopper", book(mid, "k2"))).status, "captured");
});

test("swapping the stored passkey public key (DB tamper) invalidates every mandate it signed", async () => {
  const { gw, store, mid, hash, u1 } = await setup();
  await gw.confirmMandate(mid, hash, u1.assert(mandateChallenge(hash)) as any);
  const other = await store.db.prepare("SELECT public_key FROM passkeys WHERE user_id='u2'").get() as any;
  await store.db.prepare("UPDATE passkeys SET public_key=? WHERE user_id='u1'").run(other.public_key);
  const r = await gw.propose("shopper", book(mid));
  assert.equal(r.decision, "reject");
});

test("revocation must be user-signed; a mandate-signing assertion cannot be replayed as a revocation", async () => {
  const { gw, mid, hash, u1, u2 } = await setup();
  const signing = u1.assert(mandateChallenge(hash));
  await gw.confirmMandate(mid, hash, signing as any);
  await assert.rejects(gw.revokeMandate(mid, undefined), /must be signed/);
  await assert.rejects(gw.revokeMandate(mid, u1.assert(mandateChallenge(hash)) as any), /signature rejected/);
  await assert.rejects(gw.revokeMandate(mid, u2.assert(revokeChallenge(hash)) as any), /not from this user's passkey/);
  assert.equal((await gw.mandateView(mid)).status, "active");
  const req = await gw.revocationRequest(mid);
  assert.equal(req.options.challenge, revokeChallenge(hash));
  await gw.revokeMandate(mid, u1.assert(req.options.challenge) as any, "lost trust in the agent");
  const v = await gw.mandateView(mid);
  assert.equal(v.status, "revoked"); assert.ok(v.revocation_signature?.signature);
  assert.equal((await gw.propose("shopper", book(mid))).decision, "reject");
});

test("drafts can be discarded without a signature (they carry no authority)", async () => {
  const { gw, mid } = await setup();
  await gw.revokeMandate(mid, undefined, "discard");
  assert.equal((await gw.mandateView(mid)).status, "revoked");
});

test("no trust-on-first-use: registration without a valid enrollment token is refused", async () => {
  const store = new Store(await testSql()); const pk = new PasskeyService(store, RP);
  await assert.rejects(pk.registrationOptions("u1"), /invalid enrollment token/);
  await assert.rejects(pk.registrationOptions(""), /invalid enrollment token/);
});

test("registration challenge is single-use and bound to the user", async () => {
  const store = new Store(await testSql()); const pk = new PasskeyService(store, RP);
  const a = new SoftAuthenticator();
  const ta = await pk.issueEnrollment("alice"), tb = await pk.issueEnrollment("bob");
  const opts = await pk.registrationOptions(ta.token);
  await assert.rejects(pk.verifyRegistration(tb.token, a.register(opts) as any), /no pending/);
  const done = await pk.verifyRegistration(ta.token, a.register(opts) as any);
  assert.equal(done.user_id, "alice");
  await assert.rejects(pk.verifyRegistration(ta.token, a.register(opts) as any), /already used/);
});

test("migration: server-signed legacy mandates become 'unsigned', are not enforced, and re-activate only when the user signs", async () => {
  const path = join(mkdtempSync(join(tmpdir(), "ag-")), "legacy.db");
  const db = new DatabaseSync(path);
  db.exec(`CREATE TABLE mandates (mandate_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, agent_id TEXT NOT NULL, body TEXT NOT NULL,
    mandate_hash TEXT NOT NULL, signature TEXT, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`);
  const { canonical, sha256 } = await import("../src/canonical.ts");
  const m = { mandate_id: "mdt_legacy", user_id: "u1", agent_id: "shopper", purpose: "Buy one book", constraints: { currency: "USD", max_total: "50.00", max_transactions: 2 },
    created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 3600_000).toISOString(), version: 1 };
  const h = sha256(canonical(m));
  db.prepare("INSERT INTO mandates VALUES (?,?,?,?,?,?,?,?,?)").run(m.mandate_id, "u1", "shopper", canonical(m), h, "c2VydmVyLXNpZw==", "active", m.created_at, m.created_at);
  db.close();
  const store = new Store(path);
  assert.equal((await store.getMandate("mdt_legacy"))!.status, "unsigned");
  assert.ok((await store.auditLog(10)).some(e => e.event === "mandate.migrated_unsigned"));
  const { passkeys, auths } = await enrol(store);
  const r = rail(); const gw = new Gateway({ store, passkeys, risk: new HeuristicRiskAnalyzer(), rail: r });
  await gw.linkWallet("u1", "V"); await gw.registerAgent("u1", "shopper");
  const denied = await gw.propose("shopper", book("mdt_legacy"));
  assert.equal(denied.decision, "reject"); assert.equal(r.calls.length, 0);
  await gw.confirmMandate("mdt_legacy", h, auths.get("u1")!.assert(mandateChallenge(h)) as any);
  assert.equal((await gw.propose("shopper", book("mdt_legacy", "k2"))).status, "captured");
});
