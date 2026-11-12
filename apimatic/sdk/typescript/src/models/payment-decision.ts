import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { decisionSchema, type Decision } from "./decision.js";
import { evaluationSchema, type Evaluation } from "./evaluation.js";
import { paypalSchema, type Paypal } from "./paypal.js";
import { statusSchema, type Status } from "./status.js";

export type PaymentDecision = {
  paymentId: string;
  decision: Decision;
  status: Status;
  evaluation: Evaluation;
  /** Set when the payment waits for the user's passkey approval */
  approvalId?: string | null;
  paypal?: Paypal;
  error?: string | null;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const paymentDecisionSchema: Schema<PaymentDecision> = s.object<PaymentDecision>(
  {
    paymentId: s.string(),
    decision: decisionSchema,
    status: statusSchema,
    evaluation: evaluationSchema,
    approvalId: s.optionalNullable(s.string()),
    paypal: s.optional(s.lazy(() => paypalSchema)),
    error: s.optionalNullable(s.string()),
    _keysMap: {
      paymentId: "payment_id",
      approvalId: "approval_id",
    },
  },
  { additionalProperties: s.json() },
);
