import { randomUUID, randomBytes, timingSafeEqual } from "node:crypto";
import { canonical, sha256, toMinor } from "./canonical.ts";
import { evaluatePolicy, proposalHash } from "./policy.ts";
import { orderFacts, OrderError } from "./order.ts";
import { mandateChallenge, revokeChallenge, type PasskeyService } from "./passkeys.ts";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import type { RiskAnalyzer } from "./risk.ts";
import { receiptIdFor, receiptReference, type ReceiptService } from "./receipt.ts";
import type { PaymentRail } from "./paypal.ts";
import type { Store, PaymentRow, PaymentStatus } from "./store.ts";
import type { Decision, Evaluation, Mandate, MandateConstraints, PaymentProposal, SignedMandate, UserSignature } from "./types.ts";

export interface ProposeResult {
  payment_id: string; decision: Decision; status: string; evaluation: Evaluation;
  approval_id?: string; paypal?: { order_id: string | null; authorization_id: string | null; capture_id: string | null }; error?: string | null;
}

export class GatewayError extends Error { code: number; constructor(code: number, msg: string) { super(msg); this.code = code; } }

const APPROVAL_TTL_MS = 15 * 60 * 1000;

export class Gateway {
  private store: Store; private passkeys: PasskeyService; private risk: RiskAnalyzer; private rail: PaymentRail; private receipts?: ReceiptService;
  constructor(deps: { store: Store; passkeys: PasskeyService; risk: RiskAnalyzer; rail: PaymentRail; receipts?: ReceiptService }) {
    this.store = deps.store; this.receipts = deps.receipts; this.passkeys = deps.passkeys; this.risk = deps.risk; this.rail = deps.rail;
    this.store.db.exec(`CREATE TABLE IF NOT EXISTS agents (agent_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, key_hash TEXT NOT NULL, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS wallets (user_id TEXT PRIMARY KEY, vault_id TEXT NOT NULL, payer_email TEXT, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS controls (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL);`);
  }

