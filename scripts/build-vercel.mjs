// Builds a Vercel Build Output API v3 bundle: one Node function serving every route, plus a daily cron backstop.
import { build } from "esbuild";
import { mkdirSync, readFileSync, rmSync, writeFileSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { SITE_CSP } from "../src/site.ts";

const out = ".vercel/output", fn = `${out}/functions/api.func`;
rmSync(out, { recursive: true, force: true });
mkdirSync(fn, { recursive: true });
await build({
  entryPoints: ["api/index.ts"], outfile: `${fn}/index.mjs`, bundle: true, platform: "node", format: "esm", target: "node22",
  external: ["pg-native"], sourcemap: false, legalComments: "none",
  banner: { js: 'import { createRequire as __cr } from "node:module"; const require = __cr(import.meta.url);' },
});
// Static site on the CDN: landing, console, receipt viewer, brand kit, docs, openapi.json.
execFileSync(process.execPath, ["scripts/build-web.mjs"], { stdio: "inherit" });
cpSync("dist/site", `${out}/static`, { recursive: true });
const overrides = { "index.html": { path: "" }, "console.html": { path: "console" }, "receipt.html": { path: "receipt" }, "brand/index.html": { path: "brand" } };
// Docs: docs/<slug>.html is served at /docs/<slug>; docs/index.html at /docs.
for (const slug of JSON.parse(readFileSync("dist/site/docs/pages.json", "utf8"))) overrides[`docs/${slug}.html`] = { path: slug === "index" ? "docs" : `docs/${slug}` };
const sec = { "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin" };
writeFileSync(`${fn}/.vc-config.json`, JSON.stringify({ runtime: "nodejs22.x", handler: "index.mjs", launcherType: "Nodejs",
  shouldAddHelpers: false, supportsResponseStreaming: false, maxDuration: 60 }, null, 2));
writeFileSync(`${out}/config.json`, JSON.stringify({
  version: 3,
  overrides,
  routes: [
    { src: "/(|console|receipt|brand|docs|docs/[a-z0-9-]+)", headers: { ...sec, "content-security-policy": SITE_CSP, "x-frame-options": "DENY", "cache-control": "public, max-age=0, must-revalidate" }, continue: true },
    { src: "/assets/[\\w-]+\\.[0-9a-f]{10}\\.(js|css)", headers: { ...sec, "cache-control": "public, max-age=31536000, immutable" }, continue: true },
    { src: "/brand/fonts/(.*)", headers: { ...sec, "cache-control": "public, max-age=31536000, immutable" }, continue: true },
    { src: "/(brand|samples)/(.*)", headers: { ...sec, "cache-control": "public, max-age=3600" }, continue: true },
    { src: "/(openapi\\.json|docs/search\\.json)", headers: { ...sec, "content-type": "application/json", "access-control-allow-origin": "*", "cache-control": "public, max-age=300" }, continue: true },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/api" },
  ],
  // Hobby plans allow one run per day; the 15-minute anchor and 5-minute maintenance schedules run from Supabase pg_cron.
  crons: [{ path: "/api/cron/maintenance", schedule: "0 4 * * *" }, { path: "/api/cron/anchor", schedule: "30 4 * * *" }],
}, null, 2));
console.log("built", fn);
