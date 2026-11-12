import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1KeysCompromisedRequest = {
  /** ISO time; default now */
  at?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1KeysCompromisedRequestSchema: Schema<V1KeysCompromisedRequest> =
  s.object<V1KeysCompromisedRequest>(
    {
      at: s.optional(s.string()),
    },
    { additionalProperties: s.json() },
  );
