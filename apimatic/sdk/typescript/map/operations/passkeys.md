<!-- Generated file — do not edit; regenerated with the SDK. -->

# Passkeys — operations

Accessor: `client.passkeys` · Source: `src/resources/passkeys.ts` · 9 operations · Request and error types: namespace `Passkeys`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### cancelRecovery

- **Signature**: `cancelRecovery(request: Passkeys.CancelRecoveryRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.CancelRecoveryError>`
- **Wire**: `POST /v1/users/{id}/recovery/cancel`
- **Auth**: none — public; no credential is sent
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.CancelRecoveryError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.CancelRecoveryRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1UsersRecoveryCancelRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1UsersRecoveryCancelRequest` | `v1UsersRecoveryCancelRequestSchema` | `src/models/v1-users-recovery-cancel-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### createEnrollmentLink

- **Signature**: `createEnrollmentLink(request: Passkeys.CreateEnrollmentLinkRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.CreateEnrollmentLinkError>`
- **Wire**: `POST /v1/users/{id}/enrollments`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field. **Optional**: omit it and the request carries no body and no `Content-Type` header at all
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.CreateEnrollmentLinkError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.CreateEnrollmentLinkRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1UsersEnrollmentsRequest` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1UsersEnrollmentsRequest` | `v1UsersEnrollmentsRequestSchema` | `src/models/v1-users-enrollments-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### enrollPasskey

- **Signature**: `enrollPasskey(request: Passkeys.EnrollPasskeyRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.EnrollPasskeyError>`
- **Wire**: `POST /v1/enroll`
- **Auth**: none — public; no credential is sent
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.EnrollPasskeyError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.EnrollPasskeyRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1EnrollRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1EnrollRequest` | `v1EnrollRequestSchema` | `src/models/v1-enroll-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getEnrollmentOptions

- **Signature**: `getEnrollmentOptions(request: Passkeys.GetEnrollmentOptionsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.GetEnrollmentOptionsError>`
- **Wire**: `POST /v1/enroll/options`
- **Auth**: none — public; no credential is sent
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.GetEnrollmentOptionsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.GetEnrollmentOptionsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1EnrollOptionsRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1EnrollOptionsRequest` | `v1EnrollOptionsRequestSchema` | `src/models/v1-enroll-options-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getRecoveryCancelOptions

- **Signature**: `getRecoveryCancelOptions(request: Passkeys.GetRecoveryCancelOptionsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.GetRecoveryCancelOptionsError>`
- **Wire**: `POST /v1/users/{id}/recovery/cancel-request`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.GetRecoveryCancelOptionsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.GetRecoveryCancelOptionsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getRecoveryState

- **Signature**: `getRecoveryState(request: Passkeys.GetRecoveryStateRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.GetRecoveryStateError>`
- **Wire**: `GET /v1/users/{id}/recovery`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.GetRecoveryStateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.GetRecoveryStateRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getReenrollmentOptions

- **Signature**: `getReenrollmentOptions(request: Passkeys.GetReenrollmentOptionsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.GetReenrollmentOptionsError>`
- **Wire**: `POST /v1/users/{id}/reenroll-request`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.GetReenrollmentOptionsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.GetReenrollmentOptionsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getUserPasskey

- **Signature**: `getUserPasskey(request: Passkeys.GetUserPasskeyRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.GetUserPasskeyError>`
- **Wire**: `GET /v1/users/{id}/passkey`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.GetUserPasskeyError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.GetUserPasskeyRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### reenrollPasskey

- **Signature**: `reenrollPasskey(request: Passkeys.ReenrollPasskeyRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Passkeys.ReenrollPasskeyError>`
- **Wire**: `POST /v1/users/{id}/reenroll`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Passkeys.ReenrollPasskeyError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Passkeys.ReenrollPasskeyRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1UsersReenrollRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1UsersReenrollRequest` | `v1UsersReenrollRequestSchema` | `src/models/v1-users-reenroll-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

