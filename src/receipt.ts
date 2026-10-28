import { createHash } from "node:crypto";
import { canonical, sha256 } from "./canonical.ts";
import type { IssuerSigner } from "./keys.ts";
import type { PasskeyService } from "./passkeys.ts";
import type { Store } from "./store.ts";
import { buildAp2 } from "../packages/intent-verifier/src/ap2.ts";

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
  constructor(deps: { store: Store; signer: IssuerSigner; passkeys: PasskeyService; issuer?: string }) {
    this.store = deps.store; this.signer = deps.signer; this.passkeys = deps.passkeys; this.issuer = deps.issuer ?? "agentguard";
    this.store.db.exec(`CREATE TABLE IF NOT EXISTS receipts (receipt_id TEXT PRIMARY KEY, payment_id TEXT NOT NULL UNIQUE,
      capture_id TEXT NOT NULL, receipt_hash TEXT NOT NULL, envelope TEXT NOT NULL, issued_at TEXT NOT NULL)`);
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
    };
    // AP2-compatible views (Intent/Cart/Payment Mandates + receipts), derived deterministically and covered by the signature.
    (receipt as any).ap2 = buildAp2(receipt);
    const body = canonical(receipt);
    const env: ReceiptEnvelope = { receipt, signature: { alg: "Ed25519", key_id: receipt.issuer.key_id, kid: receipt.issuer.key_id, public_key_pem: this.signer.publicKeyPem(), value: this.signer.sign(body) } };
    const receipt_hash = sha256(body);
    this.store.tx(() => {
      this.store.db.prepare("INSERT INTO receipts VALUES (?,?,?,?,?,?)").run(receipt_id, pay.payment_id, i.capture.capture_id, receipt_hash, JSON.stringify(env), receipt.issued_at);
      this.store.audit("receipt.issued", pay.payment_id, { receipt_id, receipt_hash, capture_id: i.capture.capture_id });
    });
    return env;
  }

  get(receiptId: string): ReceiptEnvelope | null {
    const r = this.store.db.prepare("SELECT envelope FROM receipts WHERE receipt_id=?").get(receiptId) as any;
    return r ? JSON.parse(r.envelope) : null;
  }
  forPayment(paymentId: string): ReceiptEnvelope | null {
    const r = this.store.db.prepare("SELECT envelope FROM receipts WHERE payment_id=?").get(paymentId) as any;
    return r ? JSON.parse(r.envelope) : null;
  }
  list(limit = 100): { receipt_id: string; payment_id: string; capture_id: string; receipt_hash: string; issued_at: string }[] {
    return this.store.db.prepare("SELECT receipt_id,payment_id,capture_id,receipt_hash,issued_at FROM receipts ORDER BY issued_at DESC LIMIT ?").all(limit) as any[];
  }
}
