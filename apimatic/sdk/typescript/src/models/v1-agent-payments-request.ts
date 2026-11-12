import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { contextSchema, type Context } from "./context.js";
import { payeeSchema, type Payee } from "./payee.js";

export type V1AgentPaymentsRequest = {
  mandateId: string;
  agentId: string;
  idempotencyKey: string;
  /** Merchant-created AUTHORIZE order (preferred). Do not combine with payee/currency/items. */
  paypalOrderId?: string;
  /** Vaulted path only (untrusted) */
  payee?: Payee;
  /** Vaulted path only */
  currency?: string;
  /** Vaulted path only (untrusted) */
  items?: Record<string, unknown>[];
  /** Untrusted context the agent saw; scored for injection, advisory only */
  context?: Context[];
  agentRationale?: string;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const v1AgentPaymentsRequestSchema: Schema<V1AgentPaymentsRequest> = s.object<V1AgentPaymentsRequest>(
  {
    mandateId: s.string(),
    agentId: s.string(),
    idempotencyKey: s.string(),
    paypalOrderId: s.optional(s.string()),
    payee: s.optional(s.lazy(() => payeeSchema)),
    currency: s.optional(s.string()),
    items: s.optional(s.array(s.record(s.string(), s.unknown()))),
    context: s.optional(s.array(s.lazy(() => contextSchema))),
    agentRationale: s.optional(s.string()),
    _keysMap: {
      mandateId: "mandate_id",
      agentId: "agent_id",
      idempotencyKey: "idempotency_key",
      paypalOrderId: "paypal_order_id",
      agentRationale: "agent_rationale",
    },
  },
  { additionalProperties: s.json() },
);
