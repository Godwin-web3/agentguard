---
title: Anchoring and timestamps
description: RFC 3161 timestamps on receipts and RFC 6962 Merkle anchors of the audit chain.
---
# Anchoring and timestamps

Signatures alone cannot tell you *when* something was signed: anyone holding a stolen key can back-date `issued_at`. AgentGuard adds two independent clocks.

## RFC 3161 timestamps on every receipt

Each receipt is stamped by an independent Time-Stamping Authority (FreeTSA, then Sectigo; set `AGENTGUARD_TSA_URLS`) over sha256(canonical(receipt)). The verifier checks the token offline against bundled TSA roots (`--tsa-root name=pem` to override). If every TSA is down the receipt is issued without a stamp and the anchor job retries.

## Audit anchors

Every decision is appended to a hash-chained, append-only audit log. The chain head is anchored every 15 minutes by a long-running server (`AGENTGUARD_ANCHOR_INTERVAL_MS`), or by calling `/api/cron/anchor` on a schedule when serverless (see [Self-hosting](./self-hosting.md)), or on demand with `POST /v1/audit/anchor`: an RFC 6962 Merkle root over all audit hashes, TSA-stamped and published at [`/v1/audit/anchors`](/v1/audit/anchors).

Each receipt carries an inclusion proof of its spend entries into the earliest anchor that covers them, plus **every prior spend entry of its mandate**. The verifier recomputes cumulative spend and transaction count against the signed limits (`spend.*`, `anchor.*` checks). `--require-timestamp` and `--require-anchor` make both mandatory.

```sh
curl -s https://agentguard-orcin.vercel.app/v1/audit/anchors?limit=3
```

## Compromised keys

When a key is marked compromised as of time T, a receipt it signed passes only if a verified TSA genTime **and** its `issued_at` are both before T. Without a timestamp it fails.

## Honest limits

- TSA genTime precision is about one second, so a compromise declared in the same second is treated as fail-closed (genTime + 1 s ≤ `compromised_at` is required).
- An anchor proves history only as of its time. Detecting a fork (two histories shown to two verifiers) needs someone outside to keep copies of `/v1/audit/anchors`.
- The issuer can fabricate history before the first anchor. Captures made before spend-chaining are summarized as `unchained_prior` and attested by the issuer only.
