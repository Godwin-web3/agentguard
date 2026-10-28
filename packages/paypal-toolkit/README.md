# @agentguard-dev/paypal-toolkit

[![npm](https://img.shields.io/npm/v/@agentguard-dev/paypal-toolkit?color=cb3837)](https://www.npmjs.com/package/@agentguard-dev/paypal-toolkit) [![License](https://img.shields.io/badge/license-Apache--2.0-blue)](https://github.com/Godwin-web3/agentguard/blob/main/LICENSE) · [Guide](https://agentguard-orcin.vercel.app/docs/toolkit)

```sh
npm i @agentguard-dev/paypal-toolkit @paypal/agent-toolkit   # + ai (Vercel AI SDK) or @modelcontextprotocol/sdk (MCP) as needed
```

Drop-in guard for [PayPal's Agent Toolkit](https://www.npmjs.com/package/@paypal/agent-toolkit) (v1.11). Your agent keeps the
toolkit's tools, but **money only moves through [AgentGuard](https://github.com/Godwin-web3/agentguard)**:

- `pay_order` goes to AgentGuard. AgentGuard reads PayPal's own order record and checks it against a mandate the user
  signed with a **passkey**: payee, amount, SKU, category and quantity, plus spend limits and owner approval. Only then does
  it authorize the user's vaulted wallet and capture. The agent never calls PayPal's capture.
- `create_order` creates an `AUTHORIZE` order with the merchant credentials. This moves no money.
- Read-only tools (`get_order`, `list_*`, `show_*`, …) pass through unchanged.
- **Every other tool is removed** (fail-closed). That covers refunds, disputes, subscriptions, invoices, and recording payments.
- The mandate id comes from config, never from tool arguments.

## Install

```bash
npm i @agentguard-dev/paypal-toolkit @paypal/agent-toolkit ai   # + @modelcontextprotocol/sdk for MCP
```

## Usage (Vercel AI SDK)

```ts
import { PayPalAgentToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/ai-sdk";
import { guardTools } from "@agentguard-dev/paypal-toolkit/ai-sdk";
import { generateText } from "ai";

const toolkit = new PayPalAgentToolkit({ clientId, clientSecret, configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: true } } });
const tools = guardTools(toolkit, { url: process.env.AGENTGUARD_URL!, apiKey: process.env.AGENTGUARD_API_KEY!,
  agentId: "shopper", mandateId: process.env.AGENTGUARD_MANDATE_ID! });
const r = await generateText({ model, tools, maxSteps: 5, prompt: "Buy $10 of API credits" });
```

**OpenAI** (`@paypal/agent-toolkit/openai`): `const g = guardOpenAI(toolkit, cfg)`. Then use `g.getTools()` and
`g.handleToolCall(toolCall)` exactly where you used the toolkit's own versions.

**MCP** (Claude Desktop, Cursor, …):

```json
{ "mcpServers": { "paypal-guarded": { "command": "npx", "args": ["-y", "-p", "@agentguard-dev/paypal-toolkit", "-p", "@paypal/agent-toolkit",
  "-p", "@modelcontextprotocol/sdk", "agentguard-paypal-mcp"],
  "env": { "PAYPAL_CLIENT_ID": "…", "PAYPAL_CLIENT_SECRET": "…", "PAYPAL_ENVIRONMENT": "SANDBOX",
           "AGENTGUARD_URL": "…", "AGENTGUARD_API_KEY": "…", "AGENTGUARD_AGENT_ID": "…", "AGENTGUARD_MANDATE_ID": "…" } } } }
```

The bin is `agentguard-paypal-mcp`. It refuses to start if the mandate is missing or not active.

## Results

`pay_order` returns `{decision: approve|reject|needs_human, status, reasons, paypal: {order_id, authorization_id, capture_id}}`.
A `needs_human` payment waits for the owner. The agent can check it with `get_payment_status`.

## Limits

- AgentGuard can only read and authorize orders created by **its own PayPal app**. For third-party merchants that needs
  PayPal partner permissions (`PayPal-Auth-Assertion`), which are not set up yet.
- Only `USD` is supported (the same as the toolkit's `create_order`). Single purchase unit only.
- Live check: `scripts/live.sh`. It uses a scripted tool-calling model unless an LLM key is set.
