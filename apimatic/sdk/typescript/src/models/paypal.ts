import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";

export type Paypal = {
  orderId?: string | null;
  authorizationId?: string | null;
  captureId?: string | null;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const paypalSchema: Schema<Paypal> = s.object<Paypal>(
  {
    orderId: s.optionalNullable(s.string()),
    authorizationId: s.optionalNullable(s.string()),
    captureId: s.optionalNullable(s.string()),
    _keysMap: {
      orderId: "order_id",
      authorizationId: "authorization_id",
      captureId: "capture_id",
    },
  },
  { additionalProperties: s.json() },
);
