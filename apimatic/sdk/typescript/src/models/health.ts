import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type Health = {
  ok: boolean;
  /** Payments stuck in reserved/authorized for over a minute */
  stuck: number;
  /** Last reconciliation run */
  lastRecovery?: Record<string, unknown> | null;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const healthSchema: Schema<Health> = s.object<Health>(
  {
    ok: s.boolean(),
    stuck: s.int(),
    lastRecovery: s.optionalNullable(s.record(s.string(), s.unknown())),
    _keysMap: {
      lastRecovery: "last_recovery",
    },
  },
  { additionalProperties: s.json() },
);
