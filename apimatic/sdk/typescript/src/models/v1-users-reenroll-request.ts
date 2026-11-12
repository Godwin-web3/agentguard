import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1UsersReenrollRequest = {
  /**
   * WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge
   * returned by the matching *-request call
   */
  assertion: Record<string, unknown>;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1UsersReenrollRequestSchema: Schema<V1UsersReenrollRequest> = s.object<V1UsersReenrollRequest>(
  {
    assertion: s.record(s.string(), s.unknown()),
  },
  { additionalProperties: s.json() },
);
