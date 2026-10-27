import { randomUUID, randomBytes, timingSafeEqual } from "node:crypto";
import { canonical, sha256, toMinor } from "./canonical.ts";
import { evaluatePolicy, proposalHash } from "./policy.ts";
import type { Signer } from "./keys.ts";
import type { RiskAnalyzer } from "./risk.ts";
import type { PaymentRail } from "./paypal.ts";
import type { Store, PaymentRow } from "./store.ts";
import type { Decision, Evaluation, Mandate, MandateConstraints, PaymentProposal } from "./types.ts";

export interface ProposeResult {
  payment_id: string; decision: Decision; status: string; evaluation: Evaluation;
  approval_id?: string; paypal?: { order_id: string | null; authorization_id: string | null; capture_id: string | null }; error?: string | null;
}

export class GatewayError extends Error { code: number; constructor(code: number, msg: string) { super(msg); this.code = code; } }

const APPROVAL_TTL_MS = 15 * 60 * 1000;

export class Gateway {
  private store: Store; private signer: Signer; private risk: RiskAnalyzer; private rail: PaymentRail;
  constructor(deps: { store: Store; signer: Signer; risk: RiskAnalyzer; rail: PaymentRail }) {
    this.store = deps.store; this.signer = deps.signer; this.risk = deps.risk; this.rail = deps.rail;
    this.store.db.exec(`CREATE TABLE IF NOT EXISTS agents (agent_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, key_hash TEXT NOT NULL, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS wallets (user_id TEXT PRIMARY KEY, vault_id TEXT NOT NULL, payer_email TEXT, created_at TEXT NOT NULL);`);
  }

  // ---------- agents & wallets ----------
  registerAgent(userId: string, agentId: string): { agent_id: string; api_key: string } {
    const key = "ag_" + randomBytes(24).toString("base64url");
    this.store.db.prepare("INSERT INTO agents VALUES (?,?,?,?)").run(agentId, userId, sha256(key), new Date().toISOString());
    this.store.audit("agent.registered", agentId, { user_id: userId });
    return { agent_id: agentId, api_key: key };
  }
  /** Returns the agent_id for a valid API key, else null. Constant-time compare. */
  authenticateAgent(apiKey: string): { agent_id: string; user_id: string } | null {
    const h = sha256(apiKey);
    const rows = this.store.db.prepare("SELECT agent_id, user_id, key_hash FROM agents").all() as any[];
    for (const r of rows) if (timingSafeEqual(Buffer.from(r.key_hash), Buffer.from(h))) return { agent_id: r.agent_id, user_id: r.user_id };
    return null;
  }
  linkWallet(userId: string, vaultId: string, payerEmail?: string): void {
    this.store.db.prepare("INSERT OR REPLACE INTO wallets VALUES (?,?,?,?)").run(userId, vaultId, payerEmail ?? null, new Date().toISOString());
    this.store.audit("wallet.linked", userId, { payer_email: payerEmail ?? null });
  }
  private vaultFor(userId: string): string {
    const r = this.store.db.prepare("SELECT vault_id FROM wallets WHERE user_id=?").get(userId) as any;
    if (!r) throw new GatewayError(409, "user has no linked PayPal wallet");
    return r.vault_id;
  }

