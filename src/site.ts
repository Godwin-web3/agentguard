import { readFileSync, existsSync } from "node:fs";
import { resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

/** Content-Security-Policy for every page: no inline script, no third-party origins. */
export const SITE_CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; " +
  "object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";
const TYPES: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };
/** Clean URLs for the pages. Everything else must be a real file under the built site directory (npm run build:web). */
const PAGES: Record<string, string> = { "/": "index.html", "/console": "console.html", "/receipt": "receipt.html", "/brand": "brand/index.html", "/brand/": "brand/index.html" };

function siteRoot(): string | null {
  const c = [process.env.AGENTGUARD_SITE_DIR, resolve(process.cwd(), "dist/site")];
  try { c.push(fileURLToPath(new URL("../dist/site", import.meta.url))); } catch { /* bundled */ }
  return c.find(d => d && existsSync(resolve(d, "index.html"))) ?? null;
}
let root: string | null | undefined;
const cache = new Map<string, { headers: Record<string, string>; body: Buffer }>();

/** Resolves a GET path to a built static file, or null. Path traversal and dotfiles are refused. */
export function siteFile(pathname: string): { headers: Record<string, string>; body: Buffer } | null {
  if (root === undefined) root = siteRoot();
  if (!root) return null;
  const rel = PAGES[pathname] ?? decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!rel || rel.split("/").some(p => p.startsWith(".")) || !TYPES[extname(rel)]) return null;
  const abs = resolve(root, rel);
  if (!abs.startsWith(root + sep)) return null;
  const hit = cache.get(abs); if (hit) return hit;
  if (!existsSync(abs)) return null;
  const ext = extname(rel), html = ext === ".html";
  const out = { body: readFileSync(abs), headers: { "content-type": TYPES[ext], "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin",
    "cache-control": html ? "no-cache" : /^assets\/[\w-]+\.[0-9a-f]{10}\.(js|css)$/.test(rel) || rel.startsWith("brand/fonts/") ? "public, max-age=31536000, immutable" : "public, max-age=3600",
    ...(html ? { "content-security-policy": SITE_CSP, "x-frame-options": "DENY" } : {}) } };
  cache.set(abs, out); return out;
}
