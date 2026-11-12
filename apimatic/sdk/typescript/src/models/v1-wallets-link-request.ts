import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1WalletsLinkRequest = {
  userId: string;
  vaultId: string;
  payerEmail?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1WalletsLinkRequestSchema: Schema<V1WalletsLinkRequest> = s.object<V1WalletsLinkRequest>(
  {
    userId: s.string(),
    vaultId: s.string(),
    payerEmail: s.optional(s.string()),
    _keysMap: {
      userId: "user_id",
      vaultId: "vault_id",
      payerEmail: "payer_email",
    },
  },
  { additionalProperties: s.json() },
);
