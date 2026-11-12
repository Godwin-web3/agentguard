import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

/** Vaulted path only (untrusted) */
export type Payee = {
  merchantId?: string;
  emailAddress?: string;
  displayName?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const payeeSchema: Schema<Payee> = s.object<Payee>(
  {
    merchantId: s.optional(s.string()),
    emailAddress: s.optional(s.string()),
    displayName: s.optional(s.string()),
    _keysMap: {
      merchantId: "merchant_id",
      emailAddress: "email_address",
      displayName: "display_name",
    },
  },
  { additionalProperties: s.json() },
);
