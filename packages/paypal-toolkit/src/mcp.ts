import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PayPalGuard, READ_ONLY, DESCRIPTIONS, STATUS_TOOL, createOrderSchema, payOrderSchema, statusSchema, type GuardConfig, type MerchantClient } from "./core.ts";

type AiTool = { description?: string; parameters: any; execute?: (a: any, o: any) => Promise<unknown> };

/**
 * MCP server equivalent to `@paypal/agent-toolkit/mcp`, but money only moves through AgentGuard.
 * Pass the AI SDK flavour of the toolkit (it exposes tool schemas + the merchant client).
 */
export function createGuardedMcpServer(toolkit: { client: MerchantClient; getTools(): Record<string, AiTool> }, cfg: GuardConfig | PayPalGuard,
  info = { name: "agentguard-paypal", version: "0.1.0" }): McpServer {
  const g = cfg instanceof PayPalGuard ? cfg : new PayPalGuard(cfg, toolkit.client);
  const server = new McpServer(info);
  const text = (v: unknown) => ({ content: [{ type: "text" as const, text: typeof v === "string" ? v : JSON.stringify(v, null, 2) }] });
  const safe = (fn: (a: any) => Promise<unknown>) => async (a: any) => {
    try { return text(await fn(a)); } catch (e: any) { return { ...text({ error: e?.message ?? String(e) }), isError: true }; }
  };
  for (const [name, t] of Object.entries(toolkit.getTools())) {
    if (!READ_ONLY.has(name) || !t.execute) continue;
    server.tool(name, t.description ?? name, t.parameters.shape, safe(a => t.execute!(a, { toolCallId: "mcp", messages: [] })));
  }
  server.tool("create_order", DESCRIPTIONS.create_order, createOrderSchema.shape, safe(a => g.createOrder(a)));
  server.tool("pay_order", DESCRIPTIONS.pay_order, payOrderSchema.shape, safe(a => g.payOrder(a)));
  server.tool(STATUS_TOOL, DESCRIPTIONS[STATUS_TOOL], statusSchema.shape, safe(a => g.paymentStatus(a)));
  return server;
}
export { PayPalGuard };
