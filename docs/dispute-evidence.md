---
title: Dispute evidence
description: Turn a verified receipt into a PayPal dispute evidence pack and optionally submit it.
---
# Dispute evidence

`intent-verify evidence` verifies the receipt first and only builds evidence from a receipt that passes.

```sh
npx -p @agentguard-dev/intent-verifier intent-verify evidence receipt.json --out ./evidence \
  --issuer-keys agentguard-keys.json --origin https://agentguard-orcin.vercel.app
```

It writes to `--out`:

- a PDF that states what is proven, lists every verification check with PASS/FAIL, and reproduces the signed receipt JSON in full;
- `provide-evidence.input.json`: the `provide-evidence` request body (`evidences[].evidence_type`, notes, document name).

## Picking the evidence type

PayPal accepts only the evidence type it asked the seller for. With `--dispute <id>` (and `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`), the verifier reads the dispute and uses, in order:

1. `--evidence-type T` if given,
2. the first evidence the dispute lists with `source: REQUESTED_FROM_SELLER`,
3. a fallback by dispute reason (e.g. `MERCHANDISE_OR_SERVICE_NOT_RECEIVED` → `PROOF_OF_FULFILLMENT`),
4. `PROOF_OF_RECEIPT_COPY`.

## Submitting

```sh
PAYPAL_CLIENT_ID=… PAYPAL_CLIENT_SECRET=… PAYPAL_API_BASE=https://api-m.sandbox.paypal.com \
  npx -p @agentguard-dev/intent-verifier intent-verify evidence receipt.json --out ./evidence \
  --issuer-keys agentguard-keys.json --dispute PP-R-XXX-000 --submit PP-R-XXX-000
```

`--submit` posts to `/v1/customer/disputes/<id>/provide-evidence` with your merchant credentials. It never accepts, refunds or closes a dispute. From code, use `buildDisputeEvidence`, `chooseEvidenceType`, `fetchDispute` and `submitDisputeEvidence`. See [Packages](./packages.md).

What a receipt proves in a dispute, and what it does not, is covered in [Disputes](./disputes.md).
