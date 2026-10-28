#!/usr/bin/env bash
# Live sandbox check. Needs a running AgentGuard (same PayPal app), AGENTGUARD_ADMIN_TOKEN, PAYEE, demo-user with a vaulted
# wallet, and PAYPAL_CLIENT_ID/SECRET in env (merchant/toolkit side). Run from packages/paypal-toolkit after `npm run build`.
set -euo pipefail
U=${AGENTGUARD_URL:-http://localhost:8787}; A="Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN"; J="Content-Type: application/json"
jqp() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
AID="toolkit-agent-$RANDOM"
export AGENTGUARD_URL=$U AGENTGUARD_AGENT_ID=$AID
export AGENTGUARD_API_KEY=$(curl -sf -X POST "$U/v1/agents" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\"}" | jqp "d['api_key']")
export AGENTGUARD_MANDATE_ID=$(curl -sf -X POST "$U/v1/mandates" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\",\"purpose\":\"Buy API credits\",\"ttl_minutes\":60,
  \"constraints\":{\"currency\":\"USD\",\"max_total\":\"40.00\",\"max_transactions\":3,\"payee_allowlist\":[\"$PAYEE\"],\"require_merchant_order\":true,
  \"sku_allowlist\":[\"AG-CREDITS-10\"],\"allowed_categories\":[\"DIGITAL_GOODS\"],\"max_quantity_per_item\":2}}" | jqp "d['mandate']['mandate_id']")
(cd ../.. && N="node --no-warnings --experimental-strip-types" && $N scripts/dev-passkey.ts register demo-user >/dev/null && $N scripts/dev-passkey.ts sign "$AGENTGUARD_MANDATE_ID" demo-user >/dev/null)
echo "mandate $AGENTGUARD_MANDATE_ID (user passkey-signed) for agent $AID"
node --experimental-strip-types --no-warnings scripts/live-agent.ts
