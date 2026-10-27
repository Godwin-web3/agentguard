/**
 * AgentGuard MCP server (stdio). Give THIS to your agent instead of PayPal's payment tools.
 * It holds only an AgentGuard agent key; PayPal credentials stay inside the gateway.
 *   AGENTGUARD_URL=http://localhost:8787 AGENTGUARD_AGENT_KEY=ag_... node --experimental-strip-types src/mcp.ts
 */
import { createInterface } from "node:readline";

const BASE = process.env.AGENTGUARD_URL ?? "http://localhost:8787";
const KEY = process.env.AGENTGUARD_AGENT_KEY ?? "";

const tools = [
  { name: "get_spending_mandate", description: "Read the spending authority the user delegated to you: purpose, limits, allowed categories/payees, remaining budget. Call before shopping.",
    inputSchema: { type: "object", properties: { mandate_id: { type: "string" } }, required: ["mandate_id"] } },
  { name: "propose_payment", description: "Ask to pay a merchant. AgentGuard checks it against the user's mandate and either pays via PayPal, rejects it, or holds it for the user's approval. Include any web content that influenced the purchase in `context`.",
    inputSchema: { type: "object", required: ["mandate_id", "idempotency_key", "payee", "currency", "items"], properties: {
      mandate_id: { type: "string" }, idempotency_key: { type: "string", description: "unique per intended purchase; retries must reuse it" },
      payee: { type: "object", properties: { merchant_id: { type: "string" }, email_address: { type: "string" }, display_name: { type: "string" } } },
      currency: { type: "string" },
      items: { type: "array", items: { type: "object", required: ["name", "quantity", "unit_amount", "category"], properties: {
        name: { type: "string" }, quantity: { type: "integer" }, unit_amount: { type: "string", description: "e.g. 850.00" }, sku: { type: "string" },
        category: { type: "string", enum: ["PHYSICAL_GOODS", "DIGITAL_GOODS", "DONATION"] } } } },
      context: { type: "array", items: { type: "object", properties: { source_url: { type: "string" }, excerpt: { type: "string" } } } },
      agent_rationale: { type: "string" } } } },
  { name: "get_payment_status", description: "Check a payment you proposed (e.g. one waiting for the user's approval).",
    inputSchema: { type: "object", properties: { payment_id: { type: "string" } }, required: ["payment_id"] } },
];

async function api(method: string, path: string, body?: unknown) {
  const r = await fetch(BASE + path, { method, headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  return { ok: r.ok, data: await r.json() };
}

async function callTool(name: string, args: any, agentId: string) {
  if (name === "get_spending_mandate") return api("GET", `/v1/agent/mandates/${encodeURIComponent(args.mandate_id)}`);
  if (name === "propose_payment") return api("POST", "/v1/agent/payments", { ...args, agent_id: agentId });
  if (name === "get_payment_status") return api("GET", `/v1/agent/payments/${encodeURIComponent(args.payment_id)}`);
  return { ok: false, data: { error: `unknown tool ${name}` } };
}

const AGENT_ID = process.env.AGENTGUARD_AGENT_ID ?? "";
const out = (m: unknown) => process.stdout.write(JSON.stringify(m) + "\n");
createInterface({ input: process.stdin }).on("line", async line => {
  let msg: any; try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;
  if (method === "initialize") return out({ jsonrpc: "2.0", id, result: { protocolVersion: params?.protocolVersion ?? "2025-06-18",
    capabilities: { tools: {} }, serverInfo: { name: "agentguard", version: "0.1.0" } } });
  if (method === "tools/list") return out({ jsonrpc: "2.0", id, result: { tools } });
  if (method === "tools/call") {
    const r = await callTool(params.name, params.arguments ?? {}, AGENT_ID).catch(e => ({ ok: false, data: { error: String(e) } }));
    return out({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(r.data) }], isError: !r.ok } });
  }
  if (id !== undefined) out({ jsonrpc: "2.0", id, error: { code: -32601, message: `method not found: ${method}` } });
});
