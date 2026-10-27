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

## Run
```bash
node >= 22.6 (no dependencies)
export AGENTGUARD_ADMIN_TOKEN=$(openssl rand -hex 24)
export PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=...      # sandbox app
export LLM_API_KEY=...   # optional: enables LLM risk analysis (OpenAI-compatible; LLM_BASE_URL, LLM_MODEL)
npm start      # gateway on :8787
npm test       # threat-model test suite
```

### Flow
1. `POST /v1/agents` → agent API key
2. `POST /v1/wallets/setup` → PayPal consent URL (vault the buyer's wallet once)
3. `POST /v1/mandates` → draft; user reviews; `POST /v1/mandates/:id/confirm {mandate_hash}` → signed, active
4. Agent: `POST /v1/agent/payments` or MCP `propose_payment`
5. Escalations: `GET /v1/approvals`, `POST /v1/approvals/:id {approve}`
6. `GET /v1/audit`, `GET /v1/audit/verify`

### MCP
```bash
AGENTGUARD_URL=http://localhost:8787 AGENTGUARD_AGENT_KEY=ag_... AGENTGUARD_AGENT_ID=shopper \
  node --experimental-strip-types src/mcp.ts
```
Give your agent this server **instead of** direct PayPal payment tools.

## License
Apache-2.0
