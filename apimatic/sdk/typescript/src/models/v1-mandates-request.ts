import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { mandateConstraintsSchema, type MandateConstraints } from "./mandate-constraints.js";

export type V1MandatesRequest = {
  userId: string;
  agentId: string;
  purpose: string;
  ttlMinutes?: number;
  constraints?: MandateConstraints;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1MandatesRequestSchema: Schema<V1MandatesRequest> = s.object<V1MandatesRequest>(
  {
    userId: s.string(),
    agentId: s.string(),
    purpose: s.string(),
    ttlMinutes: s.optional(s.int()),
    constraints: s.optional(s.lazy(() => mandateConstraintsSchema)),
    _keysMap: {
      userId: "user_id",
      agentId: "agent_id",
      ttlMinutes: "ttl_minutes",
    },
  },
  { additionalProperties: s.json() },
);
