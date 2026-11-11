/**
 * Product discovery through Channel3 (https://trychannel3.com), a catalog API for agentic commerce.
 *
 * Channel3 is DISCOVERY ONLY. It helps the agent find a real product that fits the user's mandate, and gives AgentGuard
 * an independent reference price. It never authorizes anything: the payment still goes through a merchant-created
 * PayPal order, and AgentGuard reads payee, amount and line items from PayPal (the source of truth) and checks them
 * against the passkey-signed mandate. The reference price can only escalate a payment to the user, never approve one.
 *
 * Env: CHANNEL3_API_KEY (free key at https://trychannel3.com/sign-up/developer; 1,000 searches/month), optional
 * CHANNEL3_BASE_URL (default https://api.trychannel3.com), AGENTGUARD_CATALOG_PRICE_TOLERANCE (default 0.10 = 10%).
 */
import type { Mandate, MandateConstraints, PaymentProposal, RiskSignal } from "./types.ts";
import type { RiskAnalyzer } from "./risk.ts";
import { toMinor, fromMinor } from "./canonical.ts";

export const CATALOG_SKU_PREFIX = "channel3:";

export interface CatalogOffer { domain: string; url: string; price: string; price_minor: number; currency: string; availability: string; condition: string | null }
export interface CatalogProduct {
  product_id: string;            // "channel3:<id>": put this in the PayPal order item's sku so the payment links back to the catalog
  channel3_id: string; title: string; brand: string | null; image: string | null; category: string | null;
  offers: CatalogOffer[]; best_offer: CatalogOffer | null;
}
export interface MandateFit { fits: boolean; needs_approval: boolean; checks: { check: string; pass: boolean; detail: string }[] }

export class CatalogError extends Error { code: number; constructor(code: number, msg: string) { super(msg); this.code = code; } }

export class Channel3Client {
  readonly baseUrl: string; private key: string; private timeoutMs: number;
  constructor(o: { apiKey?: string; baseUrl?: string; timeoutMs?: number } = {}) {
    this.key = o.apiKey ?? process.env.CHANNEL3_API_KEY ?? "";
    this.baseUrl = (o.baseUrl ?? process.env.CHANNEL3_BASE_URL ?? "https://api.trychannel3.com").replace(/\/$/, "");
    this.timeoutMs = o.timeoutMs ?? 8000;
  }
  get configured(): boolean { return this.key.length > 0; }

  private async call(method: string, path: string, body?: unknown): Promise<any> {
    if (!this.configured) throw new CatalogError(503, "product search is not configured on this deployment (set CHANNEL3_API_KEY)");
    let r: Response;
    try {
      r = await fetch(this.baseUrl + path, { method, signal: AbortSignal.timeout(this.timeoutMs),
        headers: { "x-api-key": this.key, "content-type": "application/json", accept: "application/json" }, body: body ? JSON.stringify(body) : undefined });
    } catch (e) { throw new CatalogError(502, `Channel3 unreachable: ${(e as Error).message}`); }
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      const detail = typeof j?.detail === "string" ? j.detail : Array.isArray(j?.detail) ? j.detail.map((d: any) => d.msg).join("; ") : r.statusText;
      // Never echo upstream auth details; they can describe the key.
      throw new CatalogError(r.status === 404 ? 404 : r.status === 402 || r.status === 429 ? 503 : 502,
        r.status === 401 || r.status === 403 ? "Channel3 rejected the API key" : `Channel3 ${r.status}: ${String(detail).slice(0, 200)}`);
    }
    return j;
  }

  /** POST /v1/search. Prices are filtered on Channel3's side and again here (an offer must be in range to be "best"). */
  async search(q: { query: string; limit?: number; max_price?: string; currency?: string; page_token?: string; user_id?: string }): Promise<{ products: CatalogProduct[]; next_page_token: string | null }> {
    const body: any = q.page_token ? { page_token: q.page_token } : {
      query: q.query, limit: Math.min(Math.max(q.limit ?? 8, 1), 30),
      filters: { availability: ["InStock"], ...(q.max_price ? { price: { max_price: toMinor(q.max_price) / 100 } } : {}) },
      ...(q.currency ? { config: { currency: q.currency } } : {}),
    };
    const j = await this.call("POST", "/v1/search", body);
    return { products: (j.products ?? []).map((p: any) => normalize(p, q.currency, q.max_price ? toMinor(q.max_price) : undefined)), next_page_token: j.next_page_token ?? null };
  }
  /** GET /v1/products/{id} (free on Channel3): current offers and prices for one product. */
  async product(id: string, currency?: string): Promise<CatalogProduct> {
    const raw = id.startsWith(CATALOG_SKU_PREFIX) ? id.slice(CATALOG_SKU_PREFIX.length) : id;
    if (!/^[\w-]{1,64}$/.test(raw)) throw new CatalogError(400, "invalid product id");
    return normalize(await this.call("GET", `/v1/products/${encodeURIComponent(raw)}`), currency);
  }
}

const money = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};

