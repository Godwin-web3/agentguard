import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1ControlPauseRequest = {
  reason?: string;
  by?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1ControlPauseRequestSchema: Schema<V1ControlPauseRequest> = s.object<V1ControlPauseRequest>(
  {
    reason: s.optional(s.string()),
    by: s.optional(s.string()),
  },
  { additionalProperties: s.json() },
);
