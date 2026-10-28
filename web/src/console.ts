// AgentGuard console. Admin token reads and drafts; every authorization is a passkey signature checked locally first.
// Contract used by scripts/e2e-console-*.ts: #token #connect #user(change) #pkCreate #pkState("passkey: registered") #pkLink,
// button[data-ap][data-v], window.reviewAndSign / window.signedRevoke, confirm() only (never alert()).
import "./site.ts";

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const icon = (id: string, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="/brand/icons.svg#${id}"/></svg>`;
let TOKEN = sessionStorage.getItem("ag_token") || "";
($("#token") as HTMLInputElement).value = TOKEN;

async function api(path: string, opts: RequestInit = {}) {
  const r = await fetch(path, { ...opts, headers: { authorization: "Bearer " + TOKEN, "content-type": "application/json" } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText || `HTTP ${r.status}`);
  return j;
}

// ---- presentation ----
const TONE: Record<string, string> = { active: "success", captured: "success", approve: "success",
  draft: "warning", unsigned: "warning", needs_human: "warning", pending_approval: "warning", authorized: "warning", reserved: "warning",
  revoked: "danger", rejected: "danger", reject: "danger", voided: "danger", failed: "danger", expired: "danger" };
const badge = (v: unknown) => v == null || v === "" ? "" : `<span class="badge ${TONE[String(v)] ? "badge-" + TONE[String(v)] : ""}"><span class="dot"></span>${esc(String(v).replace(/_/g, " "))}</span>`;
const money = (minor: number, cur: string) => `${(minor / 100).toFixed(2)} ${esc(cur)}`;
const when = (v: string) => v ? new Date(v).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
const short = (s: string, n = 14) => !s ? "" : s.length > n + 2 ? `<span title="${esc(s)}">${esc(s.slice(0, n))}…</span>` : esc(s);
const payeeOf = (p: any) => p?.payee?.display_name || p?.payee?.email_address || p?.payee?.merchant_id || "";

function toast(msg: string, kind: "success" | "danger" | "warning" | "info" = "info") {
  const el = document.createElement("div");
  el.className = "alert" + (kind === "info" ? "" : " alert-" + kind);
  el.innerHTML = icon(kind === "success" ? "i-circle-check" : kind === "info" ? "i-circle-alert" : "i-triangle-alert") + `<p>${esc(msg)}</p>`;
  $("#toasts").appendChild(el); setTimeout(() => el.remove(), kind === "danger" ? 9000 : 5000);
}
const fail = (e: unknown) => toast(e instanceof Error ? e.message : String(e), "danger");

type Col = { h: string; cls?: string; v: (r: any) => string };
function table(el: HTMLElement, cols: Col[], rows: any[], empty: { icon: string; title: string; body: string }) {
  if (!rows.length) { el.innerHTML = `<div class="empty">${icon(empty.icon)}<b>${esc(empty.title)}</b><p>${esc(empty.body)}</p></div>`; return; }
  el.innerHTML = `<table class="table"><thead><tr>${cols.map(c => `<th class="${c.cls ?? ""}" scope="col">${esc(c.h)}</th>`).join("")}</tr></thead><tbody>` +
    rows.map(r => `<tr>${cols.map(c => `<td class="${c.cls ?? ""}">${c.v(r)}</td>`).join("")}</tr>`).join("") + "</tbody></table>";
}
const skeletonTable = (el: HTMLElement) => { el.innerHTML = `<div class="stack gap-4" style="padding:18px 16px">${[70, 90, 55, 80].map(w => `<span class="skel" style="width:${w}%"></span>`).join("")}</div>`; };
["#gMandates", "#gPayments", "#gStuck", "#gAudit"].forEach(s => skeletonTable($(s)));

// ---- views ----
const TITLES: Record<string, string> = { overview: "Overview", mandates: "Mandates", payments: "Payments", recovery: "Recovery", audit: "Audit ledger" };
function show(view: string, scrollTo?: string) {
  if (!TITLES[view]) view = "overview";
  document.querySelectorAll<HTMLElement>("[data-panel]").forEach(p => { p.hidden = p.dataset.panel !== view; });
  document.querySelectorAll<HTMLElement>("[data-view]").forEach(a => {
    const on = a.dataset.view === view && (a.dataset.scroll ? scrollTo === a.dataset.scroll : !scrollTo || !a.closest(".sidebar"));
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  $("#viewTitle").textContent = TITLES[view];
  if (scrollTo) document.getElementById(scrollTo)?.scrollIntoView({ block: "start", behavior: "smooth" });
}
const route = () => { const h = location.hash.slice(1); h === "approvals" ? show("overview", "approvalsCard") : show(h || "overview"); };
addEventListener("hashchange", () => { if (!location.hash.startsWith("#enroll=")) route(); });

// ---- WebAuthn: the user's passkey signs mandates, approvals and revocations ----
const b64uToBuf = (s: string) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); const b = atob(s + "===".slice((s.length + 3) % 4)); return Uint8Array.from(b, c => c.charCodeAt(0)).buffer; };
const bufToB64u = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b as ArrayBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const canon = (v: any): string => v === null || typeof v !== "object" ? JSON.stringify(v) : Array.isArray(v) ? "[" + v.map(canon).join(",") + "]"
  : "{" + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
const userId = () => ($("#user") as HTMLInputElement).value.trim();

async function passkeyRefresh() {
  try {
    const r = await api(`/v1/users/${encodeURIComponent(userId())}/passkey`);
    const s = $("#pkState"); s.className = "badge " + (r.registered ? "badge-success" : "badge-warning");
    s.innerHTML = `<span class="dot"></span>`; s.append(r.registered ? "passkey: registered" : "passkey: none");
    ($("#pkCreate") as HTMLButtonElement).disabled = !!r.registered;
  } catch { /* shown by refresh() */ }
}
// The text node must equal "passkey: registered" exactly; keep the dot out of textContent.
const pkObserver = () => { const s = $("#pkState"); const d = s.querySelector(".dot"); if (d) d.setAttribute("aria-hidden", "true"); };

async function enrollWith(token: string) {
  const o = await api(`/v1/enroll/options`, { method: "POST", body: JSON.stringify({ token }) });
  if (o.replaces && !confirm(`This link REPLACES the existing passkey for ${o.user_id}. Continue?`)) return false;
  const cred = await navigator.credentials.create({ publicKey: { ...o, challenge: b64uToBuf(o.challenge), user: { ...o.user, id: b64uToBuf(o.user.id) },
    excludeCredentials: (o.excludeCredentials || []).map((c: any) => ({ ...c, id: b64uToBuf(c.id) })) } }) as PublicKeyCredential;
  const resp = cred.response as AuthenticatorAttestationResponse;
  const response = { id: cred.id, rawId: bufToB64u(cred.rawId), type: cred.type, clientExtensionResults: cred.getClientExtensionResults(),
    authenticatorAttachment: cred.authenticatorAttachment, response: { clientDataJSON: bufToB64u(resp.clientDataJSON),
      attestationObject: bufToB64u(resp.attestationObject), transports: resp.getTransports ? resp.getTransports() : [] } };
  await api(`/v1/enroll`, { method: "POST", body: JSON.stringify({ token, response }) });
  return true;
}
const issueLink = () => api(`/v1/users/${encodeURIComponent(userId())}/enrollments`, { method: "POST", body: JSON.stringify({ issued_by: "console" }) });

async function assertWith(o: any) {
  const a = await navigator.credentials.get({ publicKey: { ...o, challenge: b64uToBuf(o.challenge), allowCredentials: (o.allowCredentials || []).map((c: any) => ({ ...c, id: b64uToBuf(c.id) })) } }) as PublicKeyCredential;
  const r = a.response as AuthenticatorAssertionResponse;
  return { id: a.id, rawId: bufToB64u(a.rawId), type: a.type, clientExtensionResults: a.getClientExtensionResults(), authenticatorAttachment: a.authenticatorAttachment,
    response: { clientDataJSON: bufToB64u(r.clientDataJSON), authenticatorData: bufToB64u(r.authenticatorData), signature: bufToB64u(r.signature),
      userHandle: r.userHandle ? bufToB64u(r.userHandle) : undefined } };
}
const sha256 = async (s: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

/** Approve/deny a held payment: the passkey signs sha256("agentguard:approval:v1:"+canonical(statement)), checked locally first. */
async function signedDecision(id: string, approve: boolean) {
  const r = await api(`/v1/approvals/${id}/request`, { method: "POST", body: JSON.stringify({ approve }) });
  const st = r.statement;
  if (bufToB64u(await sha256("agentguard:approval:v1:" + canon(st))) !== r.options.challenge) throw new Error("Challenge does not match the approval statement. Refusing to sign.");
  if (st.approval_id !== id || st.decision !== (approve ? "approve" : "deny")) throw new Error("Statement does not match this decision. Refusing to sign.");
  if (!confirm(`${approve ? "APPROVE" : "DENY"} with your passkey?\n\n${(st.amount_minor / 100).toFixed(2)} ${st.currency}\nPayPal order ${st.paypal_order_id ?? "(direct)"}\npayment ${st.payment_id}\nexpires ${st.expires_at}`)) return false;
  const assertion = await assertWith(r.options);
  await api(`/v1/approvals/${id}`, { method: "POST", body: JSON.stringify({ approve, assertion, approver: "console" }) });
  return true;
}
/** Shows the exact mandate JSON, checks its hash locally, then has the passkey sign that hash (it is the WebAuthn challenge). */
async function reviewAndSign(id: string, alreadyReviewed = false) {
  const r = await api(`/v1/mandates/${id}/sign-request`, { method: "POST" });
  const local = [...await sha256(canon(r.mandate))].map(b => b.toString(16).padStart(2, "0")).join("");
  if (local !== r.mandate_hash) throw new Error("Mandate hash mismatch. Refusing to sign.");
  if (bufToB64u(Uint8Array.from(local.match(/../g)!, h => parseInt(h, 16))) !== r.options.challenge) throw new Error("Challenge is not this mandate's hash. Refusing to sign.");
  if (!alreadyReviewed && !confirm(`Sign this exact mandate with your passkey?\n\n${JSON.stringify(r.mandate, null, 2)}\n\nsha256 ${r.mandate_hash}`)) return false;
  const assertion = await assertWith(r.options);
  await api(`/v1/mandates/${id}/confirm`, { method: "POST", body: JSON.stringify({ mandate_hash: r.mandate_hash, assertion }) });
  return true;
}
async function signedRevoke(id: string) {
  const r = await api(`/v1/mandates/${id}/revoke-request`, { method: "POST" });
  const assertion = await assertWith(r.options);
  await api(`/v1/mandates/${id}/revoke`, { method: "POST", body: JSON.stringify({ assertion, reason: "revoked in console" }) });
  return true;
}
Object.assign(window, { reviewAndSign, signedRevoke });

// ---- data ----
function renderApprovals(list: any[]) {
  $("#apCount").textContent = String(list.length); $("#apCount").className = "badge" + (list.length ? " badge-warning" : "");
  $("#navApprovals").textContent = String(list.length); $("#navApprovals").classList.toggle("hot", list.length > 0);
  $("#stHeld").textContent = String(list.length);
  const el = $("#approvals");
  // Don't rebuild while a decision is in flight: the clicked button must stay in the DOM.
  if (el.querySelector("[aria-busy=true]")) return;
  if (!list.length) { el.innerHTML = `<div class="empty">${icon("i-circle-check")}<b>Nothing waiting on you</b><p>Payments above a mandate's ask-me threshold appear here for a passkey decision.</p></div>`; return; }
  el.innerHTML = list.map(a => {
    const p = a.proposal, e = a.evaluation;
    // The gateway folds escalating risk signals into reasons as "signal: detail"; show each once, as a risk line.
    const riskLines = new Set((e.risk || []).map((r: any) => `${r.signal}: ${r.detail}`));
    const reasons = [...new Set<string>(e.reasons || [])].filter(r => !riskLines.has(r)).map((r: string) => `<li>${icon("i-circle-alert")}<span>${esc(r)}</span></li>`).join("");
    const risk = (e.risk || []).map((r: any) => `<li class="${r.severity === "high" ? "high" : ""}">${icon("i-triangle-alert")}<span>${esc(r.signal)}: ${esc(r.detail)}</span></li>`).join("");
    return `<article class="approval" aria-label="Held payment ${esc(money(e.amount_minor, p.currency))}">
      <div class="row gap-3"><div class="amount" style="font-size:22px">${money(e.amount_minor, p.currency)}</div>${badge("needs_human")}</div>
      <div class="small muted" style="margin-top:4px">to <span class="mono xs">${esc(payeeOf(p))}</span> · ${esc((p.items || []).map((i: any) => i.quantity + " × " + i.name).join(", "))}</div>
      <ul class="reasons">${reasons}${risk}</ul>
      ${p.agent_rationale ? `<div class="quote">${icon("i-bot", "i i-sm")} <span>${esc(p.agent_rationale)}</span></div>` : ""}
      <div class="ap-actions">
        <button class="btn btn-success btn-sm" type="button" data-ap="${esc(a.approval_id)}" data-v="1">${icon("i-fingerprint")}Approve</button>
        <button class="btn btn-danger btn-sm" type="button" data-ap="${esc(a.approval_id)}" data-v="0">Deny</button>
        <span class="exp">${icon("i-timer", "i i-sm")} expires ${esc(new Date(a.expires_at).toLocaleTimeString())}</span>
      </div></article>`;
  }).join("");
  el.querySelectorAll<HTMLButtonElement>("[data-ap]").forEach(b => b.onclick = async () => {
    b.setAttribute("aria-busy", "true");
    try { if (await signedDecision(b.dataset.ap!, b.dataset.v === "1")) toast(b.dataset.v === "1" ? "Approved with your passkey. Capturing." : "Denied with your passkey. Authorization voided.", "success"); }
    catch (e) { fail(e); }
    b.removeAttribute("aria-busy"); void refresh();
  });
}

