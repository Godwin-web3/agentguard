import { canonical, sha256, toMinor } from "./canonical.ts";
import { verifyTimestampToken, type TimestampToken } from "./tsa.ts";
import { DEFAULT_TSA_ROOTS } from "./tsa-roots.ts";
import { verifyInclusion } from "./merkle.ts";
import type { Check } from "./verify.ts";

type Add = (check: string, pass: boolean, detail: string) => void;
const t = (s: any) => new Date(s).getTime();

/** RFC 3161 tokens over sha256(canonical(receipt)). Any token that fails is a failure; returns the earliest proven time. */
export function checkReceiptTimestamps(r: any, tokens: TimestampToken[] | undefined, roots: Record<string, string> | undefined, add: Add): { genTime: string | null } {
  if (!tokens?.length) return { genTime: null };
  const imprint = sha256(canonical(r));
  let best: string | null = null;
  tokens.forEach((tk, i) => {
    const v = verifyTimestampToken(tk.token, imprint, roots ?? DEFAULT_TSA_ROOTS);
    add(`receipt.timestamp[${tk.tsa ?? i}]`, v.ok, v.ok ? `RFC 3161 time ${v.gen_time} from ${v.tsa_subject} (root ${v.root})` : `timestamp invalid: ${v.error}`);
    if (v.ok && v.gen_time && (!best || t(v.gen_time) < t(best))) best = v.gen_time;
  });
  return { genTime: best };
}

/** A compromised issuer key only vouches for receipts an outside TSA proves existed before the compromise. */
export function checkCompromise(r: any, key: { kid: string; compromised_at?: string | null } | undefined, tsaTime: string | null, add: Add): void {
  if (!key?.compromised_at) return;
  const c = t(key.compromised_at);
  const ok = !!tsaTime && t(tsaTime) + 1000 <= c && t(r.issued_at) < c;
  add("issuer.key_compromise", ok, !tsaTime
    ? `key ${key.kid} was compromised at ${key.compromised_at} and this receipt has no valid independent timestamp proving it predates that`
    : ok ? `key ${key.kid} compromised at ${key.compromised_at}; TSA proves receipt existed at ${tsaTime}, before the compromise`
    : `key ${key.kid} compromised at ${key.compromised_at}; receipt timestamped ${tsaTime} / issued ${r.issued_at} at or after the compromise`);
}

const entryHash = (e: any) => sha256(`${e.prev_hash}|${e.ts}|${e.event}|${e.ref ?? ""}|${e.payload}`);

/** Recompute the mandate's cumulative spend from its hash-linked capture entries. */
export function checkSpend(r: any, add: Add, warnings: string[]): void {
  const s = r.spend; const m = r.mandate?.body;
  if (!s) { warnings.push("receipt has no spend history (issued before the spend chain): cumulative spend is attested by the issuer only."); return; }
  const es: any[] = Array.isArray(s.entries) ? s.entries : [];
  let ok = es.length > 0 && !!m && s.mandate_id === m.mandate_id; const why: string[] = [];
  let prevHash: string | null = null, idx = 0, cum = 0, cur: string | null = null;
  es.forEach((e, i) => {
    let p: any; try { p = JSON.parse(e.payload); } catch { ok = false; why.push(`entry ${i} payload unparsable`); return; }
    if (canonical(p) !== e.payload) { ok = false; why.push(`entry ${i} payload not canonical`); }
    if (entryHash(e) !== e.hash) { ok = false; why.push(`entry #${e.seq} hash mismatch`); }
    if (!["payment.captured", "payment.recovered_captured"].includes(e.event)) { ok = false; why.push(`entry #${e.seq} is ${e.event}`); }
    if (p.mandate_id !== m?.mandate_id) { ok = false; why.push(`entry #${e.seq} for another mandate`); }
    if (i === 0) {
      idx = Number(p.unchained_prior?.count ?? 0); cum = Number(p.unchained_prior?.amount_minor ?? 0); cur = p.currency;
      if (p.unchained_prior) warnings.push(`${idx} capture(s) totalling ${(cum / 100).toFixed(2)} predate the spend chain; that prefix is attested by the issuer only.`);
    }
    if (p.prev_spend_hash !== prevHash) { ok = false; why.push(`entry #${e.seq} does not link to the previous capture`); }
    idx += 1; cum += Number(p.amount_minor);
    if (p.spend_index !== idx || p.cumulative_minor !== cum || p.currency !== cur || !(Number(p.amount_minor) > 0)) { ok = false; why.push(`entry #${e.seq} index/total inconsistent`); }
    if (i > 0 && e.seq <= es[i - 1].seq) { ok = false; why.push("entries out of order"); }
    prevHash = e.hash;
  });
  const last = es.at(-1); let lp: any = {}; try { lp = JSON.parse(last?.payload ?? "{}"); } catch {}
  const bound = !!last && last.seq === r.audit?.capture_entry_seq && last.hash === r.audit?.capture_entry_hash && last.ref === r.payment?.payment_id
    && lp.capture_id === r.payment?.capture_id && lp.amount_minor === r.payment?.amount_minor && s.count === idx && s.cumulative_minor === cum;
  if (!bound) { ok = false; why.push("last spend entry is not this capture"); }
  add("spend.chain", ok, ok ? `${es.length} hash-linked capture entr${es.length === 1 ? "y" : "ies"} recomputed: #${idx} total ${(cum / 100).toFixed(2)} ${cur}` : why.join("; ") || "no spend entries");
  const c = m?.constraints ?? {};
  if (c.max_total != null) add("spend.cumulative_limit", cum <= toMinor(c.max_total), `recomputed cumulative ${(cum / 100).toFixed(2)} <= max_total ${c.max_total}`);
  if (c.max_transactions != null) add("spend.transaction_count", idx <= Number(c.max_transactions), `payment #${idx} of max ${c.max_transactions}`);
}

