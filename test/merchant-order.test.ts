import { test } from "node:test";
import assert from "node:assert/strict";
import { Store } from "../src/store.ts";
import { Gateway } from "../src/gateway.ts";
import { HeuristicRiskAnalyzer } from "../src/risk.ts";
import { orderFacts } from "../src/order.ts";
import { enrol, signer } from "./support/passkey.ts";
import type { PaymentRail, AuthorizeInput, AuthorizationState, AuthorizeResult } from "../src/paypal.ts";
import type { MandateConstraints } from "../src/types.ts";

const MERCHANT = { merchant_id: "M32J3M4A7KASQ", email_address: "store@business.example.com" };
function order(id: string, items: { name: string; sku?: string; category?: string; quantity: number; unit: string }[], extra: any = {}) {
  const sum = items.reduce((s, i) => s + Math.round(Number(i.unit) * 100) * i.quantity, 0);
  const v = (m: number) => ({ currency_code: "USD", value: (m / 100).toFixed(2) });
  const tax = extra.tax ?? 0;
  return { id, intent: extra.intent ?? "AUTHORIZE", status: "CREATED", purchase_units: [{ reference_id: "default", payee: extra.payee ?? MERCHANT,
    amount: { ...v(extra.total ?? sum + tax), breakdown: { item_total: v(sum), ...(tax ? { tax_total: v(tax) } : {}) } },
    items: items.map(i => ({ name: i.name, sku: i.sku, category: i.category, quantity: String(i.quantity), unit_amount: v(Math.round(Number(i.unit) * 100)) })) }] };
}

class OrderRail implements PaymentRail {
  calls: string[] = []; orders = new Map<string, any>(); auths = new Map<string, AuthorizationState>();
  async authorize(i: AuthorizeInput): Promise<AuthorizeResult> { this.calls.push("authorize"); throw new Error("direct path not expected"); }
  async getOrder(id: string) { this.calls.push(`get:${id}`); const o = this.orders.get(id); if (!o) throw Object.assign(new Error("not found"), { status: 404 }); return structuredClone(o); }
  async authorizeOrder(id: string, vault: string, req: string): Promise<AuthorizeResult> {
    this.calls.push(`authorizeOrder:${id}:${vault}`);
    const pu = this.orders.get(id).purchase_units[0];
    this.auths.set("A-" + id, { status: "CREATED" });
    return { order_id: id, authorization_id: "A-" + id, status: "CREATED",
      observed: { currency: pu.amount.currency_code, amountMinor: Math.round(Number(pu.amount.value) * 100), payee: pu.payee } };
  }
  async capture(id: string) { this.calls.push(`capture:${id}`); return { capture_id: "C-" + id, status: "COMPLETED" }; }
  async void(id: string) { this.calls.push(`void:${id}`); }
  async getAuthorization(id: string) { return this.auths.get(id) ?? { status: "CREATED" }; }
}

async function setup(c: Partial<MandateConstraints> = {}) {
  const store = new Store(":memory:"); const rail = new OrderRail();
  const { passkeys, auths } = await enrol(store);
  const gw = new Gateway({ store, passkeys, risk: new HeuristicRiskAnalyzer(), rail });
  gw.linkWallet("u1", "VAULT-1"); gw.registerAgent("u1", "shopper");
  const d = gw.draftMandate({ user_id: "u1", agent_id: "shopper", purpose: "Buy a laptop stand and laptop charger",
    constraints: { currency: "USD", max_total: "200.00", max_transactions: 3, payee_allowlist: [MERCHANT.email_address], require_merchant_order: true,
      sku_allowlist: ["STAND-1", "CHARGER-65W"], allowed_categories: ["PHYSICAL_GOODS"], max_quantity_per_item: 2, ...c } });
  await signer(gw, auths)(d.mandate.mandate_id, d.mandate_hash);
  return { gw, rail, store, mid: d.mandate.mandate_id };
}
const pay = (mid: string, id: string, key = "k-" + id) => ({ mandate_id: mid, agent_id: "shopper", idempotency_key: key, paypal_order_id: id });

test("merchant order within the mandate: facts come from PayPal, authorize -> capture", async () => {
  const { gw, rail, mid } = await setup();
  rail.orders.set("ORDEROK0001", order("ORDEROK0001", [{ name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "30.00" }], { tax: 250 }));
  const r = await gw.propose("shopper", pay(mid, "ORDEROK0001") as any);
  assert.equal(r.status, "captured", JSON.stringify(r.evaluation.reasons));
  assert.equal(r.evaluation.amount_minor, 3250, "tax is part of what the buyer is charged");
  assert.deepEqual(rail.calls, ["get:ORDEROK0001", "get:ORDEROK0001", "authorizeOrder:ORDEROK0001:VAULT-1", "capture:A-ORDEROK0001"]);
});

test("SKU, category, quantity and payee are checked against PayPal's order, not the agent", async () => {
  const { gw, rail, mid } = await setup();
  rail.orders.set("ORDERSKU001", order("ORDERSKU001", [{ name: "Laptop stand", sku: "GIFTCARD-100", category: "DIGITAL_GOODS", quantity: 3, unit: "10.00" }]));
  rail.orders.set("ORDERPAY001", order("ORDERPAY001", [{ name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "10.00" }],
    { payee: { merchant_id: "ATTACKER1", email_address: "attacker@evil.example" } }));
  const a = await gw.propose("shopper", pay(mid, "ORDERSKU001") as any);
  const failed = a.evaluation.checks.filter(c => !c.pass).map(c => c.check);
  assert.equal(a.decision, "reject"); assert.deepEqual(failed.sort(), ["category", "quantity", "sku_allowlist"]);
  const b = await gw.propose("shopper", pay(mid, "ORDERPAY001") as any);
  assert.equal(b.decision, "reject"); assert.ok(b.evaluation.checks.some(c => c.check === "payee_allowlist" && !c.pass));
  assert.ok(!rail.calls.some(c => c.startsWith("authorizeOrder")));
});

