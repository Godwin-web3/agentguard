import { createHash } from "node:crypto";

/** Deterministic JSON: sorted keys, no whitespace, undefined dropped. Must match AgentGuard's encoder byte for byte. */
export function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  const obj = value as Record<string, unknown>;
  return "{" + Object.keys(obj).filter(k => obj[k] !== undefined).sort()
    .map(k => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
}
export const sha256 = (s: string | Uint8Array) => createHash("sha256").update(s).digest("hex");
export const sha256Bytes = (s: string | Uint8Array) => createHash("sha256").update(s).digest();

/** "850.00" -> 85000. Strict: at most 2 decimals, no sign, no junk. */
export function toMinor(amount: string): number {
  if (!/^\d{1,12}(\.\d{1,2})?$/.test(amount)) throw new Error(`invalid amount: ${amount}`);
  const [w, f = ""] = amount.split(".");
  return Number(w) * 100 + Number((f + "00").slice(0, 2));
}
