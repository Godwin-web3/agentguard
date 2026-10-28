import { createHash } from "node:crypto";
import { canonical, sha256 } from "./canonical.ts";
import type { IssuerSigner } from "./keys.ts";
import type { PasskeyService } from "./passkeys.ts";
import type { Store } from "./store.ts";
import { buildAp2 } from "../packages/intent-verifier/src/ap2.ts";
import type { TimestampToken } from "../packages/intent-verifier/src/tsa.ts";
import type { Timestamper } from "./timestamp.ts";
import type { AnchorService, AnchorProof } from "./anchor.ts";

/**
 * Proof-of-Intent receipts. For every captured payment AgentGuard issues one signed, self-contained document
 * that binds what the USER authorized (their passkey-signed mandate) to what PayPal says was bought (the order
 * snapshot AgentGuard read from PayPal before authorizing), the deterministic policy decision, any human
 * approval, and the capture. A merchant can verify it offline with packages/intent-verifier.
 *
 * Wire format (schema agentguard.proof-of-intent/v1):
 *   { "receipt": {...}, "signature": { "alg": "Ed25519", "key_id", "public_key_pem", "value" } }
 * `value` is a detached Ed25519 signature over the UTF-8 bytes of canonical(receipt) (sorted keys, no whitespace).
 * The embedded public key is a convenience; verifiers should pin keys by kid from /.well-known/agentguard-keys.
 */
export const RECEIPT_SCHEMA = "agentguard.proof-of-intent/v1";

export interface ReceiptEnvelope {
  receipt: Record<string, any> & { schema: string; receipt_id: string };
  signature: { alg: "Ed25519"; key_id: string; kid?: string; public_key_pem: string; value: string };
  /** Unsigned, independently verifiable: RFC 3161 tokens over sha256(canonical(receipt)) from external TSAs. */
  timestamps?: TimestampToken[];
  /** Unsigned, independently verifiable: Merkle inclusion of the receipt's spend entries in a TSA-anchored audit head. */
  anchor?: AnchorProof | null;
}

/** Short, stable id for a public key: first 16 bytes of sha256(SPKI DER), hex. */
export function keyId(pem: string): string {
  const der = Buffer.from(pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, ""), "base64");
  return createHash("sha256").update(der).digest("hex").slice(0, 32);
}
/** The PayPal invoice_id AgentGuard stamps on the capture so the receipt can be found from PayPal's side. */
export const receiptReference = (receiptId: string) => `AGPOI-${receiptId}`;
export const receiptIdFor = (paymentId: string) => "poi_" + sha256(`agentguard:receipt:${paymentId}`).slice(0, 24);

export interface IssueInput {
  payment_id: string;
  order_snapshot: any;                      // raw GET /v2/checkout/orders/{id} body that was evaluated + re-checked
  authorization_id: string;
  capture: { capture_id: string; status: string; invoice_id?: string };
}

export class ReceiptService {
  private store: Store; private signer: IssuerSigner; private passkeys: PasskeyService; readonly issuer: string;
  tsa?: Timestamper; anchors?: AnchorService;
  constructor(deps: { store: Store; signer: IssuerSigner; passkeys: PasskeyService; issuer?: string; tsa?: Timestamper; anchors?: AnchorService }) {
    this.store = deps.store; this.signer = deps.signer; this.passkeys = deps.passkeys; this.issuer = deps.issuer ?? "agentguard";
    this.tsa = deps.tsa; this.anchors = deps.anchors;
    this.store.db.exec(`CREATE TABLE IF NOT EXISTS receipts (receipt_id TEXT PRIMARY KEY, payment_id TEXT NOT NULL UNIQUE,
      capture_id TEXT NOT NULL, receipt_hash TEXT NOT NULL, envelope TEXT NOT NULL, issued_at TEXT NOT NULL)`);
    const cols = (this.store.db.prepare("PRAGMA table_info(receipts)").all() as any[]).map(c => c.name);
    if (!cols.includes("timestamps")) this.store.db.exec("ALTER TABLE receipts ADD COLUMN timestamps TEXT");
  }

