// Independent, in-browser re-verification of the hash-chained audit ledger, row by row.
// Each entry's hash is sha256(prev_hash | ts | event | ref | canonical(payload)) (src/store.ts); recomputing it here
// means the console does not have to trust the server's own /v1/audit/verify answer.

export type ChainStatus = "verified" | "broken" | "unlinked";
export interface ChainResult { status: ChainStatus; detail: string; computed: string }
export interface AuditRow { seq: number; ts: string; event: string; ref: string | null; payload: unknown; prev_hash: string; hash: string }

export const canon = (v: any): string => v === null || typeof v !== "object" ? JSON.stringify(v) : Array.isArray(v) ? "[" + v.map(canon).join(",") + "]"
  : "{" + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";

export async function sha256Hex(s: string): Promise<string> {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  return Array.from(d, b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies every loaded entry: its own hash, and its link to the previous entry when that entry is loaded too.
 * The oldest loaded entry of a partial window links to an entry outside it ("unlinked" only when seq > 1 and the
 * previous entry was not loaded; its own hash is still checked).
 */
export async function verifyChainRows(rows: AuditRow[]): Promise<Map<number, ChainResult>> {
  const out = new Map<number, ChainResult>();
  const asc = [...rows].sort((a, b) => a.seq - b.seq);
  const bySeq = new Map(asc.map(r => [r.seq, r]));
  let broken = false;
  for (const r of asc) {
    const payload = typeof r.payload === "string" ? r.payload : canon(r.payload);
    const computed = await sha256Hex(`${r.prev_hash}|${r.ts}|${r.event}|${r.ref ?? ""}|${payload}`);
    const prev = bySeq.get(r.seq - 1);
    if (computed !== r.hash) { broken = true; out.set(r.seq, { status: "broken", detail: "entry hash does not match its contents", computed }); continue; }
    if (r.seq === 1 && r.prev_hash !== "GENESIS") { broken = true; out.set(r.seq, { status: "broken", detail: "first entry does not start at GENESIS", computed }); continue; }
    if (prev && prev.hash !== r.prev_hash) { broken = true; out.set(r.seq, { status: "broken", detail: `prev_hash does not match entry #${prev.seq}`, computed }); continue; }
    if (broken) { out.set(r.seq, { status: "broken", detail: "follows a broken entry", computed }); continue; }
    if (!prev && r.seq > 1) { out.set(r.seq, { status: "unlinked", detail: `hash ok; entry #${r.seq - 1} not loaded`, computed }); continue; }
    out.set(r.seq, { status: "verified", detail: "hash and link recomputed in this browser", computed });
  }
  return out;
}
