import { generateKeyPairSync } from "node:crypto";
// Channel3 product discovery: mandate-bounded search, the agent route, and the catalog reference price as an
// escalate-only risk signal on PayPal orders. A local fake stands in for api.trychannel3.com.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { Channel3Client, CatalogPriceAnalyzer, normalize, mandateFit, spendCeiling } from "../src/catalog.ts";
import { Store } from "../src/store.ts";
import { Gateway } from "../src/gateway.ts";
import { HeuristicRiskAnalyzer, CompositeRiskAnalyzer } from "../src/risk.ts";
import { testSql } from "./support/db.ts";
import { enrol, signer } from "./support/passkey.ts";
import { OrderRail, order, MERCHANT } from "./support/orders.ts";

const PRODUCTS: Record<string, any> = {
  Lp8fQ2x: { id: "Lp8fQ2x", title: "Aluminium laptop stand", brands: [{ id: "b1", name: "Rain Design" }], images: [{ url: "https://img.example/a.jpg", cleaned_url: "https://cdn.example/a.png", is_main_image: true }],
    category: { slug: "laptop-stands", title: "Laptop Stands" }, offers: [
      { url: "https://buy.example/1", domain: "bestbuy.com", price: { price: 42.5, currency: "USD" }, availability: "InStock", condition: "new" },
      { url: "https://buy.example/2", domain: "amazon.com", price: { price: 39, currency: "USD" }, availability: "InStock", condition: "new" },
      { url: "https://buy.example/3", domain: "ebay.com", price: { price: 20, currency: "USD" }, availability: "OutOfStock", condition: "used" }] },
  Hk3sW0p: { id: "Hk3sW0p", title: "Ergonomic office chair", brands: [], images: [], offers: [{ url: "u", domain: "ikea.com", price: { price: 349, currency: "USD" }, availability: "InStock" }] },
};
async function fakeChannel3() {
  const seen: { method: string; url: string; key: string | undefined; body: any }[] = [];
  const srv: Server = createServer(async (rq, rs) => {
    let raw = ""; for await (const c of rq) raw += c;
    const body = raw ? JSON.parse(raw) : undefined; seen.push({ method: rq.method!, url: rq.url!, key: rq.headers["x-api-key"] as string, body });
    rs.setHeader("content-type", "application/json");
    if (rq.headers["x-api-key"] !== "c3_test_key") { rs.statusCode = 401; return rs.end(JSON.stringify({ detail: "API key was provided but is invalid." })); }
    if (rq.method === "POST" && rq.url === "/v1/search") {
      const max = body.filters?.price?.max_price ?? Infinity;
      return rs.end(JSON.stringify({ products: Object.values(PRODUCTS).filter(p => p.offers.some((o: any) => o.price.price <= max)), next_page_token: null }));
    }
    const m = /^\/v1\/products\/(\w+)$/.exec(rq.url!);
    if (m && PRODUCTS[m[1]]) return rs.end(JSON.stringify(PRODUCTS[m[1]]));
    rs.statusCode = 404; rs.end(JSON.stringify({ detail: "Not found" }));
  }).listen(0);
  return { url: `http://127.0.0.1:${(srv.address() as AddressInfo).port}`, seen, close: () => srv.close() };
}

test("normalize: stable product shape, cheapest in-stock offer within currency and ceiling is best", () => {
  const p = normalize(PRODUCTS.Lp8fQ2x, "USD");
  assert.equal(p.product_id, "channel3:Lp8fQ2x"); assert.equal(p.brand, "Rain Design"); assert.equal(p.image, "https://cdn.example/a.png");
  assert.equal(p.best_offer!.domain, "amazon.com"); assert.equal(p.best_offer!.price, "39.00"); assert.equal(p.offers.length, 3);
  assert.equal(normalize(PRODUCTS.Lp8fQ2x, "USD", 3800).best_offer, null, "nothing in stock under 38.00");
  assert.equal(normalize(PRODUCTS.Lp8fQ2x, "EUR").best_offer, null);
});

