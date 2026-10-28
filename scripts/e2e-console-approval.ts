/**
 * Headless click-through of a held-payment approval in the owner console, through the browser's REAL WebAuthn
 * path (navigator.credentials.get) using Chrome's CDP virtual authenticator.
 *
 * The user's dev passkey (./data/dev-passkey-<user>.json) is loaded into the virtual authenticator, the console is
 * opened, the "Approve" button on the held payment's card is clicked and the confirmation dialog accepted.
 * The authenticator's sign counter is written back so the dev key stays usable.
 *
 *   APPROVAL_ID=apr_... USER=demo-user node --experimental-strip-types scripts/e2e-console-approval.ts
 * Env: AGENTGUARD_URL, AGENTGUARD_ADMIN_TOKEN, CHROME (default /usr/bin/google-chrome). Prints no secrets.
 * DEV/CI ONLY.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createPrivateKey } from "node:crypto";
import { chromium } from "playwright-core";
const BASE = process.env.AGENTGUARD_BROWSER_URL ?? process.env.AGENTGUARD_URL ?? "http://localhost:8787", TOKEN = process.env.AGENTGUARD_ADMIN_TOKEN!;
const USER = process.env.USER_ID ?? process.env.USER_NAME ?? "demo-user", APPROVAL = process.env.APPROVAL_ID!;
if (!TOKEN || !APPROVAL) { console.error("need AGENTGUARD_ADMIN_TOKEN and APPROVAL_ID"); process.exit(2); }
const file = `./data/dev-passkey-${USER.replace(/[^\w.-]/g, "_")}.json`;
const dev = JSON.parse(readFileSync(file, "utf8"));
// Behind Vercel Deployment Protection: AGENTGUARD_API_URL is an authenticated proxy for the API calls, and
// VERCEL_SHARE_URL (a share link) is opened first so the browser gets the protection cookie.
const API = process.env.AGENTGUARD_API_URL ?? BASE;
const api = async (m: string, p: string) => (await fetch(API + p, { method: m, headers: { authorization: `Bearer ${TOKEN}` } })).json() as any;

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true });
try {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("WebAuthn.enable");
  const { authenticatorId } = await cdp.send("WebAuthn.addVirtualAuthenticator", { options: { protocol: "ctap2", transport: "internal",
    hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
  await cdp.send("WebAuthn.addCredential", { authenticatorId, credential: {
    credentialId: Buffer.from(dev.credId, "base64url").toString("base64"), isResidentCredential: false, rpId: dev.rpID,
    privateKey: createPrivateKey(dev.pem).export({ type: "pkcs8", format: "der" }).toString("base64"), signCount: dev.counter } });
  const dialogs: string[] = [];
  page.on("dialog", d => { dialogs.push(d.type() + ": " + d.message().split("\n")[0]); void d.accept(); });
  if (process.env.VERCEL_SHARE_URL) await page.goto(process.env.VERCEL_SHARE_URL);
  await page.goto(BASE + "/console");
  await page.fill("#token", TOKEN); await page.click("#connect");
  await page.fill("#user", USER); await page.dispatchEvent("#user", "change");
  const btn = page.locator(`button[data-ap="${APPROVAL}"][data-v="1"]`);
  await btn.waitFor({ timeout: 20_000 });
  console.log("console shows held payment; clicking Approve");
  await btn.click();
  let pay: any = null;
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(1000);
    pay = (await api("GET", "/v1/payments?limit=50")).find((p: any) => p.approval_id === APPROVAL || p.payment_id === APPROVAL);
    if (!(await api("GET", "/v1/approvals")).some((a: any) => a.approval_id === APPROVAL)) break;
  }
  const creds = await cdp.send("WebAuthn.getCredentials", { authenticatorId });
  const c = creds.credentials.find((x: any) => Buffer.from(x.credentialId, "base64").toString("base64url") === dev.credId);
  if (c) { dev.counter = Math.max(dev.counter, c.signCount); writeFileSync(file, JSON.stringify(dev), { mode: 0o600 }); }
  console.log("dialogs:", JSON.stringify(dialogs.filter(d => !d.startsWith("alert"))));
  const alerts = dialogs.filter(d => d.startsWith("alert"));
  if (alerts.length) { console.error("console alert:", alerts.join(" | ")); process.exit(1); }
  const still = (await api("GET", "/v1/approvals")).some((a: any) => a.approval_id === APPROVAL);
  console.log(JSON.stringify({ approval_id: APPROVAL, resolved: !still, sign_count: c?.signCount ?? null }));
  if (still) process.exit(1);
} finally { await browser.close(); }
