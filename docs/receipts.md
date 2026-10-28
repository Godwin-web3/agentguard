---
title: Proof-of-Intent receipts
description: The signed evidence every captured payment produces, and what it does and does not prove.
---
# Proof-of-Intent receipts

Every payment captured against a merchant's PayPal order gets a receipt with schema `agentguard.proof-of-intent/v1`: canonical JSON plus a detached Ed25519 signature with a `kid`.

| Section | What it binds |
|---|---|
| `mandate` | The mandate body and hash, and the user's **WebAuthn assertion** over that hash (credential id, COSE public key, enrollment provenance). Verifiable without the server. |
| `order` | The PayPal order snapshot the decision was made on (payee, amount, currency, items) and its digest. |
| `decision` | Policy outcome, per-rule results, agent id, idempotency key, the proposal hash. |
| `approval` | For held payments: the passkey-signed approval statement (`method: "passkey"`). |
| `payment` | Authorization id, capture id and status, amount, times, and `AGPOI-<receipt_id>` written on the capture as `invoice_id`. |
| `audit` | Sequence and hash of the capture entry in the hash-chained audit log, plus the [anchor](./anchoring.md) inclusion proof and prior spend of this mandate. |
| `timestamps` | RFC 3161 token(s) over sha256(canonical(receipt)). |
| `ap2` | The same purchase as [AP2 mandates](./ap2.md). |

## Getting a receipt

| Who | Endpoint |
|---|---|
| Agent | `GET /v1/agent/payments/:id/receipt` or MCP `get_payment_receipt` |
| Owner | `GET /v1/payments/:id/receipt`, `GET /v1/receipts/:id` |
| Anyone (opt-in) | `GET /v1/public/receipts/:id` when `AGENTGUARD_PUBLIC_RECEIPTS=1` |

The issuer key set is published at [`/.well-known/agentguard-keys`](/.well-known/agentguard-keys). Pin it.

## Verifying

```sh
npx -p @agentguard-dev/intent-verifier intent-verify receipt.json --issuer-keys agentguard-keys.json --payee you@shop.example
```

See [Merchant verification](./merchant-verification.md) for the library API and the live PayPal re-check.

## What a receipt is not

It is evidence, not a guaranteed dispute win. PayPal and card networks decide disputes on their own rules, and "item not received" or "not as described" are about fulfilment, which no payment receipt proves.

- **Checked independently** by the verifier: the passkey signature over the mandate, the order against the mandate, and for held payments the passkey signature over the approval statement.
- **Attested by the issuer key**: the decision, cumulative spend before the first anchor, audit position, enrollment provenance. That is why you pin the key set rather than trusting the key embedded in the receipt. Unknown kids, and receipts signed by a key after its `retired_at`, are rejected.
- The passkey proves the *holder of that credential* signed. Binding it to a real person happens at [enrollment](./passkeys.md).
