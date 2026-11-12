# TypeScript SDK (/sdks/typescript)

[Download SDK](/__downloads/sdk/typescript.zip)

## Intro [#intro]

The AgentGuard API SDK provides access to the AgentGuard API REST APIs.

Financial authorization gateway for AI agents paying through PayPal. Errors are `{"error": string}`. Responses are JSON with `cache-control: no-store`. Docs: https://agentguard-orcin.vercel.app/docs

## Installation [#installation]

The SDK compiles to `dist/` before it can be referenced — run its `build` script once in the SDK folder, then add it to your project by path:

```bash
npm install <path-to-sdk>
```

## Quick Start [#quick-start]

Create one client and reuse it. Configure its behaviour through `ClientOptions`.

```ts
import { AgentGuardApiClient, ServerEnvironment } from "agent-guard-api";

const client = new AgentGuardApiClient({
  serverEnvironment: ServerEnvironment.Production,
  admin: "YOUR_BEARER_TOKEN",
  agent: "YOUR_BEARER_TOKEN",
  cron: "YOUR_BEARER_TOKEN",
});
```

Nothing in `ClientOptions` is required — `new AgentGuardApiClient()` compiles — and each option left out falls back to its default. `serverEnvironment` is spelled out above so the environment a call reaches is visible where the client is built rather than inherited silently.

### From CommonJS [#from-commonjs]

The package ships both dialects from a single entry, so `require` works with full types. In a TypeScript CommonJS file use the `import ... = require(...)` form — a plain destructuring `require` runs fine but gives you `any`.

```ts
import sdk = require("agent-guard-api");

const client = new sdk.AgentGuardApiClient({
  serverEnvironment: sdk.ServerEnvironment.Production,
  admin: "YOUR_BEARER_TOKEN",
  agent: "YOUR_BEARER_TOKEN",
  cron: "YOUR_BEARER_TOKEN",
});
```