function mandateActions(m: any) {
  const st = m.status, id = esc(m.mandate.mandate_id);
  const out: string[] = [];
  if (st === "draft" || st === "unsigned") out.push(`<button class="btn btn-secondary btn-sm" data-act="sign" data-id="${id}">${icon("i-fingerprint")}Review &amp; sign</button>`,
    `<button class="btn btn-ghost btn-sm" data-act="discard" data-id="${id}">Discard</button>`);
  if (st === "active") out.push(`<button class="btn btn-danger btn-sm" data-act="revoke" data-id="${id}">${icon("i-ban")}Revoke</button>`);
  return out.join(" ");
}
$("#gMandates").addEventListener("click", async ev => {
  const b = (ev.target as HTMLElement).closest<HTMLButtonElement>("button[data-act]"); if (!b) return;
  const id = b.dataset.id!; b.setAttribute("aria-busy", "true");
  try {
    if (b.dataset.act === "sign") { if (await reviewAndSign(id)) toast("Mandate signed with your passkey and active.", "success"); }
    if (b.dataset.act === "revoke") { if (confirm("Revoke this mandate with your passkey? Pending authorizations are voided.") && await signedRevoke(id)) toast("Mandate revoked.", "success"); }
    if (b.dataset.act === "discard") { await api(`/v1/mandates/${id}/revoke`, { method: "POST", body: JSON.stringify({ reason: "discarded" }) }); toast("Draft discarded."); }
  } catch (e) { fail(e); }
  b.removeAttribute("aria-busy"); void refresh();
});

