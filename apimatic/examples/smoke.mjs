// Smoke test for the APIMatic-generated TypeScript SDK against a live AgentGuard (read-only calls plus one refused write).
//   cd apimatic/sdk/typescript && npm install && npm run build && cd ../../.. && node apimatic/examples/smoke.mjs
// AGENTGUARD_URL overrides the server (default: the hosted demo, https://agentguard-orcin.vercel.app).
import { AgentGuardApiClient, ServerEnvironment } from "../sdk/typescript/dist/esm/index.js";

const client = new AgentGuardApiClient({
  serverEnvironment: ServerEnvironment.Production,
  ...(process.env.AGENTGUARD_URL ? { serverOptions: { baseUrl: process.env.AGENTGUARD_URL } } : {}),
  agent: "ag_not_a_real_key", // an agent key; this one is deliberately wrong
});

const health = await client.meta.getHealth();
console.log("health:", health.ok ? "ok" : "NOT OK", `(stuck payments: ${health.stuck})`);

const { keys } = await client.keys.getIssuerKeySet();
console.log("issuer keys:", keys.map(k => `${k.kid} ${k.status}`).join(", "));

// A payment proposal with a wrong agent key is refused; .asApiResult() returns the typed error instead of throwing.
const r = await client.agent.proposePayment({ body: { mandateId: "mdt_example", agentId: "shopper", idempotencyKey: "smoke-1", paypalOrderId: "ORDERSMOKE01" } }).asApiResult();
console.log("proposePayment with a wrong key:", r.ok ? "UNEXPECTED SUCCESS" : `${r.status} ${JSON.stringify(r.payload.body)}`);
if (!health.ok || !keys.length || r.ok || r.status !== 401) process.exit(1);
