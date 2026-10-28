// Renders raster brand assets (favicons, touch/app icons, OG image) from the SVG sources with headless Chrome.
// Run after build.py:  node scripts/brand/raster.mjs   (needs playwright-core + a Chrome at $CHROME or /usr/bin/google-chrome)
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const B = resolve("brand");
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome" });
const page = await browser.newPage();
async function render(html, w, h, out, scale = 1) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:transparent}</style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h }, scale: scale === 1 ? "css" : "device" });
  console.log("wrote", out);
}
// 16px: pixel-snapped variant (bracket arms 6px, stroke 2px, core 6px) so it stays crisp on the 1x grid.
const mark16 = (fr, co) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges"><path d="M1 1h6v2H3v4H1z M15 15H9v-2h4V9h2z" fill="${fr}"/><rect x="5" y="5" width="6" height="6" fill="${co}"/></svg>`;
writeFileSync(`${B}/icons/favicon-16.svg`, mark16("#0B0D12", "#2F4BD6") + "\n");
const mark = readFileSync(`${B}/logo/agentguard-mark-light.svg`, "utf8");
const app = readFileSync(`${B}/icons/app-icon.svg`, "utf8");
await render(mark16("#0B0D12", "#2F4BD6"), 16, 16, `${B}/icons/favicon-16.png`);
await render(mark.replace(/width="32" height="32"/, 'width="32" height="32" shape-rendering="crispEdges"'), 32, 32, `${B}/icons/favicon-32.png`);
await render(app.replace(/width="512" height="512"/, 'width="180" height="180"'), 180, 180, `${B}/icons/apple-touch-icon.png`);
await render(app, 512, 512, `${B}/icons/icon-512.png`);
await render(app.replace(/width="512" height="512"/, 'width="192" height="192"'), 192, 192, `${B}/icons/icon-192.png`);
// OG image 1200x630
const fontUrl = (f) => "data:font/woff2;base64," + readFileSync(resolve(B, "fonts", f)).toString("base64");
const logoDark = readFileSync(`${B}/logo/agentguard-logo-dark.svg`, "utf8").replace(/width="[\d.]+" height="32"/, 'height="40" width="178.6"');
const og = `<style>
@font-face{font-family:Inter;src:url(${fontUrl("InterVariable-latin.woff2")});font-weight:100 900}
@font-face{font-family:JBM;src:url(${fontUrl("JetBrainsMonoVariable-latin.woff2")});font-weight:100 800}
.og{position:relative;width:1200px;height:630px;background:#08090C;color:#ECEEF2;font-family:Inter;overflow:hidden;
 background-image:linear-gradient(#ffffff09 1px,transparent 1px),linear-gradient(90deg,#ffffff09 1px,transparent 1px);background-size:48px 48px;background-position:-1px -1px}
.l{position:absolute;left:72px;top:64px}
h1{position:absolute;left:72px;top:150px;margin:0;font-size:64px;line-height:68px;font-weight:620;letter-spacing:-0.035em;width:600px}
h1 span{color:#8D94A1}
p{position:absolute;left:72px;top:400px;margin:0;width:540px;font-size:24px;line-height:34px;color:#ADB3BF;letter-spacing:-0.01em}
.foot{position:absolute;left:72px;bottom:56px;font-family:JBM;font-size:17px;color:#8D94A1;letter-spacing:0}
.card{position:absolute;right:72px;top:118px;width:420px;background:#111318;border:1px solid #2A2F39;border-radius:14px;font-family:JBM;font-size:15px;box-shadow:0 30px 60px -20px #000}
.hd{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid #23272F;font-family:Inter;font-size:16px;font-weight:560}
.ok{display:inline-flex;gap:8px;align-items:center;font-family:JBM;font-size:13px;font-weight:600;color:#45CF8F;background:#0C2018;border:1px solid #1C4A35;padding:5px 10px;border-radius:6px;letter-spacing:.06em}
.row{display:flex;justify-content:space-between;padding:12px 22px;border-bottom:1px solid #1B1F26;color:#8D94A1}
.row b{font-weight:500;color:#ECEEF2}.row:last-child{border:0}
</style><div class="og"><div class="l">${logoDark}</div>
<h1>Verifiable intent for agent payments. <span>Enforced on PayPal.</span></h1>
<p>Users sign bounded mandates with a passkey. Every agent payment is held to them, and every capture leaves a receipt anyone can verify.</p>
<div class="foot">AP2-compatible · Ed25519 + RFC 3161 · Merkle-anchored audit</div>
<div class="card"><div class="hd"><span>Payment receipt <span style="color:#8D94A1;font-weight:450">· sandbox</span></span><span class="ok"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>VALID</span></div>
<div class="row">mandate<b>mdt_f1a6…cedf</b></div><div class="row">captured<b>USD 10.80</b></div><div class="row">policy<b>ask above USD 5</b></div>
<div class="row">user signature<b>passkey ES256 ✓</b></div><div class="row">issuer signature<b>Ed25519 ✓</b></div><div class="row">timestamps<b>2 × RFC 3161 ✓</b></div><div class="row">audit anchor<b>root dc20…7d57 ✓</b></div></div></div>`;
await render(og, 1200, 630, `${B}/og/og-image.png`);
await browser.close();
