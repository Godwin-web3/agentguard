import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type AgentCredentials = {
  agentId: string;
  /** Shown once; store it as the agent's secret */
  apiKey: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const agentCredentialsSchema: Schema<AgentCredentials> = s.object<AgentCredentials>(
  {
    agentId: s.string(),
    apiKey: s.string(),
    _keysMap: {
      agentId: "agent_id",
      apiKey: "api_key",
    },
  },
  { additionalProperties: s.json() },
);
