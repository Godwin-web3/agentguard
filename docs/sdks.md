---
title: SDKs and API portal (APIMatic)
description: Generated TypeScript, Python and C# SDKs and an API documentation portal from the AgentGuard OpenAPI spec, with APIMatic.
---
# SDKs and API portal (APIMatic)

The AgentGuard HTTP API is described by one OpenAPI 3.1 document, built from `docs/openapi.mjs` and tested against the server's route table on every CI run. It is served at [`/openapi.json`](/openapi.json) and copied into an [APIMatic](https://www.apimatic.io) project in [`apimatic/`](https://github.com/Godwin-web3/agentguard/tree/main/apimatic), which APIMatic turns into:

- **SDKs** for TypeScript, Python and C#, with method names from the spec's operation ids: `proposePayment`, `searchProducts`, `getAgentPayment`, `getAgentPaymentReceipt`, `getIssuerKeySet`, …
- **An API documentation portal** with the AgentGuard brand, an interactive API reference, guides and a context plugin that teaches AI coding assistants to use the SDK.

The agent-facing calls have typed responses (`PaymentDecision`, `Evaluation`, `ProductSearchResult`, `ReceiptEnvelope`, `IssuerKeySet`, `AuditEntry`), so an SDK user gets the decision, every policy check and the risk signals as typed fields rather than untyped JSON.

## Generate

```sh
npx -y @apimatic/cli@2 auth login        # APIMatic account (free trial)
npm run spec:apimatic                    # refresh apimatic/src/spec/openapi.json from docs/openapi.mjs
npm run apimatic:validate                # APIMatic validation and linting
npm run apimatic:sdk                     # apimatic/sdk/typescript, apimatic/sdk/python
npm run apimatic:portal                  # static portal in apimatic/portal
```

In CI, `.github/workflows/apimatic.yml` does the same with the `APIMATIC_API_KEY` repository secret and uploads the SDKs and the portal as a build artifact. A test fails if `apimatic/src/spec/openapi.json` drifts from the API.
