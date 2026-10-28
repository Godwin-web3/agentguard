---
title: CLI
description: intent-verify command reference.
---
# CLI: `intent-verify`

Installed by [`@agentguard-dev/intent-verifier`](https://www.npmjs.com/package/@agentguard-dev/intent-verifier). Node ≥ 20, zero dependencies.

```sh
npm i -g @agentguard-dev/intent-verifier    # or run with npx -p @agentguard-dev/intent-verifier intent-verify …
```

## Commands

| Command | Does |
|---|---|
| `intent-verify <receipt.json> [options]` | Verify a receipt. Offline unless `--paypal`. |
| `intent-verify ap2 <receipt.json>` | Print the receipt's AP2 mandates (Intent / Cart / Payment) as JSON. |
| `intent-verify evidence <receipt.json> --out <dir> [--dispute <id>] [--evidence-type T] [--submit <dispute_id>]` | Verify, then write a PayPal dispute evidence pack; optionally submit it. |

## Options

| Option | Meaning |
|---|---|
| `--issuer-key <pem file>` | Trust this single issuer public key (from `/.well-known/agentguard-key`). |
| `--issuer-keys <json file>` | Pin the issuer key set by kid (from `/.well-known/agentguard-keys`). Recommended. |
| `--allow-admin-approval` | Accept legacy receipts whose human approval was not passkey-signed. |
| `--origin <url>` | Accepted WebAuthn origin for the user's passkey (repeatable). |
| `--payee <id>` | Your PayPal merchant id or email; the order must pay it (repeatable). |
| `--paypal` | Also re-fetch the order and capture from PayPal using `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` (`PAYPAL_API_BASE` defaults to live; use `https://api-m.sandbox.paypal.com` for sandbox). |
| `--tsa-root <name=pem>` | Trust this RFC 3161 TSA root instead of the bundled FreeTSA / Sectigo roots (repeatable). |
| `--require-timestamp` | Fail unless the receipt carries a verified RFC 3161 timestamp. |
| `--require-anchor` | Fail unless the receipt carries a timestamped audit-anchor inclusion proof. |
| `--max-anchor-lag <min>` | Maximum minutes between the receipt and the anchor that covers it (default 1440). |
| `--dispute <id>` | (evidence) Read this dispute to pick the evidence type PayPal requested. |
| `--evidence-type <T>` | (evidence) Override the evidence type. |
| `--json` | Machine-readable output. |

Exit codes: `0` all checks pass, `1` a check failed, `2` usage or input error.

## Example

```sh
curl -sf https://agentguard-orcin.vercel.app/samples/receipt-sandbox.json -o receipt.json
curl -sf https://agentguard-orcin.vercel.app/.well-known/agentguard-keys -o agentguard-keys.json
npx -p @agentguard-dev/intent-verifier intent-verify receipt.json --issuer-keys agentguard-keys.json --json
```
