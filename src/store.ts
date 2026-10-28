import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { canonical, sha256 } from "./canonical.ts";
import type { MandateStatus, SignedMandate, UserSignature } from "./types.ts";

export type PaymentStatus = "rejected" | "needs_human" | "reserved" | "authorized" | "captured" | "voided" | "failed" | "denied";
/** Statuses that hold budget. A rejected/voided/failed/denied payment releases it. */
const HOLDS = "('needs_human','reserved','authorized','captured')";

export interface PaymentRow {
  payment_id: string; mandate_id: string; agent_id: string; idempotency_key: string; proposal_hash: string;
  amount_minor: number; currency: string; status: PaymentStatus; evaluation: string; proposal: string;
  paypal_order_id: string | null; paypal_authorization_id: string | null; paypal_capture_id: string | null;
  error: string | null; created_at: string; updated_at: string;
}

export class Store {
  db: DatabaseSync;
  constructor(path = process.env.AGENTGUARD_DB ?? "./data/agentguard.db") {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS mandates (
        mandate_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, agent_id TEXT NOT NULL, body TEXT NOT NULL,
        mandate_hash TEXT NOT NULL, signature TEXT, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY, mandate_id TEXT NOT NULL REFERENCES mandates(mandate_id), agent_id TEXT NOT NULL,
        idempotency_key TEXT NOT NULL, proposal_hash TEXT NOT NULL, amount_minor INTEGER NOT NULL, currency TEXT NOT NULL,
        status TEXT NOT NULL, evaluation TEXT NOT NULL, proposal TEXT NOT NULL,
        paypal_order_id TEXT, paypal_authorization_id TEXT, paypal_capture_id TEXT, error TEXT,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (mandate_id, agent_id, idempotency_key));
      CREATE TABLE IF NOT EXISTS approvals (
        approval_id TEXT PRIMARY KEY, payment_id TEXT NOT NULL REFERENCES payments(payment_id), proposal_hash TEXT NOT NULL,
        expires_at TEXT NOT NULL, resolved_at TEXT, resolution TEXT);
      CREATE TABLE IF NOT EXISTS audit (
        seq INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, event TEXT NOT NULL, ref TEXT, payload TEXT NOT NULL,
        prev_hash TEXT NOT NULL, hash TEXT NOT NULL);
      CREATE TRIGGER IF NOT EXISTS audit_no_update BEFORE UPDATE ON audit BEGIN SELECT RAISE(ABORT,'audit log is append-only'); END;
      CREATE TRIGGER IF NOT EXISTS audit_no_delete BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT,'audit log is append-only'); END;`);
    this.migrate();
  }

  /**
   * v2: mandates are signed by the user's passkey, not by the server. Mandates activated under the old
   * server-key scheme are moved to 'unsigned' and are never enforced until the user re-signs them.
   */
  private migrate(): void {
    const cols = (this.db.prepare("PRAGMA table_info(mandates)").all() as any[]).map(c => c.name);
    if (!cols.includes("user_signature")) this.db.exec("ALTER TABLE mandates ADD COLUMN user_signature TEXT");
    if (!cols.includes("revocation_signature")) this.db.exec("ALTER TABLE mandates ADD COLUMN revocation_signature TEXT");
    const legacy = this.db.prepare("SELECT mandate_id, status FROM mandates WHERE user_signature IS NULL AND status='active'").all() as any[];
    for (const r of legacy) {
      this.db.prepare("UPDATE mandates SET status='unsigned', updated_at=? WHERE mandate_id=?").run(new Date().toISOString(), r.mandate_id);
      this.audit("mandate.migrated_unsigned", r.mandate_id, { previous_status: r.status, reason: "server-signed mandate; user passkey signature required" });
    }
  }

  /** Runs fn inside BEGIN IMMEDIATE so concurrent proposals serialize on the write lock (no double-spend of budget). */
  tx<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try { const r = fn(); this.db.exec("COMMIT"); return r; } catch (e) { this.db.exec("ROLLBACK"); throw e; }
  }

  // ---- audit: hash-chained, append-only ----
  audit(event: string, ref: string | null, payload: unknown): void {
    const prev = (this.db.prepare("SELECT hash FROM audit ORDER BY seq DESC LIMIT 1").get() as any)?.hash ?? "GENESIS";
    const ts = new Date().toISOString();
    const body = canonical(payload);
    const hash = sha256(`${prev}|${ts}|${event}|${ref ?? ""}|${body}`);
    this.db.prepare("INSERT INTO audit (ts,event,ref,payload,prev_hash,hash) VALUES (?,?,?,?,?,?)").run(ts, event, ref, body, prev, hash);
  }
  verifyAuditChain(): { ok: boolean; brokenAt?: number; length: number } {
    const rows = this.db.prepare("SELECT * FROM audit ORDER BY seq").all() as any[];
    let prev = "GENESIS";
    for (const r of rows) {
      const h = sha256(`${prev}|${r.ts}|${r.event}|${r.ref ?? ""}|${r.payload}`);
      if (r.prev_hash !== prev || r.hash !== h) return { ok: false, brokenAt: r.seq, length: rows.length };
      prev = r.hash;
    }
    return { ok: true, length: rows.length };
  }
  auditLog(limit = 200): any[] {
    return (this.db.prepare("SELECT * FROM audit ORDER BY seq DESC LIMIT ?").all(limit) as any[]).map(r => ({ ...r, payload: JSON.parse(r.payload) }));
  }

  // ---- mandates ----
  insertMandate(sm: SignedMandate): void {
    const now = new Date().toISOString(); const m = sm.mandate;
    this.db.prepare(`INSERT INTO mandates (mandate_id,user_id,agent_id,body,mandate_hash,signature,status,created_at,updated_at,user_signature,revocation_signature)
      VALUES (?,?,?,?,?,NULL,?,?,?,?,?)`).run(m.mandate_id, m.user_id, m.agent_id, canonical(m), sm.mandate_hash, sm.status, now, now,
        sm.user_signature ? canonical(sm.user_signature) : null, sm.revocation_signature ? canonical(sm.revocation_signature) : null);
  }
  getMandate(id: string): SignedMandate | null {
    const r = this.db.prepare("SELECT * FROM mandates WHERE mandate_id=?").get(id) as any;
    return r ? { mandate: JSON.parse(r.body), mandate_hash: r.mandate_hash, status: r.status,
      user_signature: r.user_signature ? JSON.parse(r.user_signature) : null,
      revocation_signature: r.revocation_signature ? JSON.parse(r.revocation_signature) : null } : null;
  }
  listMandates(): SignedMandate[] {
    return (this.db.prepare("SELECT mandate_id FROM mandates ORDER BY created_at DESC").all() as any[]).map(r => this.getMandate(r.mandate_id)!);
  }
  /** CAS draft|unsigned -> active with the user's signature. */
  setMandateSigned(id: string, sig: UserSignature): boolean {
    const r = this.db.prepare("UPDATE mandates SET user_signature=?, status='active', updated_at=? WHERE mandate_id=? AND status IN ('draft','unsigned')")
      .run(canonical(sig), new Date().toISOString(), id);
    return Number(r.changes) === 1;
  }
  setMandateRevoked(id: string, sig: UserSignature | null): void {
    this.db.prepare("UPDATE mandates SET status='revoked', revocation_signature=?, updated_at=? WHERE mandate_id=?")
      .run(sig ? canonical(sig) : null, new Date().toISOString(), id);
  }
  setMandateStatus(id: string, status: MandateStatus): void {
    this.db.prepare("UPDATE mandates SET status=?, updated_at=? WHERE mandate_id=?").run(status, new Date().toISOString(), id);
  }

  // ---- spend state ----
  spendState(mandateId: string) {
    const r = this.db.prepare(`SELECT
        COALESCE(SUM(CASE WHEN status='captured' THEN amount_minor END),0) AS spent_minor,
        COALESCE(SUM(CASE WHEN status IN ('needs_human','reserved','authorized') THEN amount_minor END),0) AS reserved_minor,
        COUNT(CASE WHEN status IN ${HOLDS} THEN 1 END) AS tx_count
      FROM payments WHERE mandate_id=?`).get(mandateId) as any;
    return { spent_minor: Number(r.spent_minor), reserved_minor: Number(r.reserved_minor), tx_count: Number(r.tx_count) };
  }

  // ---- payments ----
  findPayment(mandateId: string, agentId: string, key: string): PaymentRow | null {
    return (this.db.prepare("SELECT * FROM payments WHERE mandate_id=? AND agent_id=? AND idempotency_key=?").get(mandateId, agentId, key) as any) ?? null;
  }
  getPayment(id: string): PaymentRow | null { return (this.db.prepare("SELECT * FROM payments WHERE payment_id=?").get(id) as any) ?? null; }
  listPayments(limit = 200): PaymentRow[] { return this.db.prepare("SELECT * FROM payments ORDER BY created_at DESC LIMIT ?").all(limit) as any[]; }
  /** Payments still in reserved or authorized that have not been updated since `olderThanIso`. */
  listStuck(olderThanIso: string): PaymentRow[] {
    return this.db.prepare(`SELECT * FROM payments WHERE status IN ('reserved','authorized') AND updated_at < ? ORDER BY updated_at`).all(olderThanIso) as any[];
  }
  insertPayment(p: Omit<PaymentRow, "paypal_order_id" | "paypal_authorization_id" | "paypal_capture_id" | "error" | "created_at" | "updated_at">): void {
    const now = new Date().toISOString();
    this.db.prepare(`INSERT INTO payments (payment_id,mandate_id,agent_id,idempotency_key,proposal_hash,amount_minor,currency,status,evaluation,proposal,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(p.payment_id, p.mandate_id, p.agent_id, p.idempotency_key, p.proposal_hash, p.amount_minor, p.currency, p.status, p.evaluation, p.proposal, now, now);
  }
  /** Compare-and-set status transition; returns false if the row was not in `from`. */
  transition(id: string, from: PaymentStatus[], to: PaymentStatus, fields: Partial<PaymentRow> = {}): boolean {
    const sets = ["status=?", "updated_at=?", ...Object.keys(fields).map(k => `${k}=?`)].join(",");
    const r = this.db.prepare(`UPDATE payments SET ${sets} WHERE payment_id=? AND status IN (${from.map(() => "?").join(",")})`)
      .run(to, new Date().toISOString(), ...Object.values(fields) as any[], id, ...from);
    return Number(r.changes) === 1;
  }

  // ---- human approvals ----
  insertApproval(a: { approval_id: string; payment_id: string; proposal_hash: string; expires_at: string }): void {
    this.db.prepare("INSERT INTO approvals (approval_id,payment_id,proposal_hash,expires_at) VALUES (?,?,?,?)").run(a.approval_id, a.payment_id, a.proposal_hash, a.expires_at);
  }
  getApproval(id: string): any { return this.db.prepare("SELECT * FROM approvals WHERE approval_id=?").get(id); }
  pendingApprovals(): any[] {
    return this.db.prepare(`SELECT a.*, p.proposal, p.evaluation, p.amount_minor, p.currency, p.mandate_id FROM approvals a
      JOIN payments p USING(payment_id) WHERE a.resolved_at IS NULL ORDER BY a.expires_at`).all() as any[];
  }
  /** Single-use: only succeeds once. */
  resolveApproval(id: string, resolution: "approved" | "denied" | "expired"): boolean {
    const r = this.db.prepare("UPDATE approvals SET resolved_at=?, resolution=? WHERE approval_id=? AND resolved_at IS NULL").run(new Date().toISOString(), resolution, id);
    return Number(r.changes) === 1;
  }
}