  /** Issue, then immediately obtain external timestamps (best effort; stampPending() retries). */
  async issueAndStamp(i: IssueInput): Promise<ReceiptEnvelope> {
    const env = this.issue(i);
    await this.stamp(env.receipt.receipt_id);
    return this.get(env.receipt.receipt_id)!;
  }
  /** Get RFC 3161 tokens over the receipt hash. The token proves the signed receipt existed at genTime. */
  async stamp(receiptId: string): Promise<TimestampToken[]> {
    if (!this.tsa || this.tsa.enabled === false) return [];
    const row = this.store.db.prepare("SELECT receipt_hash, timestamps FROM receipts WHERE receipt_id=?").get(receiptId) as any;
    if (!row) throw new Error("receipt not found");
    const have: TimestampToken[] = row.timestamps ? JSON.parse(row.timestamps) : [];
    if (have.length) return have;
    const tokens = await this.tsa.stamp(row.receipt_hash);
    if (!tokens.length) { this.store.audit("receipt.timestamp_failed", receiptId, { receipt_hash: row.receipt_hash }); return []; }
    this.store.db.prepare("UPDATE receipts SET timestamps=? WHERE receipt_id=? AND timestamps IS NULL").run(JSON.stringify(tokens), receiptId);
    this.store.audit("receipt.timestamped", receiptId, { receipt_hash: row.receipt_hash, tsa: tokens.map(t => ({ tsa: t.tsa, gen_time: t.gen_time ?? null })) });
    return tokens;
  }
  async stampPending(): Promise<number> {
    let n = 0;
    for (const r of this.store.db.prepare("SELECT receipt_id FROM receipts WHERE timestamps IS NULL").all() as any[]) if ((await this.stamp(r.receipt_id)).length) n++;
    return n;
  }

