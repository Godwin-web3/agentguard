# AgentGuard

**Dispute-proof agent purchases on PayPal.**
When an AI agent pays a merchant, AgentGuard hands both sides a signed **Proof-of-Intent receipt**: cryptographic evidence that *the user* authorized *this exact order*, checked by a deterministic policy, and that this is the capture PayPal settled. The merchant verifies it offline, with no dependency on AgentGuard, using [`@agentguard/intent-verifier`](packages/intent-verifier).

Underneath, AgentGuard is financial authorization for agents: an agent can browse, reason and recommend, but it cannot spend outside the authority its user delegated, even if it is fully compromised by prompt injection.

## Proof-of-Intent receipts
Every payment captured against a merchant's PayPal order gets a receipt (`agentguard.proof-of-intent/v1`): canonical JSON plus a detached Ed25519 signature. It binds:

| Section | What it proves |
|---|---|
| `mandate` | The mandate body, its hash, and the user's **WebAuthn assertion** over that hash, with credential ID and COSE public key. Verifiable without the server. |
| `order` | The exact PayPal order snapshot (payee, amount, currency, items/SKUs) the decision was made on, and its digest. |
| `decision` | Policy outcome, rule results, agent ID, idempotency key and the proposal hash binding mandate + agent + order. |
| `approval` | Any human approval: who, when, and the audit entry that recorded it. |
| `payment` | Authorization ID, capture ID, capture status, amount, timestamps, and the `AGPOI-<receipt_id>` reference written on the PayPal capture as `invoice_id`. |
| `audit` | Sequence number and hash of the capture entry in the hash-chained audit log. |

