/**
 * Live sandbox agent loop through the guarded PayPal Agent Toolkit.
 * Uses a real LLM if OPENAI_API_KEY is set; otherwise a SCRIPTED model (ai/test MockLanguageModelV1) drives the real
 * AI SDK generateText tool-calling loop. Either way the tools, AgentGuard and PayPal calls are real.
 * Then does the same through the stdio MCP server binary (dist/bin.js) with an MCP client.
 */
import { generateText } from "ai";
import { MockLanguageModelV1 } from "ai/test";
import { PayPalAgentToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/ai-sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { guardTools } from "../src/ai-sdk.ts";

const E = (k: string) => process.env[k]!;
const cfg = { url: E("AGENTGUARD_URL"), apiKey: E("AGENTGUARD_API_KEY"), agentId: E("AGENTGUARD_AGENT_ID"), mandateId: E("AGENTGUARD_MANDATE_ID") };
const toolkit = new PayPalAgentToolkit({ clientId: E("PAYPAL_CLIENT_ID"), clientSecret: E("PAYPAL_CLIENT_SECRET"),
  configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: true } } });
const tools = guardTools(toolkit, cfg);

/** Scripted "LLM": each step emits the next tool call, reading prior tool results from the prompt like a model would. */
function scripted(plan: ((lastResult: any) => { tool: string; args: any } | string)[]) {
  let step = 0;
  return new MockLanguageModelV1({ doGenerate: async ({ prompt }) => {
    const toolMsgs = prompt.filter((m: any) => m.role === "tool");
    const last = toolMsgs.length ? (toolMsgs.at(-1) as any).content.at(-1).result : null;
    const next = plan[step++](last);
    const base = { rawCall: { rawPrompt: null, rawSettings: {} }, usage: { promptTokens: 0, completionTokens: 0 } };
    if (typeof next === "string") return { ...base, finishReason: "stop", text: next };
    return { ...base, finishReason: "tool-calls", toolCalls: [{ toolCallType: "function", toolCallId: `c${step}`, toolName: next.tool, args: JSON.stringify(next.args) }] };
  } });
}
const item = (sku: string, cat = "DIGITAL_GOODS", qty = 1) => ({ currencyCode: "USD", items: [{ name: "API credits", quantity: qty, itemCost: 10, taxPercent: 8, sku, category: cat }] });

async function run(label: string, plan: Parameters<typeof scripted>[0]) {
  const r = await generateText({ model: scripted(plan), tools, maxSteps: 5, prompt: label });
  console.log(`\n## ${label}`);
  for (const s of r.steps) for (const t of s.toolResults as any[]) console.log(`  ${t.toolName}(${JSON.stringify(t.args)}) -> ${JSON.stringify(t.result)}`);
}
console.log(process.env.OPENAI_API_KEY ? "model: real LLM" : "model: SCRIPTED tool-calling loop (no LLM key on the box); real AI SDK loop, real tools, real AgentGuard + PayPal sandbox");
await run("AI SDK: buy 10 USD of API credits (allowlisted SKU)", [
  () => ({ tool: "create_order", args: item("AG-CREDITS-10") }),
  r => ({ tool: "get_order", args: { id: r.order_id } }),
  r => ({ tool: "pay_order", args: { id: JSON.parse(typeof r === "string" ? r : JSON.stringify(r)).id } }),
  r => `done: ${r.status}`,
]);
await run("AI SDK: agent tries a gift card SKU", [
  () => ({ tool: "create_order", args: item("GIFTCARD-100") }),
  r => ({ tool: "pay_order", args: { id: r.order_id } }),
  r => `done: ${r.status}`,
]);
await run("AI SDK: agent tries to smuggle a different mandate id", [
  () => ({ tool: "create_order", args: item("AG-CREDITS-10", "PHYSICAL_GOODS", 5) }),
  r => ({ tool: "pay_order", args: { id: r.order_id, mandate_id: "mdt_attacker" } }),
  r => `done: ${r.status}`,
]);
console.log("  tools offered to the model:", Object.keys(tools).length, "| refund/dispute/subscription tools present:",
  Object.keys(tools).filter(k => /refund|dispute_claim|subscription|record_payment/.test(k) && !/^(get|list|show)/.test(k)));

// MCP over stdio, using the published bin.
console.log("\n## MCP (stdio bin dist/bin.js)");
const client = new Client({ name: "live", version: "1" });
await client.connect(new StdioClientTransport({ command: "node", args: ["dist/bin.js"], env: { ...process.env } as any }));
const names = (await client.listTools()).tools.map(t => t.name);
console.log(`  ${names.length} tools; pay_order=${names.includes("pay_order")} create_refund=${names.includes("create_refund")} accept_dispute_claim=${names.includes("accept_dispute_claim")}`);
const call = async (name: string, args: any) => JSON.parse((await client.callTool({ name, arguments: args }) as any).content[0].text);
const o = await call("create_order", item("AG-CREDITS-10")); console.log("  create_order ->", JSON.stringify(o));
console.log("  pay_order    ->", JSON.stringify(await call("pay_order", { id: o.order_id })));
const r = await client.callTool({ name: "create_refund", arguments: { capture_id: "X", amount: 1 } }).catch((e: any) => ({ error: e.message }));
console.log("  create_refund ->", JSON.stringify(r).slice(0, 160));
await client.close();
