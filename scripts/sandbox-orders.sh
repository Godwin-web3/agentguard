#!/usr/bin/env bash
# Live proof that the merchant's PayPal order, not the agent, is the source of truth.
# Needs a running AgentGuard (same PayPal app as the merchant), AGENTGUARD_ADMIN_TOKEN, PAYEE, a vaulted wallet for demo-user,
# and PAYPAL_CLIENT_ID/SECRET in the env for scripts/merchant-order.ts (load with: set -a; . ./.env.paypal; set +a).
set -euo pipefail
U=${AGENTGUARD_URL:-http://localhost:8787}; A="Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN"; J="Content-Type: application/json"
jqp() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
N="node --no-warnings --experimental-strip-types"
AID="orders-$RANDOM"
KEY=$(curl -sf -X POST "$U/v1/agents" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\"}" | jqp "d['api_key']")
D=$(curl -sf -X POST "$U/v1/mandates" -H "$A" -H "$J" -d "{\"user_id\":\"demo-user\",\"agent_id\":\"$AID\",\"purpose\":\"Buy API credits from my provider\",\"ttl_minutes\":120,
  \"constraints\":{\"currency\":\"USD\",\"max_total\":\"50.00\",\"max_transactions\":3,\"payee_allowlist\":[\"$PAYEE\"],\"require_merchant_order\":true,
  \"sku_allowlist\":[\"AG-CREDITS-10\"],\"allowed_categories\":[\"DIGITAL_GOODS\"],\"max_quantity_per_item\":2}}")
MID=$(echo "$D" | jqp "d['mandate']['mandate_id']")
$N scripts/dev-passkey.ts register demo-user >/dev/null; $N scripts/dev-passkey.ts sign "$MID" demo-user >/dev/null
echo "mandate $MID signed by user passkey"
show() { jqp "f\"{str(d.get('decision')):12} {str(d.get('status')):10} order={d.get('paypal',{}).get('order_id')} auth={d.get('paypal',{}).get('authorization_id')} capture={d.get('paypal',{}).get('capture_id')} {d.get('evaluation',{}).get('reasons') or d.get('error')}\""; }
order_pay() { curl -s -X POST "$U/v1/agent/payments" -H "Authorization: Bearer $KEY" -H "$J" -d "{\"mandate_id\":\"$MID\",\"agent_id\":\"$AID\",\"idempotency_key\":\"$1\",\"paypal_order_id\":\"$2\"}"; }
OK=$($N scripts/merchant-order.ts '[{"name":"API credits","sku":"AG-CREDITS-10","category":"DIGITAL_GOODS","quantity":1,"unit_amount":"10.00"}]' 0.80)
BADSKU=$($N scripts/merchant-order.ts '[{"name":"API credits","sku":"GIFTCARD-100","category":"DIGITAL_GOODS","quantity":1,"unit_amount":"10.00"}]')
BADCAT=$($N scripts/merchant-order.ts '[{"name":"API credits","sku":"AG-CREDITS-10","category":"PHYSICAL_GOODS","quantity":5,"unit_amount":"2.00"}]')
echo "ALLOW  order $OK (sku ok, +tax):     $(order_pay ok-$RANDOM "$OK" | show)"
echo "DENY   order $BADSKU (sku):          $(order_pay sku-$RANDOM "$BADSKU" | show)"
echo "DENY   order $BADCAT (cat+qty):      $(order_pay cat-$RANDOM "$BADCAT" | show)"
echo "DENY   reuse of $OK:                 $(order_pay re-$RANDOM "$OK" | show)"
echo "DENY   agent-declared same item:     $(curl -s -X POST "$U/v1/agent/payments" -H "Authorization: Bearer $KEY" -H "$J" -d "{\"mandate_id\":\"$MID\",\"agent_id\":\"$AID\",\"idempotency_key\":\"decl-$RANDOM\",\"payee\":{\"email_address\":\"$PAYEE\"},\"currency\":\"USD\",\"items\":[{\"name\":\"API credits\",\"sku\":\"AG-CREDITS-10\",\"quantity\":1,\"unit_amount\":\"10.00\",\"category\":\"DIGITAL_GOODS\"}]}" | show)"
echo "DENY   order id + agent payee:       $(curl -s -X POST "$U/v1/agent/payments" -H "Authorization: Bearer $KEY" -H "$J" -d "{\"mandate_id\":\"$MID\",\"agent_id\":\"$AID\",\"idempotency_key\":\"mix-$RANDOM\",\"paypal_order_id\":\"$BADSKU\",\"payee\":{\"email_address\":\"$PAYEE\"}}" | jqp "d.get('error')")"
echo "audit chain: $(curl -sf "$U/v1/audit/verify" -H "$A" | jqp "d")"
