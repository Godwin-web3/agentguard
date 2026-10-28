#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { verifyReceipt, type VerifyOptions } from "./verify.ts";
import { buildDisputeEvidence, submitDisputeEvidence } from "./evidence.ts";

const USAGE = `intent-verify: verify an AgentGuard Proof-of-Intent receipt, offline by default.

  intent-verify <receipt.json> [options]
  intent-verify ap2 <receipt.json>          print the receipt's AP2 mandates (Intent/Cart/Payment) as JSON
  intent-verify evidence <receipt.json> --out <dir> [--evidence-type T] [--submit <dispute_id>] [options]

Options:
  --issuer-key <pem file>   AgentGuard issuer public key to trust (from /.well-known/agentguard-key)
  --issuer-keys <json file> AgentGuard issuer key set to pin by kid (from /.well-known/agentguard-keys)
  --allow-admin-approval    accept legacy receipts whose human approval was not passkey-signed
  --origin <url>            accepted WebAuthn origin for the user's passkey (repeatable)
  --payee <id>              your PayPal merchant id or email; the order must pay it (repeatable)
  --paypal                  also re-fetch the order/capture from PayPal using PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET
                            (PAYPAL_API_BASE defaults to https://api-m.paypal.com; use https://api-m.sandbox.paypal.com for sandbox)
  --tsa-root <name=pem>     trust this RFC 3161 TSA root instead of the bundled FreeTSA/Sectigo roots (repeatable)
  --require-timestamp       fail unless the receipt carries a verified RFC 3161 timestamp
  --require-anchor          fail unless the receipt carries a timestamped audit-anchor inclusion proof
  --max-anchor-lag <min>    maximum minutes between receipt and the anchor that covers it (default 1440)
  --json                    machine-readable output
Exit code: 0 all checks pass, 1 a check failed, 2 usage/input error.`;

async function main(argv: string[]) {
  const args = [...argv]; const flag = (n: string) => { const i = args.indexOf(n); if (i < 0) return false; args.splice(i, 1); return true; };
  const many = (n: string) => { const out: string[] = []; let i; while ((i = args.indexOf(n)) >= 0) { out.push(args[i + 1]); args.splice(i, 2); } return out; };
  const one = (n: string) => many(n)[0];
  if (flag("--help") || flag("-h") || !args.length) { console.log(USAGE); return 0; }
  const evidence = args[0] === "evidence"; if (evidence) args.shift();
  const json = flag("--json"), live = flag("--paypal"), allowAdmin = flag("--allow-admin-approval");
  const keysFile = one("--issuer-keys");
  const keyFile = one("--issuer-key"), origins = many("--origin"), payees = many("--payee");
  const out = one("--out"), submit = one("--submit"), evType = one("--evidence-type");
  if (args[0] === "ap2") { const e = JSON.parse(readFileSync(args[1], "utf8")); if (!e?.receipt?.ap2) { console.error("receipt has no AP2 views"); return 1; } console.log(JSON.stringify(e.receipt.ap2, null, 2)); return 0; }
  const file = args[0]; if (!file) { console.error(USAGE); return 2; }
  let env: any; try { env = JSON.parse(readFileSync(file, "utf8")); } catch (e) { console.error(`cannot read ${file}: ${(e as Error).message}`); return 2; }
  const creds = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID, clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are required");
    return { clientId, clientSecret, apiBase: process.env.PAYPAL_API_BASE };
  };
  const opts: VerifyOptions = {};
  if (keyFile) { const k = readFileSync(keyFile, "utf8"); opts.issuerPublicKeyPem = k.trim().startsWith("{") ? JSON.parse(k).public_key_pem : k; }
  if (keysFile) opts.issuerKeys = JSON.parse(readFileSync(keysFile, "utf8"));
  if (allowAdmin) opts.allowAdminApproval = true;
  if (origins.length) opts.expectedOrigins = origins;
  if (payees.length) opts.expectedPayee = payees;
  if (live || submit) opts.paypal = creds();
  const roots = many("--tsa-root");
  if (roots.length) opts.tsaRoots = Object.fromEntries(roots.map(r => { const i = r.indexOf("="); return [r.slice(0, i), readFileSync(r.slice(i + 1), "utf8")]; }));
  if (flag("--require-timestamp")) opts.requireTimestamp = true;
  if (flag("--require-anchor")) opts.requireAnchor = true;
  const lag = one("--max-anchor-lag"); if (lag) opts.maxAnchorLagMs = Number(lag) * 60_000;
  const v = await verifyReceipt(env, opts);
  if (json && !evidence) console.log(JSON.stringify(v, null, 2));
  else {
    console.log(`${v.ok ? "VALID" : "INVALID"} receipt ${v.receipt_id ?? "?"}${v.ok && !v.trusted_issuer ? " (issuer key not pinned)" : ""}`);
    if (v.summary) console.log(`  order ${v.summary.order_id}  capture ${v.summary.capture_id}  ${v.summary.amount} ${v.summary.currency} -> ${v.summary.payee}`);
    for (const c of v.checks) console.log(`  ${c.pass ? "✓" : "✗"} ${c.check}: ${c.detail}`);
    for (const w of v.warnings) console.log(`  ! ${w}`);
  }
  if (evidence) {
    if (!out) { console.error("--out <dir> is required for evidence"); return 2; }
    const ev = buildDisputeEvidence(env, v, { evidenceType: evType });
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "provide-evidence.input.json"), JSON.stringify(ev.input, null, 2));
    for (const f of ev.files) writeFileSync(join(out, f.name), f.data);
    console.log(`evidence written to ${out}: provide-evidence.input.json, ${ev.files.map(f => f.name).join(", ")}`);
    if (submit) {
      if (!v.ok) { console.error("refusing to submit evidence for a receipt that does not verify"); return 1; }
      const r = await submitDisputeEvidence(submit, ev, creds());
      console.log(`PayPal provide-evidence ${submit}: HTTP ${r.status} ${JSON.stringify(r.body).slice(0, 800)}`);
      return r.status >= 200 && r.status < 300 ? 0 : 1;
    }
  }
  return v.ok ? 0 : 1;
}
main(process.argv.slice(2)).then(c => process.exit(c), e => { console.error(e?.message ?? e); process.exit(2); });
