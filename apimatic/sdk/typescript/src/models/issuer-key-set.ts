import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { issuerKeySchema, type IssuerKey } from "./issuer-key.js";

export type IssuerKeySet = {
  issuer?: string;
  keys: IssuerKey[];
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const issuerKeySetSchema: Schema<IssuerKeySet> = s.object<IssuerKeySet>(
  {
    issuer: s.optional(s.string()),
    keys: s.array(s.lazy(() => issuerKeySchema)),
  },
  { additionalProperties: s.json() },
);
