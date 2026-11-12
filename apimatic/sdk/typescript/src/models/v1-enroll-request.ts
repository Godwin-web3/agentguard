import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1EnrollRequest = {
  token: string;
  /** navigator.credentials.create response */
  response: Record<string, unknown>;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1EnrollRequestSchema: Schema<V1EnrollRequest> = s.object<V1EnrollRequest>(
  {
    token: s.string(),
    response: s.record(s.string(), s.unknown()),
  },
  { additionalProperties: s.json() },
);
