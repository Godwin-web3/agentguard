/**
 * The subset of node:crypto the intent verifier uses, implemented in pure JS so the SAME verifier code runs in the browser:
 * SHA-1/2 hashes, Ed25519 / ECDSA P-256 & P-384 / RSA PKCS#1 v1.5 & PSS signature verification, SPKI keys and X.509 parsing.
 * Verification only: there is no signing or private-key code here.
 */
import { Buffer } from "./buffer-shim.ts";
import { sha256, sha384, sha512 } from "@noble/hashes/sha2.js";
import { sha1 } from "@noble/hashes/legacy.js";
import { ed25519 } from "@noble/curves/ed25519.js";
import { p256, p384 } from "@noble/curves/nist.js";

type Bytes = Uint8Array;
const HASHES: Record<string, { fn: (b: Bytes) => Bytes; len: number; di: string }> = {
  sha1: { fn: sha1, len: 20, di: "3021300906052b0e03021a05000414" },
  sha256: { fn: sha256, len: 32, di: "3031300d060960864801650304020105000420" },
  sha384: { fn: sha384, len: 48, di: "3041300d060960864801650304020205000430" },
  sha512: { fn: sha512, len: 64, di: "3051300d060960864801650304020305000440" },
};
const H = (alg: string) => { const h = HASHES[String(alg).toLowerCase().replace("-", "")]; if (!h) throw new Error(`unsupported hash ${alg}`); return h; };
const bytes = (v: string | Bytes) => typeof v === "string" ? Buffer.from(v, "utf8") : v;
const concat = (...a: Bytes[]) => { const o = new Uint8Array(a.reduce((s, x) => s + x.length, 0)); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; };

export function createHash(alg: string) {
  const parts: Bytes[] = []; const h = H(alg);
  const o = { update(v: string | Bytes) { parts.push(bytes(v)); return o; },
    digest(enc?: string): any { const d = Buffer.from(h.fn(concat(...parts))); return enc ? d.toString(enc as any) : d; } };
  return o;
}

// ---- DER ----
export interface Node { tag: number; start: number; hdr: number; end: number; buf: Bytes; kids?: Node[] }
export function der(buf: Bytes, off = 0): Node {
  const tag = buf[off]; let p = off + 1; let len = buf[p++];
  if (len & 0x80) { const n = len & 0x7f; if (n < 1 || n > 4) throw new Error("bad DER length"); len = 0; for (let i = 0; i < n; i++) len = len * 256 + buf[p++]; }
  const end = p + len; if (end > buf.length) throw new Error("truncated DER");
  const node: Node = { tag, start: off, hdr: p - off, end, buf };
  if (tag & 0x20) { node.kids = []; let q = p; while (q < end) { const k = der(buf, q); node.kids.push(k); q = k.end; } }
  return node;
}
const body = (n: Node) => n.buf.subarray(n.start + n.hdr, n.end);
const raw = (n: Node) => n.buf.subarray(n.start, n.end);
function oid(n: Node): string {
  const b = body(n); const out = [Math.floor(b[0] / 40), b[0] % 40]; let v = 0;
  for (let i = 1; i < b.length; i++) { v = v * 128 + (b[i] & 0x7f); if (!(b[i] & 0x80)) { out.push(v); v = 0; } }
  return out.join(".");
}
const big = (b: Bytes) => b.length ? BigInt("0x" + Buffer.from(b).toString("hex")) : 0n;
const unbig = (n: bigint, len: number) => { const h = n.toString(16).padStart(len * 2, "0"); if (h.length > len * 2) throw new Error("integer too large"); return Buffer.from(h, "hex"); };
const tlv = (tag: number, v: Bytes) => { const l = v.length; const len = l < 128 ? [l] : l < 256 ? [0x81, l] : [0x82, l >> 8, l & 255]; return concat(new Uint8Array([tag, ...len]), v); };
const pemToDer = (pem: string) => Buffer.from(pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, ""), "base64");

