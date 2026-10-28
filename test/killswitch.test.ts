import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { order, setup, pay, approver } from "./support/orders.ts";
import { lazyPayPalRail } from "../src/paypal.ts";

const item = [{ name: "Laptop stand", sku: "STAND-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "30.00" }];

test("operator pause blocks all new payments and approvals; resume restores; both audited", async () => {
  const { gw, rail, store, mid, auths } = await setup({ require_human_approval_over: "50.00" });
  rail.orders.set("ORDERBIG001", order("ORDERBIG001", [{ ...item[0], unit: "60.00" }]));
  const held = await gw.propose("shopper", pay(mid, "ORDERBIG001") as any);
  assert.equal(held.status, "needs_human");
  gw.pause("incident #1", "ops");
  assert.equal(gw.pauseState().paused, true);
  rail.orders.set("ORDERP00001", order("ORDERP00001", item));
  await assert.rejects(gw.propose("shopper", pay(mid, "ORDERP00001") as any), (e: any) => e.code === 503 && /paused by operator: incident #1/.test(e.message));
  await assert.rejects(approver(gw, auths, held.approval_id!, true, "owner"), /paused/);
  assert.ok(!rail.calls.some(c => c.startsWith("authorizeOrder") || c.startsWith("capture")), "no money moved while paused");
  gw.resume("ops");
  const r = await gw.propose("shopper", pay(mid, "ORDERP00001") as any);
  assert.equal(r.status, "captured");
  const ev = store.auditLog(500).map((a: any) => a.event);
  assert.ok(ev.includes("operator.pause") && ev.includes("operator.resume"));
});

test("server wires every PaymentRail method, including merchant-order calls", () => {
  const made: string[] = [];
  const fake: any = new Proxy({}, { get: (_t, k) => (...a: any[]) => { made.push(String(k)); return Promise.resolve(a); } });
  const rail = lazyPayPalRail(() => fake);
  for (const m of ["authorize", "capture", "void", "getAuthorization", "getOrder", "authorizeOrder"]) {
    assert.equal(typeof (rail as any)[m], "function", m); (rail as any)[m]("X", "Y", "Z");
  }
  assert.deepEqual(made, ["authorize", "capture", "void", "getAuthorization", "getOrder", "authorizeOrder"]);
  const src = readFileSync(new URL("../src/server.ts", import.meta.url), "utf8");
  assert.match(src, /const rail: PaymentRail = lazyPayPalRail\(pp\)/, "server must use the full rail");
});
