import * as s from "../core/validation/index.js";
import type { JsonValue, Schema } from "../core/validation/schema.js";
import { signatureSchema, type Signature } from "./signature.js";

export type ReceiptEnvelope = {
  /**
   * agentguard.proof-of-intent/v1 receipt: mandate + passkey signature, PayPal order snapshot,
   * decision, capture
   */
  receipt: Record<string, unknown>;
  signature: Signature;
  timestamps?: Record<string, unknown>[];
  /** Merkle inclusion proof for the audit-chain anchor */
  anchor?: Record<string, unknown>;
  /** Properties the service sent or accepts beyond those declared. */
  additionalProperties?: Record<string, JsonValue>;
};

export const receiptEnvelopeSchema: Schema<ReceiptEnvelope> = s.object<ReceiptEnvelope>(
  {
    receipt: s.record(s.string(), s.unknown()),
    signature: signatureSchema,
    timestamps: s.optional(s.array(s.record(s.string(), s.unknown()))),
    anchor: s.optional(s.record(s.string(), s.unknown())),
  },
  { additionalProperties: s.json() },
);
