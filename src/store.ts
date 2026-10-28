import { SqliteSql, type Sql } from "./db.ts";
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

export interface AuditEntry { seq: number; ts: string; event: string; ref: string | null; payload: string; prev_hash: string; hash: string }

export class Store {
  db: Sql;
  /** A path (SQLite) or an open Sql backend. Postgres schema is applied by db/postgres.sql, not here. */
  constructor(pathOrDb: string | Sql = process.env.AGENTGUARD_DB ?? "./data/agentguard.db") {
    this.db = typeof pathOrDb === "string" ? SqliteSql.openSync(pathOrDb) : pathOrDb;
    this.db.ddl(`
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
   * SQLite legacy migrations (sync, at open). v2: mandates are signed by the user's passkey, not by the server;
   * mandates activated under the old server-key scheme move to 'unsigned' until the user re-signs them.
   */
  private migrate(): void {
    if (!(this.db instanceof SqliteSql)) return;
    const raw = this.db.raw;
    const cols = this.db.columns("mandates");
    if (!cols.includes("user_signature")) raw.exec("ALTER TABLE mandates ADD COLUMN user_signature TEXT");
    if (!cols.includes("revocation_signature")) raw.exec("ALTER TABLE mandates ADD COLUMN revocation_signature TEXT");
    // v3: human approvals are passkey-signed over a per-request nonce.
    const acols = this.db.columns("approvals");
    if (!acols.includes("nonce")) raw.exec("ALTER TABLE approvals ADD COLUMN nonce TEXT");
    if (!acols.includes("nonce_expires_at")) raw.exec("ALTER TABLE approvals ADD COLUMN nonce_expires_at TEXT");
    if (!acols.includes("decision_request")) raw.exec("ALTER TABLE approvals ADD COLUMN decision_request TEXT");
    const legacy = raw.prepare("SELECT mandate_id, status FROM mandates WHERE user_signature IS NULL AND status='active'").all() as any[];
    for (const r of legacy) {
      raw.prepare("UPDATE mandates SET status='unsigned', updated_at=? WHERE mandate_id=?").run(new Date().toISOString(), r.mandate_id as string);
      const prev = (raw.prepare("SELECT hash FROM audit ORDER BY seq DESC LIMIT 1").get() as any)?.hash ?? "GENESIS";
      const ts = new Date().toISOString(); const body = canonical({ previous_status: r.status, reason: "server-signed mandate; user passkey signature required" });
      const hash = sha256(`${prev}|${ts}|mandate.migrated_unsigned|${r.mandate_id}|${body}`);
      raw.prepare("INSERT INTO audit (ts,event,ref,payload,prev_hash,hash) VALUES (?,?,?,?,?,?)").run(ts, "mandate.migrated_unsigned", r.mandate_id as string, body, prev, hash);
    }
  }

  /**
   * Serializes writers: SQLite BEGIN IMMEDIATE; Postgres BEGIN + a transaction-scoped advisory lock, so concurrent
   * serverless instances cannot double-reserve budget or fork the audit chain. Reentrant per async context.
   */
  tx<T>(fn: () => Promise<T>): Promise<T> { return this.db.tx(fn); }

  // ---- audit: hash-chained, append-only ----
  /** Appends one hash-linked entry. Always inside tx() so the read of the chain head and the insert are atomic. */
  async audit(event: string, ref: string | null, payload: unknown): Promise<AuditEntry> {
    return this.tx(async () => {
      const prev = (await this.db.prepare("SELECT hash FROM audit ORDER BY seq DESC LIMIT 1").get() as any)?.hash ?? "GENESIS";
      const ts = new Date().toISOString();
      const body = canonical(payload);
      const hash = sha256(`${prev}|${ts}|${event}|${ref ?? ""}|${body}`);
      const r = await this.db.prepare("INSERT INTO audit (ts,event,ref,payload,prev_hash,hash) VALUES (?,?,?,?,?,?) RETURNING seq").get(ts, event, ref, body, prev, hash);
      return { seq: Number(r.seq), ts, event, ref, payload: body, prev_hash: prev, hash };
    });
  }
  async auditEntry(seq: number): Promise<AuditEntry | null> {
    const r = await this.db.prepare("SELECT * FROM audit WHERE seq=?").get(seq) as any;
    return r ? { seq: Number(r.seq), ts: r.ts, event: r.event, ref: r.ref, payload: r.payload, prev_hash: r.prev_hash, hash: r.hash } : null;
  }
  /** Entry hashes in seq order, 1..size (the leaves of the anchored Merkle tree). */
  async auditHashes(size?: number): Promise<string[]> {
    return (await this.db.prepare(`SELECT hash FROM audit ORDER BY seq ${size ? "LIMIT ?" : ""}`).all(...(size ? [size] : [])) as any[]).map(r => r.hash);
  }

  /**
   * Per-mandate spend chain. Every capture appends an audit entry carrying the running total and the hash of the
   * mandate's previous capture entry, so a receipt can carry the mandate's whole capture history and a verifier can
   * recompute cumulative spend (and prove each entry is in the anchored log). Call inside tx().
   */
  async appendSpend(event: "payment.captured" | "payment.recovered_captured", paymentId: string, mandateId: string, amountMinor: number, currency: string,
    extra: Record<string, unknown>): Promise<AuditEntry> {
    const prev = (await this.spendEntries(mandateId)).at(-1);
    const pp = prev ? JSON.parse(prev.payload) : null;
    let base: Record<string, unknown> = {};
    if (!prev) {
      // Captures recorded before the spend chain existed are not hash-linked; disclose them as an attested prefix.
      const legacy = await this.db.prepare("SELECT COUNT(*) n, COALESCE(SUM(amount_minor),0) s FROM payments WHERE mandate_id=? AND status='captured' AND payment_id<>?").get(mandateId, paymentId) as any;
      if (Number(legacy.n) > 0) base = { unchained_prior: { count: Number(legacy.n), amount_minor: Number(legacy.s) } };
    }
    const priorMinor = pp ? Number(pp.cumulative_minor) : Number((base.unchained_prior as any)?.amount_minor ?? 0);
    const priorCount = pp ? Number(pp.spend_index) : Number((base.unchained_prior as any)?.count ?? 0);
    return await this.audit(event, paymentId, { ...extra, ...base, mandate_id: mandateId, amount_minor: amountMinor, currency,
      spend_index: priorCount + 1, cumulative_minor: priorMinor + amountMinor, prev_spend_hash: prev?.hash ?? null });
  }
  async spendEntries(mandateId: string, uptoSeq?: number): Promise<AuditEntry[]> {
    return (await this.db.prepare(`SELECT * FROM audit WHERE event IN ('payment.captured','payment.recovered_captured') AND json_extract(payload,'$.mandate_id')=?
      AND json_extract(payload,'$.spend_index') IS NOT NULL ${uptoSeq ? "AND seq<=?" : ""} ORDER BY seq`).all(...(uptoSeq ? [mandateId, uptoSeq] : [mandateId])) as any[])
      .map(r => ({ seq: Number(r.seq), ts: r.ts, event: r.event, ref: r.ref, payload: r.payload, prev_hash: r.prev_hash, hash: r.hash }));
  }
  async verifyAuditChain(): Promise<{ ok: boolean; brokenAt?: number; length: number }> {
    const rows = await this.db.prepare("SELECT * FROM audit ORDER BY seq").all() as any[];
    let prev = "GENESIS";
    for (const r of rows) {
      const h = sha256(`${prev}|${r.ts}|${r.event}|${r.ref ?? ""}|${r.payload}`);
      if (r.prev_hash !== prev || r.hash !== h) return { ok: false, brokenAt: r.seq, length: rows.length };
      prev = r.hash;
    }
    return { ok: true, length: rows.length };
  }
  async auditLog(limit = 200): Promise<any[]> {
    return (await this.db.prepare("SELECT * FROM audit ORDER BY seq DESC LIMIT ?").all(limit) as any[]).map(r => ({ ...r, payload: JSON.parse(r.payload) }));
  }

  // ---- mandates ----
  async insertMandate(sm: SignedMandate): Promise<void> {
    const now = new Date().toISOString(); const m = sm.mandate;
    await this.db.prepare(`INSERT INTO mandates (mandate_id,user_id,agent_id,body,mandate_hash,signature,status,created_at,updated_at,user_signature,revocation_signature)
      VALUES (?,?,?,?,?,NULL,?,?,?,?,?)`).run(m.mandate_id, m.user_id, m.agent_id, canonical(m), sm.mandate_hash, sm.status, now, now,
        sm.user_signature ? canonical(sm.user_signature) : null, sm.revocation_signature ? canonical(sm.revocation_signature) : null);
  }
  async getMandate(id: string): Promise<SignedMandate | null> {
    const r = await this.db.prepare("SELECT * FROM mandates WHERE mandate_id=?").get(id) as any;
    return r ? { mandate: JSON.parse(r.body), mandate_hash: r.mandate_hash, status: r.status,
      user_signature: r.user_signature ? JSON.parse(r.user_signature) : null,
      revocation_signature: r.revocation_signature ? JSON.parse(r.revocation_signature) : null } : null;
  }
  async listMandates(): Promise<SignedMandate[]> {
    const out: SignedMandate[] = [];
    for (const r of await this.db.prepare("SELECT mandate_id FROM mandates ORDER BY created_at DESC").all()) out.push((await this.getMandate(r.mandate_id))!);
    return out;
  }
  /** CAS draft|unsigned|frozen -> active with the user's signature. */
  async setMandateSigned(id: string, sig: UserSignature): Promise<boolean> {
    const r = await this.db.prepare("UPDATE mandates SET user_signature=?, status='active', updated_at=? WHERE mandate_id=? AND status IN ('draft','unsigned','frozen')")
      .run(canonical(sig), new Date().toISOString(), id);
    return Number(r.changes) === 1;
  }
  async setMandateRevoked(id: string, sig: UserSignature | null): Promise<void> {
    await this.db.prepare("UPDATE mandates SET status='revoked', revocation_signature=?, updated_at=? WHERE mandate_id=?")
      .run(sig ? canonical(sig) : null, new Date().toISOString(), id);
  }
  async setMandateStatus(id: string, status: MandateStatus): Promise<void> {
    await this.db.prepare("UPDATE mandates SET status=?, updated_at=? WHERE mandate_id=?").run(status, new Date().toISOString(), id);
  }

  // ---- spend state ----
  async spendState(mandateId: string) {
    const r = await this.db.prepare(`SELECT
        COALESCE(SUM(CASE WHEN status='captured' THEN amount_minor END),0) AS spent_minor,
        COALESCE(SUM(CASE WHEN status IN ('needs_human','reserved','authorized') THEN amount_minor END),0) AS reserved_minor,
        COUNT(CASE WHEN status IN ${HOLDS} THEN 1 END) AS tx_count
      FROM payments WHERE mandate_id=?`).get(mandateId) as any;
    return { spent_minor: Number(r.spent_minor), reserved_minor: Number(r.reserved_minor), tx_count: Number(r.tx_count) };
  }

  // ---- payments ----
  async findPayment(mandateId: string, agentId: string, key: string): Promise<PaymentRow | null> {
    return (await this.db.prepare("SELECT * FROM payments WHERE mandate_id=? AND agent_id=? AND idempotency_key=?").get(mandateId, agentId, key) as any) ?? null;
  }
  async getPayment(id: string): Promise<PaymentRow | null> { return (await this.db.prepare("SELECT * FROM payments WHERE payment_id=?").get(id) as any) ?? null; }
  async listPayments(limit = 200): Promise<PaymentRow[]> { return await this.db.prepare("SELECT * FROM payments ORDER BY created_at DESC LIMIT ?").all(limit) as any[]; }
  /** Payments still in reserved or authorized that have not been updated since `olderThanIso`. */
  async listStuck(olderThanIso: string): Promise<PaymentRow[]> {
    return await this.db.prepare(`SELECT * FROM payments WHERE status IN ('reserved','authorized') AND updated_at < ? ORDER BY updated_at`).all(olderThanIso) as any[];
  }
  async insertPayment(p: Omit<PaymentRow, "paypal_order_id" | "paypal_authorization_id" | "paypal_capture_id" | "error" | "created_at" | "updated_at"> & { paypal_order_id?: string | null }): Promise<void> {
    const now = new Date().toISOString();
    await this.db.prepare(`INSERT INTO payments (payment_id,mandate_id,agent_id,idempotency_key,proposal_hash,amount_minor,currency,status,evaluation,proposal,paypal_order_id,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(p.payment_id, p.mandate_id, p.agent_id, p.idempotency_key, p.proposal_hash, p.amount_minor, p.currency, p.status, p.evaluation, p.proposal, p.paypal_order_id ?? null, now, now);
  }
  /** Compare-and-set status transition; returns false if the row was not in `from`. */
  async transition(id: string, from: PaymentStatus[], to: PaymentStatus, fields: Partial<PaymentRow> = {}): Promise<boolean> {
    const sets = ["status=?", "updated_at=?", ...Object.keys(fields).map(k => `${k}=?`)].join(",");
    const r = await this.db.prepare(`UPDATE payments SET ${sets} WHERE payment_id=? AND status IN (${from.map(() => "?").join(",")})`)
      .run(to, new Date().toISOString(), ...Object.values(fields) as any[], id, ...from);
    return Number(r.changes) === 1;
  }

  // ---- human approvals ----
  async insertApproval(a: { approval_id: string; payment_id: string; proposal_hash: string; expires_at: string }): Promise<void> {
    await this.db.prepare("INSERT INTO approvals (approval_id,payment_id,proposal_hash,expires_at) VALUES (?,?,?,?)").run(a.approval_id, a.payment_id, a.proposal_hash, a.expires_at);
  }
  async getApproval(id: string): Promise<any> { return await this.db.prepare("SELECT * FROM approvals WHERE approval_id=?").get(id); }
  async pendingApprovals(): Promise<any[]> {
    return await this.db.prepare(`SELECT a.*, p.proposal, p.evaluation, p.amount_minor, p.currency, p.mandate_id FROM approvals a
      JOIN payments p USING(payment_id) WHERE a.resolved_at IS NULL ORDER BY a.expires_at`).all() as any[];
  }
  /** Single-use: only succeeds once. */
  async resolveApproval(id: string, resolution: "approved" | "denied" | "expired"): Promise<boolean> {
    const r = await this.db.prepare("UPDATE approvals SET resolved_at=?, resolution=? WHERE approval_id=? AND resolved_at IS NULL").run(new Date().toISOString(), resolution, id);
    return Number(r.changes) === 1;
  }
}
