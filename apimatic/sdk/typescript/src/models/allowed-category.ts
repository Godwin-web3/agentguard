import * as s from "../core/validation/index.js";
import type { EnumSchema } from "../core/validation/schema.js";

export const AllowedCategory = {
  PhysicalGoods: "PHYSICAL_GOODS",
  DigitalGoods: "DIGITAL_GOODS",
  Donation: "DONATION",
  Unspecified: "UNSPECIFIED",
} as const;
export type AllowedCategory = (typeof AllowedCategory)[keyof typeof AllowedCategory] | (string & {});

export const allowedCategorySchema: EnumSchema<AllowedCategory> = s.enumOf<AllowedCategory>(AllowedCategory);
