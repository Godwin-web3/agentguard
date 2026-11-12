import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type ReceiptSummary = {
  receiptId: string;
  paymentId: string;
  captureId?: string;
  receiptHash?: string;
  issuedAt?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const receiptSummarySchema: Schema<ReceiptSummary> = s.object<ReceiptSummary>(
  {
    receiptId: s.string(),
    paymentId: s.string(),
    captureId: s.optional(s.string()),
    receiptHash: s.optional(s.string()),
    issuedAt: s.optional(s.string()),
    _keysMap: {
      receiptId: "receipt_id",
      paymentId: "payment_id",
      captureId: "capture_id",
      receiptHash: "receipt_hash",
      issuedAt: "issued_at",
    },
  },
  { additionalProperties: s.json() },
);