  // ---------- operator kill-switch ----------
  /** Operator-wide pause: while set, no new payment is accepted and no reserved/approved payment moves money. */
  pauseState(): { paused: boolean; reason?: string; by?: string; since?: string } {
    const r = this.store.db.prepare("SELECT value FROM controls WHERE key='pause'").get() as { value: string } | undefined;
    return r ? { paused: true, ...JSON.parse(r.value) } : { paused: false };
  }
  pause(reason: string, by = "operator"): { paused: boolean } {
    const v = JSON.stringify({ reason: String(reason ?? "").slice(0, 300) || "operator pause", by: String(by).slice(0, 100), since: new Date().toISOString() });
    this.store.db.prepare("INSERT INTO controls (key,value,updated_at) VALUES ('pause',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at").run(v, new Date().toISOString());
    this.store.audit("operator.pause", null, JSON.parse(v));
    return this.pauseState();
  }
  resume(by = "operator"): { paused: boolean } {
    this.store.db.prepare("DELETE FROM controls WHERE key='pause'").run();
    this.store.audit("operator.resume", null, { by: String(by).slice(0, 100) });
    return this.pauseState();
  }
  private assertNotPaused(): void {
    const s = this.pauseState();
    if (s.paused) throw new GatewayError(503, `payments paused by operator: ${s.reason}`);
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
    this.store.insertMandate({ mandate, mandate_hash, user_signature: null, revocation_signature: null, status: "draft" });
    this.store.audit("mandate.drafted", mandate.mandate_id, { mandate, mandate_hash });
    return { mandate, mandate_hash };
  }
  /** Step 2a: what the user's authenticator must sign. The challenge IS the mandate hash. */
  async signingRequest(mandateId: string) {
    const sm = this.mustMandate(mandateId);
    if (sm.status !== "draft" && sm.status !== "unsigned") throw new GatewayError(409, `mandate is ${sm.status}`);
    if (sha256(canonical(sm.mandate)) !== sm.mandate_hash) throw new GatewayError(409, "mandate body does not match its hash");
    const options = await this.pk(() => this.passkeys.signingOptions(sm.mandate.user_id, mandateChallenge(sm.mandate_hash)));
    return { mandate: sm.mandate, mandate_hash: sm.mandate_hash, options };
  }
  /**
   * Step 2b: the user's passkey assertion over the exact hash they reviewed activates the mandate.
   * The server never signs mandates; it only verifies the user's signature, here and on every proposal.
   */
  async confirmMandate(mandateId: string, reviewedHash: string, assertion: AuthenticationResponseJSON): Promise<{ mandate_id: string; status: string; credential_id: string }> {
    const sm = this.mustMandate(mandateId);
    if (sm.status !== "draft" && sm.status !== "unsigned") throw new GatewayError(409, `mandate is ${sm.status}`);
    if (sha256(canonical(sm.mandate)) !== sm.mandate_hash || reviewedHash !== sm.mandate_hash) throw new GatewayError(409, "reviewed hash does not match mandate");
    if (!assertion) throw new GatewayError(400, "assertion (WebAuthn response signed by the user's passkey) is required");
    const sig = await this.pk(() => this.passkeys.verifyAssertion(sm.mandate.user_id, assertion, mandateChallenge(sm.mandate_hash)));
    if (!this.store.setMandateSigned(mandateId, sig)) throw new GatewayError(409, "mandate changed state while signing");
    this.store.audit("mandate.activated", mandateId, { mandate_hash: sm.mandate_hash, user_signature: sig, resigned: sm.status === "unsigned" });
    return { mandate_id: mandateId, status: "active", credential_id: sig.credential_id };
  }
  async revocationRequest(mandateId: string) {
    const sm = this.mustMandate(mandateId);
    const options = await this.pk(() => this.passkeys.signingOptions(sm.mandate.user_id, revokeChallenge(sm.mandate_hash)));
    return { mandate_id: mandateId, mandate_hash: sm.mandate_hash, statement: `agentguard:revoke:v1:${sm.mandate_hash}`, options };
  }
  /**
   * Revocation of an enforceable mandate must be signed by the user's passkey (challenge = sha256("agentguard:revoke:v1:"+hash)).
   * Drafts and unsigned legacy mandates carry no authority, so the owner console may discard them without a signature.
   */
  async revokeMandate(mandateId: string, assertion: AuthenticationResponseJSON | undefined, reason = "revoked by user"): Promise<void> {
    const sm = this.mustMandate(mandateId);
    if (sm.status === "revoked") return;
    let sig: UserSignature | null = null;
    if (sm.status !== "draft" && sm.status !== "unsigned") {
      if (!assertion) throw new GatewayError(400, "revocation must be signed with the user's passkey (assertion required)");
      sig = await this.pk(() => this.passkeys.verifyAssertion(sm.mandate.user_id, assertion, revokeChallenge(sm.mandate_hash)));
    }
    this.store.setMandateRevoked(mandateId, sig);
    this.store.audit("mandate.revoked", mandateId, { reason: String(reason).slice(0, 500), revocation_signature: sig, prior_status: sm.status });
    for (const a of this.store.pendingApprovals().filter(a => a.mandate_id === mandateId)) {
      if (this.store.resolveApproval(a.approval_id, "denied")) this.store.transition(a.payment_id, ["needs_human"], "denied", { error: "mandate revoked" });
    }
    // Void authorizations that have not been captured yet.
    for (const p of this.store.listPayments(1000).filter(p => p.mandate_id === mandateId && p.status === "authorized" && p.paypal_authorization_id)) {
      try { await this.rail.void(p.paypal_authorization_id!); this.store.transition(p.payment_id, ["authorized"], "voided", { error: "mandate revoked" }); }
      catch (e) { this.store.audit("payment.void_failed", p.payment_id, { error: (e as Error).message }); }
    }
  }
  async mandateView(mandateId: string) {
    const sm = this.mustMandate(mandateId);
    return { ...sm, spend: this.store.spendState(mandateId), signature_valid: await this.signatureValid(sm) };
  }
  private mustMandate(id: string): SignedMandate {
    const sm = this.store.getMandate(id);
    if (!sm) throw new GatewayError(404, "mandate not found");
    return sm;
  }
  private async pk<T>(fn: () => Promise<T>): Promise<T> {
    try { return await fn(); } catch (e: any) { throw e instanceof GatewayError ? e : new GatewayError(e?.code ?? 400, e?.message ?? String(e)); }
  }
  /** Re-verifies the user's passkey signature against the CURRENT mandate body. Tampering with body, hash or signature fails. */
  private async signatureValid(sm: SignedMandate): Promise<boolean> {
    return sha256(canonical(sm.mandate)) === sm.mandate_hash
      && await this.passkeys.reverify(sm.mandate.user_id, sm.user_signature, mandateChallenge(sm.mandate_hash));
  }
  /** Signature check done outside the write lock; under the lock we only confirm nothing it covered has changed. */
  private sameSigned(a: SignedMandate, b: SignedMandate): boolean {
    return a.mandate_hash === b.mandate_hash && canonical(a.mandate) === canonical(b.mandate) && canonical(a.user_signature) === canonical(b.user_signature);
  }