  // ---------- mandates ----------
  /** Step 1: draft. The user must review and confirm before the agent gets any authority. */
  draftMandate(input: { user_id: string; agent_id: string; purpose: string; constraints: MandateConstraints; ttl_minutes?: number }): { mandate: Mandate; mandate_hash: string } {
    validateConstraints(input.constraints);
    const now = new Date();
    const mandate: Mandate = { mandate_id: "mdt_" + randomUUID(), user_id: input.user_id, agent_id: input.agent_id, purpose: input.purpose.slice(0, 500),
      constraints: input.constraints, created_at: now.toISOString(),
      expires_at: new Date(now.getTime() + (input.ttl_minutes ?? 60) * 60_000).toISOString(), version: 1 };
    const mandate_hash = sha256(canonical(mandate));
    this.store.insertMandate({ mandate, mandate_hash, signature: "", status: "draft" });
    this.store.audit("mandate.drafted", mandate.mandate_id, { mandate, mandate_hash });
    return { mandate, mandate_hash };
  }
  /** Step 2: user confirms the exact hash they reviewed. Signing activates it. */
  confirmMandate(mandateId: string, reviewedHash: string): { mandate_id: string; signature: string } {
    const sm = this.store.getMandate(mandateId);
    if (!sm) throw new GatewayError(404, "mandate not found");
    if (sm.status !== "draft") throw new GatewayError(409, `mandate is ${sm.status}`);
    if (sha256(canonical(sm.mandate)) !== sm.mandate_hash || reviewedHash !== sm.mandate_hash) throw new GatewayError(409, "reviewed hash does not match mandate");
    const signature = this.signer.sign(sm.mandate_hash);
    this.store.setMandateSigned(mandateId, signature);
    this.store.audit("mandate.activated", mandateId, { mandate_hash: sm.mandate_hash, signature });
    return { mandate_id: mandateId, signature };
  }
  async revokeMandate(mandateId: string, reason = "revoked by user"): Promise<void> {
    const sm = this.store.getMandate(mandateId);
    if (!sm) throw new GatewayError(404, "mandate not found");
    this.store.setMandateStatus(mandateId, "revoked");
    this.store.audit("mandate.revoked", mandateId, { reason });
    for (const a of this.store.pendingApprovals().filter(a => a.mandate_id === mandateId)) {
      if (this.store.resolveApproval(a.approval_id, "denied")) this.store.transition(a.payment_id, ["needs_human"], "denied", { error: "mandate revoked" });
    }
    // Void authorizations that have not been captured yet.
    for (const p of this.store.listPayments(1000).filter(p => p.mandate_id === mandateId && p.status === "authorized" && p.paypal_authorization_id)) {
      try { await this.rail.void(p.paypal_authorization_id!); this.store.transition(p.payment_id, ["authorized"], "voided", { error: "mandate revoked" }); }
      catch (e) { this.store.audit("payment.void_failed", p.payment_id, { error: (e as Error).message }); }
    }
  }
  mandateView(mandateId: string) {
    const sm = this.store.getMandate(mandateId);
    if (!sm) throw new GatewayError(404, "mandate not found");
    return { ...sm, spend: this.store.spendState(mandateId), signature_valid: this.signatureValid(sm) };
  }
  private signatureValid(sm: { mandate: Mandate; mandate_hash: string; signature: string }): boolean {
    return !!sm.signature && sha256(canonical(sm.mandate)) === sm.mandate_hash && this.signer.verify(sm.mandate_hash, sm.signature);
  }

