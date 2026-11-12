import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type Context = {
  sourceUrl?: string;
  excerpt?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const contextSchema: Schema<Context> = s.object<Context>(
  {
    sourceUrl: s.optional(s.string()),
    excerpt: s.optional(s.string()),
    _keysMap: {
      sourceUrl: "source_url",
    },
  },
  { additionalProperties: s.json() },
);
