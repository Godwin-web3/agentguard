import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type V1ApprovalsRequestRequest = {
  approve: boolean;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1ApprovalsRequestRequestSchema: Schema<V1ApprovalsRequestRequest> =
  s.object<V1ApprovalsRequestRequest>(
    {
      approve: s.boolean(),
    },
    { additionalProperties: s.json() },
  );