  // ---------- payments ----------
  async propose(authAgentId: string, p: PaymentProposal): Promise<ProposeResult> {
    validateProposal(p);
    if (p.agent_id !== authAgentId) throw new GatewayError(403, "proposal agent_id does not match authenticated agent");
    const hash = proposalHash(p);

    const existing = this.store.findPayment(p.mandate_id, p.agent_id, p.idempotency_key);
    if (existing) return this.replay(existing, hash);

    const sm = this.store.getMandate(p.mandate_id);
    if (!sm) throw new GatewayError(404, "mandate not found");
    const risk = await this.risk.analyze(sm.mandate, p);   // advisory, computed outside the lock

    const paymentId = "pay_" + randomUUID();
    let result: ProposeResult;
    try {
      result = this.store.tx(() => {
        const fresh = this.store.getMandate(p.mandate_id)!;   // re-read under lock (revocation race)
        const status = fresh.status === "active" && new Date() >= new Date(fresh.mandate.expires_at) ? "expired" : fresh.status;
        const { checks, amount_minor, needsHuman } = evaluatePolicy({ mandate: fresh.mandate, status, signatureValid: this.signatureValid(fresh),
          proposal: p, state: this.store.spendState(p.mandate_id), now: new Date() });
        const failed = checks.filter(c => !c.pass);
        const riskEscalations = risk.filter(r => r.severity !== "low").map(r => `${r.signal}: ${r.detail}`);
        const decision: Decision = failed.length ? "reject" : (needsHuman.length || riskEscalations.length) ? "needs_human" : "approve";
        const reasons = failed.length ? failed.map(c => `${c.check}: ${c.detail}`) : [...needsHuman, ...riskEscalations];
        const evaluation: Evaluation = { decision, proposal_hash: hash, amount_minor, checks, risk, reasons };
        const st = decision === "reject" ? "rejected" : decision === "needs_human" ? "needs_human" : "reserved";
        this.store.insertPayment({ payment_id: paymentId, mandate_id: p.mandate_id, agent_id: p.agent_id, idempotency_key: p.idempotency_key,
          proposal_hash: hash, amount_minor, currency: p.currency, status: st, evaluation: JSON.stringify(evaluation), proposal: canonical(p) });
        let approval_id: string | undefined;
        if (decision === "needs_human") {
          approval_id = "apr_" + randomUUID();
          this.store.insertApproval({ approval_id, payment_id: paymentId, proposal_hash: hash, expires_at: new Date(Date.now() + APPROVAL_TTL_MS).toISOString() });
        }
        this.store.audit(`payment.${decision}`, paymentId, { mandate_id: p.mandate_id, agent_id: p.agent_id, proposal_hash: hash, amount_minor,
          payee: p.payee, items: p.items, failed_checks: failed, risk, approval_id: approval_id ?? null });
        return { payment_id: paymentId, decision, status: st, evaluation, approval_id };
      });
    } catch (e: any) {
      // Lost a race on the same idempotency key: return the winner's result.
      if (String(e?.message).includes("UNIQUE")) { const w = this.store.findPayment(p.mandate_id, p.agent_id, p.idempotency_key); if (w) return this.replay(w, hash); }
      throw e;
    }
    if (result.decision === "approve") await this.execute(paymentId);
    return this.view(paymentId);
  }

  private replay(row: PaymentRow, hash: string): ProposeResult {
    if (row.proposal_hash !== hash) throw new GatewayError(409, "idempotency_key reused with different payment parameters");
    this.store.audit("payment.replayed", row.payment_id, { proposal_hash: hash });
    return this.view(row.payment_id);
  }

  /** Human decision on an escalated payment. Single-use, bound to the exact proposal hash, re-checks revocation. */
  async resolveApproval(approvalId: string, approve: boolean, approver: string): Promise<ProposeResult> {
    const a = this.store.getApproval(approvalId);
    if (!a) throw new GatewayError(404, "approval not found");
    if (a.resolved_at) throw new GatewayError(409, `approval already resolved (${a.resolution})`);
    const pay = this.store.getPayment(a.payment_id)!;
    if (pay.proposal_hash !== a.proposal_hash) throw new GatewayError(409, "approval is not bound to this payment");
    if (new Date() > new Date(a.expires_at)) {
      if (this.store.resolveApproval(approvalId, "expired")) this.store.transition(pay.payment_id, ["needs_human"], "denied", { error: "approval expired" });
      throw new GatewayError(410, "approval expired");
    }
    if (!approve) {
      if (!this.store.resolveApproval(approvalId, "denied")) throw new GatewayError(409, "approval already resolved");
      this.store.transition(pay.payment_id, ["needs_human"], "denied", { error: `denied by ${approver}` });
      this.store.audit("approval.denied", pay.payment_id, { approval_id: approvalId, approver });
      return this.view(pay.payment_id);
    }
    const ok = this.store.tx(() => {
      const sm = this.store.getMandate(pay.mandate_id)!;
      if (sm.status !== "active" || new Date() >= new Date(sm.mandate.expires_at) || !this.signatureValid(sm)) return false;
      if (!this.store.resolveApproval(approvalId, "approved")) throw new GatewayError(409, "approval already resolved");
      return this.store.transition(pay.payment_id, ["needs_human"], "reserved");
    });
    if (!ok) { this.store.resolveApproval(approvalId, "denied"); this.store.transition(pay.payment_id, ["needs_human"], "denied", { error: "mandate no longer active" });
      throw new GatewayError(409, "mandate no longer active"); }
    this.store.audit("approval.granted", pay.payment_id, { approval_id: approvalId, approver, proposal_hash: pay.proposal_hash });
    await this.execute(pay.payment_id);
    return this.view(pay.payment_id);
  }

