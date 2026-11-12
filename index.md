# AgentGuard API (/)

AgentGuard sits between an AI agent and PayPal. The user signs a **spending mandate** (budget, payees, categories, SKUs, an approval threshold) with their passkey. The agent holds only an AgentGuard key. Every payment it proposes is checked deterministically against the signed mandate, using PayPal's own order as the source of truth, and then paid, rejected, or held for the user's passkey approval. Each captured payment gets an Ed25519-signed **Proof-of-Intent receipt** that anyone can verify offline.

## Who calls what [#who-calls-what]

| Caller | Auth | Typical calls |
| --- | --- | --- |
| Agent | `Authorization: Bearer ag_…` (agent key) | `searchProducts`, `proposePayment`, `getAgentPayment`, `getAgentPaymentReceipt`, `getAgentMandate` |
| Owner / console | `Authorization: Bearer <admin token>` | mandates, approvals, payments, receipts, audit ledger |
| Anyone | none | `getIssuerKeySet`, `listAuditAnchors`, `getHealth` |

The admin token can read and draft, but it **cannot authorize spending**: activating a mandate, approving a held payment and revoking all need the user's passkey (WebAuthn).

## An agent purchase in three calls [#an-agent-purchase-in-three-calls]

1. `searchProducts` finds real products through the Channel3 catalog, already capped at the mandate's currency and remaining budget.
2. The merchant creates a PayPal order (intent `AUTHORIZE`) with the product id as the item `sku`.
3. `proposePayment` with `paypal_order_id`. AgentGuard reads the order from PayPal, checks it against the mandate, and returns `captured`, `rejected` or `needs_human`.

Sandbox server: `https://agentguard-orcin.vercel.app` (PayPal sandbox). Full docs: [agentguard-orcin.vercel.app/docs](https://agentguard-orcin.vercel.app/docs).
