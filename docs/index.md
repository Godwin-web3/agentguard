---
title: Introduction
description: AgentGuard is financial authorization for AI agents that pay through PayPal, with Proof-of-Intent receipts merchants verify offline.
---
# Introduction

AgentGuard sits between an AI agent and PayPal. The agent can browse, compare and propose a purchase. It cannot spend outside what its user signed, even if it is fully taken over by prompt injection.

1. **The user signs a mandate with a passkey.** Payees, SKUs, categories, per-payment and total limits, how many payments, when to ask first. The passkey signs the mandate's hash, so neither the agent nor the server can widen it.
2. **Every payment is checked deterministically.** The agent proposes a merchant-created PayPal order. AgentGuard reads that order from PayPal, checks it against the signed mandate, reserves budget atomically, authorizes the user's vaulted wallet, re-checks PayPal's view of the money, and only then captures. Anything else is rejected or voided.
3. **Every capture gets a Proof-of-Intent receipt.** Signed JSON that binds the user's passkey signature, the exact order, the decision, any passkey-signed approval, the PayPal capture and the audit-log position. Merchants verify it offline with [`@agentguard-dev/intent-verifier`](https://www.npmjs.com/package/@agentguard-dev/intent-verifier) and can attach it to a PayPal dispute.

Receipts also carry the purchase as [AP2](./ap2.md) mandates, so it is AP2-style verifiable intent, enforced on PayPal today.

## Packages

| Package | What it is |
|---|---|
| [`@agentguard-dev/intent-verifier`](https://www.npmjs.com/package/@agentguard-dev/intent-verifier) | Zero-dependency receipt verifier: library and `intent-verify` CLI, plus PayPal dispute-evidence builder |
| [`@agentguard-dev/paypal-toolkit`](https://www.npmjs.com/package/@agentguard-dev/paypal-toolkit) | Drop-in guard for PayPal's Agent Toolkit (Vercel AI SDK, OpenAI, MCP) |

```sh
npm i @agentguard-dev/intent-verifier
npm i @agentguard-dev/paypal-toolkit @paypal/agent-toolkit
```

## Where to start

- [Quickstart](./quickstart.md): verify a real receipt, then run the gateway and sign a mandate.
- [Payment flow](./payment-flow.md): what happens between "agent proposes" and "money moves".
- [Security model](./security.md): what is enforced, what is only attested, and the honest limits.
- [API reference](./api.md) and [`/openapi.json`](/openapi.json).

## Status

AgentGuard is open source (Apache-2.0) and at version 0.1. The hosted demo at `agentguard-orcin.vercel.app` runs against the **PayPal sandbox only**. Reading and authorizing a third-party merchant's order needs PayPal partner permissions, which are not set up yet (see [FAQ](./faq.md)).
