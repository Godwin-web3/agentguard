/**
 * DEV/CI ONLY: a software passkey so scripts (sandbox smoke run) can act as the user without a browser.
 * The key is stored in ./data/dev-passkey-<user>.json. Real users sign in the owner console with a platform
 * passkey or security key; never use this for real money.
 *
 *   node --experimental-strip-types scripts/dev-passkey.ts register <user_id>
 *   node --experimental-strip-types scripts/dev-passkey.ts sign <mandate_id> <user_id>
 *   node --experimental-strip-types scripts/dev-passkey.ts revoke <mandate_id> <user_id>
 *   node --experimental-strip-types scripts/dev-passkey.ts approve <approval_id> <user_id>   (or: deny)
 *   node --experimental-strip-types scripts/dev-passkey.ts reenroll <user_id>          (rotate: the CURRENT dev passkey authorizes a new one)
 *   node --experimental-strip-types scripts/dev-passkey.ts cancel-recovery <user_id>   (stop an admin-started recovery with the current passkey)
 * register issues a single-use enrollment token with the admin token and redeems it (or redeems ENROLL_TOKEN if set).
 * Env: AGENTGUARD_URL (default http://localhost:8787), AGENTGUARD_ADMIN_TOKEN.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { SoftAuthenticator } from "../test/support/softauth.ts";

const BASE = process.env.AGENTGUARD_URL ?? "http://localhost:8787";
const TOKEN = process.env.AGENTGUARD_ADMIN_TOKEN ?? "";
const [cmd, a1, a2] = process.argv.slice(2);
const file = (u: string) => `./data/dev-passkey-${u.replace(/[^\w.-]/g, "_")}.json`;
async function api(method: string, path: string, body?: unknown) {
  const r = await fetch(BASE + path, { method, headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const j: any = await r.json(); if (!r.ok) throw new Error(`${path}: ${r.status} ${j.error}`); return j;
}
const load = (u: string) => { if (!existsSync(file(u))) throw new Error(`no dev passkey for ${u}; run register first`); return SoftAuthenticator.fromJSON(JSON.parse(readFileSync(file(u), "utf8"))); };
const save = (u: string, a: SoftAuthenticator) => { mkdirSync("./data", { recursive: true }); writeFileSync(file(u), JSON.stringify(a.toJSON()), { mode: 0o600 }); };
const origin = new URL(BASE).origin, rpID = process.env.AGENTGUARD_RP_ID ?? new URL(BASE).hostname;

if (cmd === "register") {
  const st = await api("GET", `/v1/users/${encodeURIComponent(a1)}/passkey`);
  if (st.registered) { if (!existsSync(file(a1))) throw new Error(`${a1} already has a passkey that is not this dev key`); console.log(JSON.stringify({ registered: true, credential_id: st.credential_id })); }
  else {
    const a = new SoftAuthenticator(rpID, origin);
    const token = process.env.ENROLL_TOKEN || (await api("POST", `/v1/users/${encodeURIComponent(a1)}/enrollments`, { issued_by: "dev-passkey" })).token;
    const o = await api("POST", `/v1/enroll/options`, { token });
    if (o.user_id !== a1) throw new Error(`enrollment token is for ${o.user_id}, not ${a1}`);
    const r = await api("POST", `/v1/enroll`, { token, response: a.register(o) });
    console.log(JSON.stringify({ credential_id: r.credential_id, user_id: r.user_id, enrollment: r.enrollment })); save(a1, a);
  }
} else if (cmd === "sign" || cmd === "revoke") {
  const a = load(a2);
  if (cmd === "sign") {
    const r = await api("POST", `/v1/mandates/${a1}/sign-request`);
    console.log(JSON.stringify(await api("POST", `/v1/mandates/${a1}/confirm`, { mandate_hash: r.mandate_hash, assertion: a.assert(r.options.challenge) })));
  } else {
    const r = await api("POST", `/v1/mandates/${a1}/revoke-request`);
    const v = await api("POST", `/v1/mandates/${a1}/revoke`, { assertion: a.assert(r.options.challenge), reason: "dev-passkey revoke" });
    console.log(JSON.stringify({ status: v.status }));
  }
  save(a2, a);
} else if (cmd === "approve" || cmd === "deny") {
  const a = load(a2); const approve = cmd === "approve";
  const r = await api("POST", `/v1/approvals/${a1}/request`, { approve });
  if (r.statement.user_id !== a2) throw new Error(`approval belongs to ${r.statement.user_id}`);
  console.error(`signing: ${r.statement.decision} ${r.statement.amount_minor / 100} ${r.statement.currency} order ${r.statement.paypal_order_id} payment ${r.statement.payment_id}`);
  const v = await api("POST", `/v1/approvals/${a1}`, { approve, assertion: a.assert(r.options.challenge), approver: `${a2} (dev-passkey)` });
  save(a2, a);
  console.log(JSON.stringify({ payment_id: v.payment_id, status: v.status, paypal: v.paypal ?? null, statement_hash: r.statement_hash }));
} else if (cmd === "reenroll") {
  // Passkey-authorized rotation through a single-use enrollment token: gives the user recorded provenance
  // (via=passkey) with no admin involvement. Mandates signed by the old key are frozen until re-signed.
  const cur = load(a1);
  const r = await api("POST", `/v1/users/${encodeURIComponent(a1)}/reenroll-request`);
  const t = await api("POST", `/v1/users/${encodeURIComponent(a1)}/reenroll`, { assertion: cur.assert(r.options.challenge) });
  save(a1, cur);
  const next = new SoftAuthenticator(rpID, origin);
  const o = await api("POST", `/v1/enroll/options`, { token: t.token });
  const res = await api("POST", `/v1/enroll`, { token: t.token, response: next.register(o) });
  writeFileSync(file(a1) + ".prev", JSON.stringify(cur.toJSON()), { mode: 0o600 }); save(a1, next);
  console.log(JSON.stringify({ credential_id: res.credential_id, replaces: res.enrollment.replaces, via: res.enrollment.via, token_id: t.token_id }));
} else if (cmd === "cancel-recovery") {
  const a = load(a1);
  const r = await api("POST", `/v1/users/${encodeURIComponent(a1)}/recovery/cancel-request`);
  console.log(JSON.stringify(await api("POST", `/v1/users/${encodeURIComponent(a1)}/recovery/cancel`, { assertion: a.assert(r.options.challenge) })));
  save(a1, a);
} else { console.error("usage: register <user> | reenroll <user> | cancel-recovery <user> | sign <mandate> <user> | revoke <mandate> <user> | approve|deny <approval> <user>"); process.exit(2); }
