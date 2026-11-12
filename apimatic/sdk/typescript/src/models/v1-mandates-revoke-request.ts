import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1MandatesRevokeRequest = {
  /**
   * WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge
   * returned by the matching *-request call
   */
  assertion?: Record<string, unknown>;
  reason?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1MandatesRevokeRequestSchema: Schema<V1MandatesRevokeRequest> =
  s.object<V1MandatesRevokeRequest>(
    {
      assertion: s.optional(s.record(s.string(), s.unknown())),
      reason: s.optional(s.string()),
    },
    { additionalProperties: s.json() },
  );
