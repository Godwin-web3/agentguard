# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the packages follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Documentation site at `/docs` (concepts, guides, API, CLI, package reference, security, FAQ) with search.
- OpenAPI 3.1 spec at `/openapi.json`, tested against the server's route table.
- Snippet tests: documented commands are executed in CI.
- Project hygiene: SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue and PR templates, CODEOWNERS, CI, CodeQL, Dependabot, tag-driven npm release with provenance.

### Fixed
- `@agentguard-dev/paypal-toolkit` README: the MCP `npx` command now installs the peer dependencies (`-p … agentguard-paypal-mcp`).
- README: `AGENTGUARD_PUBLIC_URL` (was `PUBLIC_URL`); verifier README library example uses `issuerKeys` and an array `expectedPayee`.

## [0.1.0] - 2026-10-28

First public release of `@agentguard-dev/intent-verifier` and `@agentguard-dev/paypal-toolkit`.

### Added
- Gateway: deterministic policy engine over passkey-signed spending mandates; PayPal Orders v2 authorize-then-capture against the user's vaulted wallet; void on mismatch or revocation; idempotency, rate limits, crash recovery, operator kill-switch.
- Merchant PayPal order as source of truth: order-id proposals, SKU allowlists, `require_merchant_order`.
- WebAuthn passkeys for mandate signing, revocation and approvals of held payments; enrollment tokens; time-locked passkey recovery and re-enrollment.
- Proof-of-Intent receipts (`agentguard.proof-of-intent/v1`): Ed25519-signed, RFC 3161 timestamped, with audit-anchor inclusion and cumulative spend proofs; issuer key rotation and compromise handling.
- AP2 views (open checkout, open payment, checkout, payment mandates) derived from every receipt.
- `@agentguard-dev/intent-verifier`: zero-dependency offline verifier, `intent-verify` CLI, AP2 checks, PayPal dispute evidence (type chosen from the dispute).
- `@agentguard-dev/paypal-toolkit`: guard for PayPal's Agent Toolkit (Vercel AI SDK, OpenAI, MCP); money moves only through AgentGuard.
- Supabase Postgres backend and Vercel deployment; owner console, receipt viewer and brand kit.

[Unreleased]: https://github.com/Godwin-web3/agentguard/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Godwin-web3/agentguard/releases/tag/v0.1.0
