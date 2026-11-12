<!-- Generated file — do not edit; regenerated with the SDK. -->

# Meta — operations

Accessor: `client.meta` · Source: `src/resources/meta.ts` · 3 operations · Request and error types: namespace `Meta`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getHealth

- **Signature**: `getHealth(options?: RequestOptions): ApiPromise<Health, Meta.GetHealthError>`
- **Wire**: `GET /health`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Health`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Meta.GetHealthError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `Health` | `healthSchema` | `src/models/health.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getLiveness

- **Signature**: `getLiveness(options?: RequestOptions): ApiPromise<Record<string, unknown>, Meta.GetLivenessError>`
- **Wire**: `GET /healthz`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Meta.GetLivenessError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### headLiveness

- **Signature**: `headLiveness(options?: RequestOptions): ApiPromise<undefined, Meta.HeadLivenessError>`
- **Wire**: `HEAD /healthz`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Meta.HeadLivenessError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"error400"` [400] no body · `"error404"` [404] no body · `"error413"` [413] no body · `"error500"` [500] no body · `"undeclared"` [any other] `rawBody: ArrayBuffer`

