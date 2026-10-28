<p align="center"><a href="https://agentguard-orcin.vercel.app"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/logo/agentguard-logo-dark.svg"><img src="brand/logo/agentguard-logo-light.svg" alt="AgentGuard" height="44"></picture></a></p>

<p align="center"><b>Verifiable intent for agent payments on PayPal.</b><br>
Signed by the user, enforced before money moves, provable afterwards.</p>

<p align="center">
<a href="https://github.com/Godwin-web3/agentguard/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/Godwin-web3/agentguard/actions/workflows/ci.yml/badge.svg"></a>
<a href="https://www.npmjs.com/package/@agentguard-dev/intent-verifier"><img alt="intent-verifier on npm" src="https://img.shields.io/npm/v/@agentguard-dev/intent-verifier?label=intent-verifier&color=cb3837"></a>
<a href="https://www.npmjs.com/package/@agentguard-dev/paypal-toolkit"><img alt="paypal-toolkit on npm" src="https://img.shields.io/npm/v/@agentguard-dev/paypal-toolkit?label=paypal-toolkit&color=cb3837"></a>
<a href="https://www.npmjs.com/package/@agentguard-dev/intent-verifier"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@agentguard-dev/intent-verifier?label=downloads"></a>
<a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue"></a>
</p>

<p align="center">
<a href="https://agentguard-orcin.vercel.app/docs">Docs</a> ·
<a href="https://agentguard-orcin.vercel.app/docs/quickstart">Quickstart</a> ·
<a href="https://agentguard-orcin.vercel.app/docs/api">API reference</a> ·
<a href="https://agentguard-orcin.vercel.app/receipt?sample=sandbox">Verify a real receipt</a> ·
<a href="CHANGELOG.md">Changelog</a>
</p>

---

An AI agent can browse, reason and recommend. With AgentGuard it **cannot spend outside what its user signed**, even if it is fully prompt-injected:

