import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { catalogProductSchema, type CatalogProduct } from "./catalog-product.js";

export type ProductSearchResult = {
  provider: string;
  mandateId?: string;
  query?: string;
  /** Price ceiling applied: min(per-payment cap, remaining budget) */
  maxPrice: string;
  currency: string;
  products: CatalogProduct[];
  nextPageToken?: string | null;
  howToPay?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const productSearchResultSchema: Schema<ProductSearchResult> = s.object<ProductSearchResult>(
  {
    provider: s.string(),
    mandateId: s.optional(s.string()),
    query: s.optional(s.string()),
    maxPrice: s.string(),
    currency: s.string(),
    products: s.array(s.lazy(() => catalogProductSchema)),
    nextPageToken: s.optionalNullable(s.string()),
    howToPay: s.optional(s.string()),
    _keysMap: {
      mandateId: "mandate_id",
      maxPrice: "max_price",
      nextPageToken: "next_page_token",
      howToPay: "how_to_pay",
    },
  },
  { additionalProperties: s.json() },
);
