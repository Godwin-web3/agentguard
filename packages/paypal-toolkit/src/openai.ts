import { zodToJsonSchema } from "zod-to-json-schema";
import { PayPalGuard, READ_ONLY, DESCRIPTIONS, STATUS_TOOL, createOrderSchema, payOrderSchema, statusSchema, GuardError, type GuardConfig, type MerchantClient } from "./core.ts";

type FnTool = { type: "function"; function: { name: string; description?: string; parameters?: any } };
type ToolCall = { id: string; type?: "function"; function: { name: string; arguments: string } };
type ToolMsg = { role: "tool"; tool_call_id: string; content: string };

/**
 * Wrap `new PayPalAgentToolkit(...)` from `@paypal/agent-toolkit/openai`. Drop-in for its getTools()/handleToolCall().
 */
export function guardOpenAI(toolkit: { client: MerchantClient; getTools(): FnTool[]; handleToolCall(tc: any): Promise<ToolMsg> }, cfg: GuardConfig | PayPalGuard) {
  const g = cfg instanceof PayPalGuard ? cfg : new PayPalGuard(cfg, toolkit.client);
  const fn = (name: string, description: string, schema: any): FnTool =>
    ({ type: "function", function: { name, description, parameters: zodToJsonSchema(schema, { $refStrategy: "none" }) } });
  const tools: FnTool[] = [
    ...toolkit.getTools().filter(t => READ_ONLY.has(t.function.name)),
    fn("create_order", DESCRIPTIONS.create_order, createOrderSchema),
    fn("pay_order", DESCRIPTIONS.pay_order, payOrderSchema),
    fn(STATUS_TOOL, DESCRIPTIONS[STATUS_TOOL], statusSchema),
  ];
  return {
    getTools: () => tools,
    async handleToolCall(tc: ToolCall): Promise<ToolMsg> {
      let content: unknown;
      try {
        const args = JSON.parse(tc.function.arguments || "{}");
        content = await g.handle(tc.function.name, args, async () => JSON.parse((await toolkit.handleToolCall(tc)).content || "null"));
      } catch (e: any) { content = { error: e instanceof GuardError ? e.message : `tool error: ${e?.message ?? e}` }; }
      return { role: "tool", tool_call_id: tc.id, content: typeof content === "string" ? content : JSON.stringify(content) };
    },
  };
}
export { PayPalGuard };
