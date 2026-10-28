/**
 * Browser check of the owner console's real WebAuthn path (navigator.credentials.create/get) using Chrome's
 * CDP virtual authenticator. Needs a running server and Chrome: CHROME=/usr/bin/google-chrome.
 *   node --experimental-strip-types scripts/e2e-console-passkey.ts
 */
import { chromium } from "playwright-core";
const BASE = process.env.AGENTGUARD_URL ?? "http://localhost:8787", TOKEN = process.env.AGENTGUARD_ADMIN_TOKEN!;
const user = `e2e-${Date.now()}`;
const api = async (m: string, p: string, b?: unknown) => (await fetch(BASE + p, { method: m, headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" }, body: b ? JSON.stringify(b) : undefined })).json() as any;
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true });
const page = await browser.newPage();
const cdp = await page.context().newCDPSession(page);
await cdp.send("WebAuthn.enable");
await cdp.send("WebAuthn.addVirtualAuthenticator", { options: { protocol: "ctap2", transport: "internal", hasResidentKey: true, hasUserVerification: true, isUserVerified: true } });
page.on("dialog", d => d.accept());
await page.goto(BASE + "/console");
await page.fill("#token", TOKEN); await page.click("#connect");
await page.fill("#user", user); await page.dispatchEvent("#user", "change");
await page.click("#pkCreate");
await page.waitForFunction(() => document.querySelector("#pkState")!.textContent === "passkey: registered");
console.log("passkey registered in browser for", user);
await api("POST", "/v1/agents", { user_id: user, agent_id: `${user}-a` });
const d = await api("POST", "/v1/mandates", { user_id: user, agent_id: `${user}-a`, purpose: "Buy one book",
  constraints: { max_total: "20.00", currency: "USD", max_transactions: 1, payee_allowlist: [{ email_address: "store@example.com" }] } });
const mid = d.mandate?.mandate_id ?? d.mandate_id; if (!mid) throw new Error("create failed: " + JSON.stringify(d));
await page.evaluate(id => (window as any).reviewAndSign(id), mid);
const after = (await api("GET", "/v1/mandates")).find((m: any) => m.mandate.mandate_id === mid);
console.log("after console sign:", after.status, "user_signature:", !!after.user_signature);
await page.evaluate(id => (window as any).signedRevoke(id), mid);
const rev = (await api("GET", "/v1/mandates")).find((m: any) => m.mandate.mandate_id === mid);
console.log("after console revoke:", rev.status, "revocation_signature:", !!rev.revocation_signature);
await browser.close();
if (after.status !== "active" || rev.status !== "revoked") process.exit(1);
