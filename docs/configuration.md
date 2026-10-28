---
title: Configuration
description: Every environment variable the server reads.
---
# Configuration

All configuration is environment variables. Nothing is read from a config file.

## Core

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `8787` | Listen port (`src/server.ts`). |
| `AGENTGUARD_PUBLIC_URL` | `http://localhost:$PORT` | Public origin. Used as the WebAuthn origin, RP ID and issuer name unless overridden. |
| `AGENTGUARD_ADMIN_TOKEN` | — | Owner bearer token, 24+ chars. Required. |
| `CRON_SECRET` | — | Bearer for `/api/cron/*` (24+ chars; cron routes reject otherwise). |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | — | PayPal REST app. |
| `PAYPAL_API_BASE` | `https://api-m.sandbox.paypal.com` | Use `https://api-m.paypal.com` for live. |

## Storage and keys

| Variable | Default | Meaning |
|---|---|---|
| `AGENTGUARD_DB` | `./data/agentguard.db` | SQLite path. |
| `AGENTGUARD_DATABASE_URL` | — | `postgres://…`; selects Postgres. |
| `AGENTGUARD_DATABASE_CA` | Supabase root | PEM CA for the Postgres TLS connection. |
| `AGENTGUARD_PG_POOL` | `3` | Pool size per instance. |
| `AGENTGUARD_KEYRING_FILE` | `./data/issuer-keys.json` | Local issuer key ring (mode 0600). |
| `AGENTGUARD_KEYRING_KEY` | — | 32+ char secret; stores the key ring encrypted in the database. Required on Postgres. |
| `AGENTGUARD_SIGNING_KEY` / `AGENTGUARD_KEY_FILE` | — / `./data/signing-key.pem` | Legacy single key; seeds the key ring once. |

## Passkeys

| Variable | Default | Meaning |
|---|---|---|
| `AGENTGUARD_RP_ID` | host of the public URL | WebAuthn RP ID. |
| `AGENTGUARD_RP_NAME` | `AgentGuard` | Shown by the authenticator. |
| `AGENTGUARD_RECOVERY_LOCK_MS` | `259200000` (72 h) | How long a passkey replacement waits before it takes effect. |
| `AGENTGUARD_NOTIFY_WEBHOOK` | — | URL that receives enrollment/recovery notifications. |

## Receipts and audit

| Variable | Default | Meaning |
|---|---|---|
| `AGENTGUARD_ISSUER_NAME` | host of the public URL | `issuer` in receipts. |
| `AGENTGUARD_TSA_URLS` | FreeTSA, Sectigo | `name=url,name=url`. Empty string disables timestamps. |
| `AGENTGUARD_ANCHOR_INTERVAL_MS` | `900000` | Audit anchor interval for long-running servers. `0` disables. |
| `AGENTGUARD_PUBLIC_RECEIPTS` | off | `1` serves `GET /v1/public/receipts/:id`. |

## Agents and risk

| Variable | Default | Meaning |
|---|---|---|
| `AGENTGUARD_AGENT_RATE_LIMIT` | `30` | Agent requests per minute per agent id. |
| `AGENTGUARD_RECOVER_INTERVAL_MS` | `300000` | Maintenance loop interval for long-running servers. |
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` | — / OpenAI / `gpt-4o-mini` | Optional LLM risk analyzer and mandate drafting (`/v1/mandates/draft-from-text`). Advisory only: it can escalate a payment to a human, never approve one that failed a deterministic check. |

## Clients

| Variable | Used by |
|---|---|
| `AGENTGUARD_URL`, `AGENTGUARD_AGENT_KEY`, `AGENTGUARD_AGENT_ID` | `src/mcp.ts` generic MCP server |
| `AGENTGUARD_URL`, `AGENTGUARD_API_KEY`, `AGENTGUARD_AGENT_ID`, `AGENTGUARD_MANDATE_ID` | `agentguard-paypal-mcp` |
| `AGENTGUARD_URL`, `AGENTGUARD_ADMIN_TOKEN` | `scripts/dev-passkey.ts` |
