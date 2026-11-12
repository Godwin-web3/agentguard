import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1EnrollOptionsRequest = {
  token: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1EnrollOptionsRequestSchema: Schema<V1EnrollOptionsRequest> = s.object<V1EnrollOptionsRequest>(
  {
    token: s.string(),
  },
  { additionalProperties: s.json() },
);
