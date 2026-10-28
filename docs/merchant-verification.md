---
title: Merchant verification
description: Verify an AgentGuard receipt before you ship, with the CLI or the library, offline or with a live PayPal re-check.
---
# Merchant verification

You received a PayPal payment whose capture `invoice_id` starts with `AGPOI-`. Verify the receipt before fulfilling. The verifier has zero runtime dependencies and never contacts AgentGuard.

## 1. Pin the issuer key set

Fetch it once over HTTPS and keep it. Re-fetch when a new `kid` appears.

```sh
curl -sf https://agentguard-orcin.vercel.app/.well-known/agentguard-keys -o agentguard-keys.json
```

## 2. Verify

```sh
npx -p @agentguard-dev/intent-verifier intent-verify receipt.json \
  --issuer-keys agentguard-keys.json --payee you@shop.example \
  --origin https://agentguard-orcin.vercel.app --require-timestamp --require-anchor
```

Exit code `0` means every check passed, `1` a check failed, `2` usage or input error. Add `--json` for machine-readable output.

Add `--paypal` to re-fetch the order and capture from PayPal **with your own credentials** and confirm the amount and the `AGPOI-<receipt_id>` invoice id:

```sh
PAYPAL_CLIENT_ID=… PAYPAL_CLIENT_SECRET=… PAYPAL_API_BASE=https://api-m.sandbox.paypal.com \
  npx -p @agentguard-dev/intent-verifier intent-verify receipt.json --issuer-keys agentguard-keys.json --paypal
```

## In code

```ts test:lib
import { readFileSync } from "node:fs";
import { verifyReceipt } from "@agentguard-dev/intent-verifier";

const envelope = JSON.parse(readFileSync("receipt.json", "utf8"));
const issuerKeys = JSON.parse(readFileSync("agentguard-keys.json", "utf8"));
const r = await verifyReceipt(envelope, { issuerKeys,
  expectedOrigins: ["https://agentguard-orcin.vercel.app"], requireTimestamp: true, requireAnchor: true });
if (!r.ok || !r.trusted_issuer) throw new Error(r.checks.filter(c => !c.pass).map(c => `${c.check}: ${c.detail}`).join("\n"));
console.log("verified", r.receipt_id);
```

Add `expectedPayee: ["you@shop.example"]` (an array of merchant ids or emails) in production. `r.ok` means every check passed; `r.trusted_issuer` means the signature verified under a pinned key.

## Checks performed

Issuer signature and key status · passkey assertion over the mandate (challenge, origin, RP ID hash, UP/UV flags, ES256/EdDSA/RS256 signature) · order digest and order against mandate (currency, limits, payee, SKUs, categories, quantities) · decision binding · time window · capture status · approval passkey signature · enrollment provenance · RFC 3161 timestamp · audit-anchor inclusion and cumulative spend · AP2 derivation.
