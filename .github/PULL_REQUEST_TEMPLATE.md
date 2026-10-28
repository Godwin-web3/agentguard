## What and why

<!-- What does this change, and why? Link the issue if there is one. -->

## Checklist

- [ ] `npm run typecheck && npm run lint && npm test` pass
- [ ] Postgres touched? `npm run test:pg` passes and `db/postgres.sql` is updated
- [ ] API changed? `docs/openapi.mjs` and the docs pages are updated (`test/docs.test.ts` checks this)
- [ ] User-visible change noted under `[Unreleased]` in `CHANGELOG.md`
- [ ] No secrets, live PayPal credentials or real customer data in code, tests or logs