let loaded = false;
async function refresh() {
  if (!TOKEN) return;
  try {
    const [m, a, p, au, stuck] = await Promise.all([api("/v1/mandates"), api("/v1/approvals"), api("/v1/payments"), api("/v1/audit"), api("/v1/payments/stuck")]);
    loaded = true; $("#loadErr").hidden = true;
    renderApprovals(a);
    table($("#gMandates"), [
      { h: "Purpose", v: r => `<div class="stack"><span>${esc(r.mandate.purpose)}</span><span class="id">${short(r.mandate.mandate_id, 18)}</span></div>` },
      { h: "Status", v: r => badge(r.status) },
      { h: "Spent", cls: "num", v: r => `${((r.spend?.spent_minor ?? 0) / 100).toFixed(2)} <span class="subtle">/ ${esc(r.mandate.constraints.max_total)} ${esc(r.mandate.constraints.currency)}</span>` },
      { h: "Payments", cls: "num", v: r => `${r.spend?.tx_count ?? 0} <span class="subtle">/ ${esc(r.mandate.constraints.max_transactions ?? "∞")}</span>` },
      { h: "Agent", v: r => `<span class="id">${esc(r.mandate.agent_id)}</span>` },
      { h: "Expires", v: r => `<span class="small muted">${esc(when(r.mandate.expires_at))}</span>` },
      { h: "", cls: "actions", v: mandateActions },
    ], m, { icon: "g-mandate", title: "No mandates yet", body: "Draft one from plain language on the Overview, then sign it with the user's passkey." });
    const pays = [...p].sort((x, y) => String(y.created_at).localeCompare(String(x.created_at)));
    table($("#gPayments"), [
      { h: "Time", v: r => `<span class="small muted">${esc(when(r.created_at))}</span>` },
      { h: "Payee", v: r => `<span class="id">${esc(payeeOf(r.proposal))}</span>` },
      { h: "Amount", cls: "num", v: r => money(r.evaluation.amount_minor, r.proposal.currency) },
      { h: "Decision", v: r => badge(r.evaluation.decision) },
      { h: "Status", v: r => badge(r.status) },
      { h: "Why", v: r => `<span class="small muted">${esc((r.evaluation.reasons || []).join("; ") || r.error || "all checks passed")}</span>` },
      { h: "PayPal capture", v: r => `<span class="id">${esc(r.paypal_capture_id || "")}</span>` },
    ], pays, { icon: "i-activity", title: "No payments yet", body: "Agents propose payments through the API or the MCP server. Every decision shows up here." });
    table($("#gStuck"), [
      { h: "Updated", v: r => `<span class="small muted">${esc(when(r.updated_at))}</span>` },
      { h: "Payment", v: r => `<span class="id">${esc(r.payment_id)}</span>` },
      { h: "Status", v: r => badge(r.status) },
      { h: "Amount", cls: "num", v: r => money(r.amount_minor, r.currency) },
      { h: "Authorization", v: r => `<span class="id">${esc(r.paypal_authorization_id || "")}</span>` },
      { h: "Error", v: r => `<span class="small" style="color:var(--danger)">${esc(r.error || "")}</span>` },
    ], stuck, { icon: "i-circle-check", title: "Nothing stuck", body: "Every payment reached a final state." });
    const audit = [...au].sort((x, y) => y.seq - x.seq);
    table($("#gAudit"), [
      { h: "#", cls: "num", v: r => `<span class="id">${esc(r.seq)}</span>` },
      { h: "Time", v: r => `<span class="small muted">${esc(when(r.ts))}</span>` },
      { h: "Event", v: r => `<span class="mono xs">${esc(r.event)}</span>` },
      { h: "Ref", v: r => `<span class="id">${esc(r.ref)}</span>` },
      { h: "Hash", v: r => `<span class="id">${short(r.hash, 16)}</span>` },
    ], audit, { icon: "g-anchor", title: "Ledger is empty", body: "Every mandate, decision and capture is appended here as a hash-chained entry." });
    const active = m.filter((x: any) => x.status === "active").length;
    $("#stActive").textContent = String(active);
    const cap: Record<string, number> = {};
    for (const x of p) if (x.status === "captured") cap[x.proposal.currency] = (cap[x.proposal.currency] ?? 0) + x.evaluation.amount_minor;
    $("#stCaptured").innerHTML = Object.keys(cap).length ? Object.entries(cap).map(([c, v]) => money(v, c)).join("<br>") : "0.00";
    $("#navMandates").textContent = String(m.length); $("#navPayments").textContent = String(p.length);
    $("#stuckCount").textContent = String(stuck.length); $("#stuckCount").classList.toggle("hot", stuck.length > 0);
    const c = $("#conn"); c.className = "badge badge-success"; c.innerHTML = '<span class="dot"></span>connected';
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const c = $("#conn"); c.className = "badge badge-danger"; c.innerHTML = '<span class="dot"></span>offline';
    $("#loadErr").hidden = false; $("#loadErr").querySelector("p")!.textContent = msg;
    throw e;
  }
}

