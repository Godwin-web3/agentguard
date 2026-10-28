---
title: Quickstart
description: Verify a real AgentGuard receipt in one minute, then run the gateway locally and give an agent a passkey-signed mandate.
---
# Quickstart

Two parts. The first needs nothing but Node. The second runs AgentGuard on your machine and takes about five minutes.

## 1. Verify a real receipt (1 minute)

This receipt came from a live PayPal sandbox purchase made through the hosted demo. You check it yourself, offline, against the pinned issuer key set. Nothing on the AgentGuard server is trusted.

```sh test:verify
curl -sfO https://agentguard-orcin.vercel.app/samples/receipt-sandbox.json
curl -sf https://agentguard-orcin.vercel.app/.well-known/agentguard-keys -o agentguard-keys.json
npx -y -p @agentguard-dev/intent-verifier intent-verify receipt-sandbox.json \
  --issuer-keys agentguard-keys.json --origin https://agentguard-orcin.vercel.app \
  --require-timestamp --require-anchor
```

You get a line per check (issuer signature, the user's passkey over the mandate, order against mandate, RFC 3161 timestamp, audit-anchor inclusion, AP2 derivation) and exit code `0`. Edit one byte of the receipt and run it again: it fails.

Prefer a browser? Open the [receipt verifier](/receipt?sample=sandbox). It runs the same code client-side.

## 2. Run AgentGuard locally (5 minutes)

You need Node 22.6 or newer and git. SQLite is built in, so there is no database to set up.

```sh
git clone https://github.com/Godwin-web3/agentguard && cd agentguard
npm install
export AGENTGUARD_ADMIN_TOKEN=$(openssl rand -hex 24)
npm start            # http://localhost:8787 (owner console at /console)
```

In a second terminal, with the same `AGENTGUARD_ADMIN_TOKEN` exported, register an agent, draft a mandate, enroll a passkey for the user and sign the mandate with it. The script below uses `scripts/dev-passkey.ts`, a software passkey for scripts and CI. Real users sign in the [owner console](/console) with Touch ID, Windows Hello or a security key.

```sh test:local
U=${AGENTGUARD_URL:-http://localhost:8787}
A="Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN"; J="content-type: application/json"
get() { node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8'))$1"; }   # read one JSON field

# 1. an agent and its API key (shown once)
AGENT_KEY=$(curl -sf -X POST $U/v1/agents -H "$A" -H "$J" -d '{"user_id":"alice","agent_id":"shopper"}' | get .api_key)

# 2. a draft mandate: what the agent may buy, from whom, up to how much
MID=$(curl -sf -X POST $U/v1/mandates -H "$A" -H "$J" -d '{"user_id":"alice","agent_id":"shopper",
  "purpose":"Buy API credits; ask me above 5 USD","ttl_minutes":60,
  "constraints":{"currency":"USD","max_total":"25.00","max_transactions":2,"payee_allowlist":["shop@example.com"],
  "require_merchant_order":true,"require_human_approval_over":"5.00","sku_allowlist":["AG-CREDITS-10"]}}' | get .mandate.mandate_id)

# 3. enroll alice's passkey with a single-use link, then sign the mandate hash with it
node --experimental-strip-types --no-warnings scripts/dev-passkey.ts register alice
node --experimental-strip-types --no-warnings scripts/dev-passkey.ts sign "$MID" alice

# 4. the agent sees an active mandate it can spend against
curl -sf $U/v1/agent/mandates/$MID -H "Authorization: Bearer $AGENT_KEY" | get .status
```

The last line prints `active`. From here the agent proposes payments with its key, and only proposals inside the signed bounds reach PayPal:

```sh
curl -s -X POST $U/v1/agent/payments -H "Authorization: Bearer $AGENT_KEY" -H "$J" \
  -d '{"mandate_id":"'$MID'","agent_id":"shopper","idempotency_key":"order-1","paypal_order_id":"<merchant order id>"}'
```

Paying needs PayPal **sandbox** credentials (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`) and a vaulted buyer wallet. `scripts/sandbox-orders.sh` and `scripts/sandbox-held-approval.sh` run that path end to end, including a held payment approved with the passkey and the receipt verified offline. See [Self-hosting](./self-hosting.md).

## Next

- Give an existing PayPal Agent Toolkit agent a guard: [Toolkit guide](./toolkit.md).
- Accept AgentGuard-paid orders as a merchant: [Merchant verification](./merchant-verification.md).
- Understand what is and is not proven: [Security model](./security.md).
