---
title: Package API
description: Exports of @agentguard-dev/intent-verifier and @agentguard-dev/paypal-toolkit.
---
# Package API

Both packages are ESM, ship TypeScript types, and are Apache-2.0.

## `@agentguard-dev/intent-verifier`

```sh
npm i @agentguard-dev/intent-verifier
```

| Export | Signature / purpose |
|---|---|
| `verifyReceipt(envelope, opts?)` | `Promise<VerifyResult>`: `{ok, trusted_issuer, receipt_id, checks: {check, pass, detail}[], warnings}`. |
| `VerifyOptions` | `issuerKeys`, `issuerPublicKeyPem`, `expectedOrigins`, `expectedPayee`, `paypal: {clientId, clientSecret, apiBase}`, `tsaRoots`, `requireTimestamp`, `requireAnchor`, `maxAnchorLagMs`, `allowAdminApproval`. |
| `verifyPasskeyAssertion(a)` | Check one WebAuthn assertion over a hex digest. |
| `checkOrderAgainstMandate(facts, mandate)` | The mandate rules as `Check[]`. |
| `orderFacts(order)` | Normalize a PayPal order (payee, currency, amount, items). |
| `buildAp2(receipt)`, `verifyAp2(receipt)` | Derive and check AP2 views. Also `ap2Hash`, `AP2_PROFILE`, `AP2_SPEC_REF`, `AP2_CAVEATS`. |
| `buildDisputeEvidence(env, result, {evidenceType})` | PayPal `provide-evidence` input and PDF. |
| `chooseEvidenceType(dispute, explicit?)`, `fetchDispute(id, creds)`, `submitDisputeEvidence(id, ev, creds)` | Dispute helpers. `REASON_FALLBACK`, `DEFAULT_EVIDENCE_TYPE`. |
| `canonical(value)` | The canonical JSON used for every hash and signature. |
| `coseToKey(cose)` | COSE public key → Node `KeyObject`. |
| `merkleRoot`, `inclusionProof`, `verifyInclusion`, `leafHash` | RFC 6962 Merkle helpers. |
| `checkReceiptTimestamps`, `checkCompromise`, `checkSpend`, `checkAnchor`, `checkRecovery` | Individual trust checks used by `verifyReceipt`. |
| `SUPPORTED_SCHEMAS` | `["agentguard.proof-of-intent/v1"]`. |

## `@agentguard-dev/paypal-toolkit`

```sh
npm i @agentguard-dev/paypal-toolkit @paypal/agent-toolkit
```

| Entry | Export |
|---|---|
| `@agentguard-dev/paypal-toolkit` | `PayPalGuard` (`mandate()`, `createOrder()`, `payOrder()`, `paymentStatus()`, `handle()`), `GuardConfig` (`url`, `apiKey`, `agentId`, `mandateId`, `fetch?`), `GuardError`, `disposition()`, `READ_ONLY`, `GUARDED`, schemas. |
| `@agentguard-dev/paypal-toolkit/ai-sdk` | `guardTools(toolkit, cfg, {readOnly?})` → AI SDK tools. |
| `@agentguard-dev/paypal-toolkit/openai` | `guardOpenAI(toolkit, cfg)` → `{getTools(), handleToolCall(tc)}`. |
| `@agentguard-dev/paypal-toolkit/mcp` | `createGuardedMcpServer(toolkit, cfg, info?)` → MCP server. |
| bin `agentguard-paypal-mcp` | stdio MCP server configured from env. |

See [PayPal Agent Toolkit guard](./toolkit.md) for usage.
