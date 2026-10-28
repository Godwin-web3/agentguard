// esbuild options for code that runs the intent verifier in the browser: node:crypto and Buffer are shimmed in pure JS.
import { join } from "node:path";
export const browserVerifierOptions = root => ({ platform: "neutral", mainFields: ["module", "main"], format: "esm",
  alias: { "node:crypto": join(root, "web/src/crypto-shim.ts") }, inject: [join(root, "web/src/inject-buffer.ts")] });
