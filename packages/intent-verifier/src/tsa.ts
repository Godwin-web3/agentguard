import { X509Certificate, createHash, verify as cverify, constants } from "node:crypto";
import { DEFAULT_TSA_ROOTS } from "./tsa-roots.ts";

/**
 * Offline RFC 3161 time-stamp token verification (no dependencies).
 * Checks: the token's messageImprint equals the digest we expect; the CMS signature over the signed attributes
 * verifies under a certificate in the token; the messageDigest attribute equals the hash of the TSTInfo; that
 * certificate has the timeStamping EKU and chains to a pinned root; every cert in the chain is valid at genTime.
 */
interface Node { tag: number; start: number; hdr: number; len: number; end: number; buf: Buffer; kids?: Node[] }
function parse(buf: Buffer, off = 0): Node {
  const tag = buf[off]; let p = off + 1; let len = buf[p++];
  if (len & 0x80) { const n = len & 0x7f; if (n < 1 || n > 4) throw new Error("bad DER length"); len = 0; for (let i = 0; i < n; i++) len = len * 256 + buf[p++]; }
  const end = p + len; if (end > buf.length) throw new Error("truncated DER");
  const node: Node = { tag, start: off, hdr: p - off, len, end, buf };
  if (tag & 0x20) { node.kids = []; let q = p; while (q < end) { const k = parse(buf, q); node.kids.push(k); q = k.end; } }
  return node;
}
const body = (n: Node) => n.buf.subarray(n.start + n.hdr, n.end);
const raw = (n: Node) => n.buf.subarray(n.start, n.end);
function oid(n: Node): string {
  const b = body(n); const out = [Math.floor(b[0] / 40), b[0] % 40]; let v = 0;
  for (let i = 1; i < b.length; i++) { v = v * 128 + (b[i] & 0x7f); if (!(b[i] & 0x80)) { out.push(v); v = 0; } }
  return out.join(".");
}
function genTime(n: Node): Date {
  const s = body(n).toString("ascii"); const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\.\d+)?Z$/.exec(s);
  if (!m) throw new Error(`bad GeneralizedTime ${s}`);
  return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${m[7] ? m[7].slice(0, 4) : ""}Z`);
}
const HASH: Record<string, string> = { "2.16.840.1.101.3.4.2.1": "sha256", "2.16.840.1.101.3.4.2.2": "sha384", "2.16.840.1.101.3.4.2.3": "sha512", "1.3.14.3.2.26": "sha1" };
const SIGHASH: Record<string, string> = { "1.2.840.113549.1.1.11": "sha256", "1.2.840.113549.1.1.12": "sha384", "1.2.840.113549.1.1.13": "sha512",
  "1.2.840.10045.4.3.2": "sha256", "1.2.840.10045.4.3.3": "sha384", "1.2.840.10045.4.3.4": "sha512" };

export interface TimestampToken { tsa?: string; url?: string; token: string /* base64 DER ContentInfo */; gen_time?: string /* informational; the verifier reads it from the token */ }
export interface TimestampResult { ok: boolean; gen_time?: string; tsa_subject?: string; root?: string; error?: string }

/** Extract the TimeStampToken (ContentInfo) from a TimeStampResp, throwing if the TSA refused. */
export function tokenFromResponse(resp: Buffer): Buffer {
  const r = parse(resp); const status = body(r.kids![0].kids![0]).readUIntBE(0, body(r.kids![0].kids![0]).length);
  if (status > 1 || !r.kids![1]) throw new Error(`TSA refused: status ${status}`);
  return raw(r.kids![1]);
}
/** DER TimeStampReq for a SHA-256 digest, certReq=true, with a random nonce. */
export function timestampRequest(hexDigest: string, nonce: Buffer): Buffer {
  const tlv = (tag: number, v: Buffer) => { const l = v.length; const len = l < 128 ? Buffer.from([l]) : l < 256 ? Buffer.from([0x81, l]) : Buffer.from([0x82, l >> 8, l & 255]); return Buffer.concat([Buffer.from([tag]), len, v]); };
  const algo = tlv(0x30, Buffer.concat([tlv(0x06, Buffer.from("608648016503040201", "hex")), Buffer.from([5, 0])]));
  const imprint = tlv(0x30, Buffer.concat([algo, tlv(0x04, Buffer.from(hexDigest, "hex"))]));
  const n = nonce[0] & 0x80 ? Buffer.concat([Buffer.from([0]), nonce]) : nonce;
  return tlv(0x30, Buffer.concat([Buffer.from([2, 1, 1]), imprint, tlv(0x02, n), Buffer.from([1, 1, 0xff])]));
}

export function verifyTimestampToken(tokenB64: string, expectHexDigest: string, rootsPem: Record<string, string> = DEFAULT_TSA_ROOTS): TimestampResult {
  try {
    const ci = parse(Buffer.from(tokenB64, "base64"));
    if (oid(ci.kids![0]) !== "1.2.840.113549.1.7.2") throw new Error("not CMS SignedData");
    const sd = ci.kids![1].kids![0]; const k = sd.kids!;
    const eci = k[2]; if (oid(eci.kids![0]) !== "1.2.840.113549.1.9.16.1.4") throw new Error("not a TSTInfo");
    const tstDer = body(eci.kids![1].kids![0]);
    const tst = parse(tstDer).kids!;
    const mi = tst[2]; const miAlg = HASH[oid(mi.kids![0].kids![0])]; const miHash = body(mi.kids![1]).toString("hex");
    if (miAlg !== "sha256" || miHash !== expectHexDigest.toLowerCase()) throw new Error("messageImprint does not match the expected digest");
    const gt = genTime(tst[4]);
    const certs = k.filter(n => n.tag === 0xa0).flatMap(n => n.kids!).map(n => new X509Certificate(raw(n)));
    const sis = k[k.length - 1]; if (sis.tag !== 0x31 || !sis.kids?.length) throw new Error("no signerInfo");
    const si = sis.kids[0].kids!;
    const digestAlg = HASH[oid(si[2].kids![0])]; if (!digestAlg || digestAlg === "sha1") throw new Error("unsupported digest algorithm");
    const sa = si[3]; if (sa.tag !== 0xa0) throw new Error("no signed attributes");
    const md = sa.kids!.find(a => oid(a.kids![0]) === "1.2.840.113549.1.9.4");
    if (!md || !body(md.kids![1].kids![0]).equals(createHash(digestAlg).update(tstDer).digest())) throw new Error("messageDigest does not match TSTInfo");
    const ct = sa.kids!.find(a => oid(a.kids![0]) === "1.2.840.113549.1.9.3");
    if (!ct || oid(ct.kids![1].kids![0]) !== "1.2.840.113549.1.9.16.1.4") throw new Error("contentType attribute is not TSTInfo");
    const signed = Buffer.concat([Buffer.from([0x31]), raw(sa).subarray(1)]);
    const sigAlgOid = oid(si[4].kids![0]); const sig = body(si[5]);
    const hash = SIGHASH[sigAlgOid] ?? digestAlg;
    const ok = (c: X509Certificate) => { try {
      if (sigAlgOid === "1.2.840.113549.1.1.10") return cverify(hash, signed, { key: c.publicKey, padding: constants.RSA_PKCS1_PSS_PADDING, saltLength: constants.RSA_PSS_SALTLEN_AUTO }, sig);
      return cverify(hash, signed, c.publicKey, sig); } catch { return false; } };
    const signer = certs.find(ok); if (!signer) throw new Error("CMS signature does not verify under any certificate in the token");
    if (!(signer.keyUsage ?? []).includes("1.3.6.1.5.5.7.3.8")) throw new Error("signer certificate lacks the timeStamping EKU");
    const roots = Object.entries(rootsPem).map(([name, pem]) => ({ name, c: new X509Certificate(pem) }));
    const validAt = (c: X509Certificate) => new Date(c.validFrom) <= gt && gt <= new Date(c.validTo);
    let cur = signer; let root: string | undefined;
    for (let depth = 0; depth < 6 && !root; depth++) {
      if (!validAt(cur)) throw new Error(`certificate ${cur.subject.split("\n").pop()} not valid at ${gt.toISOString()}`);
      const r = roots.find(r => r.c.fingerprint256 === cur.fingerprint256 || (cur.checkIssued(r.c) && cur.verify(r.c.publicKey)));
      if (r) { root = r.name; break; }
      const up = certs.find(c => c !== cur && c.fingerprint256 !== cur.fingerprint256 && cur.checkIssued(c) && cur.verify(c.publicKey));
      if (!up) throw new Error("certificate chain does not reach a pinned TSA root");
      cur = up;
    }
    if (!root) throw new Error("chain too long");
    return { ok: true, gen_time: gt.toISOString(), tsa_subject: signer.subject.split("\n").filter(l => l.startsWith("CN=")).join(","), root };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}
