/**
 * Rotate the AgentGuard issuer signing key. The current key is marked retired (still published at
 * /.well-known/agentguard-keys so receipts it signed keep verifying) and a new key becomes active.
 * Run with the server stopped, or use POST /v1/keys/rotate on a running server.
 *   node --experimental-strip-types scripts/rotate-key.ts [--list]
 * Env: AGENTGUARD_KEYRING_FILE (default ./data/issuer-keys.json). Private keys are never printed.
 */
import { KeyRing } from "../src/keys.ts";
const ring = KeyRing.load();
if (process.argv.includes("--list")) console.log(JSON.stringify(ring.jwks().keys.map(({ kid, status, created, retired }) => ({ kid, status, created, retired })), null, 2));
else console.log(JSON.stringify(ring.rotate()));
