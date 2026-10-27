import { createHash } from "node:crypto";

/** Deterministic JSON: sorted keys, no whitespace. Used for hashing and signing. */
export function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  const obj = value as Record<string, unknown>;
  return "{" + Object.keys(obj).filter(k => obj[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
}

export function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** "850.00" -> 85000. Rejects floats with >2 decimals, negatives, junk. */
export function toMinor(amount: string): number {
  if (!/^\d{1,12}(\.\d{1,2})?$/.test(amount)) throw new Error(`invalid amount: ${amount}`);
  const [w, f = ""] = amount.split(".");
  return Number(w) * 100 + Number((f + "00").slice(0, 2));
}

export function fromMinor(minor: number): string {
  return `${Math.floor(minor / 100)}.${String(minor % 100).padStart(2, "0")}`;
}
