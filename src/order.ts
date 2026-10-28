import { canonical, sha256, toMinor } from "./canonical.ts";
import type { LineItem, PayPalCategory } from "./types.ts";

/**
 * Facts AgentGuard trusts about a payment, read from PayPal's own order record (GET /v2/checkout/orders/{id}),
 * never from the agent. The merchant creates the order; the agent only names its id.
 */
export interface OrderFacts {
  order_id: string;
  status: string;
  payee: { merchant_id?: string; email_address?: string };
  currency: string;
  amount_minor: number;          // purchase_units[0].amount.value: what the buyer is charged
  items: LineItem[];
  /** sha256 over everything the policy decision depended on. Re-checked right before authorize. */
  digest: string;
}

export class OrderError extends Error { constructor(msg: string) { super(msg); } }

const CATS = ["PHYSICAL_GOODS", "DIGITAL_GOODS", "DONATION"];
const money = (m: any, cur: string, what: string): number => {
  if (!m) return 0;
  if (m.currency_code !== cur) throw new OrderError(`${what} currency ${m.currency_code} != ${cur}`);
  try { return toMinor(String(m.value)); } catch { throw new OrderError(`${what} has invalid value ${m.value}`); }
};

/**
 * Pure normalizer. Fails closed on anything the policy can't reason about:
 * not exactly one purchase unit, intent other than AUTHORIZE (capture must stay behind our verify step),
 * a status we can't authorize, no payee, no items, or a breakdown that doesn't add up to the charged amount.
 */
export function orderFacts(o: any): OrderFacts {
  if (!o || typeof o.id !== "string") throw new OrderError("not a PayPal order");
  if (o.intent !== "AUTHORIZE") throw new OrderError(`order intent ${o.intent}; merchant must create it with intent AUTHORIZE`);
  if (!["CREATED", "APPROVED"].includes(o.status)) throw new OrderError(`order status ${o.status}; only CREATED or APPROVED orders can be paid`);
  const pus = o.purchase_units ?? [];
  if (pus.length !== 1) throw new OrderError(`order has ${pus.length} purchase units; exactly 1 supported`);
  const pu = pus[0];
  if (pu.payments?.authorizations?.length || pu.payments?.captures?.length) throw new OrderError("order already has payments");
  const cur = pu.amount?.currency_code;
  if (!/^[A-Z]{3}$/.test(cur ?? "")) throw new OrderError("order has no currency");
  const total = money(pu.amount, cur, "amount");
  const payee = { merchant_id: pu.payee?.merchant_id || undefined, email_address: pu.payee?.email_address?.toLowerCase() || undefined };
  if (!payee.merchant_id && !payee.email_address) throw new OrderError("order has no payee");
  const raw = pu.items ?? [];
  if (!raw.length) throw new OrderError("order has no line items; itemized orders are required");
  const items: LineItem[] = raw.map((it: any) => {
    const q = Number(it.quantity);
    if (!Number.isInteger(q) || q < 1 || String(q) !== String(it.quantity)) throw new OrderError(`item ${it.name}: invalid quantity ${it.quantity}`);
    money(it.unit_amount, cur, `item ${it.name}`);
    return { name: String(it.name ?? ""), quantity: q, unit_amount: String(it.unit_amount.value),
      category: (CATS.includes(it.category) ? it.category : "UNSPECIFIED") as PayPalCategory, sku: it.sku ? String(it.sku) : undefined };
  });
  const itemSum = items.reduce((s, i) => s + toMinor(i.unit_amount) * i.quantity, 0);
  const b = pu.amount.breakdown ?? {};
  const itemTotal = b.item_total ? money(b.item_total, cur, "item_total") : -1;
  if (itemTotal !== itemSum) throw new OrderError(`item_total ${itemTotal} does not equal sum of items ${itemSum}`);
  const plus = ["tax_total", "shipping", "handling", "insurance"].reduce((s, k) => s + money(b[k], cur, k), 0);
  const minus = ["shipping_discount", "discount"].reduce((s, k) => s + money(b[k], cur, k), 0);
  if (itemTotal + plus - minus !== total) throw new OrderError(`breakdown ${itemTotal}+${plus}-${minus} does not equal amount ${total}`);
  const digest = sha256(canonical({ id: o.id, intent: o.intent, payee, currency: cur, total, breakdown: b, items }));
  return { order_id: o.id, status: o.status, payee, currency: cur, amount_minor: total, items, digest };
}
