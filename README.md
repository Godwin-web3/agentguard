# AgentGuard

**Financial authorization for AI agents that pay through PayPal.**
An agent can browse, reason and recommend. It cannot spend outside the authority its user delegated, even if it is fully compromised by prompt injection.

## Why
Agentic commerce gives agents a live payment capability. Detection of prompt injection is probabilistic; money movement must not be. AgentGuard separates *proposing* a payment from *having the authority to execute it*:

- Agents never hold PayPal credentials. They hold an AgentGuard key and call `propose_payment` (HTTP or MCP).
- Every proposal is checked by a **deterministic policy engine** against a **user-confirmed, Ed25519-signed spending mandate** (in the spirit of AP2 intent mandates).
- AI risk analysis is **advisory only**: it can escalate a passing payment to a human, never approve a failing one.
- Execution uses PayPal Orders v2 **`intent: AUTHORIZE`** against the user's vaulted PayPal wallet, verifies PayPal's own view of amount, currency and payee, then **captures**, or **voids** on any mismatch or revocation.
- Every decision lands in a **hash-chained, append-only audit log**.

## Threat model covered (see `test/gateway.test.ts`)
| Attack | Defence |
|---|---|
| Indirect prompt injection → extra purchases | Category, quantity, total, count limits; injection signals escalate to human |
| Spending escalation | Deterministic per-tx and total limits, atomic reservations (`BEGIN IMMEDIATE`) |
| Concurrent double-spend of budget | Serialized reservation under a write lock |
| Duplicate execution / replay | Idempotency keys bound to a proposal hash; PayPal-Request-Id on every money call |
| Approval reuse or swap | Single-use approvals bound to the exact proposal hash, 15-min TTL |
| Mandate tampering | Signature over canonical mandate hash, verified on every proposal |
| Agent impersonation | Per-agent API keys; proposals must match the authenticated agent |
| Merchant substitution | Payee allowlist + verification of the payee PayPal reports on the order |
| Revocation race | Status re-checked under lock, after approval, and again before capture |
| Crash between authorize and capture | Recovery loop queries PayPal and converges; never captures if mandate is no longer active |

## Run
```bash
node >= 22.6 (no dependencies)
export AGENTGUARD_ADMIN_TOKEN=$(openssl rand -hex 24)
export PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=...      # sandbox app
export LLM_API_KEY=...   # optional: LLM risk analysis + mandate drafting (OpenAI-compatible; LLM_BASE_URL, LLM_MODEL)
npm start      # gateway + owner console on http://localhost:8787/console
npm test       # threat-model test suite
```

### Flow
1. `POST /v1/agents` → agent API key
2. `POST /v1/wallets/setup` → PayPal consent URL (vault the buyer's wallet once)
3. `POST /v1/mandates/draft-from-text {user_id, agent_id, text}` (or structured `POST /v1/mandates`) → draft + plain-English summary; user reviews; `POST /v1/mandates/:id/confirm {mandate_hash}` → signed, active
4. Agent: `POST /v1/agent/payments` or MCP `propose_payment`
5. Escalations: `GET /v1/approvals`, `POST /v1/approvals/:id {approve}`
6. `GET /v1/audit`, `GET /v1/audit/verify`

### Recovery
The process is safe to restart. On startup and every 5 minutes (override with `AGENTGUARD_RECOVER_INTERVAL_MS`) AgentGuard scans for payments still in `reserved` or `authorized` older than 60 seconds and converges them with PayPal:

- `reserved` with no authorization id → marked failed (hold released). Never reached PayPal.
- `authorized` where PayPal reports CAPTURED → synced to captured.
- `authorized` where PayPal reports VOIDED, EXPIRED, or DENIED → synced to voided.
- `authorized` where PayPal returns 404 → marked voided (authorization expired or purged).
- `authorized` still open and the mandate is active → capture is finished.
- `authorized` still open and the mandate is no longer active → voided. Recovery never captures against an inactive mandate.
- Any other error (network, 5xx, rate limit) → logged and left for the next interval.

Operators can inspect and trigger on demand (admin token required):
```bash
curl -H "Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN" http://localhost:8787/v1/payments/stuck
curl -X POST -H "Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN" -H "content-type: application/json" \
  -d '{"older_than_ms": 60000}' http://localhost:8787/v1/recover
```

### Owner console
`/console` (admin token required): describe a mandate in plain English, review the code-rendered summary, sign it;
approve or deny escalated payments from the inbox; browse mandates, payments and the hash-chained audit ledger in AG Grid;
one-click chain verification.

### Plain-English mandates, without trusting the model
The AI only proposes. A deterministic parser reads the same sentence, and wherever both produce a limit the **tighter one wins**
(disagreements are shown as warnings). Payees the model suggests that aren't in the user's text are dropped. Anything unstated
defaults tight (1 payment, 60-minute expiry). The summary the user signs is rendered by code from the final constraints, never written
by the model. See `test/drafter.test.ts` for a model that tries to raise a $900 cap to $9,000 and add an attacker payee.

### Verified against PayPal sandbox
`scripts/sandbox-smoke.sh` runs the live path end to end: register agent → link vaulted wallet → plain-English mandate → sign →
in-policy payment (AUTHORIZE → verify → capture), off-allowlist payee (rejected, PayPal never called), over-threshold payment
(held for approval, captured after approval), and prompt-injected context (held). Note: the sandbox merchant must be in a country
that can receive PayPal payments (e.g. US); Nigerian business accounts cannot.

### MCP
```bash
AGENTGUARD_URL=http://localhost:8787 AGENTGUARD_AGENT_KEY=ag_... AGENTGUARD_AGENT_ID=shopper \
  node --experimental-strip-types src/mcp.ts
```
Give your agent this server **instead of** direct PayPal payment tools.

## License
Apache-2.0
