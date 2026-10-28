---
title: Reserve, verify, capture
description: What happens between an agent proposing a payment and PayPal moving money.
---
# Reserve, verify, capture

The agent proposes; AgentGuard decides and executes. Agents never hold PayPal credentials.

```sh
curl -s -X POST $U/v1/agent/payments -H "Authorization: Bearer $AGENT_KEY" -H "$J" \
  -d '{"mandate_id":"'$MID'","agent_id":"shopper","idempotency_key":"order-1","paypal_order_id":"5O190127TN364715T"}'
```

1. **Authenticate and rate limit.** The agent key must belong to `agent_id` (30 proposals per minute per agent by default; `429` above).
2. **Read the order from PayPal.** `GET /v2/checkout/orders/{id}` with AgentGuard's credentials. Payee, amount, currency and line items come from PayPal, not from the agent. Sending `payee`, `currency` or `items` together with an order id is rejected. Single purchase unit only; tax, shipping and discount must reconcile.
3. **Evaluate.** Re-verify the user's passkey signature on the mandate, then run every constraint. Advisory risk scoring (injection signals in `context`, optional LLM) can only escalate a passing payment to a human, never approve a failing one.
4. **Reserve.** Under a write lock (`BEGIN IMMEDIATE` on SQLite, `pg_advisory_xact_lock` on Postgres) the amount is reserved against `max_total` and `max_transactions`, the idempotency key is bound to the proposal hash, and the decision is appended to the audit chain.
5. **Hold if needed.** Over the approval threshold the payment waits for a passkey-signed approval (15-minute TTL).
6. **Authorize and verify.** Re-read the order (its digest must match), authorize against the user's vaulted wallet with `intent: AUTHORIZE`, then check PayPal's view of the authorization: amount, currency, payee. The mandate status is re-checked under lock.
7. **Capture or void.** Capture with `invoice_id = AGPOI-<receipt_id>`, or void on any mismatch or revocation. Then issue the [receipt](./receipts.md).

Every PayPal money call carries a `PayPal-Request-Id`, and replays of the same idempotency key return the original decision.

## Responses

`{decision: "approve" | "reject" | "needs_human", status, reasons, payment_id, paypal: {order_id, authorization_id, capture_id}}`. Check status later with `GET /v1/agent/payments/:id`.

## Crash recovery

The process is safe to kill at any point. On start and every 5 minutes (`AGENTGUARD_RECOVER_INTERVAL_MS`; on Vercel the maintenance cron) payments stuck in `reserved` or `authorized` for over 60 seconds are converged with PayPal: never-authorized reservations are released, captured or voided authorizations are synced, open ones are captured only if the mandate is still active, otherwise voided. Transient errors are retried next run. Operators can inspect `GET /v1/payments/stuck` and trigger `POST /v1/recover`.

## Kill-switch

`POST /v1/control/pause {reason, by}` blocks every new proposal (503) and approval and stops reserved payments from reaching PayPal. `POST /v1/control/resume` lifts it. Pausing only stops money, so it is deliberately admin-only.
