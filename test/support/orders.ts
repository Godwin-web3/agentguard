import { Store } from "../../src/store.ts";
import { Gateway } from "../../src/gateway.ts";
import { HeuristicRiskAnalyzer } from "../../src/risk.ts";
import { enrol, signer } from "./passkey.ts";
import type { PaymentRail, AuthorizeInput, AuthorizationState, AuthorizeResult } from "../../src/paypal.ts";
import type { MandateConstraints } from "../../src/types.ts";
export const MERCHANT = { merchant_id: "M32J3M4A7KASQ", email_address: "store@business.example.com" };
export function order(id: string, items: { name: string; sku?: string; category?: string; quantity: number; unit: string }[], extra: any = {}) {
  const sum = items.reduce((s, i) => s + Math.round(Number(i.unit) * 100) * i.quantity, 0);
  const v = (m: number) => ({ currency_code: "USD", value: (m / 100).toFixed(2) });
  const tax = extra.tax ?? 0;
  return { id, intent: extra.intent ?? "AUTHORIZE", status: "CREATED", purchase_units: [{ reference_id: "default", payee: extra.payee ?? MERCHANT,
    amount: { ...v(extra.total ?? sum + tax), breakdown: { item_total: v(sum), ...(tax ? { tax_total: v(tax) } : {}) } },
    items: items.map(i => ({ name: i.name, sku: i.sku, category: i.category, quantity: String(i.quantity), unit_amount: v(Math.round(Number(i.unit) * 100)) })) }] };
}

export class OrderRail implements PaymentRail {
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

export async function setup(c: Partial<MandateConstraints> = {}) {
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
export const pay = (mid: string, id: string, key = "k-" + id) => ({ mandate_id: mid, agent_id: "shopper", idempotency_key: key, paypal_order_id: id });
