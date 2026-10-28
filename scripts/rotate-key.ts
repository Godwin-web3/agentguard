/**
 * Rotate the AgentGuard issuer signing key. The current key is marked retired (still published at
 * /.well-known/agentguard-keys so receipts it signed keep verifying) and a new key becomes active.
 * Run with the server stopped, or use POST /v1/keys/rotate (or /v1/keys/:kid/compromised) on a running server.
 *   node --experimental-strip-types scripts/rotate-key.ts [--list]
 *   node --experimental-strip-types scripts/rotate-key.ts --compromised <kid> [--at <ISO time>]
 *     Marks the key compromised as of --at (default now), rotating first if it is active. Receipts it signed
 *     only keep verifying if an RFC 3161 timestamp proves they existed before that instant.
 * Env: AGENTGUARD_KEYRING_FILE (default ./data/issuer-keys.json). Private keys are never printed.
 */
import { KeyRing } from "../src/keys.ts";
const ring = KeyRing.load(); const a = process.argv;
const ci = a.indexOf("--compromised"), ai = a.indexOf("--at");
if (a.includes("--list")) console.log(JSON.stringify(ring.jwks().keys.map(({ kid, status, created, retired, compromised_at }) => ({ kid, status, created, retired, compromised_at })), null, 2));
else if (ci >= 0) console.log(JSON.stringify(ring.markCompromised(a[ci + 1], ai >= 0 ? new Date(a[ai + 1]) : new Date())));
else console.log(JSON.stringify(ring.rotate()));
