import { fromMinor } from "./canonical.ts";
import type { LineItem } from "./types.ts";

/**
 * Minimal PayPal REST client for the agent-payment path:
 *   Vault (one-time buyer consent) -> Orders v2 intent=AUTHORIZE with vault_id -> verify -> capture or void.
 * Only AgentGuard holds these credentials; agents never do.
 */
export interface PaymentRail {
  authorize(input: AuthorizeInput): Promise<AuthorizeResult>;
  capture(authorizationId: string, requestId: string, opts?: CaptureOptions): Promise<{ capture_id: string; status: string }>;
  void(authorizationId: string): Promise<void>;
  /** Current state of an authorization. Used by recovery after process death between authorize and capture. */
  getAuthorization(authorizationId: string): Promise<AuthorizationState>;
  /** Raw PayPal order (GET /v2/checkout/orders/{id}): the source of truth for merchant-created orders. */
  getOrder?(orderId: string): Promise<any>;
  /** Authorize a merchant-created order with the user's vaulted wallet. */
  authorizeOrder?(orderId: string, vaultId: string, requestId: string): Promise<AuthorizeResult>;
}

/** Optional references PayPal stores on the capture (invoice_id must be unique per merchant account). */
export interface CaptureOptions { invoice_id?: string; note_to_payer?: string }

export interface AuthorizationState {
  status: string;                 // CREATED | CAPTURED | VOIDED | EXPIRED | DENIED | ...
  amountMinor?: number;
  currency?: string;
  capture_id?: string;
}

export interface AuthorizeInput {
  requestId: string;             // PayPal-Request-Id: makes the create call idempotent on PayPal's side too
  referenceId: string;           // our payment_id
  vaultId: string;               // user's vaulted PayPal payment token
  currency: string;
  amountMinor: number;
  items: LineItem[];
  payee: { merchant_id?: string; email_address?: string };
  description?: string;
}
export interface AuthorizeResult {
  order_id: string; authorization_id: string; status: string;
  /** What PayPal says it will charge — verified against the proposal before capture. */
  observed: { currency: string; amountMinor: number; payee: { merchant_id?: string; email_address?: string } };
}

export class PayPalClient implements PaymentRail {
  private base: string; private id: string; private secret: string;
  private token?: { value: string; exp: number };
  constructor(opts = {
    base: process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com",
    clientId: process.env.PAYPAL_CLIENT_ID ?? "", clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
  }) {
    this.base = opts.base; this.id = opts.clientId; this.secret = opts.clientSecret;
    if (!this.id || !this.secret) throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are required");
  }

