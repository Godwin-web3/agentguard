---
title: Key rotation and compromise
description: Rotate the issuer signing key and handle a leaked key without invalidating honest receipts.
---
# Key rotation and compromise

Receipts are signed by an Ed25519 issuer key identified by `kid`. All keys, past and present, are published at `/.well-known/agentguard-keys` with `status`, `created_at`, `retired_at` and `compromised_at`.

## Rotate

```sh
curl -s -X POST $U/v1/keys/rotate -H "authorization: Bearer $T"
```

The active key is retired and a new one created (audited). With a local key ring you can also rotate offline and restart: `node --experimental-strip-types scripts/rotate-key.ts` (`--list` shows the ring). `kid` is the first 32 hex characters of sha256(SPKI DER). Old receipts still verify: the verifier accepts a key only for receipts issued during its lifetime.

## Mark a key compromised

```sh
curl -s -X POST $U/v1/keys/$KID/compromised -H "authorization: Bearer $T" \
  -H 'content-type: application/json' -d '{"at":"2026-10-28T10:00:00Z"}'
```

If the key is active it is rotated first. From then on a receipt signed by that key passes only if an independent RFC 3161 timestamp proves it existed before `at` (see [Anchoring](./anchoring.md)). Receipts without a timestamp fail.

Verifiers must re-fetch the key set to learn about the compromise. If you pin it, refresh it on a schedule.

## Passkey replacement

When a user loses a passkey, re-enrollment has a notice period during which the old passkey can cancel it (`/v1/users/:id/recovery`). Mandates signed by the old passkey become `frozen` until re-signed. See [Passkeys](./passkeys.md).
