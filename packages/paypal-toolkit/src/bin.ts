#!/usr/bin/env node
// Stdio MCP server: PayPal Agent Toolkit tools with money movement routed through AgentGuard.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PayPalAgentToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/ai-sdk";
import { createGuardedMcpServer } from "./mcp.ts";
import { PayPalGuard } from "./core.ts";

const env = (k: string) => { const v = process.env[k]; if (!v) { console.error(`missing env ${k}`); process.exit(1); } return v; };
const toolkit = new PayPalAgentToolkit({ clientId: env("PAYPAL_CLIENT_ID"), clientSecret: env("PAYPAL_CLIENT_SECRET"),
  configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: process.env.PAYPAL_ENVIRONMENT !== "PRODUCTION" } } });
const guard = new PayPalGuard({ url: env("AGENTGUARD_URL"), apiKey: env("AGENTGUARD_API_KEY"), agentId: env("AGENTGUARD_AGENT_ID"),
  mandateId: env("AGENTGUARD_MANDATE_ID") }, toolkit.client);
await guard.mandate(); // fail fast if the mandate is missing, unsigned, or not this agent's
await createGuardedMcpServer(toolkit as any, guard).connect(new StdioServerTransport());
