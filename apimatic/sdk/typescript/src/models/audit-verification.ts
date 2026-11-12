import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type AuditVerification = {
  ok: boolean;
  length: number;
  /** First entry whose hash or link does not verify */
  brokenAt?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const auditVerificationSchema: Schema<AuditVerification> = s.object<AuditVerification>(
  {
    ok: s.boolean(),
    length: s.int(),
    brokenAt: s.optional(s.int()),
  },
  { additionalProperties: s.json() },
);
