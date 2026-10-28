// The static site: the browser build of the intent verifier and the static file server.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
// @ts-ignore: plain ESM helper shared with the site build
import { browserVerifierOptions } from "../scripts/web-bundle.mjs";

const root = resolve(import.meta.dirname, "..");
const sample = () => JSON.parse(readFileSync(join(root, "web/samples/receipt-sandbox.json"), "utf8"));
const keys = JSON.parse(readFileSync(join(root, "web/samples/agentguard-keys-orcin.json"), "utf8"));

test("browser verifier bundle (crypto shim, no node:crypto) gives the same verdicts as the CLI", async () => {
  const outfile = join(mkdtempSync(join(tmpdir(), "ag-web-")), "verifier.mjs");
  const r = await build({ entryPoints: [join(root, "web/src/verifier.ts")], bundle: true, outfile, write: true, metafile: true, logLevel: "silent", ...browserVerifierOptions(root) });
  assert.ok(!Object.keys(r.metafile!.inputs).some(f => f.startsWith("node:")), "bundle must not pull in node built-ins");
  const { verifyReceipt } = await import(pathToFileURL(outfile).href);
  const ok = await verifyReceipt(sample(), { issuerKeys: keys });
  assert.equal(ok.ok, true, ok.checks.filter((c: any) => !c.pass).map((c: any) => c.check).join(","));
  assert.equal(ok.trusted_issuer, true);
  const t = sample(); t.receipt.payment.amount_minor += 1;
  const bad = await verifyReceipt(t, { issuerKeys: keys });
  assert.equal(bad.ok, false);
  assert.ok(bad.checks.some((c: any) => c.check === "issuer.signature" && !c.pass));
  const wrongKeys = await verifyReceipt(sample(), { issuerKeys: { keys: [] } });
  assert.equal(wrongKeys.ok, false);
});

test("static site: pretty paths, strict CSP, no traversal, no inline scripts", async () => {
  execFileSync(process.execPath, [join(root, "scripts/build-web.mjs")], { cwd: root, stdio: "ignore" });
  const { siteFile } = await import("../src/site.ts");
  for (const p of ["/", "/console", "/receipt", "/brand"]) {
    const f = siteFile(p); assert.ok(f, p);
    assert.match(f!.headers["content-type"], /text\/html/);
    const csp = f!.headers["content-security-policy"];
    assert.match(csp, /script-src 'self';/); assert.doesNotMatch(csp, /unsafe-inline[^;]*;.*script|https?:\/\//);
    assert.doesNotMatch(f!.body.toString(), /<script(?![^>]*\bsrc=)[^>]*>/i, `inline script in ${p}`);
  }
  assert.match(siteFile("/brand/icons.svg")!.headers["content-type"], /svg/);
  assert.equal(siteFile("/site.webmanifest")!.headers["content-type"], "application/manifest+json");
  for (const p of ["/../package.json", "/%2e%2e/package.json", "/..%2fsrc/app.ts", "/nope.html", "/v1/whatever"]) assert.equal(siteFile(p), null, p);
});
