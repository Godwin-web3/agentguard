---
title: Mandates
description: The bounded spending authority a user signs with a passkey.
---
# Mandates

A mandate is the only authority an agent has. It names one user, one agent, a purpose, a time window and constraints. Until the user's passkey signs it, it is a `draft` and nothing can be spent against it.

```json
{
  "user_id": "alice", "agent_id": "shopper", "purpose": "Buy API credits; ask me above 5 USD", "ttl_minutes": 60,
  "constraints": {
    "currency": "USD", "max_total": "25.00", "max_per_transaction": "12.00", "max_transactions": 2,
    "payee_allowlist": ["shop@example.com"], "require_merchant_order": true,
    "sku_allowlist": ["AG-CREDITS-10"], "allowed_categories": ["DIGITAL_GOODS"], "max_quantity_per_item": 1,
    "require_human_approval_over": "5.00"
  }
}
```

## Constraints

| Constraint | Effect |
|---|---|
| `currency`, `max_total`, `max_transactions` | Required. Cumulative ceiling and count, reserved atomically so concurrent proposals cannot overspend. |
| `max_per_transaction` | Per-payment ceiling. |
| `payee_allowlist` / `payee_blocklist` | PayPal merchant ids or emails, checked against the payee **PayPal** reports on the order. |
| `require_merchant_order` | Only pay merchant-created PayPal orders; refuse agent-declared purchases. |
| `sku_allowlist`, `allowed_categories`, `max_quantity_per_item` | Line-item rules, checked against PayPal's order items. On the agent-declared path these are unverifiable and fail closed. |
| `require_human_approval_over` | Above this amount the payment is held until the user approves with their passkey. |

## Lifecycle

`draft` → (`sign-request`, passkey assertion, `confirm`) → `active` → `exhausted` / `expired` / `revoked`. A mandate whose signing passkey was replaced is `frozen` until the new passkey re-signs it; mandates from before passkey signing are `unsigned`.

- **Signing.** `POST /v1/mandates/:id/sign-request` returns WebAuthn options whose challenge is base64url(sha256(canonical(mandate))). `POST /v1/mandates/:id/confirm {mandate_hash, assertion}` verifies and stores the assertion.
- **Re-verified on every proposal.** The stored assertion is checked again (origin, RP ID, user presence and verification flags, signature) on every proposal, approval and capture. Editing the mandate row, its hash or the stored public key stops spending.
- **Revocation** needs a separate assertion over `sha256("agentguard:revoke:v1:" + mandate_hash)`, so a signing assertion cannot be replayed as a revocation. The admin token alone cannot confirm or revoke.

## Plain-English drafting

`POST /v1/mandates/draft-from-text {user_id, agent_id, text}` lets a model propose constraints, but a deterministic parser reads the same sentence and **the tighter limit wins**. Payees the model adds that are not in the text are dropped; anything unstated defaults tight (1 payment, 60-minute expiry). The summary the user signs is rendered by code from the final constraints, never by the model. Without `LLM_API_KEY` only the deterministic parser runs.