/** Channel3 product -> the small, stable shape AgentGuard hands to agents. */
export function normalize(p: any, currency?: string, maxMinor?: number): CatalogProduct {
  const offers: CatalogOffer[] = (Array.isArray(p?.offers) ? p.offers : []).map((o: any) => {
    const price = o?.price ?? {}; const minor = money(price.price ?? price.amount);
    return minor === null ? null : { domain: String(o.domain ?? ""), url: String(o.url ?? ""), price: fromMinor(minor), price_minor: minor,
      currency: String(price.currency ?? "USD").toUpperCase(), availability: String(o.availability ?? "InStock"), condition: o.condition ?? null };
  }).filter(Boolean) as CatalogOffer[];
  const eligible = offers.filter(o => o.availability === "InStock" && (!currency || o.currency === currency.toUpperCase()) && (maxMinor === undefined || o.price_minor <= maxMinor));
  const best = [...eligible].sort((a, b) => a.price_minor - b.price_minor)[0] ?? null;
  const img = (Array.isArray(p?.images) ? p.images : []);
  const main = img.find((i: any) => i?.is_main_image) ?? img[0];
  return { product_id: CATALOG_SKU_PREFIX + String(p?.id ?? ""), channel3_id: String(p?.id ?? ""), title: String(p?.title ?? "").slice(0, 300),
    brand: p?.brands?.[0]?.name ?? null, image: main?.cleaned_url ?? main?.url ?? null, category: p?.category?.title ?? p?.category?.slug ?? null, offers, best_offer: best };
}

/** The most a single payment under this mandate may cost right now: min(per-transaction cap, remaining budget). */
export function spendCeiling(c: MandateConstraints, spentMinor: number): number {
  const remaining = Math.max(0, toMinor(c.max_total) - spentMinor);
  return c.max_per_transaction ? Math.min(remaining, toMinor(c.max_per_transaction)) : remaining;
}

/** Advisory pre-check of a catalog offer against the mandate. The binding check runs later, on the PayPal order. */
export function mandateFit(c: MandateConstraints, spentMinor: number, txCount: number, offer: CatalogOffer | null): MandateFit {
  const checks: MandateFit["checks"] = [];
  const add = (check: string, pass: boolean, detail: string) => checks.push({ check, pass, detail });
  if (!offer) { add("offer", false, "no in-stock offer within the mandate's currency and price ceiling"); return { fits: false, needs_approval: false, checks }; }
  add("currency", offer.currency === c.currency, `${offer.currency} vs mandate ${c.currency}`);
  const ceiling = spendCeiling(c, spentMinor);
  add("amount", offer.price_minor <= ceiling, `${offer.price} ≤ ${fromMinor(ceiling)} available for one payment`);
  add("transactions", txCount < c.max_transactions, `${txCount} of ${c.max_transactions} payments used`);
  if (c.allowed_categories?.length) add("category", c.allowed_categories.includes("PHYSICAL_GOODS"), `catalog items are physical goods; mandate allows ${c.allowed_categories.join(", ")}`);
  const needs = !!c.require_human_approval_over && offer.price_minor > toMinor(c.require_human_approval_over);
  return { fits: checks.every(x => x.pass), needs_approval: needs, checks };
}

/**
 * Risk analyzer: for PayPal order line items whose sku is a Channel3 product id, compare PayPal's unit price with the
 * cheapest current Channel3 offer. Overpaying beyond the tolerance escalates to the user (medium). A Channel3 outage is
 * reported as low severity so discovery problems never block a payment the mandate allows.
 */
export class CatalogPriceAnalyzer implements RiskAnalyzer {
  private c3: Channel3Client; private tolerance: number;
  constructor(c3: Channel3Client, tolerance = Number(process.env.AGENTGUARD_CATALOG_PRICE_TOLERANCE ?? 0.10)) { this.c3 = c3; this.tolerance = tolerance; }
  async analyze(_m: Mandate, p: PaymentProposal): Promise<RiskSignal[]> {
    if (!this.c3.configured || p.facts_source !== "paypal_order") return [];
    const out: RiskSignal[] = [];
    for (const it of (p.items ?? []).filter(i => i.sku?.startsWith(CATALOG_SKU_PREFIX)).slice(0, 5)) {
      let prod: CatalogProduct;
      try { prod = await this.c3.product(it.sku!, p.currency); }
      catch (e) { out.push({ signal: "catalog_unavailable", severity: "low", detail: `could not read ${it.sku} from Channel3: ${(e as Error).message}`.slice(0, 300) }); continue; }
      const ref = prod.offers.filter(o => o.currency === p.currency && o.availability === "InStock" && (o.condition ?? "new") === "new").sort((a, b) => a.price_minor - b.price_minor)[0];
      if (!ref) { out.push({ signal: "catalog_no_reference", severity: "low", detail: `${it.sku} has no new, in-stock ${p.currency} offer on Channel3` }); continue; }
      const paid = toMinor(it.unit_amount);
      if (paid > Math.round(ref.price_minor * (1 + this.tolerance)))
        out.push({ signal: "catalog_price_above_market", severity: "medium",
          detail: `PayPal order prices "${it.name}" at ${it.unit_amount} ${p.currency}; Channel3 lists it new and in stock from ${ref.price} at ${ref.domain}` });
    }
    return out;
  }
}
