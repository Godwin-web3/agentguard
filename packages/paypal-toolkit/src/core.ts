import { z } from "zod";

/** Where AgentGuard runs and which passkey-signed mandate this agent spends under. The mandate id is config, never a tool argument. */
export interface GuardConfig {
  /** AgentGuard base URL, e.g. https://guard.example.com */
  url: string;
  /** Agent API key issued by AgentGuard (POST /v1/agents). */
  apiKey: string;
  agentId: string;
  /** Mandate the user signed with their passkey. */
  mandateId: string;
  /** Optional fetch override (tests). */
  fetch?: typeof fetch;
}

/** Minimal shape of the toolkit's merchant-side PayPal client (`toolkit.client`). */
export interface MerchantClient { getBaseUrl(): string; getHeaders(): Promise<Record<string, string>> }

/** Tools that only read. Everything else not explicitly guarded is removed (fail-closed). */
export const READ_ONLY = new Set([
  "get_order", "list_invoices", "get_invoice", "search_invoicing", "get_recurring_series", "list_products", "show_product_details",
  "list_subscription_plans", "show_subscription_plan_details", "show_subscription_details", "get_shipment_tracking", "list_disputes",
  "get_dispute", "list_transactions", "get_refund", "get_merchant_insights",
]);
/** Toolkit tools whose behaviour the guard replaces. */
export const GUARDED = new Set(["create_order", "pay_order"]);
/** Extra tool exposed by the guard so the agent can follow a payment that is waiting for the owner. */
export const STATUS_TOOL = "get_payment_status";

export type ToolDisposition = "guarded" | "read_only" | "blocked";
export function disposition(method: string, allowReadOnly = true): ToolDisposition {
  if (GUARDED.has(method)) return "guarded";
  if (allowReadOnly && READ_ONLY.has(method)) return "read_only";
  return "blocked";
}

const ORDER_ID = /^[A-Z0-9]{17,32}$/;
const PAYMENT_ID = /^[A-Za-z0-9_-]{1,80}$/;
const money = z.number().nonnegative().finite();

/** Same fields as the toolkit's create_order, plus optional sku/category so mandates with SKU or category rules can be checked. */
export const createOrderSchema = z.object({
  currencyCode: z.enum(["USD"]).describe("Currency code of the amount."),
  items: z.array(z.object({
    name: z.string().min(1).max(127),
    quantity: z.number().int().positive().default(1),
    description: z.string().max(127).optional(),
    itemCost: money.describe("Unit price."),
    taxPercent: money.max(100).default(0),
    sku: z.string().max(127).optional(),
    category: z.enum(["DIGITAL_GOODS", "PHYSICAL_GOODS", "DONATION"]).optional(),
  })).min(1).max(50),
  discount: money.default(0).optional(),
  shippingCost: money.default(0).optional(),
});
export const payOrderSchema = z.object({
  id: z.string().regex(ORDER_ID, "Invalid PayPal Order ID").describe("The order id returned by create_order (or given by the merchant)."),
});
export const statusSchema = z.object({ payment_id: z.string().regex(PAYMENT_ID).describe("payment_id returned by pay_order") });

export const DESCRIPTIONS = {
  create_order: "Create a PayPal order (intent AUTHORIZE) for the given items. Moves no money. Pay it with pay_order.",
  pay_order: "Pay a PayPal order. Routed through AgentGuard: the user's passkey-signed mandate is checked against PayPal's own order record "
    + "(payee, amount, items) before any money moves. May return needs_human (owner approval) or reject with reasons.",
  [STATUS_TOOL]: "Check the status of an AgentGuard payment (e.g. one waiting for the owner's approval).",
};

const toMinor = (n: number) => Math.round(n * 100);
const fmt = (m: number) => (m / 100).toFixed(2);

/** Builds the PayPal order body. Amounts are computed in integer minor units so the breakdown always reconciles. */
export function buildOrder(input: z.input<typeof createOrderSchema>) {
  const p = createOrderSchema.parse(input); const cur = p.currencyCode;
  let itemTotal = 0, taxTotal = 0;
  const items = p.items.map(i => {
    const unit = toMinor(i.itemCost), tax = Math.round(unit * (i.taxPercent ?? 0) / 100);
    itemTotal += unit * i.quantity; taxTotal += tax * i.quantity;
    return { name: i.name, description: i.description, sku: i.sku, category: i.category, quantity: String(i.quantity),
      unit_amount: { currency_code: cur, value: fmt(unit) }, ...(tax ? { tax: { currency_code: cur, value: fmt(tax) } } : {}) };
  });
  const ship = toMinor(p.shippingCost ?? 0), disc = toMinor(p.discount ?? 0);
  const total = itemTotal + taxTotal + ship - disc;
  if (total <= 0) throw new Error("order total must be positive");
  const m = (v: number) => ({ currency_code: cur, value: fmt(v) });
  return { intent: "AUTHORIZE", purchase_units: [{ items, amount: { ...m(total), breakdown: {
    item_total: m(itemTotal), ...(taxTotal ? { tax_total: m(taxTotal) } : {}), ...(ship ? { shipping: m(ship) } : {}), ...(disc ? { discount: m(disc) } : {}) } } }] };
}