  // ---------- payments ----------
  async propose(authAgentId: string, body: any): Promise<ProposeResult> {
    this.assertNotPaused();
    const p = toProposal(body);
    if (p.agent_id !== authAgentId) throw new GatewayError(403, "proposal agent_id does not match authenticated agent");
    const hash = proposalHash(p);

    const existing = this.store.findPayment(p.mandate_id, p.agent_id, p.idempotency_key);
    if (existing) return this.replay(existing, hash);

    const sm = this.store.getMandate(p.mandate_id);
    if (!sm) throw new GatewayError(404, "mandate not found");
    if (p.paypal_order_id) {
      // Source of truth: PayPal's own order record, created by the merchant. Nothing about payee/amount/items comes from the agent.
      const f = await this.loadOrder(p.paypal_order_id);
      Object.assign(p, { payee: f.payee, currency: f.currency, items: f.items, order_digest: f.digest, order_total_minor: f.amount_minor });
    }
    const risk = await this.risk.analyze(sm.mandate, p);   // advisory, computed outside the lock
    const sigOk = await this.signatureValid(sm);

    const paymentId = "pay_" + randomUUID();
    let result: ProposeResult;
    try {
      result = this.store.tx(() => {
        const fresh = this.store.getMandate(p.mandate_id)!;   // re-read under lock (revocation race)
        const status = fresh.status === "active" && new Date() >= new Date(fresh.mandate.expires_at) ? "expired" : fresh.status;
        const { checks, amount_minor, needsHuman } = evaluatePolicy({ mandate: fresh.mandate, status, signatureValid: sigOk && this.sameSigned(sm, fresh),
          proposal: p, state: this.store.spendState(p.mandate_id), now: new Date() });
        if (p.paypal_order_id) {
          const used = this.store.db.prepare("SELECT payment_id FROM payments WHERE paypal_order_id=? AND status IN ('needs_human','reserved','authorized','captured')").get(p.paypal_order_id) as any;
          checks.push({ check: "order_unused", pass: !used, detail: used ? `order already used by ${used.payment_id}` : "order not used by another payment" });
        }
        const failed = checks.filter(c => !c.pass);
        const riskEscalations = risk.filter(r => r.severity !== "low").map(r => `${r.signal}: ${r.detail}`);
        const decision: Decision = failed.length ? "reject" : (needsHuman.length || riskEscalations.length) ? "needs_human" : "approve";
        const reasons = failed.length ? failed.map(c => `${c.check}: ${c.detail}`) : [...needsHuman, ...riskEscalations];
        const evaluation: Evaluation = { decision, proposal_hash: hash, amount_minor, checks, risk, reasons };
        const st = decision === "reject" ? "rejected" : decision === "needs_human" ? "needs_human" : "reserved";
        this.store.insertPayment({ payment_id: paymentId, mandate_id: p.mandate_id, agent_id: p.agent_id, idempotency_key: p.idempotency_key,
          proposal_hash: hash, amount_minor, currency: p.currency, status: st, evaluation: JSON.stringify(evaluation), proposal: canonical(p),
          paypal_order_id: p.paypal_order_id ?? null });
        let approval_id: string | undefined;
        if (decision === "needs_human") {
          approval_id = "apr_" + randomUUID();
          this.store.insertApproval({ approval_id, payment_id: paymentId, proposal_hash: hash, expires_at: new Date(Date.now() + APPROVAL_TTL_MS).toISOString() });
        }
        this.store.audit(`payment.${decision}`, paymentId, { mandate_id: p.mandate_id, agent_id: p.agent_id, proposal_hash: hash, amount_minor,
          payee: p.payee, items: p.items, facts_source: p.facts_source, paypal_order_id: p.paypal_order_id ?? null, order_digest: p.order_digest ?? null, failed_checks: failed, risk, approval_id: approval_id ?? null });
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

  private async loadOrder(orderId: string) {
    if (!this.rail.getOrder || !this.rail.authorizeOrder) throw new GatewayError(501, "payment rail does not support merchant orders");
    let raw: any;
    try { raw = await this.rail.getOrder(orderId); }
    catch (e: any) { throw new GatewayError(e?.status === 404 ? 404 : e?.status === 400 ? 400 : 502, `PayPal order ${orderId}: ${String(e?.message).slice(0, 200)}`); }
    try { return orderFacts(raw); }
    catch (e) { if (e instanceof OrderError) throw new GatewayError(422, `PayPal order ${orderId} not payable: ${e.message}`); throw e; }
  }

  private replay(row: PaymentRow, hash: string): ProposeResult {
    if (row.proposal_hash !== hash) throw new GatewayError(409, "idempotency_key reused with different payment parameters");
    this.store.audit("payment.replayed", row.payment_id, { proposal_hash: hash });
    return this.view(row.payment_id);
  }

  /** Human decision on an escalated payment. Single-use, bound to the exact proposal hash, re-checks revocation. */
  async resolveApproval(approvalId: string, approve: boolean, approver: string): Promise<ProposeResult> {
    if (approve) this.assertNotPaused();
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
    const before = this.store.getMandate(pay.mandate_id)!;
    const sigOk = await this.signatureValid(before);
    const ok = this.store.tx(() => {
      const sm = this.store.getMandate(pay.mandate_id)!;
      if (sm.status !== "active" || new Date() >= new Date(sm.mandate.expires_at) || !sigOk || !this.sameSigned(before, sm)) return false;
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
        const mandateOk = !!sm && sm.status === "active" && new Date() < new Date(sm.mandate.expires_at) && await this.signatureValid(sm);

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
      } catch (e: any) {
        const status = e?.status ?? e?.paypal?.status;
        // PayPal has no record of the authorization (expired and purged, or never created). Release the hold.
        if (status === 404) {
          this.store.transition(pay.payment_id, ["authorized", "reserved"], "voided", { error: "recovery: authorization not found on PayPal" });
          this.store.audit("payment.recovered_voided", pay.payment_id, { reason: "authorization_not_found", status: 404 });
          actions.push(`${pay.payment_id}:voided_not_found`);
        } else {
          // Transient error (network, 5xx, rate limit). Leave the row alone so the next interval retries.
          this.store.audit("payment.recover_error", pay.payment_id, { error: String(e?.message ?? e).slice(0, 500), status: status ?? null });
          actions.push(`${pay.payment_id}:retry`);
        }
      }
    }
    return { scanned: stuck.length, actions };
  }

  /** The only code path that touches money. Authorize -> verify PayPal's view matches -> capture, else void. */
  private async execute(paymentId: string): Promise<void> {
    const pay = this.store.getPayment(paymentId)!;
    if (pay.status !== "reserved") { this.store.audit("payment.execute_skipped", paymentId, { status: pay.status }); return; }
    if (this.pauseState().paused) { this.store.audit("payment.execute_blocked_paused", paymentId, {}); return; }
    const p: PaymentProposal = JSON.parse(pay.proposal);
    const sm = this.store.getMandate(pay.mandate_id)!;
    let authId: string | null = null;
    // Void an open authorization and mark the payment voided (only if it is still in one of `from`).
    const abort = async (from: PaymentStatus[], reason: string, extra: Record<string, unknown> = {}) => {
      if (authId) {
        try { await this.rail.void(authId); }
        catch (e) { this.store.audit("payment.void_failed", paymentId, { authorization_id: authId, error: (e as Error).message.slice(0, 500) }); }
      }
      const moved = from.length > 0 && this.store.transition(paymentId, from, authId ? "voided" : "failed", { error: reason.slice(0, 500) });
      this.store.audit("payment.aborted", paymentId, { reason, authorization_id: authId, state_updated: moved, ...extra });
    };
    try {
      let auth; let snapshot: any = null;
      if (p.paypal_order_id) {
        // Re-read the order: the merchant (or anyone holding its credentials) must not change it after we evaluated it.
        snapshot = await this.rail.getOrder!(p.paypal_order_id);
        const now = orderFacts(snapshot);
        if (now.digest !== p.order_digest) throw new Error(`PayPal order ${p.paypal_order_id} changed after evaluation`);
        auth = await this.rail.authorizeOrder!(p.paypal_order_id, this.vaultFor(sm.mandate.user_id), `ag-${paymentId}`);
      } else {
        auth = await this.rail.authorize({ requestId: `ag-${paymentId}`, referenceId: paymentId, vaultId: this.vaultFor(sm.mandate.user_id),
          currency: p.currency, amountMinor: pay.amount_minor, items: p.items, payee: p.payee, description: sm.mandate.purpose });
      }
      authId = auth.authorization_id;
      // CAS reserved -> authorized. If this fails (e.g. recovery already marked it failed and released the
      // budget hold), we must never capture: void the authorization and stop.
      if (!this.store.transition(paymentId, ["reserved"], "authorized", { paypal_order_id: auth.order_id, paypal_authorization_id: auth.authorization_id })) {
        const cur = this.store.getPayment(paymentId)!;
        return abort([], `state changed to ${cur.status} during authorize`, { observed_status: cur.status });
      }
      this.store.audit("payment.authorized", paymentId, { order_id: auth.order_id, authorization_id: auth.authorization_id, observed: auth.observed });

      const mismatch = verifyObserved(p, pay.amount_minor, auth.observed);
      if (mismatch.length) return abort(["authorized"], `PayPal order mismatch: ${mismatch.join("; ")}`, { mismatch });

      // Revocation can land between authorize and capture: re-check before moving money.
      const now = this.store.getMandate(pay.mandate_id)!;
      if (now.status !== "active") return abort(["authorized"], "mandate revoked before capture");
      // Final guard: the row must still be ours, in authorized, holding budget.
      const cur = this.store.getPayment(paymentId)!;
      if (cur.status !== "authorized" || cur.paypal_authorization_id !== authId) return abort(["authorized"], `state changed to ${cur.status} before capture`);

      // Stamp the receipt reference on PayPal's capture record so a dispute on PayPal's side leads back to the receipt.
      const invoiceId = snapshot && this.receipts ? receiptReference(receiptIdFor(paymentId)) : undefined;
      const cap = await this.rail.capture(auth.authorization_id, `ag-${paymentId}-cap`,
        invoiceId ? { invoice_id: invoiceId, note_to_payer: `Agent purchase under your signed mandate. Proof-of-Intent receipt ${invoiceId}` } : undefined);
      if (!this.store.transition(paymentId, ["authorized"], "captured", { paypal_capture_id: cap.capture_id })) {
        // Money moved but local state diverged: record loudly so an operator reconciles. Do not silently drop.
        this.store.audit("payment.capture_state_conflict", paymentId, { capture_id: cap.capture_id, status: this.store.getPayment(paymentId)!.status });
        return;
      }
      this.store.audit("payment.captured", paymentId, { capture_id: cap.capture_id, status: cap.status, invoice_id: invoiceId ?? null });
      if (snapshot && this.receipts) {
        try { this.receipts.issue({ payment_id: paymentId, order_snapshot: snapshot, authorization_id: auth.authorization_id,
          capture: { capture_id: cap.capture_id, status: cap.status, invoice_id: invoiceId } }); }
        catch (e) { this.store.audit("receipt.issue_failed", paymentId, { error: (e as Error).message.slice(0, 500) }); }
      }
      const s = this.store.spendState(pay.mandate_id);
      if (s.tx_count >= sm.mandate.constraints.max_transactions || s.spent_minor >= toMinor(sm.mandate.constraints.max_total)) {
        this.store.setMandateStatus(pay.mandate_id, "exhausted"); this.store.audit("mandate.exhausted", pay.mandate_id, s);
      }
    } catch (e) {
      const msg = (e as Error).message;
      if (authId) return abort(["reserved", "authorized"], `execute error: ${msg}`);
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
  if (c.require_merchant_order !== undefined && typeof c.require_merchant_order !== "boolean") throw new GatewayError(400, "constraints.require_merchant_order must be boolean");
  if (c.sku_allowlist !== undefined && (!Array.isArray(c.sku_allowlist) || c.sku_allowlist.some(s => typeof s !== "string" || !s.trim() || s.length > 127)))
    throw new GatewayError(400, "constraints.sku_allowlist must be an array of non-empty strings");
}
const SERVER_FIELDS = ["facts_source", "order_digest", "order_total_minor"] as const;
/** Two request shapes. With paypal_order_id the agent may not also declare payee/currency/items: PayPal supplies them. */
function toProposal(body: any): PaymentProposal {
  if (!body || typeof body !== "object") throw new GatewayError(400, "body must be an object");
  for (const k of SERVER_FIELDS) if (k in body) throw new GatewayError(400, `${k} is set by AgentGuard, not the agent`);
  if (body.paypal_order_id !== undefined) {
    for (const k of ["mandate_id", "agent_id", "idempotency_key", "paypal_order_id"]) if (typeof body[k] !== "string" || !body[k]) throw new GatewayError(400, `${k} is required`);
    if (!/^[A-Z0-9]{8,32}$/.test(body.paypal_order_id)) throw new GatewayError(400, "paypal_order_id is not a PayPal order id");
    for (const k of ["payee", "currency", "items"]) if (k in body) throw new GatewayError(400, `${k} comes from the PayPal order; do not send it with paypal_order_id`);
    return { mandate_id: body.mandate_id, agent_id: body.agent_id, idempotency_key: body.idempotency_key, paypal_order_id: body.paypal_order_id,
      context: body.context, agent_rationale: body.agent_rationale, payee: {}, currency: "", items: [], facts_source: "paypal_order" };
  }
  validateProposal(body);
  return { ...body, facts_source: "agent_declared" };
}
function validateProposal(p: PaymentProposal) {
  for (const k of ["mandate_id", "agent_id", "idempotency_key", "currency"] as const) if (typeof p?.[k] !== "string" || !p[k]) throw new GatewayError(400, `${k} is required`);
  if (!Array.isArray(p.items) || !p.items.length || p.items.length > 50) throw new GatewayError(400, "items must be 1..50");
  for (const i of p.items) if (!["PHYSICAL_GOODS", "DIGITAL_GOODS", "DONATION"].includes(i.category)) throw new GatewayError(400, `invalid category for ${i.name}`);
  if (!p.payee || typeof p.payee !== "object") throw new GatewayError(400, "payee is required");
}

/** Fail closed: PayPal must report the exact payee we sent (merchant_id if proposed, else email) and no conflicting id. */
export function verifyObserved(p: PaymentProposal, amountMinor: number,
  o: { currency: string; amountMinor: number; payee: { merchant_id?: string; email_address?: string } }): string[] {
  const out: string[] = [];
  if (o.currency !== p.currency) out.push(`currency ${o.currency}`);
  if (o.amountMinor !== amountMinor) out.push(`amount ${o.amountMinor} != ${amountMinor}`);
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const wantM = norm(p.payee.merchant_id), wantE = norm(p.payee.email_address);
  const gotM = norm(o.payee?.merchant_id), gotE = norm(o.payee?.email_address);
  if (!gotM && !gotE) out.push("PayPal reported no payee");
  else if (wantM) {
    if (gotM !== wantM) out.push(`payee merchant_id ${gotM || "(none)"} != ${wantM}`);
    if (wantE && gotE && gotE !== wantE) out.push(`payee email ${gotE} != ${wantE}`);
  } else if (wantE) {
    if (gotE !== wantE) out.push(`payee email ${gotE || "(none)"} != ${wantE}`);
  } else out.push("proposal has no payee identifier");
  return out;
}
