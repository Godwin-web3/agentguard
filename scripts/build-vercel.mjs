// Builds a Vercel Build Output API v3 bundle: one Node function serving every route, plus a daily cron backstop.
import { build } from "esbuild";
import { mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";

const out = ".vercel/output", fn = `${out}/functions/api.func`;
rmSync(out, { recursive: true, force: true });
mkdirSync(fn, { recursive: true });
await build({
  entryPoints: ["api/index.ts"], outfile: `${fn}/index.mjs`, bundle: true, platform: "node", format: "esm", target: "node22",
  external: ["pg-native"], sourcemap: false, legalComments: "none",
  banner: { js: 'import { createRequire as __cr } from "node:module"; const require = __cr(import.meta.url);' },
});
copyFileSync("src/console.html", `${fn}/console.html`);
writeFileSync(`${fn}/.vc-config.json`, JSON.stringify({ runtime: "nodejs22.x", handler: "index.mjs", launcherType: "Nodejs",
  shouldAddHelpers: false, supportsResponseStreaming: false, maxDuration: 60 }, null, 2));
writeFileSync(`${out}/config.json`, JSON.stringify({
  version: 3,
  routes: [{ src: "/(.*)", dest: "/api" }],
  // Hobby plans allow one run per day; the 15-minute anchor and 5-minute maintenance schedules run from Supabase pg_cron.
  crons: [{ path: "/api/cron/maintenance", schedule: "0 4 * * *" }, { path: "/api/cron/anchor", schedule: "30 4 * * *" }],
}, null, 2));
console.log("built", fn);
