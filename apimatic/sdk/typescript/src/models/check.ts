import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type Check = {
  check: string;
  pass: boolean;
  detail: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const checkSchema: Schema<Check> = s.object<Check>(
  {
    check: s.string(),
    pass: s.boolean(),
    detail: s.string(),
  },
  { additionalProperties: s.json() },
);
