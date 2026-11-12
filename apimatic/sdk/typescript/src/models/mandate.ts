import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { mandateConstraintsSchema, type MandateConstraints } from "./mandate-constraints.js";

export type Mandate = {
  mandateId: string;
  userId: string;
  agentId: string;
  purpose: string;
  constraints: MandateConstraints;
  createdAt: string;
  expiresAt: string;
  version?: number;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const mandateSchema: Schema<Mandate> = s.object<Mandate>(
  {
    mandateId: s.string(),
    userId: s.string(),
    agentId: s.string(),
    purpose: s.string(),
    constraints: mandateConstraintsSchema,
    createdAt: s.string(),
    expiresAt: s.string(),
    version: s.optional(s.int()),
    _keysMap: {
      mandateId: "mandate_id",
      userId: "user_id",
      agentId: "agent_id",
      createdAt: "created_at",
      expiresAt: "expires_at",
    },
  },
  { additionalProperties: s.json() },
);
