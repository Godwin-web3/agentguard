// Console AG Grid views: the in-browser audit-chain recomputation, and the console bundle (AG Grid + receipt verifier).
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, join } from "node:path";
import { build } from "esbuild";
// @ts-ignore: plain ESM helper shared with the site build
import { browserVerifierOptions } from "../scripts/web-bundle.mjs";
import { Store } from "../src/store.ts";
import { testSql } from "./support/db.ts";
import { verifyChainRows } from "../web/src/chain.ts";

async function ledger(n = 6) {
  const store = new Store(await testSql());
  for (let i = 0; i < n; i++) await store.audit(i % 2 ? "payment.approve" : "mandate.created", `ref_${i}`, { i, amount_minor: 1000 + i, note: "ünïcode ✓", nested: { b: [1, "x"], a: null } });
  return store;
}

test("audit grid: every row's hash and link is recomputed in the browser and matches the server", async () => {
  const store = await ledger();
  const rows = await store.auditLog(200);
  const res = await verifyChainRows(rows);
  assert.equal(res.size, 6);
  for (const [seq, r] of res) assert.equal(r.status, "verified", `#${seq}: ${r.detail}`);
  assert.equal((await store.verifyAuditChain()).ok, true);
});

test("audit grid: an edited payload or a re-pointed link shows as broken from that row on", async () => {
  const rows = await (await ledger()).auditLog(200);
  const edited = structuredClone(rows); edited.find(r => r.seq === 3)!.payload.amount_minor = 1;
  const a = await verifyChainRows(edited);
  assert.deepEqual([1, 2].map(s => a.get(s)!.status), ["verified", "verified"]);
  assert.equal(a.get(3)!.status, "broken"); assert.match(a.get(3)!.detail, /hash does not match/);
  assert.equal(a.get(4)!.status, "broken");
  const relinked = structuredClone(rows); relinked.find(r => r.seq === 5)!.prev_hash = "0".repeat(64);
  assert.equal((await verifyChainRows(relinked)).get(5)!.status, "broken");
});

test("audit grid: a partial window marks only its oldest row as unlinked (own hash still checked)", async () => {
  const rows = (await (await ledger()).auditLog(3));
  const res = await verifyChainRows(rows);
  assert.equal(res.get(4)!.status, "unlinked");
  assert.equal(res.get(5)!.status, "verified"); assert.equal(res.get(6)!.status, "verified");
});

test("console bundle: AG Grid Community and the receipt verifier, no node built-ins", async () => {
  const root = resolve(import.meta.dirname, "..");
  const r = await build({ entryPoints: [join(root, "web/src/console.ts")], bundle: true, write: false, metafile: true, logLevel: "silent", outdir: "/tmp/ag-console", ...browserVerifierOptions(root) });
  const inputs = Object.keys(r.metafile!.inputs);
  assert.ok(!inputs.some(f => f.startsWith("node:")), "bundle must not pull in node built-ins");
  assert.ok(inputs.some(f => f.includes("node_modules/ag-grid-community/")), "AG Grid is bundled");
  assert.ok(inputs.some(f => f.includes("packages/intent-verifier/src/verify.ts")), "receipt verifier is bundled");
});
