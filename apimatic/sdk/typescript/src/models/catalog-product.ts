import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { catalogOfferSchema, type CatalogOffer } from "./catalog-offer.js";
import { mandateFitSchema, type MandateFit } from "./mandate-fit.js";

export type CatalogProduct = {
  /** Use as the PayPal order item sku */
  productId: string;
  channel3Id?: string;
  title: string;
  brand?: string | null;
  image?: string | null;
  category?: string | null;
  offers: CatalogOffer[];
  /** Cheapest in-stock offer within the mandate's currency and ceiling */
  bestOffer?: CatalogOffer | null;
  mandateFit?: MandateFit;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const catalogProductSchema: Schema<CatalogProduct> = s.object<CatalogProduct>(
  {
    productId: s.string(),
    channel3Id: s.optional(s.string()),
    title: s.string(),
    brand: s.optionalNullable(s.string()),
    image: s.optionalNullable(s.string()),
    category: s.optionalNullable(s.string()),
    offers: s.array(s.lazy(() => catalogOfferSchema)),
    bestOffer: s.optionalNullable(s.lazy(() => catalogOfferSchema)),
    mandateFit: s.optional(s.lazy(() => mandateFitSchema)),
    _keysMap: {
      productId: "product_id",
      channel3Id: "channel3_id",
      bestOffer: "best_offer",
      mandateFit: "mandate_fit",
    },
  },
  { additionalProperties: s.json() },
);
