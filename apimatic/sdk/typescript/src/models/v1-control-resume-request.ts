import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1ControlResumeRequest = {
  by?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1ControlResumeRequestSchema: Schema<V1ControlResumeRequest> = s.object<V1ControlResumeRequest>(
  {
    by: s.optional(s.string()),
  },
  { additionalProperties: s.json() },
);
