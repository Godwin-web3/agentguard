import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1AgentsRequest = {
  /** Owner user id */
  userId: string;
  /** Agent id */
  agentId: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1AgentsRequestSchema: Schema<V1AgentsRequest> = s.object<V1AgentsRequest>(
  {
    userId: s.string(),
    agentId: s.string(),
    _keysMap: {
      userId: "user_id",
      agentId: "agent_id",
    },
  },
  { additionalProperties: s.json() },
);
