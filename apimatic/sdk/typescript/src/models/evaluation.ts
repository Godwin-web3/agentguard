import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { checkSchema, type Check } from "./check.js";
import { decisionSchema, type Decision } from "./decision.js";
import { riskSignalSchema, type RiskSignal } from "./risk-signal.js";

export type Evaluation = {
  decision: Decision;
  /** sha256 of the canonical proposal */
  proposalHash: string;
  /** Amount in minor units, from the PayPal order */
  amountMinor: number;
  checks: Check[];
  risk: RiskSignal[];
  reasons: string[];
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const evaluationSchema: Schema<Evaluation> = s.object<Evaluation>(
  {
    decision: decisionSchema,
    proposalHash: s.string(),
    amountMinor: s.int(),
    checks: s.array(s.lazy(() => checkSchema)),
    risk: s.array(s.lazy(() => riskSignalSchema)),
    reasons: s.array(s.string()),
    _keysMap: {
      proposalHash: "proposal_hash",
      amountMinor: "amount_minor",
    },
  },
  { additionalProperties: s.json() },
);