export class GuardError extends Error { status: number; body: unknown; constructor(status: number, msg: string, body?: unknown) { super(msg); this.status = status; this.body = body; } }

/** Framework-neutral guard. Each framework adapter maps its tool calls onto `handle`. */
export class PayPalGuard {
  readonly cfg: GuardConfig; private merchant?: MerchantClient; private f: typeof fetch;
  constructor(cfg: GuardConfig, merchant?: MerchantClient) {
    for (const k of ["url", "apiKey", "agentId", "mandateId"] as const) if (!cfg[k]) throw new Error(`AgentGuard config: ${k} is required`);
    this.cfg = { ...cfg, url: cfg.url.replace(/\/+$/, "") }; this.merchant = merchant; this.f = cfg.fetch ?? fetch;
  }

  private async ag(method: string, path: string, body?: unknown): Promise<any> {
    const r = await this.f(this.cfg.url + path, { method, headers: { authorization: `Bearer ${this.cfg.apiKey}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body) });
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) throw new GuardError(r.status, `AgentGuard ${r.status}: ${j?.error ?? r.statusText}`, j);
    return j;
  }

  /** Confirms the mandate exists and is active for this agent. Call at startup to fail early. */
  async mandate(): Promise<any> { return this.ag("GET", `/v1/agent/mandates/${encodeURIComponent(this.cfg.mandateId)}`); }

  /** create_order: creates an AUTHORIZE order with the merchant's credentials. No money moves; nothing is approved here. */
  async createOrder(args: unknown): Promise<{ order_id: string; status: string; total: string }> {
    if (!this.merchant) throw new GuardError(400, "create_order needs the merchant PayPal client (toolkit.client)");
    const body = buildOrder(args as any);
    const r = await this.f(`${this.merchant.getBaseUrl()}/v2/checkout/orders`, { method: "POST",
      headers: { ...(await this.merchant.getHeaders()), "content-type": "application/json", "PayPal-Request-Id": crypto.randomUUID() }, body: JSON.stringify(body) });
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) throw new GuardError(r.status, `PayPal create order failed (${r.status}): ${j?.name ?? ""} ${j?.message ?? ""}`.trim());
    return { order_id: j.id, status: j.status, total: body.purchase_units[0].amount.value };
  }

  /** pay_order: the only way money moves. AgentGuard reads PayPal's order, checks the signed mandate, then authorizes + captures. */
  async payOrder(args: unknown, context?: { source_url?: string; excerpt: string }[]): Promise<any> {
    const { id } = payOrderSchema.parse(args);
    const r = await this.ag("POST", "/v1/agent/payments", { mandate_id: this.cfg.mandateId, agent_id: this.cfg.agentId,
      idempotency_key: `paypal-order-${id}`, paypal_order_id: id, ...(context?.length ? { context } : {}) });
    return summarize(r);
  }

  async paymentStatus(args: unknown): Promise<any> {
    const { payment_id } = statusSchema.parse(args);
    return summarize(await this.ag("GET", `/v1/agent/payments/${encodeURIComponent(payment_id)}`));
  }

  /** Dispatch a toolkit-named tool call. Read-only calls go to `passthrough`; anything else is refused. */
  async handle(method: string, args: unknown, passthrough?: (m: string, a: unknown) => Promise<unknown>): Promise<unknown> {
    if (method === "create_order") return this.createOrder(args);
    if (method === "pay_order") return this.payOrder(args);
    if (method === STATUS_TOOL) return this.paymentStatus(args);
    if (READ_ONLY.has(method) && passthrough) return passthrough(method, args);
    throw new GuardError(403, `${method} is blocked by AgentGuard: only read-only PayPal tools, create_order and pay_order (via AgentGuard) are allowed`);
  }
}

function summarize(r: any) {
  const failed = (r?.evaluation?.checks ?? []).filter((c: any) => !c.pass).map((c: any) => `${c.check}: ${c.detail ?? ""}`.trim());
  return { payment_id: r.payment_id, decision: r.decision, status: r.status,
    reasons: r?.evaluation?.reasons?.length ? r.evaluation.reasons : failed, approval_id: r.approval_id ?? null,
    paypal: r.paypal ?? null, error: r.error ?? null,
    next: r.status === "needs_human" ? "Waiting for the owner to approve. Check later with get_payment_status." : undefined };
}
