import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1ProductsSearchRequest = {
  mandateId: string;
  query: string;
  limit?: number;
  pageToken?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1ProductsSearchRequestSchema: Schema<V1ProductsSearchRequest> =
  s.object<V1ProductsSearchRequest>(
    {
      mandateId: s.string(),
      query: s.string(),
      limit: s.optional(s.int()),
      pageToken: s.optional(s.string()),
      _keysMap: {
        mandateId: "mandate_id",
        pageToken: "page_token",
      },
    },
    { additionalProperties: s.json() },
  );