1. The user signs a spending **mandate** with their own **passkey** (WebAuthn): payees, SKUs, per-payment cap, budget, count, time window.
2. The agent can only *propose* a payment, by PayPal order id. A deterministic policy engine checks **PayPal's own view of the order** against the signed mandate. Payments over a threshold wait for the user's passkey.
3. AgentGuard authorizes the user's vaulted PayPal wallet, re-verifies, then captures, or voids on any mismatch.
4. Every capture gets a signed **Proof-of-Intent receipt**, RFC 3161 timestamped and anchored in a published Merkle log. Merchants verify it offline and can attach it to a PayPal dispute. Each receipt also carries the purchase as [AP2](https://github.com/google-agentic-commerce/AP2) mandates.

## Packages

| Package | For | Install |
|---|---|---|
| [`@agentguard-dev/intent-verifier`](packages/intent-verifier) | Merchants: verify receipts offline, build PayPal dispute evidence. Zero dependencies. CLI `intent-verify`. | `npm i @agentguard-dev/intent-verifier` |
| [`@agentguard-dev/paypal-toolkit`](packages/paypal-toolkit) | Agent builders: wrap [PayPal's Agent Toolkit](https://www.npmjs.com/package/@paypal/agent-toolkit) (Vercel AI SDK, OpenAI, MCP) so money only moves through AgentGuard. | `npm i @agentguard-dev/paypal-toolkit @paypal/agent-toolkit` |

## Verify a real receipt (1 minute)

```sh
curl -sfO https://agentguard-orcin.vercel.app/samples/receipt-sandbox.json
curl -sf https://agentguard-orcin.vercel.app/.well-known/agentguard-keys -o agentguard-keys.json
npx -p @agentguard-dev/intent-verifier intent-verify receipt-sandbox.json --issuer-keys agentguard-keys.json \
  --origin https://agentguard-orcin.vercel.app --require-timestamp --require-anchor
```

## Guard an agent

```ts
import { PayPalAgentToolkit, ALL_TOOLS_ENABLED } from "@paypal/agent-toolkit/ai-sdk";
import { guardTools } from "@agentguard-dev/paypal-toolkit/ai-sdk";

const toolkit = new PayPalAgentToolkit({ clientId, clientSecret, configuration: { actions: ALL_TOOLS_ENABLED, context: { sandbox: true } } });
const tools = guardTools(toolkit, { url: AGENTGUARD_URL, apiKey: AGENT_KEY, agentId: "shopper", mandateId: MANDATE_ID });
// pay_order now goes through AgentGuard; refunds, disputes, invoices etc. are removed.
```

OpenAI and MCP: see the [toolkit guide](https://agentguard-orcin.vercel.app/docs/toolkit).

## Run the gateway

```sh
git clone https://github.com/Godwin-web3/agentguard && cd agentguard
npm ci && npm run build:web
cp .env.example .env     # PayPal sandbox app + an admin token (24+ chars)
node --env-file=.env --experimental-strip-types --no-warnings src/server.ts   # http://localhost:8787/console
```

Node ≥ 22.6. SQLite locally; Supabase Postgres + Vercel in production ([self-hosting](https://agentguard-orcin.vercel.app/docs/self-hosting)). The [quickstart](https://agentguard-orcin.vercel.app/docs/quickstart) walks from an empty server to an active, passkey-signed mandate with curl; that script runs in CI.

## Threat model

| Attack | Defence |
|---|---|
| Indirect prompt injection → extra purchases | Category, quantity, total, count limits; injection signals escalate to human |
| Spending escalation | Deterministic per-tx and total limits, atomic reservations (`BEGIN IMMEDIATE`) |
| Concurrent double-spend of budget | Serialized reservation under a write lock |
| Duplicate execution / replay | Idempotency keys bound to a proposal hash; PayPal-Request-Id on every money call |
| Approval reuse or swap | Single-use approvals bound to the exact proposal hash, 15-min TTL; decision signed by the user's passkey over payment, order, amount, decision and a single-use 5-min nonce |
| Mandate tampering or forged consent | User's passkey signs the canonical mandate hash (it is the WebAuthn challenge); the server re-verifies that signature against the stored public key on every proposal, approval and capture. An admin token alone cannot activate or revoke a mandate |
| Agent impersonation | Per-agent API keys; proposals must match the authenticated agent |
| Merchant substitution | Payee allowlist + verification of the payee PayPal reports on the order |
| Revocation race | Status re-checked under lock, after approval, and again before capture |
| Crash between authorize and capture | Recovery loop queries PayPal and converges; never captures if mandate is no longer active |

What a receipt does **not** prove (fulfilment), what is attested by the issuer rather than checked independently, and the remaining limits are spelled out in [Security](https://agentguard-orcin.vercel.app/docs/security), [Receipts](https://agentguard-orcin.vercel.app/docs/receipts) and [Anchoring](https://agentguard-orcin.vercel.app/docs/anchoring).

**Live sandbox proof.** A real receipt was submitted as seller evidence on PayPal sandbox dispute `PP-R-QXA-10194904`; PayPal accepted it and moved the case to `UNDER_REVIEW` ([details](https://agentguard-orcin.vercel.app/docs/disputes)). No outcome is claimed.

## Documentation

| | |
|---|---|
| Concepts | [Mandates](https://agentguard-orcin.vercel.app/docs/mandates) · [Passkeys](https://agentguard-orcin.vercel.app/docs/passkeys) · [Payment flow](https://agentguard-orcin.vercel.app/docs/payment-flow) · [Receipts](https://agentguard-orcin.vercel.app/docs/receipts) · [Anchoring](https://agentguard-orcin.vercel.app/docs/anchoring) · [AP2](https://agentguard-orcin.vercel.app/docs/ap2) · [Disputes](https://agentguard-orcin.vercel.app/docs/disputes) |
| Guides | [Toolkit guard](https://agentguard-orcin.vercel.app/docs/toolkit) · [Merchant verification](https://agentguard-orcin.vercel.app/docs/merchant-verification) · [Dispute evidence](https://agentguard-orcin.vercel.app/docs/dispute-evidence) · [Self-hosting](https://agentguard-orcin.vercel.app/docs/self-hosting) · [Key rotation](https://agentguard-orcin.vercel.app/docs/key-rotation) |
| Reference | [HTTP API](https://agentguard-orcin.vercel.app/docs/api) ([openapi.json](https://agentguard-orcin.vercel.app/openapi.json)) · [CLI](https://agentguard-orcin.vercel.app/docs/cli) · [Package API](https://agentguard-orcin.vercel.app/docs/packages) · [Configuration](https://agentguard-orcin.vercel.app/docs/configuration) |

The docs source is in [`docs/`](docs); every page has an edit link.

## Repository layout

| Path | |
|---|---|
| `src/` | Gateway: policy engine, PayPal rail, passkeys, receipts, audit chain, HTTP server, MCP server |
| `packages/intent-verifier` | Offline verifier + CLI (published) |
| `packages/paypal-toolkit` | PayPal Agent Toolkit guard (published) |
| `web/` | Landing page, owner console, receipt viewer, brand page |
| `docs/` | Documentation site and OpenAPI source |
| `db/postgres.sql` | Postgres schema (RLS on, append-only audit) |
| `scripts/` | Builds, sandbox end-to-end scripts, dev passkey, key rotation |
| `test/` | Threat-model, receipts, AP2, anchoring, Postgres and docs tests |

## Development

```sh
npm run typecheck && npm run lint && npm test
AGENTGUARD_TEST_PG=postgres://… npm run test:pg   # same suite on Postgres
npm run test:toolkit
```

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: please report privately, see [SECURITY.md](SECURITY.md).

## License

[Apache-2.0](LICENSE)
