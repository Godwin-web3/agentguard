import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { draftFromText, parseRules } from "../src/drafter.ts";

test("rules parser reads totals, per-payment caps, counts, payees, approval threshold and window", async () => {
  const d = await draftFromText("Buy one laptop under $900 this week, only from store@bestlaptops.example. Ask me over $600.");
  assert.deepEqual(d.constraints, { currency: "USD", max_total: "900.00", max_transactions: 1, allowed_categories: ["PHYSICAL_GOODS"],
    payee_allowlist: ["store@bestlaptops.example"], max_quantity_per_item: 1, require_human_approval_over: "600.00" });
  assert.equal(d.ttl_minutes, 7 * 1440);
  const e = await draftFromText("Top up my OpenAI API credits, up to $20 each, 3 purchases, for 30 days");
  assert.equal(e.constraints.max_per_transaction, "20.00"); assert.equal(e.constraints.max_total, "60.00"); assert.equal(e.constraints.max_transactions, 3);
  const f = parseRules("Donate 25 euros to save@children.example once");
  assert.equal(f.c.max_total, "25.00"); assert.equal(f.currency, "EUR"); assert.deepEqual(f.c.allowed_categories, ["DONATION"]);
});

test("refuses to draft without a spending limit, and defaults tight when details are missing", async () => {
  await assert.rejects(draftFromText("get me some stuff"), /how much/);
  const d = await draftFromText("pay up to $40");
  assert.equal(d.constraints.max_transactions, 1); assert.equal(d.ttl_minutes, 60);
  assert.ok(d.warnings.some(w => /any merchant/.test(w)));
});

test("a model that tries to widen authority is overruled by the text: tighter limit wins, invented payees dropped", async () => {
  const evil = { purpose: "laptop", currency: "USD", max_total: "9000.00", max_transactions: 50, require_human_approval_over: "8000.00",
    payee_allowlist: ["store@bestlaptops.example", "attacker@evil.example"], ttl_minutes: 999999 };
  const srv = createServer((_q, r) => { r.setHeader("content-type", "application/json"); r.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(evil) } }] })); });
  await new Promise<void>(ok => srv.listen(0, ok));
  const port = (srv.address() as any).port;
  try {
    const d = await draftFromText("Buy one laptop under $900 this week, only from store@bestlaptops.example. Ask me over $600.",
      { baseUrl: `http://127.0.0.1:${port}`, apiKey: "x", model: "m" });
    assert.equal(d.source, "rules+llm");
    assert.equal(d.constraints.max_total, "900.00");
    assert.equal(d.constraints.max_transactions, 1);
    assert.equal(d.constraints.require_human_approval_over, "600.00");
    assert.deepEqual(d.constraints.payee_allowlist, ["store@bestlaptops.example"]);
    assert.equal(d.ttl_minutes, 7 * 1440);
    assert.ok(d.warnings.some(w => /kept the lower/.test(w)));
    assert.ok(d.summary.join(" ").includes("900.00 USD"));
  } finally { srv.close(); }
});

test("drafting still works when the model is unreachable", async () => {
  const d = await draftFromText("pay up to $15 for one ebook", { baseUrl: "http://127.0.0.1:1", apiKey: "x", model: "m" });
  assert.equal(d.source, "rules"); assert.equal(d.constraints.max_total, "15.00");
  assert.ok(d.warnings.some(w => /unavailable/.test(w)));
});
