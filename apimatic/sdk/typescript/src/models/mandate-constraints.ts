import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { allowedCategorySchema, type AllowedCategory } from "./allowed-category.js";

export type MandateConstraints = {
  /** ISO 4217 */
  currency: string;
  maxTotal: string;
  maxPerTransaction?: string;
  maxTransactions: number;
  allowedCategories?: AllowedCategory[];
  payeeAllowlist?: string[];
  payeeBlocklist?: string[];
  maxQuantityPerItem?: number;
  requireHumanApprovalOver?: string;
  requireMerchantOrder?: boolean;
  skuAllowlist?: string[];
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const mandateConstraintsSchema: Schema<MandateConstraints> = s.object<MandateConstraints>(
  {
    currency: s.string(),
    maxTotal: s.string(),
    maxPerTransaction: s.optional(s.string()),
    maxTransactions: s.int(),
    allowedCategories: s.optional(s.array(s.lazy(() => allowedCategorySchema))),
    payeeAllowlist: s.optional(s.array(s.string())),
    payeeBlocklist: s.optional(s.array(s.string())),
    maxQuantityPerItem: s.optional(s.int()),
    requireHumanApprovalOver: s.optional(s.string()),
    requireMerchantOrder: s.optional(s.boolean()),
    skuAllowlist: s.optional(s.array(s.string())),
    _keysMap: {
      maxTotal: "max_total",
      maxPerTransaction: "max_per_transaction",
      maxTransactions: "max_transactions",
      allowedCategories: "allowed_categories",
      payeeAllowlist: "payee_allowlist",
      payeeBlocklist: "payee_blocklist",
      maxQuantityPerItem: "max_quantity_per_item",
      requireHumanApprovalOver: "require_human_approval_over",
      requireMerchantOrder: "require_merchant_order",
      skuAllowlist: "sku_allowlist",
    },
  },
  { additionalProperties: s.json() },
);
