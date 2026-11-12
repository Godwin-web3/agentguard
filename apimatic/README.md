# AgentGuard × APIMatic

This directory is an [APIMatic](https://www.apimatic.io) project for the AgentGuard HTTP API: the OpenAPI 3.1 spec, the
portal configuration and guide pages APIMatic uses to generate SDKs (TypeScript, Python, C#) and an API documentation portal.

```
apimatic/src/
  apimatic.json        portal branding, context-plugin identity, SDK languages
  spec/openapi.json    generated from docs/openapi.mjs (npm run spec:apimatic); tested against the server's route table
  content/*.mdx        portal guides
  static/images/       AgentGuard logo and favicon
```

The spec is the same one served at [`/openapi.json`](https://agentguard-orcin.vercel.app/openapi.json). It has SDK-friendly
operation ids (`proposePayment`, `searchProducts`, `getAgentPaymentReceipt`, …) and typed responses for the agent and
verifier calls (`PaymentDecision`, `ProductSearchResult`, `ReceiptEnvelope`, `IssuerKeySet`, …).

## Generate

APIMatic needs an account (free trial at <https://app.apimatic.io/account/register>). Log in once, or use an API key:

```sh
npx -y @apimatic/cli@2 auth login              # or: export APIMATIC_API_KEY=… and pass --auth-key "$APIMATIC_API_KEY"
npm run spec:apimatic                          # refresh apimatic/src/spec/openapi.json
npm run apimatic:validate                      # APIMatic validation + linting
npm run apimatic:sdk                           # apimatic/sdk/typescript, python, csharp
npm run apimatic:smoke                         # build the TypeScript SDK, call the hosted demo
npm run apimatic:portal                        # static portal in apimatic/portal
```

CI: `.github/workflows/apimatic.yml` runs the same steps when the `APIMATIC_API_KEY` repository secret is set and uploads
the SDKs and portal as a build artifact.

## Published

- Portal: https://agentguard-api-portal.vercel.app (the `api-portal` branch holds the static build; a separate Vercel project serves it)
- SDKs: `apimatic/sdk/typescript`, `apimatic/sdk/python`, `apimatic/sdk/csharp` (also downloadable from the portal)
- Smoke test: `apimatic/examples/smoke.mjs`
