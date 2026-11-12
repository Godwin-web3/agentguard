import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type Signature = {
  alg: string;
  kid?: string;
  keyId?: string;
  publicKeyPem?: string;
  value: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const signatureSchema: Schema<Signature> = s.object<Signature>(
  {
    alg: s.string(),
    kid: s.optional(s.string()),
    keyId: s.optional(s.string()),
    publicKeyPem: s.optional(s.string()),
    value: s.string(),
    _keysMap: {
      keyId: "key_id",
      publicKeyPem: "public_key_pem",
    },
  },
  { additionalProperties: s.json() },
);
