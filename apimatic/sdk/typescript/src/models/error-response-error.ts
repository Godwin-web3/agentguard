import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

/** Every non-2xx response */
export type ErrorResponseError = {
  /** What went wrong */
  error: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const errorResponseErrorSchema: Schema<ErrorResponseError> = s.object<ErrorResponseError>(
  {
    error: s.string(),
  },
  { additionalProperties: s.json() },
);