// ---- public keys ----
type Kind = { type: "ed25519"; x: Bytes } | { type: "ec"; curve: "P-256" | "P-384"; point: Bytes } | { type: "rsa"; n: bigint; e: bigint; bits: number };
export class KeyObject {
  constructor(readonly k: Kind, private spkiDer: Bytes) {}
  get asymmetricKeyType() { return this.k.type; }
  export(o: { type: string; format: string }): any {
    if (o.format === "der") return Buffer.from(this.spkiDer);
    const b64 = Buffer.from(this.spkiDer).toString("base64").match(/.{1,64}/g)!.join("\n");
    return `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----\n`;
  }
}
const ED_SPKI = "302a300506032b6570032100";
function fromSpki(d: Bytes): KeyObject {
  const s = der(d); const alg = s.kids![0]; const a = oid(alg.kids![0]); const bits = body(s.kids![1]).subarray(1);
  if (a === "1.3.101.112") return new KeyObject({ type: "ed25519", x: bits }, d);
  if (a === "1.2.840.10045.2.1") {
    const c = oid(alg.kids![1]); const curve = c === "1.2.840.10045.3.1.7" ? "P-256" : c === "1.3.132.0.34" ? "P-384" : null;
    if (!curve) throw new Error(`unsupported curve ${c}`); return new KeyObject({ type: "ec", curve, point: bits }, d);
  }
  if (a === "1.2.840.113549.1.1.1" || a === "1.2.840.113549.1.1.10") {
    const r = der(bits); const n = big(body(r.kids![0])), e = big(body(r.kids![1]));
    return new KeyObject({ type: "rsa", n, e, bits: n.toString(2).length }, d);
  }
  throw new Error(`unsupported key algorithm ${a}`);
}
const ub64u = (s: string) => Buffer.from(s, "base64url");
export function createPublicKey(input: any): KeyObject {
  if (input instanceof KeyObject) return input;
  if (typeof input === "string" || input instanceof Uint8Array) return fromSpki(typeof input === "string" ? pemToDer(input) : input);
  if (input?.format === "jwk") {
    const j = input.key;
    if (j.kty === "OKP" && j.crv === "Ed25519") { const x = ub64u(j.x); return new KeyObject({ type: "ed25519", x }, concat(Buffer.from(ED_SPKI, "hex"), x)); }
    if (j.kty === "EC" && (j.crv === "P-256" || j.crv === "P-384")) {
      const point = concat(new Uint8Array([4]), ub64u(j.x), ub64u(j.y));
      const curveOid = j.crv === "P-256" ? "06082a8648ce3d030107" : "06052b81040022";
      const spki = tlv(0x30, concat(tlv(0x30, concat(Buffer.from("06072a8648ce3d0201", "hex"), Buffer.from(curveOid, "hex"))), tlv(0x03, concat(new Uint8Array([0]), point))));
      return new KeyObject({ type: "ec", curve: j.crv, point }, spki);
    }
    if (j.kty === "RSA") { const n = big(ub64u(j.n)), e = big(ub64u(j.e)); return new KeyObject({ type: "rsa", n, e, bits: n.toString(2).length }, new Uint8Array()); }
  }
  throw new Error("unsupported public key input");
}

// ---- signature verification ----
export const constants = { RSA_PKCS1_PADDING: 1, RSA_PKCS1_PSS_PADDING: 6, RSA_PSS_SALTLEN_AUTO: -2 };
const modpow = (b: bigint, e: bigint, m: bigint) => { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = r * b % m; e >>= 1n; b = b * b % m; } return r; };
const eq = (a: Bytes, b: Bytes) => a.length === b.length && a.every((v, i) => v === b[i]);
function mgf1(seed: Bytes, len: number, h: (b: Bytes) => Bytes) {
  const out: Bytes[] = []; let n = 0;
  for (let c = 0; n < len; c++) { const d = h(concat(seed, new Uint8Array([c >>> 24, (c >>> 16) & 255, (c >>> 8) & 255, c & 255]))); out.push(d); n += d.length; }
  return concat(...out).subarray(0, len);
}
function rsaVerify(k: Extract<Kind, { type: "rsa" }>, alg: string, data: Bytes, sig: Bytes, pss: boolean): boolean {
  const h = H(alg); const kLen = Math.ceil(k.bits / 8);
  if (sig.length !== kLen) return false;
  const s = big(sig); if (s >= k.n) return false;
  const em = unbig(modpow(s, k.e, k.n), kLen); const mHash = h.fn(data);
  if (!pss) {
    const t = concat(Buffer.from(h.di, "hex"), mHash);
    if (kLen < t.length + 11) return false;
    return eq(em, concat(new Uint8Array([0, 1]), new Uint8Array(kLen - t.length - 3).fill(0xff), new Uint8Array([0]), t));
  }
  const emBits = k.bits - 1, emLen = Math.ceil(emBits / 8);
  if (emLen < kLen && em[0] !== 0) return false;
  const EM = em.subarray(kLen - emLen);
  if (EM[emLen - 1] !== 0xbc || emLen < h.len + 2) return false;
  const masked = EM.subarray(0, emLen - h.len - 1), Hh = EM.subarray(emLen - h.len - 1, emLen - 1);
  const db = mgf1(Hh, masked.length, h.fn).map((b, i) => b ^ masked[i]);
  db[0] &= 0xff >> (8 * emLen - emBits);
  const one = db.findIndex(b => b !== 0); if (one < 0 || db[one] !== 1) return false;
  const salt = db.subarray(one + 1);
  return eq(h.fn(concat(new Uint8Array(8), mHash, salt)), Hh);
}
export function verify(alg: string | null | undefined, data: Bytes, key: any, sig: Bytes): boolean {
  const pss = key && !(key instanceof KeyObject) && typeof key === "object" && !(key instanceof Uint8Array) && key.padding === constants.RSA_PKCS1_PSS_PADDING;
  const ko = createPublicKey(key && !(key instanceof KeyObject) && typeof key === "object" && "key" in key && !("format" in key) ? key.key : key);
  const k = ko.k;
  if (k.type === "ed25519") return ed25519.verify(sig, data, k.x);
  if (k.type === "ec") {
    const c = k.curve === "P-256" ? p256 : p384;
    return c.verify(sig, H(alg ?? "sha256").fn(data), k.point, { prehash: false, lowS: false, format: "der" });
  }
  return rsaVerify(k, alg ?? "sha256", data, sig, !!pss);
}

