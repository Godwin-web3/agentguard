import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1ApprovalsRequest = {
  approve: boolean;
  /**
   * WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge
   * returned by the matching *-request call
   */
  assertion: Record<string, unknown>;
  approver?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1ApprovalsRequestSchema: Schema<V1ApprovalsRequest> = s.object<V1ApprovalsRequest>(
  {
    approve: s.boolean(),
    assertion: s.record(s.string(), s.unknown()),
    approver: s.optional(s.string()),
  },
  { additionalProperties: s.json() },
);
