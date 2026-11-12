import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { mandateSchema, type Mandate } from "./mandate.js";
import { spendSchema, type Spend } from "./spend.js";
import { status1Schema, type Status1 } from "./status1.js";

export type AgentMandate = {
  mandate: Mandate;
  status: Status1;
  spend?: Spend;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const agentMandateSchema: Schema<AgentMandate> = s.object<AgentMandate>(
  {
    mandate: mandateSchema,
    status: status1Schema,
    spend: s.optional(s.lazy(() => spendSchema)),
  },
  { additionalProperties: s.json() },
);
