import { jsonSchema, type Tool } from "ai";
import { z } from "zod";
import { PayPalGuard, READ_ONLY, ANNOTATIONS, DESCRIPTIONS, STATUS_TOOL, createOrderSchema, payOrderSchema, statusSchema, type GuardConfig, type MerchantClient } from "./core.ts";

/**
 * Wrap `new PayPalAgentToolkit(...)` from `@paypal/agent-toolkit/ai-sdk`.
 * Returns a tool set for generateText/streamText: create_order and pay_order go through AgentGuard,
 * read-only toolkit tools pass through, every other money- or state-changing tool is removed.
 */
export function guardTools(toolkit: { client: MerchantClient; getTools(): Record<string, Tool> }, cfg: GuardConfig | PayPalGuard,
  opts: { readOnly?: boolean } = {}): Record<string, Tool> {
  const g = cfg instanceof PayPalGuard ? cfg : new PayPalGuard(cfg, toolkit.client);
  const out: Record<string, Tool> = {};
  if (opts.readOnly !== false) for (const [name, t] of Object.entries(toolkit.getTools())) if (READ_ONLY.has(name)) out[name] = t;
  out.create_order = mk(DESCRIPTIONS.create_order, createOrderSchema, a => g.createOrder(a));
  out.pay_order = mk(DESCRIPTIONS.pay_order, payOrderSchema, a => g.payOrder(a));
  out[STATUS_TOOL] = mk(DESCRIPTIONS[STATUS_TOOL], statusSchema, a => g.paymentStatus(a));
  return out;
}
/**
 * Build an AI SDK tool from a Zod 4 schema without depending on the SDK's own Zod integration, so it works on AI SDK 4 (`parameters`)
 * and AI SDK 5 (`inputSchema`). Validation still runs through Zod.
 */
function mk(description: string, schema: z.ZodType, execute: (a: any) => Promise<unknown>): Tool {
  const s = jsonSchema(z.toJSONSchema(schema, { io: "input", unrepresentable: "any" }) as any, {
    validate: (v: unknown) => { const r = schema.safeParse(v); return r.success ? { success: true, value: r.data } : { success: false, error: r.error }; },
  });
  return { type: "function", description, parameters: s, inputSchema: s, execute } as unknown as Tool;
}
export { PayPalGuard, ANNOTATIONS };
