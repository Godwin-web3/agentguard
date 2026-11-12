import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1MandatesDraftFromTextRequest = {
  userId: string;
  agentId: string;
  text: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1MandatesDraftFromTextRequestSchema: Schema<V1MandatesDraftFromTextRequest> =
  s.object<V1MandatesDraftFromTextRequest>(
    {
      userId: s.string(),
      agentId: s.string(),
      text: s.string(),
      _keysMap: {
        userId: "user_id",
        agentId: "agent_id",
      },
    },
    { additionalProperties: s.json() },
  );
