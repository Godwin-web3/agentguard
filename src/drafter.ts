import { toMinor, fromMinor } from "./canonical.ts";
import type { MandateConstraints, PayPalCategory } from "./types.ts";

/**
 * Natural-language mandate drafting.
 *
 * The AI only PROPOSES. Three rules keep it from widening authority:
 *  1. Output is a draft; nothing is active until the owner confirms the exact mandate hash.
 *  2. A deterministic rules parser reads the same text. Where both produce a limit, the TIGHTER one wins,
 *     and any disagreement is surfaced as a warning.
 *  3. The plain-English summary the owner reviews is rendered from the final constraints by code,
 *     never written by the model, so a model can't describe one mandate while emitting another.
 */
export interface MandateDraft {
  purpose: string;
  constraints: MandateConstraints;
  ttl_minutes: number;
  summary: string[];
  warnings: string[];
  source: "rules" | "rules+llm";
}

export interface LLMConfig { baseUrl: string; apiKey: string; model: string }

const CATS: Record<string, PayPalCategory> = { physical: "PHYSICAL_GOODS", digital: "DIGITAL_GOODS", donation: "DONATION" };
const CUR: Record<string, string> = { "$": "USD", "€": "EUR", "£": "GBP", usd: "USD", eur: "EUR", gbp: "GBP", dollars: "USD", euros: "EUR", pounds: "GBP" };
const NUM_WORDS: Record<string, number> = { one: 1, once: 1, single: 1, a: 1, an: 1, two: 2, twice: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const MAX_TTL_MIN = 30 * 24 * 60;

const money = String.raw`(\$|€|£)?\s?(\d{1,9}(?:[.,]\d{1,2})?)(?!\d|[.,]\d)\s?(usd|eur|gbp|dollars|euros|pounds)?`;
const amt = (s: string) => fromMinor(toMinor(s.replace(",", ".")));
const n = (s: string) => NUM_WORDS[s.toLowerCase()] ?? Number(s);

/** Deterministic parse. Conservative: anything it can't read stays unset and the drafter fills tight defaults. */
export function parseRules(text: string): { c: Partial<MandateConstraints>; ttl?: number; currency?: string } {
  const t = text.toLowerCase();
  const c: Partial<MandateConstraints> = {};
  let currency: string | undefined;
  const cm = t.match(new RegExp(money, "i"));
  if (cm) currency = CUR[cm[1] ?? ""] ?? CUR[cm[3] ?? ""];

  const total = t.match(new RegExp(String.raw`(?:under|below|less than|up to|max(?:imum)?|no more than|at most|budget(?: of)?|total(?: of)?|spend(?:ing)?(?: up to)?|cap(?: of)?)\s+(?:a total of\s+)?` + money + String.raw`(?!\s*(?:each|per|a piece|apiece))`, "i"));
  if (total) c.max_total = amt(total[2]);
  const per = t.match(new RegExp(money + String.raw`\s*(?:each|per (?:item|purchase|transaction|order|payment)|a piece|apiece)`, "i"))
    ?? t.match(new RegExp(String.raw`(?:each|per (?:item|purchase|transaction|order|payment))\s+(?:under|below|up to|max|at most|no more than)?\s*` + money, "i"));
  if (per) c.max_per_transaction = amt(per[2]);
  const ask = t.match(new RegExp(String.raw`(?:ask|check with|confirm with|approval|approve)[^.]*?(?:over|above|more than|exceeding)\s+` + money, "i"));
  if (ask) c.require_human_approval_over = amt(ask[2]);
  if (!c.max_total && !c.max_per_transaction) {
    // A bare amount with an explicit currency ("donate 25 euros") is read as the total cap.
    const bare = [...t.matchAll(new RegExp(money, "gi"))].filter(m => m[1] || m[3]).filter(m => !ask || m.index !== ask.index + ask[0].length - m[0].length);
    if (bare.length === 1) c.max_total = amt(bare[0][2]);
  }

  const cnt = t.match(/\b(\d{1,3}|one|a|an|single|two|three|four|five|six|seven|eight|nine|ten)\s+(?:purchases?|payments?|orders?|transactions?|times?)\b/i)
    ?? t.match(/\b(once|twice)\b/i);
  if (cnt) c.max_transactions = n(cnt[1]);
  else if (/\b(?:buy|order|purchase|get|book|pay for)\s+(?:one|a|an|single)\b/i.test(t)) c.max_transactions = 1;

  const qty = t.match(/\b(?:no more than|max(?:imum)?|at most|up to)\s+(\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:of each|per item|units?|copies|of any item)/i);
  if (qty) c.max_quantity_per_item = n(qty[1]);
  else if (/\b(?:buy|order|purchase|get)\s+(?:one|a|an|single)\b/i.test(t)) c.max_quantity_per_item = 1;

  const cats = new Set<PayPalCategory>();
  for (const [k, v] of Object.entries(CATS)) if (new RegExp(String.raw`\b${k}\b`, "i").test(t)) cats.add(v);
  if (/\b(?:software|subscription|api credits?|e-?books?|licen[cs]e|saas|download)/i.test(t)) cats.add("DIGITAL_GOODS");
  if (/\b(?:laptop|phone|shoes|book(?!ing)|groceries|hardware|monitor|keyboard|furniture)/i.test(t)) cats.add("PHYSICAL_GOODS");
  if (/\bdonat/i.test(t)) cats.add("DONATION");
  if (cats.size) c.allowed_categories = [...cats];

  const emails = [...t.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)].map(m => m[0]);
  const neverIdx = t.search(/\b(?:never|not|don't|do not|block|except)\b[^.]*@/);
  if (emails.length) {
    const blocked = neverIdx >= 0 ? emails.filter(e => t.indexOf(e) > neverIdx) : [];
    const allowed = emails.filter(e => !blocked.includes(e));
    if (allowed.length) c.payee_allowlist = allowed;
    if (blocked.length) c.payee_blocklist = blocked;
  }

  let ttl: number | undefined;
  const d = t.match(/\b(?:for|within|in the next|next|valid for|expires? in)\s+(\d{1,3}|one|two|three|four|five|six|seven|ten|a|an)\s+(minutes?|hours?|days?|weeks?)\b/i);
  if (d) ttl = n(d[1]) * ({ minute: 1, hour: 60, day: 1440, week: 10080 } as any)[d[2].replace(/s$/, "")];
  else if (/\btoday\b/.test(t)) ttl = 12 * 60;
  else if (/\bthis week\b/.test(t)) ttl = 7 * 1440;
  return { c, ttl, currency };
}

async function llmPropose(text: string, cfg: LLMConfig): Promise<any | null> {
  const sys = `Convert a user's spending instruction for an AI agent into JSON with keys: purpose (string), currency (ISO 4217),
max_total, max_per_transaction, require_human_approval_over (decimal strings like "120.00" or null), max_transactions (int),
max_quantity_per_item (int or null), allowed_categories (subset of PHYSICAL_GOODS, DIGITAL_GOODS, DONATION), payee_allowlist,
payee_blocklist (emails or PayPal merchant ids), ttl_minutes (int). Never invent limits looser than the user stated. Reply with JSON only.`;
  try {
    const r = await fetch(`${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`, { method: "POST", signal: AbortSignal.timeout(15000),
      headers: { authorization: `Bearer ${cfg.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: cfg.model, temperature: 0, response_format: { type: "json_object" },
        messages: [{ role: "system", content: sys }, { role: "user", content: text.slice(0, 2000) }] }) });
    if (!r.ok) return null;
    const j: any = await r.json();
    return JSON.parse(j.choices?.[0]?.message?.content ?? "null");
  } catch { return null; }
}

const tighterAmt = (a?: string, b?: string) => !a ? b : !b ? a : toMinor(a) <= toMinor(b) ? a : b;
const tighterInt = (a?: number, b?: number) => a == null ? b : b == null ? a : Math.min(a, b);
const validAmt = (v: unknown) => { try { return typeof v === "string" && toMinor(v) > 0 ? fromMinor(toMinor(v)) : undefined; } catch { return undefined; } };
const validInt = (v: unknown, max: number) => Number.isInteger(v) && (v as number) > 0 ? Math.min(v as number, max) : undefined;

export async function draftFromText(text: string, llm?: LLMConfig): Promise<MandateDraft> {
  if (!text || text.trim().length < 5) throw new Error("describe what the agent may buy");
  const warnings: string[] = [];
  const r = parseRules(text);
  let c: Partial<MandateConstraints> = { ...r.c };
  let currency = r.currency, ttl = r.ttl, purpose = text.trim().slice(0, 500), source: MandateDraft["source"] = "rules";

  const m = llm ? await llmPropose(text, llm) : null;
  if (llm && !m) warnings.push("AI drafting unavailable; used the rules parser only.");
  if (m) {
    source = "rules+llm";
    const mc: Partial<MandateConstraints> = {
      max_total: validAmt(m.max_total), max_per_transaction: validAmt(m.max_per_transaction),
      require_human_approval_over: validAmt(m.require_human_approval_over),
      max_transactions: validInt(m.max_transactions, 100), max_quantity_per_item: validInt(m.max_quantity_per_item, 1000),
      allowed_categories: Array.isArray(m.allowed_categories) ? m.allowed_categories.filter((x: any) => Object.values(CATS).includes(x)) : undefined,
      payee_allowlist: Array.isArray(m.payee_allowlist) ? m.payee_allowlist.filter((x: any) => typeof x === "string").slice(0, 20) : undefined,
      payee_blocklist: Array.isArray(m.payee_blocklist) ? m.payee_blocklist.filter((x: any) => typeof x === "string").slice(0, 50) : undefined,
    };
    for (const k of ["max_total", "max_per_transaction", "require_human_approval_over"] as const) {
      if (c[k] && mc[k] && c[k] !== mc[k]) warnings.push(`AI read ${k} as ${mc[k]} but the text says ${c[k]}; kept the lower.`);
      c[k] = tighterAmt(c[k], mc[k]);
    }
    for (const k of ["max_transactions", "max_quantity_per_item"] as const) c[k] = tighterInt(c[k], mc[k]);
    // Allowlists only narrow: if both name payees, keep the intersection; never add payees the text didn't mention.
    if (mc.payee_allowlist?.length) {
      const inText = mc.payee_allowlist.filter(p => text.toLowerCase().includes(p.toLowerCase()));
      if (inText.length < mc.payee_allowlist.length) warnings.push("Ignored AI-suggested payees that aren't in your text.");
      if (inText.length) c.payee_allowlist = c.payee_allowlist ? c.payee_allowlist.filter(p => inText.includes(p)) : inText;
    }
    c.payee_blocklist = [...new Set([...(c.payee_blocklist ?? []), ...(mc.payee_blocklist ?? [])])];
    if (!c.allowed_categories?.length && mc.allowed_categories?.length) c.allowed_categories = mc.allowed_categories;
    if (!currency && typeof m.currency === "string" && /^[A-Z]{3}$/.test(m.currency)) currency = m.currency;
    if (validInt(m.ttl_minutes, MAX_TTL_MIN)) ttl = ttl ? Math.min(ttl, m.ttl_minutes) : m.ttl_minutes;
    if (typeof m.purpose === "string" && m.purpose.trim()) purpose = m.purpose.trim().slice(0, 500);
  }

  // Tight defaults for anything still unset.
  if (!currency) { currency = "USD"; warnings.push("No currency given; assumed USD."); }
  if (!c.max_total) {
    if (c.max_per_transaction) c.max_total = fromMinor(toMinor(c.max_per_transaction) * (c.max_transactions ?? 1));
    else throw new Error("say how much the agent may spend, e.g. \"up to $50\"");
  }
  if (!c.max_transactions) { c.max_transactions = 1; warnings.push("No purchase count given; limited to 1 payment."); }
  if (c.max_per_transaction && toMinor(c.max_per_transaction) > toMinor(c.max_total)) c.max_per_transaction = c.max_total;
  if (!c.allowed_categories?.length) warnings.push("No category detected; any PayPal item category is allowed.");
  if (!c.payee_allowlist?.length) warnings.push("No payee named; the agent may pay any merchant not blocked.");
  if (!ttl) { ttl = 60; warnings.push("No time window given; expires in 60 minutes."); }
  ttl = Math.min(ttl, MAX_TTL_MIN);
  if (!c.payee_blocklist?.length) delete c.payee_blocklist;

  const constraints: MandateConstraints = {
    currency, max_total: c.max_total!, max_transactions: c.max_transactions!,
    ...(c.max_per_transaction && { max_per_transaction: c.max_per_transaction }),
    ...(c.allowed_categories?.length && { allowed_categories: c.allowed_categories }),
    ...(c.payee_allowlist?.length && { payee_allowlist: c.payee_allowlist }),
    ...(c.payee_blocklist?.length && { payee_blocklist: c.payee_blocklist }),
    ...(c.max_quantity_per_item && { max_quantity_per_item: c.max_quantity_per_item }),
    ...(c.require_human_approval_over && { require_human_approval_over: c.require_human_approval_over }),
  };
  return { purpose, constraints, ttl_minutes: ttl, summary: summarize(constraints, ttl), warnings, source };
}

/** Rendered by code from the constraints the owner will sign: this is what they actually approve. */
export function summarize(c: MandateConstraints, ttlMinutes?: number): string[] {
  const s = [`Spend at most ${c.max_total} ${c.currency} in total, across at most ${c.max_transactions} payment${c.max_transactions === 1 ? "" : "s"}.`];
  if (c.max_per_transaction) s.push(`No single payment above ${c.max_per_transaction} ${c.currency}.`);
  if (c.allowed_categories?.length) s.push(`Only these PayPal item categories: ${c.allowed_categories.join(", ")}.`);
  if (c.payee_allowlist?.length) s.push(`Only pay: ${c.payee_allowlist.join(", ")}.`);
  if (c.payee_blocklist?.length) s.push(`Never pay: ${c.payee_blocklist.join(", ")}.`);
  if (c.require_merchant_order) s.push("Only pay orders the merchant created on PayPal; payee, amount and items are read from PayPal, not from the agent.");
  if (c.sku_allowlist?.length) s.push(`Only these product SKUs: ${c.sku_allowlist.join(", ")}.`);
  if ((c.allowed_categories?.length || c.max_quantity_per_item || c.sku_allowlist?.length) && !c.require_merchant_order)
    s.push("Category, SKU and quantity limits can only be checked on merchant-created PayPal orders; agent-typed payments that rely on them are refused.");
  if (c.max_quantity_per_item) s.push(`At most ${c.max_quantity_per_item} of any item.`);
  if (c.require_human_approval_over) s.push(`Ask you before any payment above ${c.require_human_approval_over} ${c.currency}.`);
  if (ttlMinutes) s.push(`Expires ${ttlMinutes >= 1440 ? `in ${+(ttlMinutes / 1440).toFixed(1)} days` : ttlMinutes >= 60 ? `in ${+(ttlMinutes / 60).toFixed(1)} hours` : `in ${ttlMinutes} minutes`}, and is void the moment you revoke it.`);
  return s;
}
