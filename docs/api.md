---
title: HTTP API
description: Authentication, errors, idempotency and the full endpoint reference generated from the OpenAPI spec.
---
# HTTP API

The machine-readable spec is [`/openapi.json`](/openapi.json) (OpenAPI 3.1). Import it into Postman, Insomnia or a client generator. It is tested against the server's route table, so every route is in it.

## Authentication

| Scheme | Header | Who |
|---|---|---|
| `admin` | `Authorization: Bearer <AGENTGUARD_ADMIN_TOKEN>` | The owner / console |
| `agent` | `Authorization: Bearer ag_…` | An agent key from `POST /v1/agents` |
| `cron` | `Authorization: Bearer <CRON_SECRET>` | The scheduler (Supabase pg_cron or Vercel cron) |
| none | — | Public keys, anchors, enrollment and passkey ceremonies, health |

Wrong or missing tokens get `401 {"error":"unauthorized"}`.

## Conventions

- JSON in and out. Amounts are decimal strings (`"10.80"`), currencies ISO 4217.
- Errors are `{"error": "message"}` with a 4xx/5xx status. `503` while the kill-switch is on.
- `POST /v1/agent/payments` requires an `idempotency_key`. Replaying it with the same proposal returns the original result; with a different proposal it is rejected with `409`.
- Agents are rate limited (`429`), 30 requests per minute by default.

## A payment, end to end

```sh
curl -s -X POST $U/v1/agent/payments -H "authorization: Bearer $AGENT_KEY" -H 'content-type: application/json' -d '{
  "agent_id": "shopper", "mandate_id": "'$MID'", "idempotency_key": "order-1001",
  "paypal_order_id": "5O190127TN364715T", "agent_rationale": "API credits"}'
curl -s $U/v1/agent/payments/$PID -H "authorization: Bearer $AGENT_KEY"
curl -s $U/v1/agent/payments/$PID/receipt -H "authorization: Bearer $AGENT_KEY"
```

The response carries `decision` (`approve`, `reject`, `needs_human`), `reasons` and, once captured, the PayPal ids. See [Payment flow](./payment-flow.md).

## Reference