  private async accessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.exp) return this.token.value;
    const r = await fetch(`${this.base}/v1/oauth2/token`, { method: "POST",
      headers: { authorization: "Basic " + Buffer.from(`${this.id}:${this.secret}`).toString("base64"), "content-type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials" });
    if (!r.ok) throw new Error(`PayPal auth failed: ${r.status} ${await r.text()}`);
    const j: any = await r.json();
    this.token = { value: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
    return this.token.value;
  }

  async call(method: string, path: string, body?: unknown, headers: Record<string, string> = {}): Promise<any> {
    const r = await fetch(`${this.base}${path}`, { method, headers: {
      authorization: `Bearer ${await this.accessToken()}`, "content-type": "application/json", prefer: "return=representation", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await r.text();
    const json = text ? JSON.parse(text) : {};
    if (!r.ok) { const err: any = new Error(`PayPal ${method} ${path} -> ${r.status}: ${json.name ?? ""} ${json.message ?? text}`); err.paypal = json; err.status = r.status; throw err; }
    return json;
  }

  // ---- Vault onboarding (buyer consents once; AgentGuard stores the vault id, the agent never sees it) ----
  async createSetupToken(returnUrl: string, cancelUrl: string): Promise<{ id: string; approve_url: string }> {
    const j = await this.call("POST", "/v3/vault/setup-tokens", { payment_source: { paypal: {
      usage_type: "MERCHANT", customer_type: "CONSUMER", permit_multiple_payment_tokens: false,
      experience_context: { return_url: returnUrl, cancel_url: cancelUrl, brand_name: "AgentGuard", shipping_preference: "NO_SHIPPING" } } } },
      { "PayPal-Request-Id": crypto.randomUUID() });
    return { id: j.id, approve_url: j.links.find((l: any) => l.rel === "approve")?.href };
  }
  async createPaymentToken(setupTokenId: string): Promise<{ vault_id: string; customer_id: string; payer_email?: string }> {
    const j = await this.call("POST", "/v3/vault/payment-tokens", { payment_source: { token: { id: setupTokenId, type: "SETUP_TOKEN" } } },
      { "PayPal-Request-Id": crypto.randomUUID() });
    return { vault_id: j.id, customer_id: j.customer?.id, payer_email: j.payment_source?.paypal?.email_address };
  }

  // ---- Payment path ----
  async authorize(i: AuthorizeInput): Promise<AuthorizeResult> {
    const value = fromMinor(i.amountMinor);
    let order = await this.call("POST", "/v2/checkout/orders", {
      intent: "AUTHORIZE",
      payment_source: { paypal: { vault_id: i.vaultId } },
      purchase_units: [{
        reference_id: i.referenceId, description: i.description?.slice(0, 127),
        payee: i.payee.merchant_id ? { merchant_id: i.payee.merchant_id } : i.payee.email_address ? { email_address: i.payee.email_address } : undefined,
        amount: { currency_code: i.currency, value, breakdown: { item_total: { currency_code: i.currency, value } } },
        items: i.items.map(it => ({ name: it.name.slice(0, 127), quantity: String(it.quantity), sku: it.sku,
          unit_amount: { currency_code: i.currency, value: it.unit_amount }, category: it.category })),
      }],
    }, { "PayPal-Request-Id": i.requestId });
    // With a vaulted PayPal wallet the order is usually authorized on create; otherwise authorize explicitly.
    if (order.status !== "COMPLETED") order = await this.call("POST", `/v2/checkout/orders/${order.id}/authorize`, {}, { "PayPal-Request-Id": `${i.requestId}-auth` });
    return observedFrom(order);
  }
  async getOrder(orderId: string) {
    if (!/^[A-Z0-9]{8,32}$/.test(orderId)) throw Object.assign(new Error("invalid PayPal order id"), { status: 400 });
    return this.call("GET", `/v2/checkout/orders/${orderId}`);
  }
  async authorizeOrder(orderId: string, vaultId: string, requestId: string): Promise<AuthorizeResult> {
    if (!/^[A-Z0-9]{8,32}$/.test(orderId)) throw new Error("invalid PayPal order id");
    const order = await this.call("POST", `/v2/checkout/orders/${orderId}/authorize`, { payment_source: { paypal: { vault_id: vaultId } } },
      { "PayPal-Request-Id": requestId });
    return observedFrom(order);
  }
  async capture(authorizationId: string, requestId: string, opts?: CaptureOptions) {
    const j = await this.call("POST", `/v2/payments/authorizations/${authorizationId}/capture`, { final_capture: true, ...opts }, { "PayPal-Request-Id": requestId });
    return { capture_id: j.id, status: j.status };
  }
  async void(authorizationId: string) { await this.call("POST", `/v2/payments/authorizations/${authorizationId}/void`); }
  async getAuthorization(authorizationId: string): Promise<AuthorizationState> {
    const j = await this.call("GET", `/v2/payments/authorizations/${authorizationId}`);
    const [w, f = "0"] = String(j.amount?.value ?? "0").split(".");
    return {
      status: j.status,
      amountMinor: Number(w) * 100 + Number((f + "00").slice(0, 2)),
      currency: j.amount?.currency_code,
      capture_id: j.links?.find((l: any) => l.rel === "capture")?.href?.split("/").pop(),
    };
  }
}

/** What PayPal says it will charge on an authorized order. */
function observedFrom(order: any): AuthorizeResult {
  const pu = order.purchase_units?.[0] ?? {};
    const auth = pu.payments?.authorizations?.[0];
    if (!auth) throw new Error(`PayPal returned no authorization (order ${order.id}, status ${order.status})`);
    const [w, f = "0"] = String(auth.amount?.value ?? pu.amount?.value ?? "0").split(".");
    return { order_id: order.id, authorization_id: auth.id, status: auth.status,
      observed: { currency: auth.amount?.currency_code ?? pu.amount?.currency_code,
        amountMinor: Number(w) * 100 + Number((f + "00").slice(0, 2)), payee: { merchant_id: pu.payee?.merchant_id, email_address: pu.payee?.email_address } } };
}

/** The rail the server uses: every PaymentRail method (incl. merchant-order calls) bound to a lazily created PayPalClient. */
export function lazyPayPalRail(make: () => PayPalClient = () => new PayPalClient()): Required<PaymentRail> {
  let c: PayPalClient | null = null; const pp = () => (c ??= make());
  return {
    authorize: i => pp().authorize(i), capture: (a, r, o) => pp().capture(a, r, o), void: a => pp().void(a),
    getAuthorization: a => pp().getAuthorization(a), getOrder: id => pp().getOrder(id),
    authorizeOrder: (id, v, r) => pp().authorizeOrder(id, v, r),
  };
}
