// Renders docs/*.md into dist/site/docs/<slug>.html (served at /docs/<slug>), the search index, and /openapi.json.
// Called by build-web.mjs with its include expander and asset manifest.
import { Marked, Renderer } from "marked";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildOpenApi, ENDPOINTS } from "../docs/openapi.mjs";

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const stripTags = s => s.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
const slugify = s => stripTags(s.toLowerCase()).replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const COPY = '<button class="btn" type="button" data-copy style="margin-left:auto" aria-label="Copy code"><svg class="i i-sm"><use href="/brand/icons.svg#i-copy"/></svg><span>Copy</span></button>';

export function loadDocs(root) {
  const nav = JSON.parse(readFileSync(join(root, "docs/nav.json"), "utf8"));
  const pages = [];
  for (const sec of nav) for (const slug of sec.pages) {
    const src = slug === "changelog" ? readFileSync(join(root, "CHANGELOG.md"), "utf8") : readFileSync(join(root, "docs", slug + ".md"), "utf8");
    const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
    const meta = m ? Object.fromEntries(m[1].split("\n").map(l => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()])) : {};
    let body = m ? src.slice(m[0].length) : src;
    if (slug === "changelog") Object.assign(meta, { title: "Changelog", description: "Release history (Keep a Changelog)." });
    if (slug === "api") body += "\n" + apiReference(root);
    pages.push({ slug, section: sec.title, title: meta.title ?? slug, description: meta.description ?? "", body });
  }
  return { nav, pages };
}

/** Markdown for every endpoint, generated from the same table as /openapi.json. */
function apiReference(root) {
  const spec = buildOpenApi(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version);
  const auth = { admin: "Admin token", agent: "Agent key", cron: "CRON_SECRET", none: "None" };
  let md = "";
  for (const tag of spec.tags.map(t => t.name)) {
    md += `\n## ${tag}\n`;
    for (const [method, path, a, t, summary] of ENDPOINTS) {
      if (t !== tag) continue;
      const op = spec.paths[path][method.toLowerCase()];
      md += `\n### \`${method} ${path}\`\n\n${summary}. **Auth:** ${auth[a]}.\n`;
      const params = (op.parameters ?? []).filter(p => p.in === "query");
      if (params.length) md += `\nQuery: ${params.map(p => `\`${p.name}\` (${p.description})`).join(", ")}.\n`;
      const body = op.requestBody?.content["application/json"].schema;
      if (body?.properties) {
        md += "\n| Field | Type | Required | Notes |\n|---|---|---|---|\n";
        for (const [k, v] of Object.entries(body.properties))
          md += `| \`${k}\` | ${v.$ref ? `[MandateConstraints](#mandateconstraints)` : v.type ?? "object"} | ${(body.required ?? []).includes(k) ? "yes" : ""} | ${(v.description ?? "").replace(/\|/g, "/")} |\n`;
      }
    }
  }
  const mc = spec.components.schemas.MandateConstraints;
  md += "\n## MandateConstraints\n\n| Field | Type | Required | Notes |\n|---|---|---|---|\n";
  for (const [k, v] of Object.entries(mc.properties)) md += `| \`${k}\` | ${v.type ?? "enum"}${v.items?.enum ? ` of ${v.items.enum.join(", ")}` : ""} | ${mc.required.includes(k) ? "yes" : ""} | ${v.description ?? ""} |\n`;
  return md;
}