test("mandateFit and spendCeiling are advisory pre-checks against the mandate", () => {
  const c = { currency: "USD", max_total: "100.00", max_per_transaction: "60.00", max_transactions: 3, require_human_approval_over: "40.00", allowed_categories: ["PHYSICAL_GOODS" as const] };
  assert.equal(spendCeiling(c, 0), 6000); assert.equal(spendCeiling(c, 7000), 3000);
  const offer = normalize(PRODUCTS.Lp8fQ2x, "USD").best_offer;
  assert.deepEqual([mandateFit(c, 0, 0, offer).fits, mandateFit(c, 0, 0, offer).needs_approval], [true, false]);
  assert.equal(mandateFit(c, 7000, 1, offer).fits, false);
  assert.equal(mandateFit(c, 0, 3, offer).fits, false);
  assert.equal(mandateFit({ ...c, require_human_approval_over: "30.00" }, 0, 0, offer).needs_approval, true);
  assert.equal(mandateFit({ ...c, allowed_categories: ["DIGITAL_GOODS"] }, 0, 0, offer).fits, false);
  assert.equal(mandateFit(c, 0, 0, null).fits, false);
});

test("Channel3Client: unconfigured fails closed with a clear message; a bad key never leaks upstream detail", async () => {
  const f = await fakeChannel3();
  try {
    await assert.rejects(new Channel3Client({ apiKey: "", baseUrl: f.url }).search({ query: "x" }), /CHANNEL3_API_KEY/);
    assert.equal(f.seen.length, 0);
    await assert.rejects(new Channel3Client({ apiKey: "wrong", baseUrl: f.url }).search({ query: "x" }), (e: any) => e.code === 502 && e.message === "Channel3 rejected the API key");
    await assert.rejects(new Channel3Client({ apiKey: "c3_test_key", baseUrl: f.url }).product("../etc"), /invalid product id/);
  } finally { f.close(); }
});

async function world(c3url: string, risk: "catalog" | "plain" = "catalog") {
  const sql = await testSql(); const store = new Store(sql); const rail = new OrderRail();
  const { passkeys, auths } = await enrol(store, ["u1"]);
  const c3 = new Channel3Client({ apiKey: "c3_test_key", baseUrl: c3url });
  const gw = new Gateway({ store, passkeys, rail, risk: risk === "catalog" ? new CompositeRiskAnalyzer(new HeuristicRiskAnalyzer(), new CatalogPriceAnalyzer(c3)) : new HeuristicRiskAnalyzer() });
  await gw.linkWallet("u1", "VAULT-1"); const agent = await gw.registerAgent("u1", "shopper");
  const d = await gw.draftMandate({ user_id: "u1", agent_id: "shopper", purpose: "Buy a laptop stand",
    constraints: { currency: "USD", max_total: "100.00", max_per_transaction: "80.00", max_transactions: 3, payee_allowlist: [MERCHANT.email_address], require_merchant_order: true } });
  await signer(gw, auths)(d.mandate.mandate_id, d.mandate_hash);
  return { sql, store, rail, gw, mid: d.mandate.mandate_id, agentKey: agent.api_key };
}
const stand = (unit: string) => [{ name: "Aluminium laptop stand", sku: "channel3:Lp8fQ2x", category: "PHYSICAL_GOODS", quantity: 1, unit }];

test("catalog price: PayPal order at market price is paid; overpriced vs Channel3 escalates to the user; outage never blocks", async () => {
  const f = await fakeChannel3();
  try {
    const w = await world(f.url);
    w.rail.orders.set("ORDEROK0001", order("ORDEROK0001", stand("41.00")));
    const ok = await w.gw.propose("shopper", { mandate_id: w.mid, agent_id: "shopper", idempotency_key: "k1", paypal_order_id: "ORDEROK0001" } as any);
    assert.equal(ok.status, "captured", JSON.stringify(ok));
    w.rail.orders.set("ORDERHIGH001", order("ORDERHIGH001", stand("59.00")));
    const high = await w.gw.propose("shopper", { mandate_id: w.mid, agent_id: "shopper", idempotency_key: "k2", paypal_order_id: "ORDERHIGH001" } as any);
    assert.equal(high.status, "needs_human");
    const ev = JSON.parse((await w.store.getPayment(high.payment_id))!.evaluation);
    assert.ok(ev.risk.some((r: any) => r.signal === "catalog_price_above_market" && /39\.00 at amazon\.com/.test(r.detail)), JSON.stringify(ev.risk));
    // The price came from PayPal's order, never from Channel3: the reference only escalated.
    assert.equal(ev.amount_minor, 5900);
    const down = await world("http://127.0.0.1:9");
    down.rail.orders.set("ORDERDOWN001", order("ORDERDOWN001", stand("41.00")));
    const r = await down.gw.propose("shopper", { mandate_id: down.mid, agent_id: "shopper", idempotency_key: "k3", paypal_order_id: "ORDERDOWN001" } as any);
    assert.equal(r.status, "captured");
    assert.ok(JSON.parse((await down.store.getPayment(r.payment_id))!.evaluation).risk.some((x: any) => x.signal === "catalog_unavailable" && x.severity === "low"));
  } finally { f.close(); }
});

