<!-- Generated file — do not edit; regenerated with the SDK. -->

# Mandates — operations

Accessor: `client.mandates` · Source: `src/resources/mandates.ts` · 8 operations · Request and error types: namespace `Mandates`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### confirmMandate

- **Signature**: `confirmMandate(request: Mandates.ConfirmMandateRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.ConfirmMandateError>`
- **Wire**: `POST /v1/mandates/{id}/confirm`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.ConfirmMandateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.ConfirmMandateRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1MandatesConfirmRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1MandatesConfirmRequest` | `v1MandatesConfirmRequestSchema` | `src/models/v1-mandates-confirm-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### createMandate

- **Signature**: `createMandate(request: Mandates.CreateMandateRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.CreateMandateError>`
- **Wire**: `POST /v1/mandates`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.CreateMandateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.CreateMandateRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1MandatesRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1MandatesRequest` | `v1MandatesRequestSchema` | `src/models/v1-mandates-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### draftMandateFromText

- **Signature**: `draftMandateFromText(request: Mandates.DraftMandateFromTextRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.DraftMandateFromTextError>`
- **Wire**: `POST /v1/mandates/draft-from-text`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.DraftMandateFromTextError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.DraftMandateFromTextRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1MandatesDraftFromTextRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1MandatesDraftFromTextRequest` | `v1MandatesDraftFromTextRequestSchema` | `src/models/v1-mandates-draft-from-text-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getMandate

- **Signature**: `getMandate(request: Mandates.GetMandateRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.GetMandateError>`
- **Wire**: `GET /v1/mandates/{id}`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.GetMandateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.GetMandateRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getMandateRevocationOptions

- **Signature**: `getMandateRevocationOptions(request: Mandates.GetMandateRevocationOptionsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.GetMandateRevocationOptionsError>`
- **Wire**: `POST /v1/mandates/{id}/revoke-request`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.GetMandateRevocationOptionsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.GetMandateRevocationOptionsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getMandateSigningOptions

- **Signature**: `getMandateSigningOptions(request: Mandates.GetMandateSigningOptionsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.GetMandateSigningOptionsError>`
- **Wire**: `POST /v1/mandates/{id}/sign-request`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.GetMandateSigningOptionsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.GetMandateSigningOptionsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### listMandates

- **Signature**: `listMandates(options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.ListMandatesError>`
- **Wire**: `GET /v1/mandates`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.ListMandatesError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### revokeMandate

- **Signature**: `revokeMandate(request: Mandates.RevokeMandateRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Mandates.RevokeMandateError>`
- **Wire**: `POST /v1/mandates/{id}/revoke`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field. **Optional**: omit it and the request carries no body and no `Content-Type` header at all
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Mandates.RevokeMandateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Mandates.RevokeMandateRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1MandatesRevokeRequest` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1MandatesRevokeRequest` | `v1MandatesRevokeRequestSchema` | `src/models/v1-mandates-revoke-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

