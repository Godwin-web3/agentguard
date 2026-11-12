---
title: Product search (Channel3)
description: Let the agent find real products through Channel3, bounded by the mandate, while PayPal's order stays the source of truth.
---
# Product search (Channel3)

Agents shop better when they can find real products. AgentGuard integrates [Channel3](https://trychannel3.com), a product catalog API for agentic commerce, so an agent can search millions of products across retailers **inside the limits of the mandate the user signed**.

Channel3 is discovery only. It never authorizes a payment:

1. The agent searches. AgentGuard forwards the query to Channel3 with the mandate's currency and the most one payment may still cost (`min(max_per_transaction, remaining budget)`) as the price ceiling. Each result carries an advisory `mandate_fit` pre-check.
2. The agent asks the merchant for a PayPal order (intent `AUTHORIZE`) whose line item `sku` is the result's `product_id` (`channel3:<id>`).
3. The agent calls `pay_paypal_order`. AgentGuard reads payee, amount and items **from PayPal** and runs every deterministic mandate check, exactly as without Channel3.
4. For line items whose sku is a Channel3 id, AgentGuard also looks up Channel3's cheapest new, in-stock offer. If PayPal's unit price is more than 10% above it, the payment is held for the user's passkey approval (`catalog_price_above_market`). The reference price can only escalate; it can never approve, and a Channel3 outage never blocks a payment the mandate allows.

Every search is appended to the hash-chained audit ledger as `catalog.search`.

## Agent: MCP tool

The AgentGuard MCP server exposes `search_products` (read-only) next to `pay_paypal_order`:

```json
{ "name": "search_products", "arguments": { "mandate_id": "mdt_…", "query": "65W USB-C charger", "limit": 8 } }
```

## Agent: HTTP

```sh
curl -s -X POST $AGENTGUARD_URL/v1/agent/products/search \
  -H "authorization: Bearer $AGENTGUARD_AGENT_KEY" -H 'content-type: application/json' \
  -d '{"mandate_id":"mdt_…","query":"65W USB-C charger"}'
```

The response lists `products[]` with `product_id`, `title`, `brand`, `image`, `offers[]` (retailer, price, availability), `best_offer` and `mandate_fit`, plus `max_price` and `currency` (the ceiling that was applied). Searches count toward the agent's 30 requests/minute limit.

## Owner console

**Product search** in the console runs the same search for any active mandate and shows each product's mandate fit: *fits mandate*, *needs your approval* (above the mandate's approval threshold), or *outside mandate* (with the reason).

## Configuration

| Variable | Default | |
| --- | --- | --- |
| `CHANNEL3_API_KEY` | — | Free developer key from [trychannel3.com/sign-up/developer](https://trychannel3.com/sign-up/developer) (1,000 searches a month). Without it, search returns 503 and the console says it is not configured. |
| `CHANNEL3_BASE_URL` | `https://api.trychannel3.com` | Override for testing. |
| `AGENTGUARD_CATALOG_PRICE_TOLERANCE` | `0.10` | How far above Channel3's cheapest offer a PayPal unit price may be before the payment is held for the user. |
