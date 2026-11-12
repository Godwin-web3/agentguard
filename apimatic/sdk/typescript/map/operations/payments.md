<!-- Generated file — do not edit; regenerated with the SDK. -->

# Payments — operations

Accessor: `client.payments` · Source: `src/resources/payments.ts` · 3 operations · Request and error types: namespace `Payments`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### listPayments

- **Signature**: `listPayments(request?: Payments.ListPaymentsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Payments.ListPaymentsError>`
- **Wire**: `GET /v1/payments`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Payments.ListPaymentsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Payments.ListPaymentsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `limit` | `query` | `string` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### listStuckPayments

- **Signature**: `listStuckPayments(request?: Payments.ListStuckPaymentsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Payments.ListStuckPaymentsError>`
- **Wire**: `GET /v1/payments/stuck`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Payments.ListStuckPaymentsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Payments.ListStuckPaymentsRequest` (1):

| Field | Channel | Wire | Type | Req |
| --- | --- | --- | --- | --- |
| `olderThanMs` | `query` | `older_than_ms` | `string` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### recoverPayments

- **Signature**: `recoverPayments(request?: Payments.RecoverPaymentsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Payments.RecoverPaymentsError>`
- **Wire**: `POST /v1/recover`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field. **Optional**: omit it and the request carries no body and no `Content-Type` header at all
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Payments.RecoverPaymentsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Payments.RecoverPaymentsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1RecoverRequest` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1RecoverRequest` | `v1RecoverRequestSchema` | `src/models/v1-recover-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

