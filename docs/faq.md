---
title: FAQ
description: Common questions about AgentGuard.
---
# FAQ

## Is this production-ready?

It runs on PayPal **sandbox** today. The code paths are the live ones (Orders v2, vaulting, authorize/capture), but use live credentials only after your own review.

## Does the agent ever hold PayPal credentials?

No. Agents hold an AgentGuard key. The PayPal merchant credentials stay on the server, and the toolkit guard removes every money-moving PayPal tool except through AgentGuard.

## Can the operator spend on my behalf?

No. Activating a mandate, revoking it and approving a held payment each need the user's passkey signature, which the server re-verifies on every proposal and capture. The admin token alone cannot do it.

## What if the LLM is tricked?

It can propose whatever it wants; the policy engine checks the merchant's PayPal order against the signed mandate (payee, SKUs, quantity, amount, budget, count, window). Injection signals escalate to a human; nothing a prompt says can widen the mandate.

## Do merchants need to trust AgentGuard?

Less than you'd think. The passkey signatures, order binding and approval are checked independently by the open-source verifier. What remains attested by the issuer (decision, spend before the first anchor) is signed by a pinned key, timestamped by independent TSAs and anchored in a published Merkle log. See [Receipts](./receipts.md).

## Will a receipt win a dispute?

No one can promise that. It is strong evidence of authorization, not of fulfilment. See [Disputes](./disputes.md).

## Is it AP2?

It expresses each purchase as AP2 mandates and checks them, with documented approximations (no SD-JWT, unsigned checkout JWT). See [AP2 mapping](./ap2.md).

## Which currencies?

The policy engine is currency-aware; the PayPal toolkit guard and `create_order` are USD only.

## Where do I report a bug or vulnerability?

Bugs: [GitHub issues](https://github.com/Godwin-web3/agentguard/issues). Vulnerabilities: privately via [security advisories](https://github.com/Godwin-web3/agentguard/security/advisories/new).
