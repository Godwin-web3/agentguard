// Docs pages: shared site behaviour (theme, copy buttons, nav) plus client-side search and the mobile menu.
import "./site.ts";

type Entry = { u: string; t: string; s: string; h: [string, string][]; x: string };
let index: Entry[] | null = null;
const q = document.getElementById("docs-q") as HTMLInputElement | null;
const out = document.getElementById("docs-results") as HTMLUListElement | null;

async function load(): Promise<Entry[]> {
  if (!index) index = await (await fetch("/docs/search.json")).json() as Entry[];
  return index;
}
function el(tag: string, text: string, cls?: string) { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; }

export function search(entries: Entry[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits: { u: string; t: string; sub: string; score: number; snip: string }[] = [];
  for (const e of entries) {
    const title = e.t.toLowerCase(), body = e.x.toLowerCase();
    if (!terms.every(t => title.includes(t) || body.includes(t) || e.h.some(([, h]) => h.toLowerCase().includes(t)))) continue;
    let score = 0; for (const t of terms) score += (title.includes(t) ? 10 : 0) + (body.split(t).length - 1);
    const head = e.h.find(([, h]) => terms.some(t => h.toLowerCase().includes(t)));
    const at = Math.max(0, body.indexOf(terms[0]) - 40);
    hits.push({ u: head ? `${e.u}#${head[0]}` : e.u, t: e.t, sub: head ? head[1] : e.s, score: score + (head ? 5 : 0), snip: (at ? "…" : "") + e.x.slice(at, at + 120) + "…" });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 8);
}

if (q && out) {
  let sel = -1;
  const draw = async () => {
    const hits = search(await load(), q.value);
    out.replaceChildren(); sel = -1;
    if (!q.value.trim()) { out.hidden = true; return; }
    if (!hits.length) out.append(el("li", "No results", "muted small"));
    for (const h of hits) {
      const li = document.createElement("li"), a = document.createElement("a"); a.href = h.u;
      a.append(el("b", h.t), el("span", h.sub, "muted xs"), el("span", h.snip, "small snip")); li.append(a); out.append(li);
    }
    out.hidden = false;
  };
  q.addEventListener("input", () => void draw());
  q.addEventListener("focus", () => void load());
  q.addEventListener("keydown", e => {
    const links = [...out.querySelectorAll("a")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + links.length) % Math.max(links.length, 1); links.forEach((l, i) => l.classList.toggle("on", i === sel)); }
    else if (e.key === "Enter" && links.length) { location.href = (links[Math.max(sel, 0)] as HTMLAnchorElement).href; }
    else if (e.key === "Escape") { q.value = ""; out.hidden = true; q.blur(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== q && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); q.focus(); }
  });
  document.addEventListener("click", e => { if (!(e.target as Element).closest(".docs-search")) out.hidden = true; });
}
const menu = document.querySelector<HTMLButtonElement>(".docs-menu"), navEl = document.getElementById("docs-nav");
if (menu && navEl) menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(open)); navEl.classList.toggle("open", open); });
