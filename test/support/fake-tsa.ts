import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os"; import { join, resolve } from "node:path"; import { randomBytes } from "node:crypto";
import { timestampRequest, tokenFromResponse } from "../../packages/intent-verifier/src/tsa.ts";
import type { Timestamper } from "../../src/timestamp.ts";

/** A real RFC 3161 TSA backed by `openssl ts -reply` and the test-only CA in test/fixtures/tsa. */
const DIR = resolve(import.meta.dirname, "../fixtures/tsa");
export const TEST_TSA_ROOTS = { "test-root": readFileSync(join(DIR, "root.pem"), "utf8") };
export const OTHER_ROOTS = { "other": readFileSync(join(DIR, "other-root.pem"), "utf8") };
export function fakeTsaToken(hexDigest: string): string {
  const d = mkdtempSync(join(tmpdir(), "tsa-")); writeFileSync(join(d, "serial"), "01\n");
  writeFileSync(join(d, "q.tsq"), timestampRequest(hexDigest, randomBytes(8)));
  execFileSync("openssl", ["ts", "-reply", "-queryfile", join(d, "q.tsq"), "-config", join(DIR, "tsa.cnf"), "-out", join(d, "r.tsr")],
    { env: { ...process.env, TSA_DIR: DIR, TSA_SERIAL: join(d, "serial") }, stdio: "ignore" });
  return tokenFromResponse(readFileSync(join(d, "r.tsr"))).toString("base64");
}
export class FakeTsa implements Timestamper {
  roots = TEST_TSA_ROOTS; calls = 0; down = false;
  async stamp(hexDigest: string) { this.calls++; return this.down ? [] : [{ tsa: "test", token: fakeTsaToken(hexDigest) }]; }
}
