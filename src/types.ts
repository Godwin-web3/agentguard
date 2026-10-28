/** PayPal item categories — grounded in PayPal order data, not agent claims. */
export type PayPalCategory = "PHYSICAL_GOODS" | "DIGITAL_GOODS" | "DONATION" | "UNSPECIFIED";  // UNSPECIFIED: order item with no category

export interface MandateConstraints {
  currency: string;                 // ISO 4217, e.g. "USD"
  max_total: string;                // ceiling across all transactions, "900.00"
  max_per_transaction?: string;     // optional per-tx ceiling
  max_transactions: number;         // how many payments this mandate may fund
  allowed_categories?: PayPalCategory[];  // PayPal item.category allowlist
  payee_allowlist?: string[];       // PayPal merchant_ids or emails; empty/undefined = any
  payee_blocklist?: string[];
  max_quantity_per_item?: number;
  require_human_approval_over?: string;   // amount above which a human must approve
  /** Only pay merchant-created PayPal orders (the agent passes paypal_order_id; facts come from PayPal). */
  require_merchant_order?: boolean;
  /** Every line item's sku (as PayPal reports it on the order) must be in this list. */
  sku_allowlist?: string[];
}

export interface Mandate {
  mandate_id: string;
  user_id: string;
  agent_id: string;
  purpose: string;                  // the user's task, in their words
  constraints: MandateConstraints;
  created_at: string;
  expires_at: string;
  version: 1;
}

/** "unsigned": legacy mandate activated before user-held keys existed. Never enforced until the user re-signs it. */
export type MandateStatus = "draft" | "unsigned" | "active" | "revoked" | "exhausted" | "expired";

/** A WebAuthn assertion from the user's passkey whose challenge is the signed digest. All fields base64url. */
export interface UserSignature {
  credential_id: string;
  authenticator_data: string;
  client_data_json: string;
  signature: string;
}

export interface SignedMandate {
  mandate: Mandate;
  mandate_hash: string;                         // sha256(canonical(mandate))
  user_signature: UserSignature | null;         // user's passkey over mandate_hash; required to enforce
  revocation_signature: UserSignature | null;   // user's passkey over the revocation digest
  status: MandateStatus;
}

export interface LineItem {
  name: string;
  quantity: number;
  unit_amount: string;              // "850.00"
  category: PayPalCategory;
  sku?: string;
}

/** What an agent asks to pay. The agent never sees PayPal credentials. */
export interface PaymentProposal {
  mandate_id: string;
  agent_id: string;
  idempotency_key: string;          // agent-chosen; replays return the original decision
  payee: { merchant_id?: string; email_address?: string; display_name?: string };
  currency: string;
  items: LineItem[];
  /** Untrusted context the agent saw (page text, tool output). Used only for risk scoring. */
  context?: { source_url?: string; excerpt?: string }[];
  agent_rationale?: string;
  /** Set by AgentGuard, never accepted from the agent: where payee/amount/items came from. */
  facts_source?: FactsSource;
  /** Merchant-created PayPal order this proposal pays (facts_source = "paypal_order"). */
  paypal_order_id?: string;
  order_digest?: string;
  order_total_minor?: number;
}

/** "paypal_order": read from PayPal's order record. "agent_declared": typed by the agent; untrusted. */
export type FactsSource = "paypal_order" | "agent_declared";

/** Preferred agent request: the merchant already created the PayPal order; the agent only names it. */
export interface OrderProposal {
  mandate_id: string; agent_id: string; idempotency_key: string; paypal_order_id: string;
  context?: { source_url?: string; excerpt?: string }[]; agent_rationale?: string;
}

export type CheckResult = { check: string; pass: boolean; detail: string };

export type Decision = "approve" | "reject" | "needs_human";

export interface RiskSignal { signal: string; severity: "low" | "medium" | "high"; detail: string }

export interface Evaluation {
  decision: Decision;
  proposal_hash: string;
  amount_minor: number;
  checks: CheckResult[];
  risk: RiskSignal[];
  reasons: string[];
}
