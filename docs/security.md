---
title: Security and threat model
description: What AgentGuard defends against, what it trusts, and how to report a vulnerability.
---
# Security and threat model

## Design rule

Detection of prompt injection is probabilistic; money movement must not be. The agent can only *propose*. Authority comes from a mandate the user signed with their own passkey, checked by a deterministic policy engine against PayPal's own view of the order. The server holds no key that can authorize spending: its Ed25519 key only signs audit attestations and receipts.

## Threats covered

Each row is exercised by the test suite (`test/gateway.test.ts` and friends).

| Attack | Defence |
|---|---|
| Indirect prompt injection → extra purchases | Category, quantity, total, count limits; injection signals escalate to human |
| Spending escalation | Deterministic per-tx and total limits, atomic reservations (`BEGIN IMMEDIATE`) |
| Concurrent double-spend of budget | Serialized reservation under a write lock |
| Duplicate execution / replay | Idempotency keys bound to a proposal hash; PayPal-Request-Id on every money call |
| Approval reuse or swap | Single-use approvals bound to the exact proposal hash, 15-min TTL; decision signed by the user's passkey over payment, order, amount, decision and a single-use 5-min nonce |
| Mandate tampering or forged consent | User's passkey signs the canonical mandate hash (it is the WebAuthn challenge); the server re-verifies that signature against the stored public key on every proposal, approval and capture. An admin token alone cannot activate or revoke a mandate |
| Agent impersonation | Per-agent API keys; proposals must match the authenticated agent |
| Merchant substitution | Payee allowlist + verification of the payee PayPal reports on the order |
| Revocation race | Status re-checked under lock, after approval, and again before capture |
| Crash between authorize and capture | Recovery loop queries PayPal and converges; never captures if mandate is no longer active |

## Trust boundaries

| Party | Trusted for | Not trusted for |
|---|---|---|
| Agent / LLM | nothing | anything; every argument is untrusted input |
| User's passkey | consent to a mandate, approval of a held payment | identity, unless enrollment binds it |
| AgentGuard server | running the policy honestly, attesting audit position | receipt verification: merchants verify offline against pinned keys, independent TSAs and published anchors |
| PayPal | order contents, payee, authorization and capture state | — |
| Operator (admin token) | creating agents and drafts, pausing | activating or revoking mandates, approving payments (needs the passkey) |

## Known limits

- The issuer attests to history before the first audit anchor; see [Anchoring](./anchoring.md).
- AgentGuard only sees orders created by its own PayPal app (third-party merchants need partner permissions).
- The LLM risk analyzer is advisory and can be disabled; it never approves.
- A receipt does not prove fulfilment; see [Disputes](./disputes.md).

## Reporting a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/Godwin-web3/agentguard/security/advisories/new). Do not open a public issue. See [SECURITY.md](https://github.com/Godwin-web3/agentguard/blob/main/SECURITY.md) for scope and response times.
