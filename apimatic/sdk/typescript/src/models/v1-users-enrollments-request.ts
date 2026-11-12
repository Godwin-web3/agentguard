import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1UsersEnrollmentsRequest = {
  issuedBy?: string;
  ttlMinutes?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1UsersEnrollmentsRequestSchema: Schema<V1UsersEnrollmentsRequest> =
  s.object<V1UsersEnrollmentsRequest>(
    {
      issuedBy: s.optional(s.string()),
      ttlMinutes: s.optional(s.int()),
      _keysMap: {
        issuedBy: "issued_by",
        ttlMinutes: "ttl_minutes",
      },
    },
    { additionalProperties: s.json() },
  );