Get it via `GET /v1/agent/payments/:id/receipt` (agent), `GET /v1/payments/:id/receipt` / `GET /v1/receipts/:id` (admin), the MCP tool `get_payment_receipt`, or, if `AGENTGUARD_PUBLIC_RECEIPTS=1`, `GET /v1/public/receipts/:id`. Issuer keys are published as a key set at `/.well-known/agentguard-keys` (each key's `kid`, `created_at`, `retired_at`); receipts carry `signature.kid`. The legacy `/.well-known/agentguard-key` still returns the active key.

```sh
intent-verify receipt.json --issuer-keys agentguard-keys.json --payee you@shop.example   # offline, pinned key set
intent-verify receipt.json --issuer-key issuer-key.json                               # single pinned key
PAYPAL_CLIENT_ID=… PAYPAL_CLIENT_SECRET=… intent-verify receipt.json --issuer-key issuer-key.json --paypal  # + live re-check with your own keys
intent-verify evidence receipt.json --out evidence/ [--submit PP-D-…]                # PayPal provide-evidence package (PDF + input JSON)
```

Tampered receipts, swapped orders, forged mandates and wrong issuer keys all fail (`test/receipts.test.ts`). Live sandbox run: `scripts/sandbox-receipt.sh`.

**What a receipt is not.** It is *evidence*, not a guaranteed dispute or chargeback win: PayPal and card networks decide disputes on their own rules, and "item not received" or "not as described" claims are about fulfilment, which no payment receipt proves. Be precise about what is attested by whom:
- Checked independently by the verifier: the passkey signature over the mandate, the order/mandate match, and, for held payments, the passkey signature over the approval statement (payment, order, amount, decision, nonce, expiry). Everything else (decision, cumulative spend, audit position, enrollment provenance) is **attested by the issuer key**, so **pin the key set** (`--issuer-keys`) rather than trusting the key embedded in the receipt. The verifier rejects unknown kids and receipts signed by a key after its `retired_at`.
- Approvals are passkey-signed (`approval.method: "passkey"`). Receipts from before this change show `admin_token` and fail `approval.method` unless you pass `--allow-admin-approval`.
- The passkey proves the *holder of that credential* signed. Binding it to a real person happens at enrollment: whoever holds a valid enrollment link (issued with the admin token) enrolls the passkey. `mandate.passkey.enrollment` on the receipt records who issued it and whether it replaced an earlier passkey, and the verifier warns on replacements.
- Rotation does not protect against a key that leaked *before* it was retired: anything signed while it was active stays valid. Retire promptly and rotate the admin token too.

## AP2 compatibility: AP2-style verifiable intent, enforced and dispute-ready on PayPal, today
Every receipt also carries an `ap2` block: the same purchase expressed as [Agent Payments Protocol (AP2)](https://github.com/google-agentic-commerce/AP2) mandates, using the JSON shapes in AP2's `code/sdk/schemas/ap2` (pinned to commit `e1ea56d`, Apr 2026). AP2 v0.1 called these the Intent / Cart / Payment Mandates; the current spec splits intent into Open Checkout + Open Payment Mandates and calls the cart a Checkout Mandate. AgentGuard emits the current shapes under the v0.1 role names:

| AP2 role | AP2 object (`vct`) | Built from | Fidelity |
|---|---|---|---|
| Intent Mandate | `open_checkout_mandate` (`mandate.checkout.open.1`): `checkout.allowed_merchants`, `checkout.line_items` | passkey-signed mandate: payee allowlist, SKU allowlist, max qty | Exact when `sku_allowlist` is set; otherwise line items come from the order (`agentguard_constraint_source: "order_items"`) |
| Intent Mandate | `open_payment_mandate` (`mandate.payment.open.1`): `payment.reference`, `amount_range`, `budget`, `agent_recurrence`, `execution_date`, `allowed_payees` | mandate limits and window | Exact mapping of per-tx cap, total budget, count, window. Categories and blocklists have no AP2 constraint and stay AgentGuard-only |
| Cart Mandate | `checkout_mandate` (`mandate.checkout.1`): `checkout_jwt`, `checkout_hash` | the merchant-created PayPal order AgentGuard read and verified | Shape exact; `checkout_jwt` is an **unsecured JWT (`alg: none`)** of PayPal's order, not a merchant-signed JWS |
| Payment Mandate | `payment_mandate` (`mandate.payment.1`): `transaction_id` = `checkout_hash`, `payee`, `payment_amount` (minor units), `payment_instrument` | decision + PayPal authorization | Exact. Instrument is `PAYPAL_WALLET`; the vault token is never included |
| Receipts | `checkout_receipt`, `payment_receipt` (`reference` = hash of the closed mandate, `psp_confirmation_id` = PayPal capture id) | capture | `network_confirmation_id` holds the PayPal authorization id (PayPal is PSP and network) |

Hashes follow AP2: `checkout_hash` = base64url(sha256(checkout_jwt)); `payment.reference.conditional_transaction_id` = base64url(sha256(canonical(open checkout mandate))). Every AP2 object also carries `agentguard_mandate_hash`, which pins it to the mandate the user's passkey signed.

`intent-verify` checks the AP2 views automatically: they must **recompute exactly** from the signed receipt (`ap2.derivation`), and the chain must hold (open payment mandate → open checkout mandate, checkout hash → PayPal order, payment mandate → checkout, amount within `amount_range`, payee allowed, receipts → capture). An edited view fails even if the attacker re-signs the whole receipt with their own key (`test/ap2.test.ts`). `intent-verify ap2 receipt.json` prints the AP2 block.

**What is approximated, honestly:**
- **No SD-JWT.** AP2 mandates are SD-JWT VCs with key-binding JWTs and selective disclosure. These are plain JSON claim sets, authenticated by AgentGuard's Ed25519 issuer signature on the receipt.
- **User signature format differs.** The user signs with a WebAuthn passkey over sha256(canonical(AgentGuard mandate)) (`ap2.user_authorization`), not over the AP2 open mandates. The open mandates are deterministically derived from that signed mandate, and the verifier re-derives them, so the authority is the same but the bytes the user signed are AgentGuard's.
- **Merchant authenticity comes from PayPal's API**, not a merchant JWS: AgentGuard fetches the merchant-created order from PayPal (`GET /v2/checkout/orders/{id}`), and `--paypal` re-checks it with the merchant's own keys.
- `cnf` is `{ kid: "agentguard-agent:<agent_id>" }`, not an agent JWK. AgentGuard does not speak AP2's A2A/MCP message flows; it emits AP2-shaped evidence for a PayPal checkout.

The point: AP2 defines *how to express* verifiable intent; AgentGuard *enforces* it before PayPal moves money and hands the merchant a receipt they can use in a dispute.

## Why
Agentic commerce gives agents a live payment capability. Detection of prompt injection is probabilistic; money movement must not be. AgentGuard separates *proposing* a payment from *having the authority to execute it*:

- Agents never hold PayPal credentials. They hold an AgentGuard key and call `propose_payment` (HTTP or MCP).
- Every proposal is checked by a **deterministic policy engine** against a spending mandate **signed by the user's own passkey** (WebAuthn, in the spirit of AP2 intent mandates). The server holds no key that can authorize spending; its Ed25519 key only signs audit attestations and Proof-of-Intent receipts.
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
| Approval reuse or swap | Single-use approvals bound to the exact proposal hash, 15-min TTL; decision signed by the user's passkey over payment, order, amount, decision and a single-use 5-min nonce |
| Mandate tampering or forged consent | User's passkey signs the canonical mandate hash (it is the WebAuthn challenge); the server re-verifies that signature against the stored public key on every proposal, approval and capture. An admin token alone cannot activate or revoke a mandate |
| Agent impersonation | Per-agent API keys; proposals must match the authenticated agent |
| Merchant substitution | Payee allowlist + verification of the payee PayPal reports on the order |
| Revocation race | Status re-checked under lock, after approval, and again before capture |
| Crash between authorize and capture | Recovery loop queries PayPal and converges; never captures if mandate is no longer active |

## Run
```bash
node >= 22.6; one runtime dependency (@simplewebauthn/server)
npm install
export AGENTGUARD_ADMIN_TOKEN=$(openssl rand -hex 24)
export PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=...      # sandbox app
export PUBLIC_URL=https://agentguard.example.com   # WebAuthn origin; RP ID defaults to its hostname (AGENTGUARD_RP_ID)
export LLM_API_KEY=...   # optional: LLM risk analysis + mandate drafting (OpenAI-compatible; LLM_BASE_URL, LLM_MODEL)
npm start      # gateway + owner console on http://localhost:8787/console
npm test       # threat-model test suite
```

### Flow
1. `POST /v1/agents` → agent API key
2. `POST /v1/wallets/setup` → PayPal consent URL (vault the buyer's wallet once)
3. `POST /v1/mandates/draft-from-text {user_id, agent_id, text}` (or structured `POST /v1/mandates`) → draft + plain-English summary; user reviews the exact mandate JSON and signs it with their passkey (`POST /v1/mandates/:id/sign-request` → `navigator.credentials.get` with the mandate hash as challenge → `POST /v1/mandates/:id/confirm {mandate_hash, assertion}`) → active
4. Agent: `POST /v1/agent/payments` or MCP `propose_payment`
5. Escalations: `GET /v1/approvals`, `POST /v1/approvals/:id/request {approve}` → statement + WebAuthn options (challenge = base64url sha256(`"agentguard:approval:v1:"` + canonical(statement)), 5-min nonce) → `POST /v1/approvals/:id {approve, assertion}`. The admin token alone cannot approve or deny.
6. `GET /v1/audit`, `GET /v1/audit/verify`

### User passkeys (what is and isn't enforced)
- One passkey per user. User verification (PIN/biometric) is required.
- **Enrollment tokens, not trust-on-first-use.** The admin issues a single-use link bound to one user (`POST /v1/users/:id/enrollments` → `{token, link: /console#enroll=…, expires_at}`, 15-min default). Only its sha256 is stored. The user redeems it (`POST /v1/enroll/options {token}`, `POST /v1/enroll {token, response}`). Reused, expired, or other-user tokens are refused.
- **Replacing a passkey, without admin takeover.** Two paths only:
  1. *Current passkey* (`POST /v1/users/:id/reenroll-request` → assert → `POST /v1/users/:id/reenroll` mints a single-use token; `scripts/dev-passkey.ts reenroll <user>`). Immediate; recorded as `via: passkey` and checked by the verifier as `passkey.provenance`.
  2. *Time-locked recovery* (lost passkey). An admin link that names the credential it replaces only **starts** a recovery: the new key is registered but cannot sign anything for `AGENTGUARD_RECOVERY_LOCK_MS` (default 72h). The user is notified (`AGENTGUARD_NOTIFY_WEBHOOK`), and the *current* passkey can cancel at any time (`POST /v1/users/:id/recovery/cancel-request` → assert → `.../recovery/cancel`; `dev-passkey.ts cancel-recovery <user>`). `GET /v1/users/:id/recovery` shows the state.
  
  In both cases mandates signed by the old key are **frozen** until the new key re-signs them. Recovery is in the audit log (`passkey.recovery_*`), on every later receipt (`mandate.passkey.enrollment.via = recovery`), and the verifier warns `RECOVERY: …` (`passkey.recovery_lock` fails if a recovered key was used before its lock expired).
- Confirming a mandate needs a WebAuthn assertion whose challenge is the base64url SHA-256 of the canonical mandate. The assertion is stored and **re-verified on every proposal** (statelessly: origin, RP ID, UP+UV flags, signature over the stored public key), so editing the mandate row, its hash, the signature, or swapping the stored public key all stop spending.
- Revocation needs a separate assertion over `sha256("agentguard:revoke:v1:" + mandate_hash)`, so a signing assertion can't be replayed as a revocation. Unsigned drafts can be discarded without one.
- Mandates created before this change are migrated to `unsigned` and are not usable until the user re-signs them.
- Honest limits: **first** enrollment is still admin-bootstrapped (whoever holds the admin token decides who gets the first link). An admin who holds the token *and* suppresses the notification webhook *and* outlasts the 72h lock while the user never opens the console can still take over; the receipt and verifier then say `RECOVERY`, so it is visible, not prevented. The notifier only works if the operator configures it. In production, deliver links over your own authenticated channel (email/SSO). There is no operator kill-switch that bypasses the user's passkey; an operator can still let held payments expire unapproved. `scripts/dev-passkey.ts` is a software passkey for scripts and CI only.
- `GET /v1/audit/attestation` returns the audit chain head signed with the active issuer key (with `kid`).

### Issuer key rotation
Keys live in `data/issuer-keys.json` (0600; override with `AGENTGUARD_KEYRING_FILE`). On first start it is seeded from the legacy `data/signing-key.pem`. `kid` = the first 32 hex characters of sha256(SPKI DER).
```bash
node --experimental-strip-types scripts/rotate-key.ts          # retire the active key, create a new one (restart the server)
node --experimental-strip-types scripts/rotate-key.ts --list
curl -X POST -H "Authorization: Bearer $AGENTGUARD_ADMIN_TOKEN" http://localhost:8787/v1/keys/rotate   # live, audited
curl http://localhost:8787/.well-known/agentguard-keys > agentguard-keys.json                          # pin this
```
Retired keys stay published, so old receipts keep verifying. A receipt that claims a retired key but was issued after its `retired_at` is rejected.

### Key compromise, RFC 3161 timestamps and external anchoring
- Key states: `active` → `retired` → `compromised` (`POST /v1/keys/:kid/compromised {at}`, admin, audited; rotates first if the key is active). The key set publishes `status` and `compromised_at`.
- Every receipt is stamped by an independent RFC 3161 TSA (FreeTSA, then Sectigo; `AGENTGUARD_TSA_URLS`) over `sha256(canonical(receipt))`. The verifier checks the token offline against bundled TSA roots (`--tsa-root` to override). **For a compromised key, a receipt passes only if a verified TSA genTime and its `issued_at` are both before `compromised_at`**; with no TSA proof it fails, because anyone holding the stolen key can back-date `issued_at`.
- The audit chain head is anchored every `AGENTGUARD_ANCHOR_INTERVAL_MS` (default 15 min; `POST /v1/audit/anchor`, `GET /v1/audit/anchors`): an RFC 6962 Merkle root of all audit hashes, TSA-stamped. Each receipt carries an inclusion proof of its spend entries into the earliest anchor that covers them, plus **all prior spend entries of its mandate**, so the verifier recomputes cumulative spend and transaction count against the signed limits (`spend.*`, `anchor.*`). `--require-timestamp` / `--require-anchor` make those mandatory.
- Honest limits: TSA genTime precision is about 1 s, so a compromise declared within the same second as a receipt is treated as fail-closed (the verifier requires genTime + 1 s ≤ `compromised_at`). An anchor proves history only **as of its time**; detecting a fork (two different histories shown to two verifiers) needs someone outside to keep copies of `/v1/audit/anchors`. The issuer can fabricate history before the first anchor. Captures made before spend-chaining are summarized as `unchained_prior` and attested by the issuer only. A receipt issued while every TSA is down has no timestamp until `stampPending` retries; anchoring then lags.

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
`/console` (admin token required): enroll the user's passkey or hand them a single-use enrollment link (`#enroll=`), describe a mandate in plain English, review the code-rendered summary and exact JSON, sign it with the passkey (the console recomputes the hash locally and refuses if the challenge isn't that hash); revoke with the passkey;
approve or deny escalated payments with the passkey (the console recomputes the approval challenge from the statement and refuses on mismatch); browse mandates, payments and the hash-chained audit ledger in AG Grid;
one-click chain verification.

### Plain-English mandates, without trusting the model
The AI only proposes. A deterministic parser reads the same sentence, and wherever both produce a limit the **tighter one wins**
(disagreements are shown as warnings). Payees the model suggests that aren't in the user's text are dropped. Anything unstated
defaults tight (1 payment, 60-minute expiry). The summary the user signs is rendered by code from the final constraints, never written
by the model. See `test/drafter.test.ts` for a model that tries to raise a $900 cap to $9,000 and add an attacker payee.

### Verified against PayPal sandbox
`scripts/sandbox-smoke.sh` runs the live path end to end: register agent → link vaulted wallet → plain-English mandate → sign →
in-policy payment (AUTHORIZE → verify → capture), off-allowlist payee (rejected, PayPal never called), over-threshold payment
(held for approval, captured after approval), prompt-injected context (held), admin-only confirm and revoke (refused), and a passkey-signed revoke. `scripts/e2e-console-approval.ts` clicks Approve on a held payment in the console headlessly (the dev passkey is loaded into a CDP virtual authenticator; `scripts/sandbox-held-approval.sh` uses it by default). `scripts/e2e-console-passkey.ts` drives the console's real `navigator.credentials` path in Chrome with a virtual authenticator. Note: the sandbox merchant must be in a country
that can receive PayPal payments (e.g. US); Nigerian business accounts cannot.

### MCP
```bash
AGENTGUARD_URL=http://localhost:8787 AGENTGUARD_AGENT_KEY=ag_... AGENTGUARD_AGENT_ID=shopper \
  node --experimental-strip-types src/mcp.ts
```
Give your agent this server **instead of** direct PayPal payment tools.

## License
Apache-2.0

## Merchant orders: the PayPal order is the source of truth

The agent no longer has to *describe* the purchase. The merchant creates a PayPal order (`intent: AUTHORIZE`) and the agent
proposes only its id (`POST /v1/agent/payments {mandate_id, agent_id, idempotency_key, paypal_order_id}`, or the MCP tool
`pay_paypal_order`). AgentGuard GETs the order from PayPal and evaluates the mandate against **PayPal's** payee, amount,
currency and line items (SKU, category, quantity, tax/shipping/discount breakdown must reconcile). Sending `payee`,
`currency` or `items` together with an order id is rejected. At execute time the order is re-read and must have the same
digest, then authorized with the user's vault token, verified, and captured. An order can be paid once.

New mandate constraints: `require_merchant_order: true` (refuse agent-declared purchases) and `sku_allowlist: [...]`.
The old vaulted path (`payee`/`items` supplied by the agent) still works, but its items are **untrusted**: any
mandate constraint that depends on them (`allowed_categories`, `max_quantity_per_item`, `sku_allowlist`) fails as
"unverifiable" on that path; only payee allowlist + amount limits can be enforced there.

Live proof: `scripts/sandbox-orders.sh` (merchant side: `scripts/merchant-order.ts`).

Production limit: reading and authorizing another merchant's order needs the order to be created by the same PayPal app,
or PayPal partner permissions (`PayPal-Auth-Assertion`). Single-purchase-unit orders only.

## Operator kill-switch

`POST /v1/control/pause {"reason","by"}` (admin) blocks every new payment proposal (503) and every approval, and stops any
reserved payment from reaching PayPal. `POST /v1/control/resume` lifts it; `GET /v1/control/pause` shows state. Both are
written to the audit chain. Pausing is fail-safe, so it is deliberately admin-only (no passkey needed to stop money).

Type check: `npm run typecheck`.