function render(md) {
  const toc = [];
  const marked = new Marked({ gfm: true });
  marked.use({ renderer: {
    code({ text, lang }) {
      const l = (lang ?? "").split(/\s+/)[0] || "text";
      const hl = esc(text).replace(/^(\s*)(#(?!!)[^\n]*|\/\/[^\n]*)$/gm, '$1<span class="c">$2</span>');
      return `<div class="code"><div class="code-hd"><span>${esc(l)}</span>${COPY}</div><pre><code>${hl}</code></pre></div>\n`;
    },
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens), id = slugify(html);
      if (depth === 2 || depth === 3) toc.push({ id, depth, text: stripTags(html) });
      return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${html}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const h = href.replace(/^\.\/([a-z0-9-]+)\.md(#.*)?$/, "/docs/$1$2"), ext = /^https?:/.test(h);
      return `<a href="${esc(h)}"${title ? ` title="${esc(title)}"` : ""}${ext ? ' rel="noopener"' : ""}>${this.parser.parseInline(tokens)}</a>`;
    },
    table(t) { return `<div class="table-wrap">${Renderer.prototype.table.call(this, t)}</div>`; },
  } });
  return { html: marked.parse(md), toc };
}

export function buildDocs({ root, out, expand, assets }) {
  const { nav, pages } = loadDocs(root);
  const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  mkdirSync(join(out, "docs"), { recursive: true });
  const index = [];
  pages.forEach((p, i) => {
    const { html, toc } = render(p.body);
    const href = s => s === "index" ? "/docs" : `/docs/${s}`;
    const side = nav.map(sec => `<div class="docs-sec"><h4>${esc(sec.title)}</h4><ul>${sec.pages.map(s => {
      const q = pages.find(x => x.slug === s); return `<li><a href="${href(s)}"${s === p.slug ? ' aria-current="page"' : ""}>${esc(q.title)}</a></li>`; }).join("")}</ul></div>`).join("");
    const prev = pages[i - 1], next = pages[i + 1];
    const pager = `<nav class="docs-pager" aria-label="Pagination">${prev ? `<a href="${href(prev.slug)}"><span>Previous</span>${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a class="next" href="${href(next.slug)}"><span>Next</span>${esc(next.title)}</a>` : ""}</nav>`;
    const edit = p.slug === "changelog" ? "CHANGELOG.md" : `docs/${p.slug}.md`;
    const page = `<!doctype html>
<html lang="en">
<head>
<!--#include head-->
<title>${esc(p.title)} · AgentGuard docs</title>
<meta name="description" content="${esc(p.description || p.title + " — AgentGuard documentation")}">
<meta property="og:title" content="${esc(p.title)} · AgentGuard docs">
<link rel="canonical" href="https://agentguard-orcin.vercel.app${href(p.slug)}">
</head>
<body class="docs-body">
<!--#include nav-->
<div class="container docs">
  <aside class="docs-side" aria-label="Documentation">
    <div class="docs-search" role="search"><input class="input input-sm" type="search" id="docs-q" placeholder="Search docs  /" aria-label="Search docs" autocomplete="off"><ul id="docs-results" class="docs-results" hidden></ul></div>
    <button class="btn btn-secondary btn-sm docs-menu" type="button" aria-expanded="false" aria-controls="docs-nav">Menu</button>
    <nav id="docs-nav">${side}<p class="docs-ver mono">v${esc(version)} · <a href="/openapi.json">openapi.json</a></p></nav>
  </aside>
  <main id="main" class="docs-main">
    <p class="eyebrow">${esc(p.section)}</p>
    <article class="prose">
${html}
    </article>
    <p class="docs-edit small muted"><a href="https://github.com/Godwin-web3/agentguard/edit/main/${edit}">Edit this page on GitHub</a></p>
    ${pager}
  </main>
  <aside class="docs-toc" aria-label="On this page">${toc.length ? `<h4>On this page</h4><ul>${toc.map(t => `<li class="d${t.depth}"><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ul>` : ""}</aside>
</div>
<!--#include footer-->
<script type="module" src="/assets/docs.js"></script>
</body>
</html>
`;
    const final = expand(page).replace(/\/assets\/[a-z-]+\.(?:js|css)/g, a => { if (!assets[a]) throw new Error(`unknown asset ${a}`); return assets[a]; });
    if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(final)) throw new Error(`inline script in docs/${p.slug}`);
    writeFileSync(join(out, "docs", p.slug + ".html"), final);
    const text = html.replace(/<pre[\s\S]*?<\/pre>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
    index.push({ u: href(p.slug), t: p.title, s: p.section, h: toc.map(t => [t.id, t.text]), x: text.slice(0, 6000) });
  });
  writeFileSync(join(out, "docs/search.json"), JSON.stringify(index));
  writeFileSync(join(out, "openapi.json"), JSON.stringify(buildOpenApi(version), null, 2));
  return pages.map(p => p.slug);
}
