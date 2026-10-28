import { tool, type Tool } from "ai";
import { PayPalGuard, READ_ONLY, DESCRIPTIONS, STATUS_TOOL, createOrderSchema, payOrderSchema, statusSchema, type GuardConfig, type MerchantClient } from "./core.ts";

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
  out.create_order = tool({ description: DESCRIPTIONS.create_order, parameters: createOrderSchema, execute: a => g.createOrder(a) });
  out.pay_order = tool({ description: DESCRIPTIONS.pay_order, parameters: payOrderSchema, execute: a => g.payOrder(a) });
  out[STATUS_TOOL] = tool({ description: DESCRIPTIONS[STATUS_TOOL], parameters: statusSchema, execute: a => g.paymentStatus(a) });
  return out;
}
export { PayPalGuard };
