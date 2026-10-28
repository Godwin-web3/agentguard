#!/usr/bin/env bash
# Live held payment approved with the user's passkey: merchant order over the human-approval threshold ->
# held (needs_human) -> passkey signs the approval statement -> captured -> receipt verified offline against
# the pinned key set (/.well-known/agentguard-keys) and live against PayPal.
# Needs a running AgentGuard, AGENTGUARD_ADMIN_TOKEN, PAYEE, a vaulted wallet for demo-user, PAYPAL_CLIENT_ID/SECRET. Never prints them.
set -euo pipefail
U=${AGENTGUARD_URL:-http://localhost:8787}; A="Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN"; J="Content-Type: application/json"
jqp() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
N="node --no-warnings --experimental-strip-types"; OUT=${OUT:-data/held-live}; mkdir -p "$OUT"
AID="held-$RANDOM"
KEY=$(curl -sf -X POST "$U/v1/agents" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\"}" | jqp "d['api_key']")
MID=$(curl -sf -X POST "$U/v1/mandates" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\",\"purpose\":\"Buy API credits; ask me above 5 USD\",\"ttl_minutes\":120,
  \"constraints\":{\"currency\":\"USD\",\"max_total\":\"25.00\",\"max_transactions\":2,\"payee_allowlist\":[\"$PAYEE\"],\"require_merchant_order\":true,
  \"require_human_approval_over\":\"5.00\",\"sku_allowlist\":[\"AG-CREDITS-10\"],\"allowed_categories\":[\"DIGITAL_GOODS\"],\"max_quantity_per_item\":1}}" | jqp "d['mandate']['mandate_id']")
[ -f data/dev-passkey-demo-user.json ] || $N scripts/dev-passkey.ts register demo-user >/dev/null; $N scripts/dev-passkey.ts sign "$MID" demo-user >/dev/null
OID=$($N scripts/merchant-order.ts '[{"name":"API credits","sku":"AG-CREDITS-10","category":"DIGITAL_GOODS","quantity":1,"unit_amount":"10.00"}]' 0.80)
R=$(curl -s -X POST "$U/v1/agent/payments" -H "Authorization: Bearer $KEY" -H "$J" -d "{\"mandate_id\":\"$MID\",\"agent_id\":\"$AID\",\"idempotency_key\":\"held-$RANDOM\",\"paypal_order_id\":\"$OID\"}")
PID=$(echo "$R" | jqp "d['payment_id']"); APID=$(echo "$R" | jqp "d.get('approval_id') or d.get('approval',{}).get('approval_id')")
echo "mandate $MID | order $OID | payment $PID | status $(echo "$R" | jqp "d['status']") | approval $APID"
echo "--- admin token alone: $(curl -s -X POST "$U/v1/approvals/$APID" -H "$A" -H "$J" -d '{"approve":true}' | jqp "d.get('error')")"
if [ "${APPROVE_VIA:-console}" = console ]; then
  echo "--- passkey approval, clicked through the console (CDP virtual authenticator):"
  APPROVAL_ID="$APID" USER_ID=demo-user $N scripts/e2e-console-approval.ts | sed 's/^/  /'
else echo "--- passkey approval:"; $N scripts/dev-passkey.ts approve "$APID" demo-user | sed 's/^/  /'; fi
# capture runs after the approval resolves; wait for the receipt (and its TSA stamp) before anchoring
for i in $(seq 1 40); do curl -sf "$U/v1/agent/payments/$PID/receipt" -H "Authorization: Bearer $KEY" >| "$OUT/receipt.json" 2>/dev/null && grep -q '"timestamps"' "$OUT/receipt.json" && break; sleep 1; done
echo "--- anchor the audit head (RFC 3161): $(curl -s -X POST "$U/v1/audit/anchor" -H "$A" | jqp "'size=%s root=%s' % (d['statement']['size'], d['statement']['root'][:16]) if d else 'nothing new'")"
curl -sf "$U/v1/agent/payments/$PID/receipt" -H "Authorization: Bearer $KEY" >| "$OUT/receipt.json"
curl -sf "$U/.well-known/agentguard-keys" > "$OUT/agentguard-keys.json"
echo "receipt $(jqp "d['receipt']['receipt_id'] + ' kid=' + d['signature']['kid'] + ' approval.method=' + d['receipt']['approval']['method']" < "$OUT/receipt.json")"
V="$N packages/intent-verifier/src/cli.ts"
echo "--- offline, pinned key set, timestamp + anchor required"; $V "$OUT/receipt.json" --issuer-keys "$OUT/agentguard-keys.json" --payee "$PAYEE" --origin "$U" --require-timestamp --require-anchor | sed 's/^/  /'
echo "--- live re-check with PayPal"; PAYPAL_API_BASE=https://api-m.sandbox.paypal.com $V "$OUT/receipt.json" --issuer-keys "$OUT/agentguard-keys.json" --paypal | grep -E "VALID|paypal\." | sed 's/^/  /'
echo "audit chain: $(curl -sf "$U/v1/audit/verify" -H "$A" | jqp "d")"
