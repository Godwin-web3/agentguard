import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1AgentProductsSearchRequest = {
  mandateId: string;
  query: string;
  /** 1-30, default 8 */
  limit?: number;
  /** next_page_token from a previous search */
  pageToken?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1AgentProductsSearchRequestSchema: Schema<V1AgentProductsSearchRequest> =
  s.object<V1AgentProductsSearchRequest>(
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
