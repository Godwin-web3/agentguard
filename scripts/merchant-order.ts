/**
 * Plays the MERCHANT: creates a PayPal order (intent AUTHORIZE, no payment source) with the merchant's own app
 * credentials (PAYPAL_CLIENT_ID/SECRET from the environment) and prints only the order id.
 *   node --experimental-strip-types scripts/merchant-order.ts '<items json>' [tax]
 * items: [{"name":"API credits","sku":"AG-CREDITS-10","category":"DIGITAL_GOODS","quantity":1,"unit_amount":"10.00"}]
 */
import { PayPalClient } from "../src/paypal.ts";
import { toMinor, fromMinor } from "../src/canonical.ts";
const items = JSON.parse(process.argv[2]); const tax = process.argv[3] ? toMinor(process.argv[3]) : 0;
const cur = "USD", sum = items.reduce((s: number, i: any) => s + toMinor(i.unit_amount) * i.quantity, 0);
const m = (v: number) => ({ currency_code: cur, value: fromMinor(v) });
const o = await new PayPalClient().call("POST", "/v2/checkout/orders", { intent: "AUTHORIZE", purchase_units: [{
  amount: { ...m(sum + tax), breakdown: { item_total: m(sum), ...(tax ? { tax_total: m(tax) } : {}) } },
  items: items.map((i: any) => ({ name: i.name, sku: i.sku, category: i.category, quantity: String(i.quantity), unit_amount: { currency_code: cur, value: i.unit_amount } })) }] },
  { "PayPal-Request-Id": crypto.randomUUID() });
console.log(o.id);
