import { canonical, sha256 } from "./canonical.ts";
import type { Store } from "./store.ts";
import type { Timestamper } from "./timestamp.ts";
import { merkleRoot, inclusionProof } from "../packages/intent-verifier/src/merkle.ts";
import type { TimestampToken } from "../packages/intent-verifier/src/tsa.ts";

export interface AnchorStatement { v: 1; kind: "agentguard.audit-anchor"; issuer: string; size: number; root: string; head_seq: number; head_hash: string }
export interface Anchor { anchor_id: number; statement: AnchorStatement; statement_hash: string; timestamps: TimestampToken[]; anchored_at: string }
export interface AnchorProof extends Anchor { proofs: { seq: number; index: number; hash: string; path: string[] }[] }

/**
 * External anchoring of the audit chain. Periodically, AgentGuard computes an RFC 6962 Merkle root over every audit
 * entry hash so far and gets an RFC 3161 timestamp over sha256(canonical(statement)) from independent TSAs. A receipt
 * then carries inclusion proofs from its spend entries to an anchored root, so rewriting history after the anchor
 * (e.g. dropping an earlier capture to make cumulative spend look smaller) breaks the proof or needs a fresh anchor
 * whose TSA time gives it away. Anchors are public at GET /v1/audit/anchors so anyone can keep copies.
 */
export class AnchorService {
  private store: Store; private tsa: Timestamper; readonly issuer: string;
  constructor(deps: { store: Store; tsa: Timestamper; issuer: string }) {
    this.store = deps.store; this.tsa = deps.tsa; this.issuer = deps.issuer;
    this.store.db.exec(`CREATE TABLE IF NOT EXISTS audit_anchors (anchor_id INTEGER PRIMARY KEY AUTOINCREMENT, size INTEGER NOT NULL, root TEXT NOT NULL,
      statement TEXT NOT NULL, statement_hash TEXT NOT NULL, timestamps TEXT NOT NULL, anchored_at TEXT NOT NULL);
      CREATE TRIGGER IF NOT EXISTS anchors_no_update BEFORE UPDATE ON audit_anchors BEGIN SELECT RAISE(ABORT,'anchors are append-only'); END;
      CREATE TRIGGER IF NOT EXISTS anchors_no_delete BEFORE DELETE ON audit_anchors BEGIN SELECT RAISE(ABORT,'anchors are append-only'); END;`);
  }
  private row(r: any): Anchor | null {
    return r ? { anchor_id: Number(r.anchor_id), statement: JSON.parse(r.statement), statement_hash: r.statement_hash, timestamps: JSON.parse(r.timestamps), anchored_at: r.anchored_at } : null;
  }
  latest(): Anchor | null { return this.row(this.store.db.prepare("SELECT * FROM audit_anchors ORDER BY anchor_id DESC LIMIT 1").get()); }
  list(limit = 100): Anchor[] { return (this.store.db.prepare("SELECT * FROM audit_anchors ORDER BY anchor_id DESC LIMIT ?").all(limit) as any[]).map(r => this.row(r)!); }

  /** Anchor the current head. No-op if nothing was appended since the last anchor. Returns null if no TSA answered. */
  async anchor(): Promise<Anchor | null> {
    const hashes = this.store.auditHashes();
    const last = this.latest();
    if (!hashes.length || (last && last.statement.size === hashes.length)) return last;
    const head = this.store.db.prepare("SELECT seq, hash FROM audit ORDER BY seq LIMIT 1 OFFSET ?").get(hashes.length - 1) as any;
    const statement: AnchorStatement = { v: 1, kind: "agentguard.audit-anchor", issuer: this.issuer, size: hashes.length, root: merkleRoot(hashes),
      head_seq: Number(head.seq), head_hash: head.hash };
    const statement_hash = sha256(canonical(statement));
    const timestamps = await this.tsa.stamp(statement_hash);
    if (!timestamps.length) { this.store.audit("audit.anchor_failed", null, { size: statement.size, root: statement.root, reason: "no TSA token" }); return null; }
    const at = new Date().toISOString();
    const r = this.store.db.prepare("INSERT INTO audit_anchors (size,root,statement,statement_hash,timestamps,anchored_at) VALUES (?,?,?,?,?,?)")
      .run(statement.size, statement.root, canonical(statement), statement_hash, JSON.stringify(timestamps), at);
    this.store.audit("audit.anchored", null, { anchor_id: Number(r.lastInsertRowid), ...statement, statement_hash, tsa: timestamps.map(t => ({ tsa: t.tsa, gen_time: t.gen_time })) });
    return this.row(this.store.db.prepare("SELECT * FROM audit_anchors WHERE anchor_id=?").get(Number(r.lastInsertRowid)));
  }

  /** Inclusion proofs for the given audit seqs against the EARLIEST anchor that covers all of them (closest in time). */
  proofFor(seqs: number[]): AnchorProof | null {
    if (!seqs.length) return null;
    const maxSeq = Math.max(...seqs);
    const pos = this.store.db.prepare("SELECT COUNT(*) n FROM audit WHERE seq<=?").get(maxSeq) as any;
    const a = this.row(this.store.db.prepare("SELECT * FROM audit_anchors WHERE size>=? ORDER BY anchor_id LIMIT 1").get(Number(pos.n)));
    if (!a) return null;
    const leaves = this.store.auditHashes(a.statement.size);
    const seqList = (this.store.db.prepare("SELECT seq FROM audit ORDER BY seq LIMIT ?").all(a.statement.size) as any[]).map(r => Number(r.seq));
    const proofs = seqs.map(seq => { const index = seqList.indexOf(seq); return { seq, index, hash: leaves[index], path: inclusionProof(leaves, index) }; });
    return { ...a, proofs };
  }
}
