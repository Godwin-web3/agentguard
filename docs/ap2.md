---
title: AP2 mapping
description: How AgentGuard receipts express the purchase as Agent Payments Protocol mandates, and what is approximated.
---
# AP2 mapping

Every receipt carries an `ap2` block: the purchase as [Agent Payments Protocol](https://github.com/google-agentic-commerce/AP2) mandates, using the JSON shapes in AP2's `code/sdk/schemas/ap2` (pinned to commit `e1ea56d`, April 2026). AP2 v0.1 called these Intent, Cart and Payment Mandates; the current spec splits intent into Open Checkout and Open Payment Mandates and calls the cart a Checkout Mandate.

| AP2 role | AP2 object | Built from | Fidelity |
|---|---|---|---|
| Intent | `open_checkout_mandate` | passkey-signed mandate: payee allowlist, SKU allowlist, max quantity | Exact when `sku_allowlist` is set; otherwise line items come from the order |
| Intent | `open_payment_mandate` | mandate limits and window | Exact for per-payment cap, budget, count and window. Categories and blocklists have no AP2 constraint |
| Cart | `checkout_mandate` | the merchant's PayPal order, as read from PayPal | Shape exact; `checkout_jwt` is an **unsecured JWT (`alg: none`)**, not a merchant JWS |
| Payment | `payment_mandate` | decision + PayPal authorization | Exact. Instrument `PAYPAL_WALLET`; the vault token is never included |
| Receipts | `checkout_receipt`, `payment_receipt` | capture | PayPal is both PSP and network |

Hashes follow AP2: `checkout_hash` = base64url(sha256(checkout_jwt)). Every AP2 object also carries `agentguard_mandate_hash`, pinning it to what the passkey signed.

The verifier recomputes the AP2 views from the signed receipt and checks the chain (open payment → open checkout, checkout hash → PayPal order, amount within range, payee allowed, receipts → capture). An edited view fails even if the attacker re-signs the whole receipt with their own key.

```sh
npx -p @agentguard-dev/intent-verifier intent-verify ap2 receipt.json
```

## Approximations

- **No SD-JWT.** AP2 mandates are SD-JWT VCs with key binding and selective disclosure. These are plain JSON claim sets authenticated by the receipt's Ed25519 signature.
- **The user signs AgentGuard's mandate**, not the AP2 objects. They are derived deterministically from it and re-derived by the verifier, so the authority is the same but the signed bytes differ.
- **Merchant authenticity comes from PayPal's API**, not a merchant signature.
- `cnf` is `{kid: "agentguard-agent:<agent_id>"}`, not an agent JWK. AgentGuard does not speak AP2's A2A message flows.
