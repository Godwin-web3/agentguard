---
title: SDKs and API portal (APIMatic)
description: Generated TypeScript, Python and C# SDKs and an API documentation portal from the AgentGuard OpenAPI spec, with APIMatic.
---
# SDKs and API portal (APIMatic)

The AgentGuard HTTP API is described by one OpenAPI 3.1 document, built from `docs/openapi.mjs` and tested against the server's route table on every CI run. It is served at [`/openapi.json`](/openapi.json) and copied into an [APIMatic](https://www.apimatic.io) project in [`apimatic/`](https://github.com/Godwin-web3/agentguard/tree/main/apimatic), which APIMatic turns into:

- **SDKs** for TypeScript, Python and C#, with method names from the spec's operation ids: `proposePayment`, `searchProducts`, `getAgentPayment`, `getAgentPaymentReceipt`, `getIssuerKeySet`, …
- **An API documentation portal** with the AgentGuard brand, an interactive API reference, guides and a context plugin that teaches AI coding assistants to use the SDK.

The agent-facing calls have typed responses (`PaymentDecision`, `Evaluation`, `ProductSearchResult`, `ReceiptEnvelope`, `IssuerKeySet`, `AuditEntry`), so an SDK user gets the decision, every policy check and the risk signals as typed fields rather than untyped JSON.

**Portal:** [agentguard-api-portal.vercel.app](https://agentguard-api-portal.vercel.app) (APIMatic-generated, hosted as a static site): API reference with a "try it" console, code samples in cURL, TypeScript, Python and C#, SDK downloads, guides and the context plugin.

## The SDKs

The generated SDKs are committed in [`apimatic/sdk/`](https://github.com/Godwin-web3/agentguard/tree/main/apimatic/sdk): `typescript/` (npm package `agent-guard-api`, ESM + CommonJS), `python/` (`agent_guard_api`, sync and async clients) and `csharp/` (.NET). Each one has its own README, an `api-reference.md` and an SDK map for AI coding assistants. They are not published to a registry yet: build from the folder, or download them from the portal.

```ts
import { AgentGuardApiClient, ServerEnvironment } from "agent-guard-api";

const client = new AgentGuardApiClient({ serverEnvironment: ServerEnvironment.Production, agent: process.env.AGENTGUARD_AGENT_KEY });

// Find something real to buy, capped at what the mandate still allows (Channel3).
const found = await client.agent.searchProducts({ body: { mandateId: "mdt_…", query: "65W USB-C charger" } });

// Propose paying a merchant's PayPal order. AgentGuard reads the order from PayPal and checks it against the signed mandate.
const decision = await client.agent.proposePayment({
  body: { mandateId: "mdt_…", agentId: "shopper", idempotencyKey: "order-1", paypalOrderId: "5O190127TN364715T" },
});
console.log(decision.status, decision.evaluation.checks.filter(c => !c.pass));   // captured | needs_human | rejected
```

```python
from agent_guard_api import AgentGuardApiClient

client = AgentGuardApiClient()                       # hosted demo; pass agent="ag_…" for agent calls
print(client.meta.get_health())                      # ok=True stuck=0 last_recovery=None
print([k.kid for k in client.keys.get_issuer_key_set().keys])
```

Errors are typed, too: `.asApiResult()` (TypeScript) returns `{ ok: false, status: 401, payload: { body: { error: "unauthorized" } } }` instead of throwing.

[`apimatic/examples/smoke.mjs`](https://github.com/Godwin-web3/agentguard/blob/main/apimatic/examples/smoke.mjs) runs the TypeScript SDK against the hosted demo: health, the issuer key set, and a payment proposal with a wrong agent key that must come back as a typed 401 (`npm run apimatic:smoke`).

## Regenerate

```sh
npx -y @apimatic/cli@2 auth login        # or pass --auth-key with an APIMatic API key
npm run spec:apimatic                    # refresh apimatic/src/spec/openapi.json from docs/openapi.mjs
npm run apimatic:validate                # APIMatic validation and linting
npm run apimatic:sdk                     # apimatic/sdk/typescript, python, csharp
npm run apimatic:smoke                   # build the TypeScript SDK and call the hosted demo
npm run apimatic:portal                  # static portal in apimatic/portal
```

The portal is published from the `api-portal` branch (the contents of `apimatic/portal`) as its own static Vercel project. In CI, `.github/workflows/apimatic.yml` validates, generates the three SDKs, smoke-tests the TypeScript one and builds the portal with the `APIMATIC_API_KEY` repository secret, and uploads them as a build artifact. A test fails if `apimatic/src/spec/openapi.json` drifts from the API.
