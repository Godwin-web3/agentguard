import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1RecoverRequest = {
  olderThanMs?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1RecoverRequestSchema: Schema<V1RecoverRequest> = s.object<V1RecoverRequest>(
  {
    olderThanMs: s.optional(s.int()),
    _keysMap: {
      olderThanMs: "older_than_ms",
    },
  },
  { additionalProperties: s.json() },
);
