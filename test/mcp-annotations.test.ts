import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

test("stdio MCP server: every tool declares the four behaviour annotations as booleans", async () => {
  const p = spawn(process.execPath, ["--experimental-strip-types", "--no-warnings", "src/mcp.ts"], { env: { ...process.env, AGENTGUARD_AGENT_KEY: "" } });
  const line: string = await new Promise((res, rej) => {
    let buf = ""; p.stdout.on("data", d => { buf += d; const i = buf.indexOf("\n"); if (i >= 0) res(buf.slice(0, i)); });
    p.on("error", rej); p.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }) + "\n");
  });
  p.kill();
  const tools = JSON.parse(line).result.tools;
  assert.ok(tools.length >= 5);
  for (const t of tools) for (const k of ["readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint"])
    assert.equal(typeof t.annotations?.[k], "boolean", `${t.name}.${k}`);
  const a = (n: string) => tools.find((t: any) => t.name === n).annotations;
  assert.equal(a("pay_paypal_order").destructiveHint, true); assert.equal(a("get_payment_status").readOnlyHint, true);
});
