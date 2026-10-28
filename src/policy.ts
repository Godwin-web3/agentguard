import { canonical, sha256, toMinor } from "./canonical.ts";
import type { CheckResult, Mandate, MandateStatus, PaymentProposal } from "./types.ts";

export interface SpendState { spent_minor: number; reserved_minor: number; tx_count: number }

/** Binds an approval to exact payment parameters. Changing any field yields a different hash. */
export function proposalHash(p: PaymentProposal): string {
  return sha256(canonical({ mandate_id: p.mandate_id, agent_id: p.agent_id, idempotency_key: p.idempotency_key,
    payee: p.payee, currency: p.currency, items: p.items }));
}

export function proposalAmount(p: PaymentProposal): number {
  return p.items.reduce((s, i) => {
    if (!Number.isInteger(i.quantity) || i.quantity < 1) throw new Error(`invalid quantity for ${i.name}`);
    return s + toMinor(i.unit_amount) * i.quantity;
  }, 0);
}

/**
 * Deterministic authorization. Pure function: same inputs, same answer. No model involved.
 * Every check runs (no short-circuit) so the audit log shows the full picture.
 */
export function evaluatePolicy(args: {
  mandate: Mandate; status: MandateStatus; signatureValid: boolean; proposal: PaymentProposal;
  state: SpendState; now: Date;
}): { checks: CheckResult[]; amount_minor: number; needsHuman: string[] } {
  const { mandate: m, status, signatureValid, proposal: p, state, now } = args;
  const c = m.constraints;
  const checks: CheckResult[] = [];
  const add = (check: string, pass: boolean, detail: string) => checks.push({ check, pass, detail });
  const needsHuman: string[] = [];

  let amount = 0;
  try { amount = proposalAmount(p); add("amount_parse", amount > 0, `total ${amount} minor units`); }
  catch (e) { add("amount_parse", false, (e as Error).message); }

  add("mandate_signature", signatureValid, signatureValid ? "signature verified" : "mandate signature invalid or tampered");
  add("mandate_status", status === "active", `status=${status}`);
  add("mandate_expiry", now < new Date(m.expires_at), `expires ${m.expires_at}`);
  add("agent_binding", p.agent_id === m.agent_id, `proposal agent ${p.agent_id}, mandate agent ${m.agent_id}`);
  add("currency", p.currency === c.currency, `${p.currency} vs allowed ${c.currency}`);
  add("items_present", p.items.length > 0, `${p.items.length} items`);

  if (c.max_per_transaction) add("per_transaction_limit", amount <= toMinor(c.max_per_transaction), `${amount} <= ${toMinor(c.max_per_transaction)}`);
  const committed = state.spent_minor + state.reserved_minor;
  add("total_limit", committed + amount <= toMinor(c.max_total), `committed ${committed} + ${amount} <= ${toMinor(c.max_total)}`);
  add("transaction_count", state.tx_count < c.max_transactions, `${state.tx_count} used of ${c.max_transactions}`);

  if (c.allowed_categories?.length) {
    const bad = p.items.filter(i => !c.allowed_categories!.includes(i.category));
    add("category", bad.length === 0, bad.length ? `disallowed: ${bad.map(i => `${i.name} (${i.category})`).join(", ")}` : "all items in allowed categories");
  }
  const payeeIds = [p.payee.merchant_id, p.payee.email_address].filter(Boolean).map(s => s!.toLowerCase());
  add("payee_identified", payeeIds.length > 0, payeeIds.length ? payeeIds.join(", ") : "no merchant_id or email");
  if (c.payee_allowlist?.length) {
    const allow = c.payee_allowlist.map(s => s.toLowerCase());
    // Every identifier must be allowlisted: PayPal routes funds by merchant_id when present, so a mixed
    // {merchant_id: attacker, email_address: allowlisted} proposal must not pass on the email alone.
    const unknown = payeeIds.filter(id => !allow.includes(id));
    add("payee_allowlist", payeeIds.length > 0 && unknown.length === 0,
      unknown.length ? `not allowlisted: ${unknown.join(", ")}` : `payee ${payeeIds.join("/")} allowlisted`);
  }
  if (c.payee_blocklist?.length) {
    const block = c.payee_blocklist.map(s => s.toLowerCase());
    add("payee_blocklist", !payeeIds.some(id => block.includes(id)), `payee ${payeeIds.join("/")}`);
  }
  if (c.max_quantity_per_item) {
    const over = p.items.filter(i => i.quantity > c.max_quantity_per_item!);
    add("quantity", over.length === 0, over.length ? `over limit: ${over.map(i => `${i.name} x${i.quantity}`).join(", ")}` : "ok");
  }
  if (c.require_human_approval_over && amount > toMinor(c.require_human_approval_over)) {
    needsHuman.push(`amount ${amount} exceeds human-approval threshold ${toMinor(c.require_human_approval_over)}`);
  }
  return { checks, amount_minor: amount, needsHuman };
}
