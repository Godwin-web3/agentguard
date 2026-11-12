import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { severitySchema, type Severity } from "./severity.js";

export type RiskSignal = {
  signal: string;
  severity: Severity;
  detail: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const riskSignalSchema: Schema<RiskSignal> = s.object<RiskSignal>(
  {
    signal: s.string(),
    severity: severitySchema,
    detail: s.string(),
  },
  { additionalProperties: s.json() },
);