test("agent cannot mix declared fields into an order proposal, or set server-only fields", async () => {
  const { gw, mid } = await setup();
  await assert.rejects(gw.propose("shopper", { ...pay(mid, "ORDEROK0001"), payee: { email_address: "x@y" } } as any), /comes from the PayPal order/);
  await assert.rejects(gw.propose("shopper", { ...pay(mid, "ORDEROK0001"), facts_source: "paypal_order" } as any), /set by AgentGuard/);
  await assert.rejects(gw.propose("shopper", { mandate_id: mid, agent_id: "shopper", idempotency_key: "z", currency: "USD", payee: MERCHANT,
    facts_source: "paypal_order", items: [{ name: "x", quantity: 1, unit_amount: "1.00", category: "PHYSICAL_GOODS" }] } as any), /set by AgentGuard/);
});

test("agent-declared (vaulted) path: category/sku/quantity limits and require_merchant_order fail as unverifiable", async () => {
  const { gw, rail, mid } = await setup();
  const r = await gw.propose("shopper", { mandate_id: mid, agent_id: "shopper", idempotency_key: "d1", currency: "USD", payee: { email_address: MERCHANT.email_address },
    items: [{ name: "Laptop stand", quantity: 1, unit_amount: "30.00", category: "PHYSICAL_GOODS", sku: "STAND-1" }] });
  assert.equal(r.decision, "reject");
  const failed = r.evaluation.checks.filter(c => !c.pass).map(c => c.check).sort();
  assert.deepEqual(failed, ["category", "merchant_order", "quantity", "sku_allowlist"]);
  assert.ok(r.evaluation.reasons.some(x => x.includes("unverifiable")));
  assert.equal(rail.calls.length, 0);
});

test("order changed by the merchant after evaluation is never authorized", async () => {
  const { gw, rail, mid, store } = await setup({ require_human_approval_over: "20.00" });
  rail.orders.set("ORDERCHG001", order("ORDERCHG001", [{ name: "Laptop charger", sku: "CHARGER-65W", category: "PHYSICAL_GOODS", quantity: 1, unit: "45.00" }]));
  const r = await gw.propose("shopper", pay(mid, "ORDERCHG001") as any);
  assert.equal(r.status, "needs_human");
  rail.orders.set("ORDERCHG001", order("ORDERCHG001", [{ name: "Laptop charger", sku: "CHARGER-65W", category: "PHYSICAL_GOODS", quantity: 1, unit: "45.00" }],
    { payee: { merchant_id: "ATTACKER1", email_address: "attacker@evil.example" } }));
  const done = await gw.resolveApproval(r.approval_id!, true, "owner");
  assert.equal(done.status, "failed"); assert.match(done.error!, /changed after evaluation/);
  assert.ok(!rail.calls.some(c => c.startsWith("authorizeOrder")));
  assert.equal(store.spendState(mid).reserved_minor, 0);
});

test("an order id can fund only one payment", async () => {
  const { gw, rail, mid } = await setup();
  rail.orders.set("ORDERONE001", order("ORDERONE001", [{ name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "10.00" }]));
  assert.equal((await gw.propose("shopper", pay(mid, "ORDERONE001", "a") as any)).status, "captured");
  const again = await gw.propose("shopper", pay(mid, "ORDERONE001", "b") as any);
  assert.equal(again.decision, "reject"); assert.ok(again.evaluation.checks.some(c => c.check === "order_unused" && !c.pass));
  // Same key replays the original decision instead of re-reading PayPal.
  assert.equal((await gw.propose("shopper", pay(mid, "ORDERONE001", "a") as any)).status, "captured");
});

test("orderFacts fails closed on orders the policy can't reason about", () => {
  const ok = order("ORDERX00001", [{ name: "a", sku: "S", category: "PHYSICAL_GOODS", quantity: 1, unit: "10.00" }]);
  assert.equal(orderFacts(ok).amount_minor, 1000);
  assert.throws(() => orderFacts({ ...ok, intent: "CAPTURE" }), /intent CAPTURE/);
  assert.throws(() => orderFacts({ ...ok, status: "COMPLETED" }), /status COMPLETED/);
  assert.throws(() => orderFacts({ ...ok, purchase_units: [ok.purchase_units[0], ok.purchase_units[0]] }), /2 purchase units/);
  assert.throws(() => orderFacts(order("ORDERX00002", [{ name: "a", quantity: 1, unit: "10.00" }], { total: 500 })), /does not equal amount/);
  assert.throws(() => orderFacts({ ...ok, purchase_units: [{ ...ok.purchase_units[0], items: [] }] }), /no line items/);
  assert.throws(() => orderFacts({ ...ok, purchase_units: [{ ...ok.purchase_units[0], payee: undefined }] }), /no payee/);
  assert.equal(orderFacts(order("ORDERX00003", [{ name: "a", quantity: 1, unit: "1.00" }])).items[0].category, "UNSPECIFIED");
});
