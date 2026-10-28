---
title: Passkeys, enrollment and recovery
description: How a user's passkey is bound, replaced and recovered without letting an admin take over.
---
# Passkeys, enrollment and recovery

Each user has one WebAuthn passkey with user verification (PIN or biometric) required. The server never holds a key that can authorize spending.

## Enrollment links

Enrollment is not trust-on-first-use. The admin issues a single-use link bound to one user:

```sh
curl -s -X POST $U/v1/users/alice/enrollments -H "$A" -H "$J" -d '{"ttl_minutes":15}'
# → {"token":"…","link":"https://your-host/console#enroll=…","expires_at":"…"}
```

Only the token's sha256 is stored. The user opens the link and the console calls `POST /v1/enroll/options {token}` then `POST /v1/enroll {token, response}`. Reused, expired or other-user tokens are refused. Every receipt records how the passkey was enrolled (`mandate.passkey.enrollment`).

## Replacing a passkey

Two paths, neither of which lets the admin token alone take over:

1. **With the current passkey.** `POST /v1/users/:id/reenroll-request` → assert → `POST /v1/users/:id/reenroll` mints a fresh enrollment token. Immediate, recorded as `via: passkey`.
2. **Time-locked recovery** (passkey lost). An admin link naming the credential it replaces only *starts* a recovery. The new key cannot sign anything for `AGENTGUARD_RECOVERY_LOCK_MS` (72 hours by default). The user is notified through `AGENTGUARD_NOTIFY_WEBHOOK`, and the current passkey can cancel at any time (`POST /v1/users/:id/recovery/cancel-request` → assert → `/recovery/cancel`). `GET /v1/users/:id/recovery` shows the state.

In both cases, mandates signed by the old key are frozen until the new key re-signs them. A recovery shows up in the audit log, on every later receipt (`enrollment.via = recovery`), and as a `RECOVERY` warning in the verifier.

## Approvals

Payments over `require_human_approval_over` are held. `POST /v1/approvals/:id/request {approve}` returns a statement (payment, order, amount, decision, a single-use 5-minute nonce, expiry) and WebAuthn options whose challenge is base64url(sha256(`"agentguard:approval:v1:"` + canonical(statement))). `POST /v1/approvals/:id {approve, assertion}` resolves it. The console recomputes the challenge from the statement and refuses on mismatch.

## Honest limits

The **first** enrollment is admin-bootstrapped: whoever holds the admin token decides who gets the first link. Deliver links over your own authenticated channel. An admin who also suppresses the notification webhook and outlasts the lock can still recover an account; the receipt then says `RECOVERY`, so it is visible, not prevented.