// ---- X.509 (what an RFC 3161 chain check needs) ----
const NAMES: Record<string, string> = { "2.5.4.3": "CN", "2.5.4.6": "C", "2.5.4.10": "O", "2.5.4.11": "OU", "2.5.4.7": "L", "2.5.4.8": "ST", "1.2.840.113549.1.9.1": "emailAddress", "2.5.4.5": "serialNumber" };
const dn = (n: Node) => n.kids!.flatMap(set => set.kids!.map(atv => `${NAMES[oid(atv.kids![0])] ?? oid(atv.kids![0])}=${Buffer.from(body(atv.kids![1])).toString("utf8")}`)).join("\n");
function time(n: Node): string {
  const s = Buffer.from(body(n)).toString("ascii");
  const m = n.tag === 0x17 ? /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s) : /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s);
  if (!m) throw new Error(`bad certificate time ${s}`);
  const y = n.tag === 0x17 ? (Number(m[1]) >= 50 ? "19" : "20") + m[1] : m[1];
  return new Date(`${y}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`).toUTCString();
}
const SIG: Record<string, { hash: string; pss?: boolean }> = {
  "1.2.840.113549.1.1.5": { hash: "sha1" }, "1.2.840.113549.1.1.11": { hash: "sha256" }, "1.2.840.113549.1.1.12": { hash: "sha384" }, "1.2.840.113549.1.1.13": { hash: "sha512" },
  "1.2.840.10045.4.3.2": { hash: "sha256" }, "1.2.840.10045.4.3.3": { hash: "sha384" }, "1.2.840.10045.4.3.4": { hash: "sha512" },
};
const HOID: Record<string, string> = { "2.16.840.1.101.3.4.2.1": "sha256", "2.16.840.1.101.3.4.2.2": "sha384", "2.16.840.1.101.3.4.2.3": "sha512", "1.3.14.3.2.26": "sha1" };
export class X509Certificate {
  readonly raw: ReturnType<typeof Buffer.from>; readonly subject: string; readonly issuer: string; readonly validFrom: string; readonly validTo: string;
  readonly fingerprint256: string; readonly publicKey: KeyObject; readonly keyUsage: string[] | undefined;
  private tbs: Bytes; private sig: Bytes; private sigAlg: { hash: string; pss?: boolean }; private issuerRaw: Bytes; private subjectRaw: Bytes;
  constructor(input: string | Bytes) {
    const d = typeof input === "string" ? pemToDer(input) : Uint8Array.from(input);
    this.raw = Buffer.from(d);
    const c = der(d); const t = c.kids![0]; const f = t.kids!; const i = f[0].tag === 0xa0 ? 1 : 0;
    this.tbs = raw(t); this.sig = body(c.kids![2]).subarray(1);
    const sa = c.kids![1]; const so = oid(sa.kids![0]);
    if (so === "1.2.840.113549.1.1.10") { const p = sa.kids![1]?.kids?.find(k => k.tag === 0xa0); this.sigAlg = { hash: p ? HOID[oid(p.kids![0].kids![0])] ?? "sha1" : "sha1", pss: true }; }
    else this.sigAlg = SIG[so] ?? { hash: "unsupported:" + so };
    this.issuerRaw = raw(f[i + 2]); this.issuer = dn(f[i + 2]);
    this.validFrom = time(f[i + 3].kids![0]); this.validTo = time(f[i + 3].kids![1]);
    this.subjectRaw = raw(f[i + 4]); this.subject = dn(f[i + 4]);
    this.publicKey = fromSpki(raw(f[i + 5]));
    this.fingerprint256 = Buffer.from(sha256(d)).toString("hex").toUpperCase().match(/../g)!.join(":");
    const ext = f.find(n => n.tag === 0xa3)?.kids![0].kids ?? [];
    const eku = ext.find(e => oid(e.kids![0]) === "2.5.29.37");
    this.keyUsage = eku ? der(body(eku.kids![eku.kids!.length - 1])).kids!.map(oid) : undefined;
  }
  checkIssued(other: X509Certificate): boolean { return eq(this.issuerRaw, other.subjectRaw); }
  verify(key: KeyObject): boolean {
    try { return verify(this.sigAlg.hash, this.tbs, this.sigAlg.pss ? { key, padding: constants.RSA_PKCS1_PSS_PADDING } : key, this.sig); } catch { return false; }
  }
}
export default { createHash, createPublicKey, verify, constants, X509Certificate, KeyObject };
