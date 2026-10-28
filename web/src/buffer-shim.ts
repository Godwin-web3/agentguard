// A minimal Node Buffer for the browser build of the verifier. It covers only what the verifier and crypto-shim use
// (from/concat/alloc/byteLength, toString in utf8/hex/base64/base64url/ascii/latin1, equals/compare, readUInt*BE),
// replacing the 25 KB npm `buffer` polyfill. Uint8Array's species makes slice/subarray return this class too.
type Enc = "utf8" | "utf-8" | "hex" | "base64" | "base64url" | "ascii" | "latin1" | "binary";
const te = new TextEncoder(), td = new TextDecoder();
const b64 = (s: string) => { const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/]/g, "").padEnd(Math.ceil(s.length / 4) * 4, "="));
  const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
const latin = (u: Uint8Array) => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return s; };

// @ts-expect-error Buffer.from(string, encoding) intentionally differs from Uint8Array.from, as in Node.
export class Buffer extends Uint8Array {
  static from(v: any, enc?: Enc | number, len?: number): Buffer {
    if (typeof v === "string") {
      const e = (enc ?? "utf8") as Enc;
      if (e === "hex") { const n = v.length >> 1, u = new Buffer(n); for (let i = 0; i < n; i++) { const x = parseInt(v.substr(i * 2, 2), 16); if (Number.isNaN(x)) return u.subarray(0, i) as Buffer; u[i] = x; } return u; }
      if (e === "base64" || e === "base64url") { const u = b64(v); return new Buffer(u.buffer, u.byteOffset, u.length); }
      if (e === "ascii" || e === "latin1" || e === "binary") { const u = new Buffer(v.length); for (let i = 0; i < v.length; i++) u[i] = v.charCodeAt(i) & 0xff; return u; }
      const u = te.encode(v); return new Buffer(u.buffer, u.byteOffset, u.length);
    }
    if (v instanceof ArrayBuffer) return new Buffer(v, (enc as number) ?? 0, len ?? v.byteLength - ((enc as number) ?? 0));
    if (ArrayBuffer.isView(v)) { const b = new Buffer(v.byteLength); b.set(new Uint8Array(v.buffer, v.byteOffset, v.byteLength)); return b; }
    if (Array.isArray(v)) { const b = new Buffer(v.length); b.set(v); return b; }
    throw new TypeError("Buffer.from: unsupported input");
  }
  static alloc(n: number, fill = 0): Buffer { const b = new Buffer(n); if (fill) b.fill(fill); return b; }
  static isBuffer(v: unknown): v is Buffer { return v instanceof Buffer; }
  static byteLength(s: string | Uint8Array, enc?: Enc): number { return typeof s === "string" ? Buffer.from(s, enc).length : s.byteLength; }
  static concat(list: Uint8Array[], total?: number): Buffer {
    const n = total ?? list.reduce((a, b) => a + b.length, 0), out = new Buffer(n); let o = 0;
    for (const b of list) { if (o >= n) break; out.set(b.subarray(0, n - o), o); o += b.length; } return out;
  }
  static compare(a: Uint8Array, b: Uint8Array): number { return Buffer.prototype.compare.call(a, b); }
  override toString(enc: Enc | number = "utf8", s = 0, e = this.length): string {
    if (typeof enc === "number") return super.toString();
    const u = this.subarray(s, e);
    if (enc === "hex") { let h = ""; for (const x of u) h += (x < 16 ? "0" : "") + x.toString(16); return h; }
    if (enc === "base64") return btoa(latin(u));
    if (enc === "base64url") return btoa(latin(u)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    if (enc === "ascii") return latin(u.map(x => x & 0x7f));
    if (enc === "latin1" || enc === "binary") return latin(u);
    return td.decode(u);
  }
  equals(o: Uint8Array): boolean { return this.compare(o) === 0; }
  compare(o: Uint8Array): number {
    const n = Math.min(this.length, o.length);
    for (let i = 0; i < n; i++) if (this[i] !== o[i]) return this[i] < o[i] ? -1 : 1;
    return this.length === o.length ? 0 : this.length < o.length ? -1 : 1;
  }
  private at_(i: number) { if (i < 0 || i >= this.length) throw new RangeError("out of range"); return this[i]; }
  readUInt8(o = 0) { return this.at_(o); }
  readUInt16BE(o = 0) { return this.at_(o) * 256 + this.at_(o + 1); }
  readUInt32BE(o = 0) { return this.at_(o) * 0x1000000 + this.readUInt16BE(o + 1) * 256 + this.at_(o + 3); }
  readUIntBE(o: number, n: number) { let v = 0; for (let i = 0; i < n; i++) v = v * 256 + this.at_(o + i); return v; }
}