test("agent route: search is bounded by the mandate's remaining budget, audited, and scoped to the agent's own mandate", async () => {
  const f = await fakeChannel3();
  const saved = { k: process.env.CHANNEL3_API_KEY, u: process.env.CHANNEL3_BASE_URL, r: process.env.AGENTGUARD_KEYRING_KEY, sk: process.env.AGENTGUARD_SIGNING_KEY };
  process.env.CHANNEL3_API_KEY = "c3_test_key"; process.env.CHANNEL3_BASE_URL = f.url; process.env.AGENTGUARD_ADMIN_TOKEN ??= "x".repeat(32);
  // On Postgres (CI) the app keeps its issuer keys in the database key ring, which needs a wrapping key.
  process.env.AGENTGUARD_KEYRING_KEY ??= "catalog-test-keyring-key-0123456789abcdef";
  process.env.AGENTGUARD_SIGNING_KEY ??= generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  let app: Awaited<ReturnType<typeof import("../src/app.ts")["createApp"]>> | undefined;
  let srv: ReturnType<typeof createServer> | undefined;
  try {
    const w = await world(f.url, "plain");
    const { createApp } = await import("../src/app.ts");
    const a = app = await createApp({ sql: w.sql, background: false });
    const s = srv = createServer((q, r) => void a.handler(q, r)).listen(0);
    await new Promise(ok => s.once("listening", ok));
    const base = `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
    const post = (path: string, key: string, body: unknown) => fetch(base + path, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify(body) });
    const r = await post("/v1/agent/products/search", w.agentKey, { mandate_id: w.mid, query: "laptop stand" });
    assert.equal(r.status, 200);
    const j = await r.json() as any;
    assert.equal(j.provider, "channel3"); assert.equal(j.max_price, "80.00"); assert.equal(j.currency, "USD");
    assert.deepEqual(j.products.map((p: any) => p.product_id), ["channel3:Lp8fQ2x"], "the 349.00 chair is over the 80.00 ceiling");
    assert.equal(j.products[0].mandate_fit.fits, true); assert.match(j.how_to_pay, /pay_paypal_order/);
    const call = f.seen.find(s => s.url === "/v1/search")!;
    assert.equal(call.key, "c3_test_key"); assert.equal(call.body.filters.price.max_price, 80); assert.equal(call.body.config.currency, "USD");
    assert.ok(await w.store.db.prepare("SELECT 1 FROM audit WHERE event='catalog.search' AND ref=?").get(w.mid));
    assert.equal((await w.store.verifyAuditChain()).ok, true);
    assert.equal((await post("/v1/agent/products/search", "ag_wrong", { mandate_id: w.mid, query: "x" })).status, 401);
    const other = await (await import("../src/gateway.ts")).Gateway.prototype.registerAgent.call({ store: w.store }, "u1", "other");
    assert.equal((await post("/v1/agent/products/search", other.api_key, { mandate_id: w.mid, query: "x" })).status, 404);
    assert.equal((await post("/v1/agent/products/search", w.agentKey, { mandate_id: w.mid, query: "" })).status, 400);
  } finally {
    srv?.close(); f.close(); await app?.close();
    if (saved.sk === undefined) delete process.env.AGENTGUARD_SIGNING_KEY; else process.env.AGENTGUARD_SIGNING_KEY = saved.sk;
    if (saved.r === undefined) delete process.env.AGENTGUARD_KEYRING_KEY; else process.env.AGENTGUARD_KEYRING_KEY = saved.r;
    if (saved.k === undefined) delete process.env.CHANNEL3_API_KEY; else process.env.CHANNEL3_API_KEY = saved.k;
    if (saved.u === undefined) delete process.env.CHANNEL3_BASE_URL; else process.env.CHANNEL3_BASE_URL = saved.u;
  }
});
