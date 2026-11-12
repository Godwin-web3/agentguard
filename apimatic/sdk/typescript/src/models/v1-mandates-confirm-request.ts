import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1MandatesConfirmRequest = {
  mandateHash: string;
  /**
   * WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge
   * returned by the matching *-request call
   */
  assertion: Record<string, unknown>;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1MandatesConfirmRequestSchema: Schema<V1MandatesConfirmRequest> =
  s.object<V1MandatesConfirmRequest>(
    {
      mandateHash: s.string(),
      assertion: s.record(s.string(), s.unknown()),
      _keysMap: {
        mandateHash: "mandate_hash",
      },
    },
    { additionalProperties: s.json() },
  );
