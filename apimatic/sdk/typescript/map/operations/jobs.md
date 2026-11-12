<!-- Generated file — do not edit; regenerated with the SDK. -->

# Jobs — operations

Accessor: `client.jobs` · Source: `src/resources/jobs.ts` · 4 operations · Request and error types: namespace `Jobs`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### runAnchorJob

- **Signature**: `runAnchorJob(options?: RequestOptions): ApiPromise<Record<string, unknown>, Jobs.RunAnchorJobError>`
- **Wire**: `GET /api/cron/anchor`
- **Auth**: `cron`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Jobs.RunAnchorJobError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### runAnchorJobPost

- **Signature**: `runAnchorJobPost(options?: RequestOptions): ApiPromise<Record<string, unknown>, Jobs.RunAnchorJobPostError>`
- **Wire**: `POST /api/cron/anchor`
- **Auth**: `cron`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Jobs.RunAnchorJobPostError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### runMaintenanceJob

- **Signature**: `runMaintenanceJob(options?: RequestOptions): ApiPromise<Record<string, unknown>, Jobs.RunMaintenanceJobError>`
- **Wire**: `GET /api/cron/maintenance`
- **Auth**: `cron`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Jobs.RunMaintenanceJobError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### runMaintenanceJobPost

- **Signature**: `runMaintenanceJobPost(options?: RequestOptions): ApiPromise<Record<string, unknown>, Jobs.RunMaintenanceJobPostError>`
- **Wire**: `POST /api/cron/maintenance`
- **Auth**: `cron`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Jobs.RunMaintenanceJobPostError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

