import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1UsersRecoveryCancelRequest = {
  /**
   * WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge
   * returned by the matching *-request call
   */
  assertion: Record<string, unknown>;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1UsersRecoveryCancelRequestSchema: Schema<V1UsersRecoveryCancelRequest> =
  s.object<V1UsersRecoveryCancelRequest>(
    {
      assertion: s.record(s.string(), s.unknown()),
    },
    { additionalProperties: s.json() },
  );
