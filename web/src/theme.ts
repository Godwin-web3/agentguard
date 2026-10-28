// Loaded synchronously in <head> so the stored theme applies before first paint (no inline script: strict CSP).
try { const t = localStorage.getItem("ag-theme"); if (t === "light" || t === "dark") document.documentElement.dataset.theme = t; } catch { /* storage blocked */ }