  /**
   * Bring local state back in line with PayPal after a crash or network drop between authorize and capture.
   * Safe to call repeatedly. Only touches payments older than olderThanMs.
   */
  async reconcile(olderThanMs = 60_000): Promise<{ scanned: number; actions: string[] }> {
    const cutoff = new Date(Date.now() - olderThanMs).toISOString();
    const stuck = this.store.listStuck(cutoff);
    const actions: string[] = [];
    for (const pay of stuck) {
      try {
        if (pay.status === "reserved" && !pay.paypal_authorization_id) {
          // Never reached PayPal, or we died before recording the auth id. Release the hold.
          if (this.store.transition(pay.payment_id, ["reserved"], "failed", { error: "recovery: never authorized" })) {
            this.store.audit("payment.recovered_failed", pay.payment_id, { reason: "never authorized" });
            actions.push(`${pay.payment_id}:failed_never_authorized`);
          }
          continue;
        }
        if (pay.status !== "authorized" || !pay.paypal_authorization_id) continue;

        const remote = await this.rail.getAuthorization(pay.paypal_authorization_id);
        const sm = this.store.getMandate(pay.mandate_id);
        const mandateOk = sm && sm.status === "active" && new Date() < new Date(sm.mandate.expires_at);

        if (remote.status === "CAPTURED") {
          this.store.transition(pay.payment_id, ["authorized"], "captured", { paypal_capture_id: remote.capture_id ?? null });
          this.store.audit("payment.recovered_captured", pay.payment_id, { remote_status: remote.status, capture_id: remote.capture_id });
          actions.push(`${pay.payment_id}:synced_captured`);
        } else if (remote.status === "VOIDED" || remote.status === "EXPIRED" || remote.status === "DENIED") {
          this.store.transition(pay.payment_id, ["authorized"], "voided", { error: `recovery: PayPal ${remote.status}` });
          this.store.audit("payment.recovered_voided", pay.payment_id, { remote_status: remote.status });
          actions.push(`${pay.payment_id}:synced_voided`);
        } else if (remote.status === "CREATED" || remote.status === "PENDING") {
          if (!mandateOk) {
            await this.rail.void(pay.paypal_authorization_id);
            this.store.transition(pay.payment_id, ["authorized"], "voided", { error: "recovery: mandate no longer active" });
            this.store.audit("payment.recovered_voided", pay.payment_id, { reason: "mandate inactive" });
            actions.push(`${pay.payment_id}:voided_mandate_inactive`);
          } else {
            // Still authorized and mandate is good: finish the capture.
            const cap = await this.rail.capture(pay.paypal_authorization_id, `ag-${pay.payment_id}-cap-recover`);
            this.store.transition(pay.payment_id, ["authorized"], "captured", { paypal_capture_id: cap.capture_id });
            this.store.audit("payment.recovered_captured", pay.payment_id, { capture_id: cap.capture_id });
            actions.push(`${pay.payment_id}:captured`);
          }
        } else {
          this.store.audit("payment.recover_unknown", pay.payment_id, { remote_status: remote.status });
          actions.push(`${pay.payment_id}:unknown_${remote.status}`);
        }
      } catch (e) {
        this.store.audit("payment.recover_error", pay.payment_id, { error: (e as Error).message.slice(0, 500) });
        actions.push(`${pay.payment_id}:error`);
      }
    }
    return { scanned: stuck.length, actions };
  }

