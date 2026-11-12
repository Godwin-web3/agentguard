import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { checkSchema, type Check } from "./check.js";

export type MandateFit = {
  fits?: boolean;
  needsApproval?: boolean;
  checks?: Check[];
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const mandateFitSchema: Schema<MandateFit> = s.object<MandateFit>(
  {
    fits: s.optional(s.boolean()),
    needsApproval: s.optional(s.boolean()),
    checks: s.optional(s.array(s.lazy(() => checkSchema))),
    _keysMap: {
      needsApproval: "needs_approval",
    },
  },
  { additionalProperties: s.json() },
);
