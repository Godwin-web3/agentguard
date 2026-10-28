// Builds the static site (landing, console, receipt viewer, brand guidelines) into dist/site.
// HTML partials: <!--#include name--> pulls web/partials/name.html (nested includes allowed).
import { browserVerifierOptions } from "./web-bundle.mjs";
import { build } from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist/site");
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets"), { recursive: true });

const partial = (name, depth = 0) => {
  if (depth > 4) throw new Error("include depth");
  return expand(readFileSync(join(root, "web/partials", name + ".html"), "utf8").trim(), depth + 1);
};
const expand = (s, depth = 0) => s.replace(/<!--#include ([a-z-]+)-->/g, (_, n) => partial(n, depth));

const pages = { "web/index.html": "index.html", "web/console.html": "console.html", "web/receipt.html": "receipt.html", "web/brand.html": "brand/index.html" };
for (const [src, dst] of Object.entries(pages)) {
  if (!existsSync(join(root, src))) continue;
  const html = expand(readFileSync(join(root, src), "utf8"));
  if (/<!--#include/.test(html)) throw new Error(`unresolved include in ${src}`);
  if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) throw new Error(`inline script in ${src} (CSP forbids it)`);
  mkdirSync(dirname(join(out, dst)), { recursive: true });
  writeFileSync(join(out, dst), html);
}

const common = { bundle: true, minify: true, target: "es2022", legalComments: "none", logLevel: "warning", outdir: join(out, "assets") };
// theme.js is a classic blocking <head> script (no flash of the wrong theme); site.js is tiny and shared.
await build({ ...common, entryPoints: { theme: join(root, "web/src/theme.ts") }, format: "iife" });
await build({ ...common, entryPoints: { site: join(root, "web/src/site.ts"), console: join(root, "web/src/console.ts") }, format: "esm" });
// Pages that verify receipts carry the shared verifier with browser shims for node:crypto and Buffer.
const heavy = Object.fromEntries([["receipt", "web/src/receipt.ts"]].filter(([, f]) => existsSync(join(root, f))).map(([k, f]) => [k, join(root, f)]));
if (Object.keys(heavy).length) await build({ ...common, entryPoints: heavy, ...browserVerifierOptions(root) });

cpSync(join(root, "web/site.css"), join(out, "assets/site.css"));
cpSync(join(root, "web/site.webmanifest"), join(out, "site.webmanifest"));
cpSync(join(root, "web/samples"), join(out, "samples"), { recursive: true });
cpSync(join(root, "brand"), join(out, "brand"), { recursive: true, filter: s => !s.endsWith(".md") || s.endsWith("README.md") });
cpSync(join(root, "brand/icons/favicon.svg"), join(out, "favicon.svg"));
console.log("site built →", out);
