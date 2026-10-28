#!/usr/bin/env bash
# Live Proof-of-Intent: merchant order -> agent pays under a passkey-signed mandate -> signed receipt ->
# merchant verifies offline (pinned key) and live against PayPal with its own keys -> dispute evidence package.
# Needs a running AgentGuard on this branch, AGENTGUARD_ADMIN_TOKEN, PAYEE, a vaulted wallet for demo-user,
# and PAYPAL_CLIENT_ID/SECRET in the env (set -a; . ./.env.paypal; set +a). Never prints them.
set -euo pipefail
U=${AGENTGUARD_URL:-http://localhost:8787}; A="Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN"; J="Content-Type: application/json"
jqp() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
N="node --no-warnings --experimental-strip-types"; OUT=${OUT:-data/poi-live}; mkdir -p "$OUT"
AID="poi-$RANDOM"
KEY=$(curl -sf -X POST "$U/v1/agents" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\"}" | jqp "d['api_key']")
MID=$(curl -sf -X POST "$U/v1/mandates" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\",\"purpose\":\"Buy 10 API credits from my provider\",\"ttl_minutes\":120,
  \"constraints\":{\"currency\":\"USD\",\"max_total\":\"25.00\",\"max_transactions\":2,\"payee_allowlist\":[\"$PAYEE\"],\"require_merchant_order\":true,
  \"sku_allowlist\":[\"AG-CREDITS-10\"],\"allowed_categories\":[\"DIGITAL_GOODS\"],\"max_quantity_per_item\":1}}" | jqp "d['mandate']['mandate_id']")
$N scripts/dev-passkey.ts register demo-user >/dev/null 2>&1 || true; $N scripts/dev-passkey.ts sign "$MID" demo-user >/dev/null
OID=$($N scripts/merchant-order.ts '[{"name":"API credits","sku":"AG-CREDITS-10","category":"DIGITAL_GOODS","quantity":1,"unit_amount":"10.00"}]' 0.80)
R=$(curl -s -X POST "$U/v1/agent/payments" -H "Authorization: Bearer $KEY" -H "$J" -d "{\"mandate_id\":\"$MID\",\"agent_id\":\"$AID\",\"idempotency_key\":\"poi-$RANDOM\",\"paypal_order_id\":\"$OID\"}")
PID=$(echo "$R" | jqp "d['payment_id']")
echo "mandate $MID | order $OID | $(echo "$R" | jqp "f\"{d['status']} auth={d['paypal']['authorization_id']} capture={d['paypal']['capture_id']}\"")"
curl -sf "$U/v1/agent/payments/$PID/receipt" -H "Authorization: Bearer $KEY" > "$OUT/receipt.json"
MCPR=$(printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"sh","version":"1"}}}' "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/call\",\"params\":{\"name\":\"get_payment_receipt\",\"arguments\":{\"payment_id\":\"$PID\"}}}" | AGENTGUARD_URL=$U AGENTGUARD_AGENT_KEY=$KEY $N src/mcp.ts | tail -1)
echo "MCP get_payment_receipt: $(echo "$MCPR" | jqp "json.loads(d['result']['content'][0]['text'])['receipt']['receipt_id']") (same bytes as API: $(echo "$MCPR" | jqp "json.loads(d['result']['content'][0]['text'])==json.load(open('$OUT/receipt.json'))"))"
curl -sf "$U/.well-known/agentguard-key" > "$OUT/issuer-key.json"
echo "receipt $(jqp "d['receipt']['receipt_id'] + ' invoice_id=' + str(d['receipt']['payment']['paypal_invoice_id'])" < "$OUT/receipt.json") -> $OUT/receipt.json"
V="$N packages/intent-verifier/src/cli.ts"
echo "--- merchant: offline, pinned issuer key"; $V "$OUT/receipt.json" --issuer-key "$OUT/issuer-key.json" --payee "$PAYEE" --origin "$U" | sed 's/^/  /'
echo "--- merchant: live re-check with PayPal (merchant keys)"; PAYPAL_API_BASE=https://api-m.sandbox.paypal.com $V "$OUT/receipt.json" --issuer-key "$OUT/issuer-key.json" --paypal | grep -E "VALID|paypal\." | sed 's/^/  /'
python3 - "$OUT" <<'PY'
import json,sys; d=json.load(open(sys.argv[1]+"/receipt.json")); d["receipt"]["order"]["snapshot"]["purchase_units"][0]["amount"]["value"]="1.00"; json.dump(d,open(sys.argv[1]+"/tampered.json","w"))
PY
echo "--- tampered copy (amount edited)"; $V "$OUT/tampered.json" --issuer-key "$OUT/issuer-key.json" | grep -E "INVALID|✗" | sed 's/^/  /' || true
echo "--- dispute evidence"; $V evidence "$OUT/receipt.json" --issuer-key "$OUT/issuer-key.json" --out "$OUT/evidence" | tail -1
echo "audit chain: $(curl -sf "$U/v1/audit/verify" -H "$A" | jqp "d")"
