import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type CatalogOffer = {
  domain: string;
  /** Retailer buy link */
  url?: string;
  price: string;
  priceMinor?: number;
  currency: string;
  availability?: string;
  /** new, used, refurbished; null when unknown */
  condition?: string | null;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const catalogOfferSchema: Schema<CatalogOffer> = s.object<CatalogOffer>(
  {
    domain: s.string(),
    url: s.optional(s.string()),
    price: s.string(),
    priceMinor: s.optional(s.int()),
    currency: s.string(),
    availability: s.optional(s.string()),
    condition: s.optionalNullable(s.string()),
    _keysMap: {
      priceMinor: "price_minor",
    },
  },
  { additionalProperties: s.json() },
);
