import { verifyReceipt } from "./verifier.ts";
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const ta = $<HTMLTextAreaElement>("rjson"), keysSel = $<HTMLSelectElement>("keys");

async function getJson(url: string) { const r = await fetch(url, { headers: { accept: "application/json" } }); if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`); return r.json(); }
async function loadKeys(): Promise<any | undefined> {
  if (keysSel.value === "embedded") return undefined;
  return getJson(keysSel.value === "origin" ? "/.well-known/agentguard-keys" : "/samples/agentguard-keys-orcin.json");
}
function show(res: { ok: boolean; trusted_issuer: boolean; receipt_id?: string; summary?: any; checks: { check: string; pass: boolean; detail: string }[]; warnings: string[] }, note = "") {
  $("outEmpty").hidden = true; $("outBody").hidden = false;
  const v = $("verdict"); v.className = `verdict ${res.ok ? "ok" : "bad"}`;
  $("vIcon").setAttribute("href", `/brand/icons.svg#i-${res.ok ? "check" : "x"}`);
  $("vWord").textContent = res.ok ? "VALID" : "INVALID";
  const failed = res.checks.filter(c => !c.pass).length;
  $("vSub").textContent = (res.ok ? `All ${res.checks.length} checks passed${res.trusted_issuer ? " under a pinned issuer key" : ""}.` : `${failed} of ${res.checks.length} checks failed.`) + (note ? ` ${note}` : "");
  const s = res.summary, rows: [string, string][] = [];
  if (res.receipt_id) rows.push(["Receipt", res.receipt_id]);
  if (s) rows.push(["Amount", `${s.amount} ${s.currency}`], ["Payee", s.payee], ["PayPal order", s.order_id], ["Capture", s.capture_id], ["Agent", s.agent_id], ["Captured", s.captured_at]);
  $("summary").innerHTML = rows.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join("");
  $("cCount").textContent = `${res.checks.length - failed}/${res.checks.length}`;
  const sorted = [...res.checks].sort((a, b) => Number(a.pass) - Number(b.pass));
  $("checks").innerHTML = sorted.map(c => `<div class="check-row"><svg class="i ${c.pass ? "ok" : "bad"}" aria-hidden="true"><use href="/brand/icons.svg#i-${c.pass ? "circle-check" : "circle-x"}"/></svg>` +
    `<span class="what mono small">${esc(c.check)}<span class="sr-only">: ${c.pass ? "pass" : "fail"}</span></span><span class="detail">${esc(c.detail)}</span></div>`).join("");
  $("warnings").innerHTML = res.warnings.map(w => `<div class="alert alert-warning" style="margin:12px 16px"><svg class="i"><use href="/brand/icons.svg#i-triangle-alert"/></svg><p>${esc(w)}</p></div>`).join("");
}
function fail(msg: string) { show({ ok: false, trusted_issuer: false, checks: [{ check: "input", pass: false, detail: msg }], warnings: [] }); }

async function run(note = "") {
  const btn = $<HTMLButtonElement>("verifyBtn"); btn.setAttribute("aria-busy", "true"); btn.disabled = true;
  try {
    let env: any; try { env = JSON.parse(ta.value); } catch { return fail("not valid JSON"); }
    let issuerKeys: any; try { issuerKeys = await loadKeys(); } catch (e: any) { return fail(`could not load the issuer key set: ${e.message}`); }
    show(await verifyReceipt(env, issuerKeys ? { issuerKeys } : {}), note);
  } catch (e: any) { fail(e?.message ?? String(e)); }
  finally { btn.removeAttribute("aria-busy"); btn.disabled = false; }
}
async function sample() {
  ta.value = JSON.stringify(await getJson("/samples/receipt-sandbox.json"), null, 2); keysSel.value = "pinned"; await run();
}
$("verifyBtn").addEventListener("click", () => run());
$("loadSample").addEventListener("click", () => { sample().catch(e => fail(e.message)); });
$("tamper").addEventListener("click", () => {
  let env: any; try { env = JSON.parse(ta.value); } catch { return fail("load a receipt first"); }
  const p = env?.receipt?.payment;
  if (p && Number.isInteger(p.amount_minor)) p.amount_minor += 1; else if (env?.receipt) env.receipt.receipt_id = String(env.receipt.receipt_id) + "x"; else return fail("load a receipt first");
  ta.value = JSON.stringify(env, null, 2); void run("The receipt was modified after signing.");
});
$<HTMLInputElement>("rfile").addEventListener("change", async e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { ta.value = await f.text(); void run(); } });
ta.addEventListener("dragover", e => e.preventDefault());
ta.addEventListener("drop", async e => { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) { ta.value = await f.text(); void run(); } });
if (new URLSearchParams(location.search).get("sample") === "sandbox") sample().catch(e => fail(e.message));
