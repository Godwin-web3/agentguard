# Contributing

Thanks for helping. Issues and pull requests are welcome.

## Setup

```sh
git clone https://github.com/Godwin-web3/agentguard && cd agentguard
npm ci
npm run build:web
cp .env.example .env    # PayPal **sandbox** credentials only
node --env-file=.env --experimental-strip-types --no-warnings src/server.ts
```

Node ≥ 22.6 (TypeScript runs directly via `--experimental-strip-types`; there is no build step for the server).

## Checks

```sh
npm run typecheck
npm run lint
npm test                                          # SQLite, in memory
AGENTGUARD_TEST_PG=postgres://… npm run test:pg  # same suite, a fresh schema per test
npm run test:toolkit                              # @agentguard-dev/paypal-toolkit
```

CI runs all of these on every pull request.

## Guidelines

- **Security first.** The policy engine must stay deterministic and fail-closed. A change that widens what an agent can do
  needs a test in `test/security-regressions.test.ts` or `test/limits.test.ts` showing the old attack still fails.
- **Docs are tested.** `test/docs.test.ts` checks that `docs/openapi.mjs` matches the route table, that curl samples
  target real endpoints, that CLI flags exist, and runs the quickstart. If you add a route, document it.
- **Changelog.** Add user-visible changes under `[Unreleased]` in `CHANGELOG.md`.
- **Postgres and SQLite** must behave the same. Schema changes go in `db/postgres.sql`, and in the SQLite schema in `src/db.ts`.
- Keep pull requests focused. Use clear commit messages (`feat:`, `fix:`, `docs:` …).
- Never commit secrets, live credentials or real customer data.

## Docs site

Pages live in `docs/*.md` with the sidebar in `docs/nav.json`. `npm run build:web` renders them to `dist/site/docs`.

## Releases (maintainers)

Bump both package versions, move `[Unreleased]` to a new version in `CHANGELOG.md`, merge, then push a tag `vX.Y.Z`.
`.github/workflows/release.yml` publishes both packages to npm with provenance.

By contributing you agree your work is licensed under Apache-2.0, and to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