  issue(i: IssueInput): ReceiptEnvelope {
    const existing = this.forPayment(i.payment_id);
    if (existing) return existing;
    const pay = this.store.getPayment(i.payment_id);
    if (!pay) throw new Error("payment not found");
    const sm = this.store.getMandate(pay.mandate_id)!;
    if (!sm.user_signature) throw new Error("mandate has no user signature; refusing to issue a receipt");
    const cred = this.passkeys.credentialFor(sm.mandate.user_id);
    if (!cred || cred.credential_id !== sm.user_signature.credential_id) throw new Error("mandate signer credential not registered");
    const proposal = JSON.parse(pay.proposal); const evaluation = JSON.parse(pay.evaluation);
    const approvalRow = this.store.db.prepare("SELECT * FROM approvals WHERE payment_id=? AND resolution='approved'").get(i.payment_id) as any;
    const granted = approvalRow ? this.store.db.prepare("SELECT ts, payload, hash FROM audit WHERE event='approval.granted' AND ref=? ORDER BY seq DESC LIMIT 1").get(i.payment_id) as any : null;
    const evalAt = this.store.db.prepare("SELECT ts FROM audit WHERE event IN ('payment.evaluated','payment.proposed') AND ref=? ORDER BY seq LIMIT 1").get(i.payment_id) as any;
    const head = this.store.db.prepare("SELECT seq, hash, ts FROM audit WHERE event='payment.captured' AND ref=? ORDER BY seq DESC LIMIT 1").get(i.payment_id) as any;
    if (!head) throw new Error("no capture audit entry");
    const origins = Array.isArray(this.passkeys.cfg.origin) ? this.passkeys.cfg.origin : [this.passkeys.cfg.origin];
    const receipt_id = receiptIdFor(i.payment_id);
    const receipt = {
      schema: RECEIPT_SCHEMA,
      receipt_id,
      issuer: { name: this.issuer, key_id: keyId(this.signer.publicKeyPem()), webauthn_rp_id: this.passkeys.cfg.rpID, webauthn_origins: origins },
      issued_at: new Date().toISOString(),
      mandate: {
        body: sm.mandate,
        hash: sm.mandate_hash,
        // The user's passkey assertion whose WebAuthn challenge is base64url(bytes(hash)).
        user_signature: sm.user_signature,
        passkey: { credential_id: cred.credential_id, public_key_cose: cred.public_key, enrollment: this.passkeys.enrollmentFor(sm.mandate.user_id) },
      },
      order: {
        paypal_order_id: proposal.paypal_order_id,
        digest: proposal.order_digest,
        snapshot: i.order_snapshot,
        snapshot_source: "GET /v2/checkout/orders/{id} as read by AgentGuard immediately before authorization",
      },
      decision: {
        decision: evaluation.decision, proposal_hash: evaluation.proposal_hash, amount_minor: evaluation.amount_minor,
        checks: evaluation.checks, risk: evaluation.risk, reasons: evaluation.reasons, evaluated_at: evalAt?.ts ?? pay.created_at,
        agent_id: pay.agent_id, idempotency_key: pay.idempotency_key,
        agent_context: proposal.context ?? [], agent_rationale: proposal.agent_rationale ?? null,
      },
      approval: approvalRow ? {
        approval_id: approvalRow.approval_id, resolution: approvalRow.resolution, resolved_at: approvalRow.resolved_at,
        proposal_hash: approvalRow.proposal_hash, approver: granted ? JSON.parse(granted.payload).approver ?? null : null,
        audit_hash: granted?.hash ?? null,
        // The user's passkey signed approvalChallenge(canonical(statement)); verifiable offline with mandate.passkey.
        ...(() => { const g = granted ? JSON.parse(granted.payload) : {}; return g.method === "passkey"
          ? { method: "passkey", statement: g.statement, assertion: g.user_signature }
          : { method: "admin_token", statement: null, assertion: null }; })(),
      } : null,
      payment: {
        payment_id: pay.payment_id, currency: pay.currency, amount_minor: pay.amount_minor,
        authorization_id: i.authorization_id, capture_id: i.capture.capture_id, capture_status: i.capture.status,
        paypal_invoice_id: i.capture.invoice_id ?? null, proposed_at: pay.created_at, captured_at: head.ts,
      },
      audit: { capture_entry_seq: head.seq, capture_entry_hash: head.hash },
      // The mandate's full capture history up to and including this payment: hash-linked audit entries a verifier
      // recomputes to check cumulative spend against max_total / max_transactions.
      spend: (() => {
        const entries = this.store.spendEntries(sm.mandate.mandate_id, head.seq);
        const last = entries.at(-1); const lp = last ? JSON.parse(last.payload) : null;
        return { mandate_id: sm.mandate.mandate_id, entries, count: lp?.spend_index ?? null, cumulative_minor: lp?.cumulative_minor ?? null };
      })(),
    };
    // AP2-compatible views (Intent/Cart/Payment Mandates + receipts), derived deterministically and covered by the signature.
    (receipt as any).ap2 = buildAp2(receipt);
    const body = canonical(receipt);
    const env: ReceiptEnvelope = { receipt, signature: { alg: "Ed25519", key_id: receipt.issuer.key_id, kid: receipt.issuer.key_id, public_key_pem: this.signer.publicKeyPem(), value: this.signer.sign(body) } };
    const receipt_hash = sha256(body);
    this.store.tx(() => {
      this.store.db.prepare("INSERT INTO receipts (receipt_id,payment_id,capture_id,receipt_hash,envelope,issued_at) VALUES (?,?,?,?,?,?)").run(receipt_id, pay.payment_id, i.capture.capture_id, receipt_hash, JSON.stringify(env), receipt.issued_at);
      this.store.audit("receipt.issued", pay.payment_id, { receipt_id, receipt_hash, capture_id: i.capture.capture_id });
    });
    return env;
  }

  private full(r: any): ReceiptEnvelope | null {
    if (!r) return null;
    const env: ReceiptEnvelope = JSON.parse(r.envelope);
    if (r.timestamps) env.timestamps = JSON.parse(r.timestamps);
    if (this.anchors) {
      const seqs = (env.receipt.spend?.entries ?? []).map((e: any) => e.seq);
      if (!seqs.includes(env.receipt.audit?.capture_entry_seq)) seqs.push(env.receipt.audit?.capture_entry_seq);
      env.anchor = this.anchors.proofFor(seqs.filter((x: any) => Number.isInteger(x)));
    }
    return env;
  }
  get(receiptId: string): ReceiptEnvelope | null {
    return this.full(this.store.db.prepare("SELECT envelope, timestamps FROM receipts WHERE receipt_id=?").get(receiptId));
  }
  forPayment(paymentId: string): ReceiptEnvelope | null {
    return this.full(this.store.db.prepare("SELECT envelope, timestamps FROM receipts WHERE payment_id=?").get(paymentId));
  }
  list(limit = 100): { receipt_id: string; payment_id: string; capture_id: string; receipt_hash: string; issued_at: string }[] {
    return this.store.db.prepare("SELECT receipt_id,payment_id,capture_id,receipt_hash,issued_at FROM receipts ORDER BY issued_at DESC LIMIT ?").all(limit) as any[];
  }
}
