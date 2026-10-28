import { test } from "node:test";
import assert from "node:assert/strict";
import { PayPalAgentToolkit as AiToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/ai-sdk";
import { PayPalAgentToolkit as OaToolkit } from "@paypal/agent-toolkit/openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { buildOrder, PayPalGuard, READ_ONLY, disposition } from "../src/core.ts";
import { guardTools } from "../src/ai-sdk.ts";
import { guardOpenAI } from "../src/openai.ts";
import { createGuardedMcpServer } from "../src/mcp.ts";
import { orderFacts } from "../../../src/order.ts";

const cfgBase = { url: "https://guard.test/", apiKey: "agk_test", agentId: "shopper", mandateId: "mdt_1" };
const toolkitOpts = { clientId: "id", clientSecret: "secret", configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: true } } };
const merchant = { getBaseUrl: () => "https://api-m.sandbox.paypal.com", getHeaders: async () => ({ authorization: "Bearer merchant" }) };

function fakeFetch() {
  const calls: { url: string; method: string; body: any; auth?: string }[] = [];
  const f = (async (url: string, init: any) => {
    const body = init?.body ? JSON.parse(init.body) : undefined; calls.push({ url, method: init?.method, body, auth: init?.headers?.authorization });
    if (url.endsWith("/v2/checkout/orders")) return Response.json({ id: "5O190127TN364715T", status: "CREATED" }, { status: 201 });
    if (url.endsWith("/v1/agent/payments")) return Response.json({ payment_id: "pay_1", decision: "reject", status: "rejected",
      evaluation: { reasons: [], checks: [{ check: "sku_allowlist", pass: false, detail: "not allowlisted" }] }, paypal: { order_id: body.paypal_order_id } });
    return Response.json({ error: "unexpected " + url }, { status: 500 });
  }) as unknown as typeof fetch;
  return { f, calls };
}

test("buildOrder: AUTHORIZE, integer-cent breakdown that AgentGuard's order normalizer accepts", () => {
  const o = buildOrder({ currencyCode: "USD", items: [{ name: "Credits", quantity: 3, itemCost: 3.33, taxPercent: 7.5, sku: "C-1", category: "DIGITAL_GOODS" }], shippingCost: 1.1, discount: 0.5 });
  assert.equal(o.intent, "AUTHORIZE");
  assert.equal(o.purchase_units[0].amount.value, "11.34"); // 9.99 + 3*0.25 tax + 1.10 - 0.50
  const facts = orderFacts({ id: "5O190127TN364715T", status: "CREATED", ...o, purchase_units: [{ ...o.purchase_units[0], payee: { merchant_id: "M1" } }] } as any);
  assert.equal(facts.amount_minor, 1134);
});

test("fail-closed tool policy: only read-only + guarded tools survive", () => {
  for (const m of ["create_refund", "accept_dispute_claim", "record_payment_for_invoice", "create_subscription", "send_invoice", "update_subscription"])
    assert.equal(disposition(m), "blocked", m);
  assert.equal(disposition("pay_order"), "guarded"); assert.equal(disposition("get_order"), "read_only");
});

test("AI SDK: pay_order goes to AgentGuard with the configured mandate; PayPal capture is never called; risky tools removed", async () => {
  const tk = new AiToolkit(toolkitOpts); const { f, calls } = fakeFetch();
  const tools = guardTools(tk, new PayPalGuard({ ...cfgBase, fetch: f }, merchant));
  assert.ok(!("create_refund" in tools) && !("accept_dispute_claim" in tools) && !("create_subscription" in tools));
  assert.ok("get_order" in tools && "pay_order" in tools && "create_order" in tools);
  assert.ok(Object.keys(tools).every(k => READ_ONLY.has(k) || ["create_order", "pay_order", "get_payment_status"].includes(k)));
  const c: any = await tools.create_order.execute!({ currencyCode: "USD", items: [{ name: "x", quantity: 1, itemCost: 5, taxPercent: 0 }] } as any, { toolCallId: "1", messages: [] });
  assert.equal(c.order_id, "5O190127TN364715T"); assert.equal(calls[0].body.intent, "AUTHORIZE"); assert.equal(calls[0].auth, "Bearer merchant");
  const r: any = await tools.pay_order.execute!({ id: "5O190127TN364715T", mandate_id: "mdt_EVIL" } as any, { toolCallId: "2", messages: [] });
  assert.equal(r.decision, "reject"); assert.deepEqual(r.reasons, ["sku_allowlist: not allowlisted"]);
  const p = calls[1];
  assert.equal(p.url, "https://guard.test/v1/agent/payments"); assert.equal(p.auth, "Bearer agk_test");
  assert.deepEqual(p.body, { mandate_id: "mdt_1", agent_id: "shopper", idempotency_key: "paypal-order-5O190127TN364715T", paypal_order_id: "5O190127TN364715T" });
  assert.ok(!calls.some(x => /\/capture|\/authorize/.test(x.url)), "no direct PayPal money movement");
});

test("OpenAI: drop-in getTools/handleToolCall; blocked tools refuse; pay routes to AgentGuard", async () => {
  const { f, calls } = fakeFetch();
  const g = guardOpenAI(new OaToolkit(toolkitOpts), new PayPalGuard({ ...cfgBase, fetch: f }, merchant));
  const names = g.getTools().map(t => t.function.name);
  assert.ok(names.includes("pay_order") && !names.includes("create_refund"));
  const blocked = await g.handleToolCall({ id: "t1", function: { name: "create_refund", arguments: '{"capture_id":"X","amount":10}' } });
  assert.match(blocked.content, /blocked by AgentGuard/);
  const paid = await g.handleToolCall({ id: "t2", function: { name: "pay_order", arguments: '{"id":"5O190127TN364715T"}' } });
  assert.equal(JSON.parse(paid.content).payment_id, "pay_1"); assert.equal(calls.length, 1);
  const bad = await g.handleToolCall({ id: "t3", function: { name: "pay_order", arguments: '{"id":"../../v1/x"}' } });
  assert.match(bad.content, /Invalid PayPal Order ID/);
});

test("MCP: guarded server lists no refund/dispute tools and routes pay_order through AgentGuard", async () => {
  const { f, calls } = fakeFetch();
  const server = createGuardedMcpServer(new AiToolkit(toolkitOpts) as any, new PayPalGuard({ ...cfgBase, fetch: f }, merchant));
  const [a, b] = InMemoryTransport.createLinkedPair(); const client = new Client({ name: "t", version: "1" });
  await Promise.all([server.connect(a), client.connect(b)]);
  const names = (await client.listTools()).tools.map(t => t.name);
  assert.ok(names.includes("pay_order") && names.includes("get_order") && !names.includes("create_refund") && !names.includes("accept_dispute_claim"));
  const r: any = await client.callTool({ name: "pay_order", arguments: { id: "5O190127TN364715T" } });
  assert.equal(JSON.parse(r.content[0].text).decision, "reject"); assert.equal(calls[0].body.mandate_id, "mdt_1");
  await client.close();
});
