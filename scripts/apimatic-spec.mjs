// Writes the OpenAPI spec into the APIMatic project (apimatic/src/spec/openapi.json) from docs/openapi.mjs, the same
// source as /openapi.json. test/apimatic.test.ts fails if the committed copy drifts.
import { writeFileSync, readFileSync } from "node:fs";
import { buildOpenApi } from "../docs/openapi.mjs";
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const out = new URL("../apimatic/src/spec/openapi.json", import.meta.url);
writeFileSync(out, JSON.stringify(buildOpenApi(pkg.version), null, 2) + "\n");
console.log("wrote", out.pathname);
