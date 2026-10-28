// Docs stay true: the OpenAPI spec matches the route table, curl samples hit real endpoints, CLI flags exist,
// package imports are real exports, and the tagged code blocks actually run.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "node:net";
// @ts-ignore: plain ESM module shared with the site build
import { buildOpenApi, ENDPOINTS } from "../docs/openapi.mjs";
import { createApp } from "../src/app.ts";

const root = resolve(import.meta.dirname, "..");
const docs = readdirSync(join(root, "docs")).filter(f => f.endsWith(".md")).map(f => ({ f, s: readFileSync(join(root, "docs", f), "utf8") }));
const docText = docs.map(d => d.s).join("\n") + readFileSync(join(root, "README.md"), "utf8")
  + readFileSync(join(root, "packages/intent-verifier/README.md"), "utf8") + readFileSync(join(root, "packages/paypal-toolkit/README.md"), "utf8");
const blocks = (tag: string) => docs.flatMap(d => [...d.s.matchAll(/```(\w+) ([\w:]+)\n([\s\S]*?)```/g)].filter(m => m[2] === tag).map(m => m[3]));
const node = [process.execPath, "--experimental-strip-types", "--no-warnings"];
const cli = join(root, "packages/intent-verifier/src/cli.ts");
const spec = buildOpenApi("test");
const toPath = (p: string) => p.replace(/:(\w+)/g, "{$1}");
const specOps = new Set(Object.entries(spec.paths).flatMap(([p, ops]: any) => Object.keys(ops).map(m => `${m.toUpperCase()} ${p}`)));

test("OpenAPI 3.1 spec covers exactly the app's routes", async () => {
  assert.equal(spec.openapi, "3.1.0");
  process.env.AGENTGUARD_ADMIN_TOKEN ??= "docs-test-admin-token-0123456789";
  const app = await createApp({ background: false });
  const routes = new Set(app.routes().map(r => `${r.method} ${toPath(r.path)}`));
  const missing = [...routes].filter(r => !specOps.has(r)), extra = [...specOps].filter(r => !routes.has(r));
  assert.deepEqual({ missing, extra }, { missing: [], extra: [] });
  assert.equal(ENDPOINTS.length, routes.size);
  await (app as any).close?.();
});

