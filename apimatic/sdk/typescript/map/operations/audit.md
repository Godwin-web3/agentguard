<!-- Generated file — do not edit; regenerated with the SDK. -->

# Audit — operations

Accessor: `client.audit` · Source: `src/resources/audit.ts` · 5 operations · Request and error types: namespace `Audit`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### anchorAuditChain

- **Signature**: `anchorAuditChain(options?: RequestOptions): ApiPromise<Record<string, unknown>, Audit.AnchorAuditChainError>`
- **Wire**: `POST /v1/audit/anchor`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Audit.AnchorAuditChainError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getAuditAttestation

- **Signature**: `getAuditAttestation(options?: RequestOptions): ApiPromise<Record<string, unknown>, Audit.GetAuditAttestationError>`
- **Wire**: `GET /v1/audit/attestation`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Audit.GetAuditAttestationError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### listAuditAnchors

- **Signature**: `listAuditAnchors(request?: Audit.ListAuditAnchorsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Audit.ListAuditAnchorsError>`
- **Wire**: `GET /v1/audit/anchors`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Audit.ListAuditAnchorsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Audit.ListAuditAnchorsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `limit` | `query` | `string` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### listAuditEntries

- **Signature**: `listAuditEntries(request?: Audit.ListAuditEntriesRequest, options?: RequestOptions): ApiPromise<AuditEntry[], Audit.ListAuditEntriesError>`
- **Wire**: `GET /v1/audit`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `AuditEntry[]` — a bare `application/json` array; the success type *is* the array, not a wrapper model
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Audit.ListAuditEntriesError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Audit.ListAuditEntriesRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `limit` | `query` | `string` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `AuditEntry` | `auditEntrySchema` | `src/models/audit-entry.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### verifyAuditChain

- **Signature**: `verifyAuditChain(options?: RequestOptions): ApiPromise<AuditVerification, Audit.VerifyAuditChainError>`
- **Wire**: `GET /v1/audit/verify`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `AuditVerification`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Audit.VerifyAuditChainError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `AuditVerification` | `auditVerificationSchema` | `src/models/audit-verification.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

