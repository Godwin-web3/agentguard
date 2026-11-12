import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1WalletsSetupRequest = {
  userId: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1WalletsSetupRequestSchema: Schema<V1WalletsSetupRequest> = s.object<V1WalletsSetupRequest>(
  {
    userId: s.string(),
    _keysMap: {
      userId: "user_id",
    },
  },
  { additionalProperties: s.json() },
);