/** Merkle inclusion of the receipt's audit entries in a TSA-anchored audit head. */
export function checkAnchor(r: any, a: any, receiptTsa: string | null, o: { roots?: Record<string, string>; maxLagMs: number; require: boolean }, add: Add, warnings: string[]): void {
  if (!a) {
    if (o.require) add("anchor.present", false, "receipt carries no audit anchor proof");
    else warnings.push("audit chain not yet anchored past this receipt: spend history is not externally anchored (re-fetch the receipt after the next anchor).");
    return;
  }
  const st = a.statement ?? {};
  const sh = sha256(canonical(st));
  add("anchor.statement", sh === a.statement_hash && st.kind === "agentguard.audit-anchor",
    `anchor #${a.anchor_id}: ${st.size} entries, root ${String(st.root).slice(0, 16)}…`);
  let gen: string | null = null;
  (a.timestamps ?? []).forEach((tk: TimestampToken, i: number) => {
    const v = verifyTimestampToken(tk.token, sh, o.roots ?? DEFAULT_TSA_ROOTS);
    add(`anchor.timestamp[${tk.tsa ?? i}]`, v.ok, v.ok ? `anchor existed at ${v.gen_time} (${v.tsa_subject})` : `anchor timestamp invalid: ${v.error}`);
    if (v.ok && v.gen_time && (!gen || t(v.gen_time) < t(gen))) gen = v.gen_time;
  });
  if (!(a.timestamps ?? []).length) add("anchor.timestamp", false, "anchor has no TSA token");
  const need = new Map<number, string>();
  for (const e of r.spend?.entries ?? []) need.set(e.seq, e.hash);
  if (r.audit?.capture_entry_seq) need.set(r.audit.capture_entry_seq, r.audit.capture_entry_hash);
  const bad: number[] = [];
  for (const [seq, h] of need) {
    const p = (a.proofs ?? []).find((p: any) => p.seq === seq);
    if (!p || p.hash !== h || !verifyInclusion(h, p.index, st.size, p.path ?? [], st.root)) bad.push(seq);
  }
  add("anchor.inclusion", need.size > 0 && bad.length === 0, bad.length ? `entries ${bad.join(", ")} not proven in the anchored root` : `${need.size} audit entr${need.size === 1 ? "y" : "ies"} proven in anchored root`);
  if (gen && receiptTsa) {
    const lag = t(gen) - t(receiptTsa);
    add("anchor.lag", lag <= o.maxLagMs, `anchored ${Math.round(lag / 1000)}s after the receipt timestamp (max ${Math.round(o.maxLagMs / 1000)}s)`);
  }
}

/** Passkey swapped via admin-started recovery: flag it and check the time lock was honoured. */
export function checkRecovery(r: any, add: Add, warnings: string[]): void {
  const enr = r.mandate?.passkey?.enrollment;
  if (enr?.via !== "recovery") return;
  const rc = enr.recovery;
  warnings.push(`RECOVERY: this passkey replaced ${enr.replaces} through an admin-started time-locked recovery${rc ? ` (${rc.recovery_id}, started ${rc.started_at}, unlocked ${rc.unlock_at}, user notified: ${rc.notified})` : ""}. Confirm with the user.`);
  const used = [r.approval?.resolved_at, r.decision?.evaluated_at].filter(Boolean);
  const ok = !!rc && t(rc.unlock_at) > t(rc.started_at) && t(rc.completed_at) >= t(rc.unlock_at) && used.every(u => t(u) >= t(rc.completed_at));
  add("passkey.recovery_lock", ok, ok ? `time lock ${rc.started_at} → ${rc.unlock_at} honoured; key used only after ${rc.completed_at}` : "recovered passkey used before its time lock expired (or lock data missing)");
}
export type { Check };
