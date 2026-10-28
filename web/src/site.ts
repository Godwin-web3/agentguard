// Small progressive enhancements shared by every page. Everything works without it.
const $$ = <T extends Element>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

export function initTheme() {
  for (const b of $$<HTMLButtonElement>("[data-theme-toggle]")) {
    b.addEventListener("click", () => {
      const root = document.documentElement;
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("ag-theme", root.dataset.theme); } catch { /* ignore */ }
    });
  }
}
export function initCopy() {
  for (const b of $$<HTMLButtonElement>("[data-copy]")) {
    b.addEventListener("click", async () => {
      const src = b.dataset.copy ? document.getElementById(b.dataset.copy) : b.closest(".code")?.querySelector("pre");
      if (!src) return;
      try { await navigator.clipboard.writeText(src.textContent ?? ""); } catch { return; }
      const label = b.querySelector("span"); const prev = label?.textContent;
      if (label) { label.textContent = "Copied"; setTimeout(() => { label.textContent = prev ?? "Copy"; }, 1400); }
    });
  }
}
export function initTabs() {
  for (const list of $$<HTMLElement>("[role=tablist]")) {
    const tabs = $$<HTMLButtonElement>("[role=tab]", list);
    const select = (t: HTMLButtonElement) => tabs.forEach(x => {
      const on = x === t; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
      const p = document.getElementById(x.getAttribute("aria-controls") ?? ""); if (p) p.hidden = !on;
    });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", e => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n); }
      });
    });
  }
}
function initNav() {
  const nav = document.querySelector(".nav"); if (!nav) return;
  const on = () => nav.classList.toggle("scrolled", scrollY > 4); on(); addEventListener("scroll", on, { passive: true });
}
initTheme(); initCopy(); initTabs(); initNav();
