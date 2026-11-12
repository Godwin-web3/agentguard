import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type AuditEntry = {
  seq: number;
  ts: string;
  event: string;
  ref?: string | null;
  payload?: Record<string, unknown>;
  prevHash: string;
  /** sha256(prev_hash|ts|event|ref|canonical(payload)) */
  hash: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const auditEntrySchema: Schema<AuditEntry> = s.object<AuditEntry>(
  {
    seq: s.int(),
    ts: s.string(),
    event: s.string(),
    ref: s.optionalNullable(s.string()),
    payload: s.optional(s.record(s.string(), s.unknown())),
    prevHash: s.string(),
    hash: s.string(),
    _keysMap: {
      prevHash: "prev_hash",
    },
  },
  { additionalProperties: s.json() },
);