async function verifyChain() {
  const el = $("#chain");
  try { const v = await api("/v1/audit/verify"); el.className = "badge " + (v.ok ? "badge-success" : "badge-danger");
    el.innerHTML = '<span class="dot"></span>'; el.append(v.ok ? `intact · ${v.length} entries` : `BROKEN at #${v.brokenAt}`); }
  catch (e) { el.className = "badge badge-danger"; el.innerHTML = '<span class="dot"></span>'; el.append(e instanceof Error ? e.message : "error"); }
}

// ---- wiring ----
$("#connectForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  TOKEN = ($("#token") as HTMLInputElement).value.trim();
  const btn = $("#connect"); btn.setAttribute("aria-busy", "true"); $("#connectErr").hidden = true;
  try { await enter(); }
  catch (e) { $("#connectErr").hidden = false; $("#connectErr").querySelector("p")!.textContent = e instanceof Error ? e.message : String(e); sessionStorage.removeItem("ag_token"); }
  btn.removeAttribute("aria-busy");
});
async function enter() {
  if (!TOKEN) throw new Error("Enter the admin token.");
  sessionStorage.setItem("ag_token", TOKEN);
  $("#connectView").hidden = true; $("#appView").hidden = false; route();
  try { await refresh(); } catch (e) { if (!loaded && /unauthor|forbidden|token/i.test(String((e as Error).message))) { $("#appView").hidden = true; $("#connectView").hidden = false; throw e; } }
  void verifyChain(); void passkeyRefresh();
}
$("#disconnect").onclick = () => { sessionStorage.removeItem("ag_token"); TOKEN = ""; location.hash = ""; location.reload(); };
$("#user").addEventListener("change", passkeyRefresh);
$("#pkCreate").onclick = async () => { try { if (await enrollWith((await issueLink()).token)) toast("Passkey enrolled.", "success"); } catch (e) { fail(e); } void passkeyRefresh(); };
$("#pkLink").onclick = async () => {
  try { const t = await issueLink();
    $("#enrollMeta").textContent = `For ${t.user_id} · expires ${new Date(t.expires_at).toLocaleTimeString()}${t.replaces ? " · REPLACES the current passkey (logged)" : ""}`;
    ($("#enrollUrl") as HTMLInputElement).value = t.link; $("#enrollPanel").hidden = false; ($("#enrollUrl") as HTMLInputElement).select();
  } catch (e) { fail(e); }
};
$("#enrollClose").onclick = () => { $("#enrollPanel").hidden = true; };
$("#verify").onclick = verifyChain;
$("#recover").onclick = async () => {
  if (!confirm("Run recovery now for payments older than 60s?")) return;
  try { const r = await api("/v1/recover", { method: "POST", body: JSON.stringify({ older_than_ms: 60000 }) });
    toast(`Scanned ${r.scanned}. ${r.actions.length ? "Actions: " + r.actions.join(", ") : "No action needed."}`, "success"); }
  catch (e) { fail(e); }
  refresh().catch(() => {});
};
$("#draftForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const out = $("#draftOut"), btn = $("#draft");
  btn.setAttribute("aria-busy", "true"); out.innerHTML = `<div class="stack gap-3"><span class="skel" style="width:60%"></span><span class="skel" style="width:85%"></span></div>`;
  try {
    const d = await api("/v1/mandates/draft-from-text", { method: "POST", body: JSON.stringify({ user_id: userId(), agent_id: ($("#agent") as HTMLInputElement).value, text: ($("#text") as HTMLTextAreaElement).value }) });
    out.innerHTML = `<div class="stack gap-3" style="border-top:1px solid var(--border);padding-top:16px">
      <b class="small">You're about to authorize</b>
      <ul class="reasons" style="margin:0">${d.summary.map((s: string) => `<li>${icon("i-check")}<span>${esc(s)}</span></li>`).join("")}</ul>
      ${d.warnings.map((w: string) => `<div class="alert alert-warning">${icon("i-triangle-alert")}<p>${esc(w)}</p></div>`).join("")}
      <details><summary class="small muted" style="cursor:pointer">Exact mandate you will sign</summary><pre class="json" style="margin-top:8px">${esc(JSON.stringify(d.mandate, null, 2))}</pre></details>
      <div class="xs subtle">Drafted by ${esc(d.source)} · sha256 your passkey signs</div><code class="xs mono" style="word-break:break-all">${esc(d.mandate_hash)}</code>
      <div class="row gap-2"><button class="btn btn-success btn-sm" type="button" id="sign">${icon("i-fingerprint")}Sign with passkey</button><button class="btn btn-ghost btn-sm" type="button" id="discard">Discard</button></div></div>`;
    $("#sign").onclick = async () => { try { if (await reviewAndSign(d.mandate.mandate_id, true)) { out.innerHTML = ""; toast("Mandate signed with your passkey and active.", "success"); } } catch (e) { fail(e); } refresh().catch(() => {}); };
    $("#discard").onclick = async () => { try { await api(`/v1/mandates/${d.mandate.mandate_id}/revoke`, { method: "POST", body: JSON.stringify({ reason: "discarded draft" }) }); out.innerHTML = ""; } catch (e) { fail(e); } refresh().catch(() => {}); };
  } catch (e) { out.innerHTML = `<div class="alert alert-danger">${icon("i-circle-alert")}<p>${esc(e instanceof Error ? e.message : e)}</p></div>`; }
  btn.removeAttribute("aria-busy");
});

// Opening an enrollment link (#enroll=<token>) redeems it; no admin token needed.
if (location.hash.startsWith("#enroll=")) {
  const t = decodeURIComponent(location.hash.slice(8)); history.replaceState(null, "", location.pathname);
  setTimeout(async () => { try { if (await enrollWith(t)) toast("Passkey enrolled. You can close this tab.", "success"); } catch (e) { fail(e); } void passkeyRefresh(); }, 0);
}
pkObserver();
if (TOKEN) enter().catch(() => {});
setInterval(() => { if (!$("#appView").hidden) refresh().catch(() => {}); }, 4000);
