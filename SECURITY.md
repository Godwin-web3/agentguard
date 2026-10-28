# Security policy

AgentGuard sits in front of real money, so we take reports seriously.

## Reporting a vulnerability

Please **do not open a public issue**. Report privately through
[GitHub Security Advisories](https://github.com/Godwin-web3/agentguard/security/advisories/new).
Include what you found, how to reproduce it, and the impact you think it has.

We aim to acknowledge reports within 3 working days and to agree a fix and disclosure timeline with you.
We are happy to credit you in the advisory and the changelog.

## Scope

- The gateway in this repository (policy engine, PayPal integration, passkeys, receipts, audit chain, HTTP/MCP API)
- `@agentguard-dev/intent-verifier` and `@agentguard-dev/paypal-toolkit` on npm
- The hosted demo at https://agentguard-orcin.vercel.app (PayPal **sandbox** only)

Especially interesting: anything that lets an agent move money outside a signed mandate, forge or replay a passkey
approval, produce a receipt that verifies but should not, or bypass the kill-switch or recovery lock.

Out of scope: denial of service by volume against the free demo, findings that need a compromised owner device or
admin token, and reports from automated scanners without a demonstrated impact.

Please test only against your own deployment or the sandbox demo, never against real PayPal accounts you do not own.

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | ✅ |

The threat model and known limits are documented at https://agentguard-orcin.vercel.app/docs/security.
