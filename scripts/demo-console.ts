/**
 * DEV ONLY. Local console with realistic seeded data (no PayPal, no secrets): a passkey-signed mandate, captured
 * merchant-order payments with signed receipts, a rejection, a held payment and the hash-chained audit ledger.
 * Used for screenshots and for trying the AG Grid views without a sandbox account.
 *
 *   node --experimental-strip-types --no-warnings scripts/demo-console.ts      # then open http://localhost:8787/console
 * Env: PORT (8787), AGENTGUARD_ADMIN_TOKEN (default: a fixed local-only demo token printed at start), CHANNEL3_API_KEY
 * (optional: real Channel3 product search in the console; without it the Product search view says it is not configured).
 */
import { createServer } from "node:http";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SqliteSql } from "../src/db.ts";
import { Store } from "../src/store.ts";
import { KeyRing } from "../src/keys.ts";
import { ReceiptService } from "../src/receipt.ts";
import { Gateway } from "../src/gateway.ts";
import { HeuristicRiskAnalyzer } from "../src/risk.ts";
import { enrol, signer } from "../test/support/passkey.ts";
import { OrderRail, order, MERCHANT } from "../test/support/orders.ts";

const dir = mkdtempSync(join(tmpdir(), "ag-demo-"));
process.env.AGENTGUARD_ADMIN_TOKEN ??= "ag_admin_local_demo_only_0000000000";
process.env.AGENTGUARD_KEYRING_FILE = join(dir, "issuer-keys.json");
process.env.AGENTGUARD_TSA_URLS = "";
process.env.AGENTGUARD_PUBLIC_URL ??= "http://localhost:8787";
const sql = SqliteSql.openSync(join(dir, "demo.db"));
const store = new Store(sql);
const keys = KeyRing.load();
const { passkeys, auths } = await enrol(store, ["demo-user"]);
const receipts = new ReceiptService({ store, signer: keys, passkeys, issuer: "localhost:8787" });
const rail = new OrderRail();
const gw = new Gateway({ store, passkeys, risk: new HeuristicRiskAnalyzer(), rail, receipts });
await gw.linkWallet("demo-user", "VAULT-DEMO"); await gw.registerAgent("demo-user", "shopper");
const d = await gw.draftMandate({ user_id: "demo-user", agent_id: "shopper", purpose: "Buy a laptop stand, a 65W USB-C charger and a USB-C cable for the home office",
  constraints: { currency: "USD", max_total: "250.00", max_transactions: 6, payee_allowlist: [MERCHANT.email_address], require_merchant_order: true,
    allowed_categories: ["PHYSICAL_GOODS"], max_quantity_per_item: 2, require_human_approval_over: "90.00" } });
await signer(gw, auths)(d.mandate.mandate_id, d.mandate_hash);
const mid = d.mandate.mandate_id;
const orders: [string, any[], any?][] = [
  ["7XK21934BD551204R", [{ name: "Aluminium laptop stand", sku: "STAND-ALU-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "39.00" }], { tax: 300 }],
  ["2HW88310JS0174523", [{ name: "Anker 65W USB-C charger", sku: "CHG-65W-C", category: "PHYSICAL_GOODS", quantity: 1, unit: "35.99" }]],
  ["5TY40012MV9930118", [{ name: "USB-C to USB-C cable 2m", sku: "CBL-USBC-2M", category: "PHYSICAL_GOODS", quantity: 2, unit: "12.49" }]],
  ["9PL55027KC4419620", [{ name: "Steam gift card", sku: "GIFT-50", category: "DIGITAL_GOODS", quantity: 1, unit: "50.00" }]],
  ["3RD71128WW2207741", [{ name: "Ergonomic office chair", sku: "CHAIR-ERGO-1", category: "PHYSICAL_GOODS", quantity: 1, unit: "119.00" }]],
];
for (const [id, items, extra] of orders) {
  rail.orders.set(id, order(id, items, extra));
  await gw.propose("shopper", { mandate_id: mid, agent_id: "shopper", idempotency_key: "k-" + id, paypal_order_id: id } as any).catch(e => console.log("propose:", e.message));
}
const { createApp } = await import("../src/app.ts");
const app = await createApp({ sql });
const PORT = Number(process.env.PORT ?? 8787);
createServer((rq, res) => void app.handler(rq, res)).listen(PORT, () =>
  console.log(`demo console: http://localhost:${PORT}/console  (local demo admin token: ${process.env.AGENTGUARD_ADMIN_TOKEN})`));
