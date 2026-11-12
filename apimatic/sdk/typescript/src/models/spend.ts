import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type Spend = {
  spentMinor?: number;
  reservedMinor?: number;
  txCount?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const spendSchema: Schema<Spend> = s.object<Spend>(
  {
    spentMinor: s.optional(s.int()),
    reservedMinor: s.optional(s.int()),
    txCount: s.optional(s.int()),
    _keysMap: {
      spentMinor: "spent_minor",
      reservedMinor: "reserved_minor",
      txCount: "tx_count",
    },
  },
  { additionalProperties: s.json() },
);
