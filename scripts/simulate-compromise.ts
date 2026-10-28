/**
 * Live key-compromise drill against a running AgentGuard (sandbox/dev only).
 *   RECEIPT=data/held-live/receipt.json node --experimental-strip-types scripts/simulate-compromise.ts
 * 1. declares the receipt's signing key compromised (POST /v1/keys/:kid/compromised, admin; the server rotates);
 * 2. re-pins the published key set and verifies the genuine pre-compromise receipt offline (must PASS: its RFC 3161
 *    tokens predate compromised_at);
 * 3. plays the attacker holding the stolen key (read from the local key ring, never printed) and forges receipts:
 *    post-dated + real fresh TSA stamp, back-dated + no stamp, back-dated + real fresh TSA stamp. All must FAIL.
 * Env: AGENTGUARD_URL, AGENTGUARD_ADMIN_TOKEN, AGENTGUARD_KEYRING_FILE. Prints no secrets.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createPrivateKey, sign, createHash } from "node:crypto";
import { verifyReceipt } from "../packages/intent-verifier/src/index.ts";
import { canonical } from "../src/canonical.ts";
import { KeyRing } from "../src/keys.ts";
import { TsaClient } from "../src/timestamp.ts";
const U = process.env.AGENTGUARD_URL ?? "http://localhost:8787", A = { authorization: `Bearer ${process.env.AGENTGUARD_ADMIN_TOKEN}`, "content-type": "application/json" };
const file = process.env.RECEIPT ?? "data/held-live/receipt.json", out = file.replace(/receipt\.json$/, "");
const pre = JSON.parse(readFileSync(file, "utf8")); const kid = pre.signature.kid;
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const r = await fetch(`${U}/v1/keys/${kid}/compromised`, { method: "POST", headers: A, body: JSON.stringify({}) });
const marked = await r.json() as any; if (!r.ok) throw new Error(JSON.stringify(marked));
console.log(`declared ${kid} compromised at ${marked.compromised_at}; active key now ${marked.active}`);
const keys = await (await fetch(`${U}/.well-known/agentguard-keys`)).json(); writeFileSync(out + "agentguard-keys.after-compromise.json", JSON.stringify(keys, null, 2));
const opts = { issuerKeys: keys, requireTimestamp: true } as any;
const fails = (v: any) => v.checks.filter((c: any) => !c.pass).map((c: any) => c.check);
const show = (label: string, v: any) => console.log(`${v.ok ? "PASS" : "FAIL"}  ${label}${v.ok ? "" : "  -> failed: " + fails(v).join(", ")}  | ${v.checks.find((c: any) => c.check === "issuer.key_compromise")?.detail ?? ""}`);
show(`genuine pre-compromise receipt ${pre.receipt.receipt_id}`, await verifyReceipt(pre, opts));
show(`same receipt with its TSA tokens stripped`, await verifyReceipt({ ...pre, timestamps: undefined }, opts));

const rec = (KeyRing.load() as any).recs.find((x: any) => x.kid === kid); const stolen = createPrivateKey(rec.private_pem);
const tsa = new TsaClient();
const forge = async (label: string, mut: (r: any) => void, stamp: boolean) => {
  const f = structuredClone(pre); delete f.anchor; mut(f.receipt);
  f.signature.value = sign(null, Buffer.from(canonical(f.receipt)), stolen).toString("base64");
  f.timestamps = stamp ? await tsa.stamp(sha(canonical(f.receipt))) : undefined;
  show(`${label} (${f.receipt.receipt_id}${stamp ? ", TSA " + f.timestamps.map((t: any) => t.gen_time).join("/") : ""})`, await verifyReceipt(f, opts));
};
await forge("forgery, post-dated, fresh real TSA stamp", r => { r.receipt_id = "poi_forged_post"; r.issued_at = new Date().toISOString(); }, true);
await forge("forgery, back-dated, no TSA stamp", r => { r.receipt_id = "poi_forged_back"; }, false);
await forge("forgery, back-dated, fresh real TSA stamp", r => { r.receipt_id = "poi_forged_back_tsa"; }, true);
