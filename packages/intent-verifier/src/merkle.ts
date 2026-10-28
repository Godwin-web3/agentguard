import { createHash } from "node:crypto";
/**
 * RFC 6962 (Certificate Transparency) Merkle tree over the audit chain's entry hashes (hex).
 * leaf = sha256(0x00 || bytes(hash)), node = sha256(0x01 || left || right). Inclusion proofs per RFC 6962 §2.1.1.
 */
const H = (...b: Buffer[]) => createHash("sha256").update(Buffer.concat(b)).digest();
export const leafHash = (hexHash: string) => H(Buffer.from([0]), Buffer.from(hexHash, "hex"));
const node = (l: Buffer, r: Buffer) => H(Buffer.from([1]), l, r);
const split = (n: number) => { let k = 1; while (k * 2 < n) k *= 2; return k; };

function mth(leaves: Buffer[]): Buffer {
  if (leaves.length === 0) return H();
  if (leaves.length === 1) return leaves[0];
  const k = split(leaves.length);
  return node(mth(leaves.slice(0, k)), mth(leaves.slice(k)));
}
export function merkleRoot(hexHashes: string[]): string { return mth(hexHashes.map(leafHash)).toString("hex"); }

function path(m: number, leaves: Buffer[]): Buffer[] {
  if (leaves.length <= 1) return [];
  const k = split(leaves.length);
  return m < k ? [...path(m, leaves.slice(0, k)), mth(leaves.slice(k))] : [...path(m - k, leaves.slice(k)), mth(leaves.slice(0, k))];
}
/** Audit path for leaf `index` (0-based) in a tree of hexHashes.length leaves. */
export function inclusionProof(hexHashes: string[], index: number): string[] {
  if (index < 0 || index >= hexHashes.length) throw new Error("index out of range");
  return path(index, hexHashes.map(leafHash)).map(b => b.toString("hex"));
}
/** RFC 9162 §2.1.3.2 verification. */
export function verifyInclusion(hexHash: string, index: number, size: number, proof: string[], rootHex: string): boolean {
  try {
    if (!Number.isInteger(index) || !Number.isInteger(size) || index < 0 || index >= size || !Array.isArray(proof)) return false;
    let fn = index, sn = size - 1, r = leafHash(hexHash);
    for (const p of proof) {
      if (sn === 0) return false;
      const pb = Buffer.from(p, "hex"); if (pb.length !== 32) return false;
      if ((fn & 1) === 1 || fn === sn) {
        r = node(pb, r);
        if ((fn & 1) === 0) while ((fn & 1) === 0 && fn !== 0) { fn >>= 1; sn >>= 1; }
      } else r = node(r, pb);
      fn >>= 1; sn >>= 1;
    }
    return sn === 0 && r.toString("hex") === rootHex;
  } catch { return false; }
}
