import { createPublicKey, verify, type KeyObject } from "node:crypto";

/** Minimal CBOR decoder: enough for a COSE_Key (maps, ints, byte/text strings). */
function decode(buf: Buffer, pos = 0): [unknown, number] {
  const ib = buf[pos++]; const mt = ib >> 5; let ai = ib & 31; let n: number;
  if (ai < 24) n = ai;
  else if (ai === 24) n = buf[pos++];
  else if (ai === 25) { n = buf.readUInt16BE(pos); pos += 2; }
  else if (ai === 26) { n = buf.readUInt32BE(pos); pos += 4; }
  else throw new Error("unsupported CBOR length");
  switch (mt) {
    case 0: return [n, pos];
    case 1: return [-1 - n, pos];
    case 2: return [buf.subarray(pos, pos + n), pos + n];
    case 3: return [buf.subarray(pos, pos + n).toString("utf8"), pos + n];
    case 4: { const a: unknown[] = []; for (let i = 0; i < n; i++) { const [v, p] = decode(buf, pos); a.push(v); pos = p; } return [a, pos]; }
    case 5: { const m = new Map<unknown, unknown>(); for (let i = 0; i < n; i++) { const [k, p1] = decode(buf, pos); const [v, p2] = decode(buf, p1); m.set(k, v); pos = p2; } return [m, pos]; }
    default: throw new Error(`unsupported CBOR major type ${mt}`);
  }
}

const b64u = (b: unknown) => Buffer.from(b as Buffer).toString("base64url");

/** COSE_Key (as stored by WebAuthn) -> Node KeyObject + verify algorithm. Supports ES256, EdDSA (Ed25519), RS256. */
export function coseToKey(cose: Uint8Array): { key: KeyObject; alg: "ES256" | "EdDSA" | "RS256" } {
  const [m] = decode(Buffer.from(cose));
  if (!(m instanceof Map)) throw new Error("COSE key is not a map");
  const kty = m.get(1), alg = m.get(3);
  if (kty === 2 && (alg === -7 || alg === undefined) && m.get(-1) === 1)
    return { alg: "ES256", key: createPublicKey({ format: "jwk", key: { kty: "EC", crv: "P-256", x: b64u(m.get(-2)), y: b64u(m.get(-3)) } }) };
  if (kty === 1 && (alg === -8 || alg === undefined) && m.get(-1) === 6)
    return { alg: "EdDSA", key: createPublicKey({ format: "jwk", key: { kty: "OKP", crv: "Ed25519", x: b64u(m.get(-2)) } }) };
  if (kty === 3 && (alg === -257 || alg === undefined))
    return { alg: "RS256", key: createPublicKey({ format: "jwk", key: { kty: "RSA", n: b64u(m.get(-1)), e: b64u(m.get(-2)) } }) };
  throw new Error(`unsupported COSE key (kty ${String(kty)}, alg ${String(alg)})`);
}

export function verifyCose(cose: Uint8Array, data: Buffer, sig: Buffer): boolean {
  const { key, alg } = coseToKey(cose);
  return alg === "EdDSA" ? verify(null, data, key, sig) : verify("sha256", data, key, sig);
}
