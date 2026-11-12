import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type PauseState = {
  paused: boolean;
  reason?: string;
  by?: string;
  since?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const pauseStateSchema: Schema<PauseState> = s.object<PauseState>(
  {
    paused: s.boolean(),
    reason: s.optional(s.string()),
    by: s.optional(s.string()),
    since: s.optional(s.string()),
  },
  { additionalProperties: s.json() },
);