  /** The only code path that touches money. Authorize -> verify PayPal's view matches -> capture, else void. */
  private async execute(paymentId: string): Promise<void> {
    const pay = this.store.getPayment(paymentId)!;
    const p: PaymentProposal = JSON.parse(pay.proposal);
    const sm = this.store.getMandate(pay.mandate_id)!;
    try {
      const auth = await this.rail.authorize({ requestId: `ag-${paymentId}`, referenceId: paymentId, vaultId: this.vaultFor(sm.mandate.user_id),
        currency: p.currency, amountMinor: pay.amount_minor, items: p.items, payee: p.payee, description: sm.mandate.purpose });
      this.store.transition(paymentId, ["reserved"], "authorized", { paypal_order_id: auth.order_id, paypal_authorization_id: auth.authorization_id });
      this.store.audit("payment.authorized", paymentId, { order_id: auth.order_id, authorization_id: auth.authorization_id, observed: auth.observed });

      const mismatch: string[] = [];
      if (auth.observed.currency !== p.currency) mismatch.push(`currency ${auth.observed.currency}`);
      if (auth.observed.amountMinor !== pay.amount_minor) mismatch.push(`amount ${auth.observed.amountMinor} != ${pay.amount_minor}`);
      const want = (p.payee.merchant_id ?? p.payee.email_address ?? "").toLowerCase();
      const got = [auth.observed.payee.merchant_id, auth.observed.payee.email_address].filter(Boolean).map(s => s!.toLowerCase());
      if (want && got.length && !got.includes(want)) mismatch.push(`payee ${got.join("/")} != ${want}`);
      if (mismatch.length) {
        await this.rail.void(auth.authorization_id);
        this.store.transition(paymentId, ["authorized"], "voided", { error: `PayPal order mismatch: ${mismatch.join("; ")}` });
        this.store.audit("payment.voided_mismatch", paymentId, { mismatch });
        return;
      }
      // Revocation can land between authorize and capture: re-check before moving money.
      const now = this.store.getMandate(pay.mandate_id)!;
      if (now.status !== "active") { await this.rail.void(auth.authorization_id); this.store.transition(paymentId, ["authorized"], "voided", { error: "mandate revoked before capture" }); return; }

      const cap = await this.rail.capture(auth.authorization_id, `ag-${paymentId}-cap`);
      this.store.transition(paymentId, ["authorized"], "captured", { paypal_capture_id: cap.capture_id });
      this.store.audit("payment.captured", paymentId, { capture_id: cap.capture_id, status: cap.status });
      const s = this.store.spendState(pay.mandate_id);
      if (s.tx_count >= sm.mandate.constraints.max_transactions || s.spent_minor >= toMinor(sm.mandate.constraints.max_total)) {
        this.store.setMandateStatus(pay.mandate_id, "exhausted"); this.store.audit("mandate.exhausted", pay.mandate_id, s);
      }
    } catch (e) {
      const msg = (e as Error).message;
      this.store.transition(paymentId, ["reserved", "authorized"], "failed", { error: msg.slice(0, 500) });
      this.store.audit("payment.failed", paymentId, { error: msg.slice(0, 500) });
    }
  }

  view(paymentId: string): ProposeResult {
    const r = this.store.getPayment(paymentId)!;
    const ev: Evaluation = JSON.parse(r.evaluation);
    const apr = this.store.db.prepare("SELECT approval_id FROM approvals WHERE payment_id=?").get(paymentId) as any;
    return { payment_id: r.payment_id, decision: ev.decision, status: r.status, evaluation: ev, approval_id: apr?.approval_id,
      paypal: { order_id: r.paypal_order_id, authorization_id: r.paypal_authorization_id, capture_id: r.paypal_capture_id }, error: r.error };
  }
}

function validateConstraints(c: MandateConstraints) {
  if (!/^[A-Z]{3}$/.test(c.currency ?? "")) throw new GatewayError(400, "constraints.currency must be ISO 4217");
  toMinor(c.max_total); if (c.max_per_transaction) toMinor(c.max_per_transaction); if (c.require_human_approval_over) toMinor(c.require_human_approval_over);
  if (!Number.isInteger(c.max_transactions) || c.max_transactions < 1 || c.max_transactions > 1000) throw new GatewayError(400, "constraints.max_transactions must be 1..1000");
}
function validateProposal(p: PaymentProposal) {
  for (const k of ["mandate_id", "agent_id", "idempotency_key", "currency"] as const) if (typeof p?.[k] !== "string" || !p[k]) throw new GatewayError(400, `${k} is required`);
  if (!Array.isArray(p.items) || !p.items.length || p.items.length > 50) throw new GatewayError(400, "items must be 1..50");
  for (const i of p.items) if (!["PHYSICAL_GOODS", "DIGITAL_GOODS", "DONATION"].includes(i.category)) throw new GatewayError(400, `invalid category for ${i.name}`);
  if (!p.payee || typeof p.payee !== "object") throw new GatewayError(400, "payee is required");
}
