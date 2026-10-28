---
title: Self-hosting
description: Run AgentGuard on your own machine or on Vercel with Postgres.
---
# Self-hosting

AgentGuard is one Node process with no framework. Node ≥ 22.6 runs the TypeScript directly (`--experimental-strip-types`).

## Local (SQLite)

```sh
git clone https://github.com/Godwin-web3/agentguard && cd agentguard
npm ci && npm run build:web
cp .env.example .env    # fill in PayPal sandbox credentials and an admin token (24+ chars)
node --env-file=.env --experimental-strip-types --no-warnings src/server.ts   # http://localhost:8787
```

`npm start` runs the same server with whatever is already in the environment. State lives in `./data` (SQLite database `AGENTGUARD_DB`, issuer key ring `AGENTGUARD_KEYRING_FILE`). Back it up; the key ring is what makes old receipts verifiable.

## Vercel + Postgres

The repo deploys as a single Vercel function (`api/index.ts`) plus static pages (`npm run build:vercel`). Set at least:

| Variable | Why |
|---|---|
| `AGENTGUARD_DATABASE_URL` | Postgres connection string. Apply `db/postgres.sql` first. Supabase's CA is pinned; set `AGENTGUARD_DATABASE_CA` for other providers. |
| `AGENTGUARD_KEYRING_KEY` | Secret (32+ chars) that encrypts the issuer key ring stored in the database. Never stored in the database. |
| `AGENTGUARD_ADMIN_TOKEN` | Owner token (24+ chars). |
| `AGENTGUARD_PUBLIC_URL` | Your public origin; also the WebAuthn origin and RP ID. |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API_BASE` | Your PayPal app (sandbox: `https://api-m.sandbox.paypal.com`). |
| `CRON_SECRET` | Bearer token Vercel sends to `/api/cron/*`. |

A serverless function has no timers, so background work is exposed as two routes that need `Authorization: Bearer $CRON_SECRET`:

| Route | Does | Intended schedule |
|---|---|---|
| `/api/cron/anchor` | timestamps pending receipts, anchors the audit-chain head | every 15 min |
| `/api/cron/maintenance` | finalizes passkey recoveries, retries notifications, converges stuck payments with PayPal | every 5 min |

Vercel Hobby allows only daily crons, so `vercel.json` runs each once a day (04:00 and 04:30 UTC) as a fallback and the real schedule comes from Supabase `pg_cron` + `pg_net`, with the secret kept in Supabase Vault:

```sql
create extension if not exists pg_cron; create extension if not exists pg_net;
select vault.create_secret('<CRON_SECRET>', 'agentguard_cron_secret');
select cron.schedule('agentguard-anchor', '*/15 * * * *', $$
  select net.http_post(url := 'https://<domain>/api/cron/anchor',
    headers := jsonb_build_object('Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'agentguard_cron_secret')),
    timeout_milliseconds := 60000) $$);
-- same for 'agentguard-maintenance', '*/5 * * * *', /api/cron/maintenance
```

Serverless instances share state through Postgres; reserve, verify, capture and the audit chain run in one transaction under `pg_advisory_xact_lock`. Free Supabase projects pause after a week without traffic (the maintenance job keeps them awake), and the Vercel function has a 60 s ceiling, so TSA calls use short timeouts.

All variables are listed in [Configuration](./configuration.md).

## Health

`GET /healthz` returns `{ok, db, db_ms}` after a database round-trip (503 if it fails) and reveals no configuration. `GET /health` returns service status.

## Upgrading

The SQLite schema is created and migrated on boot. On Postgres, apply `db/postgres.sql` (idempotent) with `psql "$AGENTGUARD_DATABASE_URL" -f db/postgres.sql` before deploying. Pause first if you want zero in-flight payments:

```sh
curl -s -X POST $U/v1/control/pause -H "authorization: Bearer $T" -H 'content-type: application/json' -d '{"reason":"upgrade"}'
# deploy, then
curl -s -X POST $U/v1/control/resume -H "authorization: Bearer $T"
```
