import { canonical, sha256, toMinor } from "./canonical.ts";

export interface Item { name: string; quantity: number; unit_amount: string; category: string; sku?: string }
export interface Facts { order_id: string; intent: string; payee: { merchant_id?: string; email_address?: string }; currency: string; amount_minor: number; items: Item[]; digest: string }

const CATS = ["PHYSICAL_GOODS", "DIGITAL_GOODS", "DONATION"];
const money = (m: any, cur: string, what: string): number => {
  if (!m) return 0;
  if (m.currency_code !== cur) throw new Error(`${what} currency ${m.currency_code} != ${cur}`);
  return toMinor(String(m.value));
};

/**
 * Independent re-derivation of what a PayPal order charges and for what. Mirrors AgentGuard's normalizer so the
 * digest it recorded can be recomputed here, but does not depend on AgentGuard code. Works on a snapshot taken
 * before authorization and on a later re-fetch (status/payments are ignored for the facts).
 */
export function orderFacts(o: any): Facts {
  if (!o || typeof o.id !== "string") throw new Error("not a PayPal order");
  const pus = o.purchase_units ?? [];
  if (pus.length !== 1) throw new Error(`order has ${pus.length} purchase units; exactly 1 supported`);
  const pu = pus[0]; const cur = pu.amount?.currency_code;
  if (!/^[A-Z]{3}$/.test(cur ?? "")) throw new Error("order has no currency");
  const total = money(pu.amount, cur, "amount");
  const payee = { merchant_id: pu.payee?.merchant_id || undefined, email_address: pu.payee?.email_address?.toLowerCase() || undefined };
  const items: Item[] = (pu.items ?? []).map((it: any) => {
    const q = Number(it.quantity);
    if (!Number.isInteger(q) || q < 1 || String(q) !== String(it.quantity)) throw new Error(`item ${it.name}: invalid quantity ${it.quantity}`);
    money(it.unit_amount, cur, `item ${it.name}`);
    return { name: String(it.name ?? ""), quantity: q, unit_amount: String(it.unit_amount.value),
      category: CATS.includes(it.category) ? it.category : "UNSPECIFIED", sku: it.sku ? String(it.sku) : undefined };
  });
  const b = pu.amount.breakdown ?? {};
  const itemSum = items.reduce((s, i) => s + toMinor(i.unit_amount) * i.quantity, 0);
  const itemTotal = b.item_total ? money(b.item_total, cur, "item_total") : -1;
  if (itemTotal !== itemSum) throw new Error(`item_total ${itemTotal} does not equal sum of items ${itemSum}`);
  const plus = ["tax_total", "shipping", "handling", "insurance"].reduce((s, k) => s + money(b[k], cur, k), 0);
  const minus = ["shipping_discount", "discount"].reduce((s, k) => s + money(b[k], cur, k), 0);
  if (itemTotal + plus - minus !== total) throw new Error(`breakdown does not add up to amount ${total}`);
  const digest = sha256(canonical({ id: o.id, intent: o.intent, payee, currency: cur, total, breakdown: b, items }));
  return { order_id: o.id, intent: o.intent, payee, currency: cur, amount_minor: total, items, digest };
}

/** The commercial substance two order views must agree on (ignores status and payments). */
export const substance = (f: Facts) => canonical({ id: f.order_id, payee: f.payee, currency: f.currency, amount_minor: f.amount_minor, items: f.items });
