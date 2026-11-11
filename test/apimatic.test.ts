// The APIMatic project (apimatic/src) stays in sync with the API and is shaped for SDK generation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
// @ts-ignore: plain ESM module shared with the site build
import { buildOpenApi } from "../docs/openapi.mjs";

const root = resolve(import.meta.dirname, "..");
const committed = JSON.parse(readFileSync(join(root, "apimatic/src/spec/openapi.json"), "utf8"));

test("apimatic/src/spec/openapi.json is the current spec (run npm run spec:apimatic)", () => {
  const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  assert.deepEqual(committed, buildOpenApi(version));
});

test("spec is SDK-ready: unique camelCase operation ids, typed agent responses, every $ref resolves", () => {
  const ops = Object.values(committed.paths).flatMap((o: any) => Object.values(o)) as any[];
  const ids = ops.map(o => o.operationId);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z][A-Za-z0-9]+$/, id);
  for (const p of ["/v1/agent/payments", "/v1/agent/products/search"]) assert.ok(committed.paths[p].post.responses["200"].content["application/json"].schema.$ref, p);
  const refs = JSON.stringify(committed).match(/"#\/components\/schemas\/(\w+)"/g)!.map(r => r.slice(22, -1));
  for (const r of new Set(refs)) assert.ok(committed.components.schemas[r], `missing schema ${r}`);
  assert.ok(committed.tags.every((t: any) => t.description));
});

test("APIMatic project files are present and point at real assets", () => {
  const cfg = JSON.parse(readFileSync(join(root, "apimatic/src/apimatic.json"), "utf8"));
  assert.equal(cfg.schemaVersion, 1);
  assert.deepEqual(Object.keys(cfg.languages).sort(), ["csharp", "python", "typescript"]);
  assert.match(cfg.plugin.pluginId, /^[a-z0-9]+(-[a-z0-9]+)*$/); assert.match(cfg.plugin.pluginVersion, /^\d+\.\d+\.\d+$/);
  for (const f of [cfg.portal.brand.logo.light, cfg.portal.brand.logo.dark, cfg.portal.brand.favicon]) assert.ok(existsSync(join(root, "apimatic/src", f)), f);
});
