# @agentguard-dev/intent-verifier

Standalone, zero-dependency verifier for AgentGuard **Proof-of-Intent receipts** (`agentguard.proof-of-intent/v1`). It does not talk to, import, or trust an AgentGuard server. Node ≥ 20.

## What it checks
- **Issuer signature**: Ed25519 over the canonical receipt; key ID matches. Pin the key with `--issuer-key` (PEM or the `/.well-known/agentguard-key` JSON); otherwise the result says `trusted_issuer: false`.
- **User passkey**: re-hashes the mandate, checks the WebAuthn `clientDataJSON` challenge equals that hash, origin (`--origin`), rpIdHash, UP/UV flags, and the ES256/EdDSA/RS256 signature with the embedded COSE key.
- **Order vs mandate**: recomputes the order digest from the snapshot and checks currency, per-payment limit, payee allowlist, SKUs, categories and quantities; `--payee` asserts it was paid to you.
- **Decision binding, time window, capture status, audit anchor.**
- **Optional live re-check** (`--paypal`, uses `PAYPAL_CLIENT_ID/SECRET`, `PAYPAL_API_BASE`): the order still exists and matches the snapshot, the capture is present with the right amount, and its `invoice_id` is `AGPOI-<receipt_id>`.

Exit code 0 = valid, 1 = invalid, 2 = usage error. `--json` prints the full result.

## Dispute evidence
`intent-verify evidence receipt.json --out dir` writes a PDF summary and the `input` JSON for PayPal's `POST /v1/customer/disputes/{id}/provide-evidence`; `--submit <dispute_id>` uploads them with your merchant keys. A receipt is evidence, not a guaranteed win.

## Library
```ts
import { verifyReceipt, buildDisputeEvidence } from "@agentguard-dev/intent-verifier";
const r = await verifyReceipt(envelope, { issuerPublicKeyPem, expectedPayee: "you@shop.example" });
```
