/**
 * DEV/CI ONLY: a software passkey so scripts (sandbox smoke run) can act as the user without a browser.
 * The key is stored in ./data/dev-passkey-<user>.json. Real users sign in the owner console with a platform
 * passkey or security key; never use this for real money.
 *
 *   node --experimental-strip-types scripts/dev-passkey.ts register <user_id>
 *   node --experimental-strip-types scripts/dev-passkey.ts sign <mandate_id> <user_id>
 *   node --experimental-strip-types scripts/dev-passkey.ts revoke <mandate_id> <user_id>
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
    const o = await api("POST", `/v1/users/${encodeURIComponent(a1)}/passkey/options`);
    console.log(JSON.stringify(await api("POST", `/v1/users/${encodeURIComponent(a1)}/passkey`, { response: a.register(o) }))); save(a1, a);
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
} else { console.error("usage: register <user> | sign <mandate> <user> | revoke <mandate> <user>"); process.exit(2); }
