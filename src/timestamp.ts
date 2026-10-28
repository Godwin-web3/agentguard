import { randomBytes } from "node:crypto";
import { timestampRequest, tokenFromResponse, verifyTimestampToken, type TimestampToken } from "../packages/intent-verifier/src/tsa.ts";
import { DEFAULT_TSA_ROOTS } from "../packages/intent-verifier/src/tsa-roots.ts";

/** Something that can obtain RFC 3161 time-stamp tokens over a SHA-256 digest from independent TSAs. */
export interface Timestamper { enabled?: boolean; stamp(hexDigest: string): Promise<TimestampToken[]>; roots: Record<string, string> }

/**
 * RFC 3161 client. Default TSAs: freetsa.org and Sectigo (both reachable from the box; DigiCert's TSA returned 5xx).
 * Override with AGENTGUARD_TSA_URLS="name=url,name=url". Each token is verified against the pinned roots before
 * it is kept, so a misbehaving TSA can't attach junk. Returns whatever subset succeeded (possibly empty).
 */
export class TsaClient implements Timestamper {
  readonly tsas: { name: string; url: string }[]; readonly roots: Record<string, string>; private http: typeof fetch; private timeoutMs: number;
  constructor(o: { tsas?: { name: string; url: string }[]; roots?: Record<string, string>; fetch?: typeof fetch; timeoutMs?: number } = {}) {
    this.tsas = o.tsas ?? TsaClient.fromEnv(); this.roots = o.roots ?? DEFAULT_TSA_ROOTS; this.http = o.fetch ?? fetch; this.timeoutMs = o.timeoutMs ?? 15_000;
  }
  get enabled(): boolean { return this.tsas.length > 0; }
  static fromEnv(v = process.env.AGENTGUARD_TSA_URLS): { name: string; url: string }[] {
    if (v === "") return [];
    if (!v) return [{ name: "freetsa", url: "https://freetsa.org/tsr" }, { name: "sectigo", url: "https://timestamp.sectigo.com" }];
    return v.split(",").map(s => { const [name, ...u] = s.split("="); return { name: name.trim(), url: u.join("=").trim() }; });
  }
  async stamp(hexDigest: string): Promise<TimestampToken[]> {
    const out = await Promise.all(this.tsas.map(async t => {
      try {
        const res = await this.http(t.url, { method: "POST", headers: { "content-type": "application/timestamp-query" },
          body: new Uint8Array(timestampRequest(hexDigest, randomBytes(8))), signal: AbortSignal.timeout(this.timeoutMs) });
        if (!res.ok) return null;
        const token = tokenFromResponse(Buffer.from(await res.arrayBuffer())).toString("base64");
        const v = verifyTimestampToken(token, hexDigest, this.roots);
        return v.ok ? { tsa: t.name, url: t.url, token, gen_time: v.gen_time } : null;
      } catch { return null; }
    }));
    return out.filter(Boolean) as TimestampToken[];
  }
}
