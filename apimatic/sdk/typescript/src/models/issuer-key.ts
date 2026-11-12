import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type IssuerKey = {
  kid: string;
  kty?: string;
  crv?: string;
  x?: string;
  publicKeyPem?: string;
  status?: string;
  created?: string;
  retired?: string | null;
  compromisedAt?: string | null;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const issuerKeySchema: Schema<IssuerKey> = s.object<IssuerKey>(
  {
    kid: s.string(),
    kty: s.optional(s.string()),
    crv: s.optional(s.string()),
    x: s.optional(s.string()),
    publicKeyPem: s.optional(s.string()),
    status: s.optional(s.string()),
    created: s.optional(s.string()),
    retired: s.optionalNullable(s.string()),
    compromisedAt: s.optionalNullable(s.string()),
    _keysMap: {
      publicKeyPem: "public_key_pem",
      compromisedAt: "compromised_at",
    },
  },
  { additionalProperties: s.json() },
);
