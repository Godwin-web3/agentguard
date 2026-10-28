---
title: PayPal Agent Toolkit guard
description: Wrap PayPal's Agent Toolkit so the agent can only move money through AgentGuard (AI SDK, OpenAI, MCP).
---
# PayPal Agent Toolkit guard

[`@agentguard-dev/paypal-toolkit`](https://www.npmjs.com/package/@agentguard-dev/paypal-toolkit) wraps [PayPal's Agent Toolkit](https://www.npmjs.com/package/@paypal/agent-toolkit) (v1.11). Your agent keeps the toolkit's tools, but money only moves through AgentGuard:

- `pay_order` goes to AgentGuard, which checks PayPal's own order against the passkey-signed mandate, authorizes the user's vaulted wallet and captures. The agent never calls PayPal's capture.
- `create_order` creates an `AUTHORIZE` order with the merchant credentials. This moves no money.
- Read-only tools (`get_order`, `list_*`, `show_*`, …) pass through unchanged. Add `get_payment_status` to poll held payments.
- **Every other tool is removed** (fail-closed): refunds, disputes, subscriptions, invoices.
- The mandate id comes from config, never from tool arguments, so a prompt cannot switch mandates.

```sh
npm i @agentguard-dev/paypal-toolkit @paypal/agent-toolkit ai
```

You need an agent key and an active mandate id from your AgentGuard (see [Quickstart](./quickstart.md)).

## Vercel AI SDK

```ts
import { PayPalAgentToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/ai-sdk";
import { guardTools } from "@agentguard-dev/paypal-toolkit/ai-sdk";
import { generateText } from "ai";

const toolkit = new PayPalAgentToolkit({ clientId, clientSecret,
  configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: true } } });
const tools = guardTools(toolkit, {
  url: process.env.AGENTGUARD_URL!, apiKey: process.env.AGENTGUARD_API_KEY!,
  agentId: "shopper", mandateId: process.env.AGENTGUARD_MANDATE_ID!,
});
const r = await generateText({ model, tools, maxSteps: 5, prompt: "Buy $10 of API credits" });
```

## OpenAI

```ts
import { PayPalAgentToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/openai";
import { guardOpenAI } from "@agentguard-dev/paypal-toolkit/openai";

const toolkit = new PayPalAgentToolkit({ clientId, clientSecret, configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: true } } });
const g = guardOpenAI(toolkit, cfg);
// use g.getTools() and g.handleToolCall(toolCall) where you used the toolkit's own
```

## MCP (Claude Desktop, Cursor, …)

```json
{ "mcpServers": { "paypal-guarded": { "command": "npx",
  "args": ["-y", "-p", "@agentguard-dev/paypal-toolkit", "-p", "@paypal/agent-toolkit", "-p", "@modelcontextprotocol/sdk", "agentguard-paypal-mcp"],
  "env": { "PAYPAL_CLIENT_ID": "…", "PAYPAL_CLIENT_SECRET": "…", "PAYPAL_ENVIRONMENT": "SANDBOX",
           "AGENTGUARD_URL": "…", "AGENTGUARD_API_KEY": "…", "AGENTGUARD_AGENT_ID": "…", "AGENTGUARD_MANDATE_ID": "…" } } } }
```

`@modelcontextprotocol/sdk` is an optional peer dependency, so it is listed explicitly. The server refuses to start if the mandate is missing, unsigned, or not this agent's. To embed in your own server use `createGuardedMcpServer(toolkit, cfg)` from `@agentguard-dev/paypal-toolkit/mcp`.

The repo also ships a generic MCP server without the toolkit (`propose_payment`, `pay_paypal_order`, `get_payment_receipt`):

```sh
AGENTGUARD_URL=http://localhost:8787 AGENTGUARD_AGENT_KEY=ag_… AGENTGUARD_AGENT_ID=shopper \
  node --experimental-strip-types src/mcp.ts
```

## Results

`pay_order` returns `{decision: approve | reject | needs_human, status, reasons, paypal: {order_id, authorization_id, capture_id}}`. A `needs_human` payment waits for the owner's passkey; the agent checks it with `get_payment_status`. Errors are thrown as `GuardError` with `status` and `body`.

## Limits

- AgentGuard can only read and authorize orders created by **its own PayPal app**. Third-party merchants need PayPal partner permissions (`PayPal-Auth-Assertion`).
- USD only (same as the toolkit's `create_order`); single purchase unit.