test("every curl in the docs targets a documented endpoint", () => {
  const tmpl = [...specOps].map(o => { const [m, p] = o.split(" "); return { m, re: new RegExp("^" + p.replace(/\{\w+\}/g, "[^/]+") + "$") }; });
  let n = 0;
  const lines = docText.replace(/\\\n\s*/g, " ").split("\n").filter(l => /\bcurl\b/.test(l));
  for (const line of lines) {
    const u = line.match(/(?:\$\{?(?:U|AGENTGUARD_URL)\}?|https:\/\/agentguard-orcin\.vercel\.app|https?:\/\/localhost:8787|your-host)(\/[^\s"'?]*)/);
    if (!u || !/^\/(v1|api|\.well-known|health)/.test(u[1])) continue;
    const method = line.match(/-X (\w+)/)?.[1] ?? (/\s(-d|--data)\s/.test(line) ? "POST" : "GET");
    const path = u[1].replace(/\$\{?\w+\}?|<[^>]+>|…/g, "x");
    n++;
    assert.ok(tmpl.some(t => t.m === method && t.re.test(path)), `${method} ${path} is not in the API: ${line}`);
  }
  assert.ok(n >= 8, `expected curl samples, found ${n}`);
});

test("every intent-verify flag in the docs exists", () => {
  const help = execFileSync(node[0], [...node.slice(1), cli, "--help"], { encoding: "utf8" });
  const used = new Set<string>();
  for (const line of docText.split("\n")) if (/intent-verify|^\s+--[a-z]/.test(line)) for (const f of line.matchAll(/(?<![\w-])--([a-z][a-z-]+)/g)) used.add(f[1]);
  for (const f of ["experimental-strip-types", "no-warnings", "env-file", "out", "provenance", "access", "json"]) used.delete(f);
  for (const f of used) if (!["data", "silent"].includes(f)) assert.ok(help.includes(`--${f}`), `--${f} is not an intent-verify flag`);
});

test("package imports in the docs name real exports", async () => {
  const mods: Record<string, string> = {
    "@agentguard-dev/intent-verifier": join(root, "packages/intent-verifier/src/index.ts"),
  };
  for (const m of docText.matchAll(/import \{([^}]+)\} from "(@agentguard-dev\/[\w-]+(?:\/[\w-]+)?)"/g)) {
    const names = m[1].split(",").map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
    const src = mods[m[2]];
    if (src) { const mod = await import(src); for (const n of names) assert.ok(n in mod, `${m[2]} has no export ${n}`); }
    else {
      const sub = m[2].split("/")[2] ?? "index";
      const dir = join(root, "packages/paypal-toolkit/src");
      const file = [join(dir, sub + ".ts"), join(dir, sub, "index.ts")].find(existsSync);
      assert.ok(file, `no source for ${m[2]}`);
      const text = readFileSync(file!, "utf8");
      for (const n of names) assert.match(text, new RegExp(`export (?:async )?(?:function|const|class|type|interface) ${n}\\b|export \\{[^}]*\\b${n}\\b`), `${m[2]} has no export ${n}`);
    }
  }
});

test("quickstart: verify block passes offline against the bundled sample", () => {
  const [b] = blocks("test:verify"); assert.ok(b);
  const dir = mkdtempSync(join(tmpdir(), "ag-docs-"));
  copyFileSync(join(root, "web/samples/receipt-sandbox.json"), join(dir, "receipt-sandbox.json"));
  copyFileSync(join(root, "web/samples/agentguard-keys-orcin.json"), join(dir, "agentguard-keys.json"));
  const cmd = b.replace(/\\\n\s*/g, " ").split("\n").find(l => l.includes("intent-verify "))!;
  const args = cmd.slice(cmd.indexOf("intent-verify ") + 14).trim().split(/\s+/);
  const out = execFileSync(node[0], [...node.slice(1), cli, ...args], { cwd: dir, encoding: "utf8" });
  assert.match(out, /^VALID receipt poi_/);
});

test("merchant-verification: library sample runs", () => {
  const [b] = blocks("test:lib"); assert.ok(b);
  const dir = mkdtempSync(join(tmpdir(), "ag-docs-"));
  copyFileSync(join(root, "web/samples/receipt-sandbox.json"), join(dir, "receipt.json"));
  copyFileSync(join(root, "web/samples/agentguard-keys-orcin.json"), join(dir, "agentguard-keys.json"));
  const f = join(dir, "sample.mts");
  writeFileSync(f, b.replace('"@agentguard-dev/intent-verifier"', JSON.stringify(join(root, "packages/intent-verifier/src/index.ts"))));
  const out = execFileSync(node[0], [...node.slice(1), f], { cwd: dir, encoding: "utf8" });
  assert.match(out, /^verified poi_/);
});

const freePort = () => new Promise<number>(res => { const s = createServer().listen(0, () => { const p = (s.address() as any).port; s.close(() => res(p)); }); });

test("quickstart: local walkthrough ends with an active mandate", { skip: !!process.env.AGENTGUARD_TEST_PG && "SQLite walkthrough" }, async () => {
  const [b] = blocks("test:local"); assert.ok(b);
  const dir = mkdtempSync(join(tmpdir(), "ag-docs-")), port = await freePort(), U = `http://localhost:${port}`;
  const token = "docs-test-admin-token-0123456789";
  const env = { ...process.env, PORT: String(port), AGENTGUARD_ADMIN_TOKEN: token, AGENTGUARD_DB: join(dir, "ag.db"),
    AGENTGUARD_KEYRING_FILE: join(dir, "keys.json"), AGENTGUARD_TSA_URLS: "", AGENTGUARD_PUBLIC_URL: U, AGENTGUARD_RP_ID: "localhost",
    AGENTGUARD_DATABASE_URL: "", AGENTGUARD_URL: U };
  const pk = join(root, "data/dev-passkey-alice.json"), bak = pk + ".docs-test-bak";
  if (existsSync(pk)) renameSync(pk, bak);
  const srv = spawn(node[0], [...node.slice(1), join(root, "src/server.ts")], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
  let log = ""; srv.stdout.on("data", d => log += d); srv.stderr.on("data", d => log += d);
  try {
    for (let i = 0; ; i++) { try { if ((await fetch(U + "/healthz")).ok) break; } catch {} if (i > 100) throw new Error("server did not start:\n" + log); await new Promise(r => setTimeout(r, 100)); }
    const out = execFileSync("bash", ["-euo", "pipefail", "-c", b], { cwd: root, env, encoding: "utf8" });
    assert.equal(out.trim().split("\n").at(-1), "active", out);
  } finally {
    srv.kill();
    rmSync(pk, { force: true }); if (existsSync(bak)) renameSync(bak, pk);
  }
});
