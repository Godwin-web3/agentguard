<!-- Generated file — do not edit; regenerated with the SDK. -->

# Approvals — operations

Accessor: `client.approvals` · Source: `src/resources/approvals.ts` · 3 operations · Request and error types: namespace `Approvals`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getApprovalOptions

- **Signature**: `getApprovalOptions(request: Approvals.GetApprovalOptionsRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Approvals.GetApprovalOptionsError>`
- **Wire**: `POST /v1/approvals/{id}/request`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Approvals.GetApprovalOptionsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Approvals.GetApprovalOptionsRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1ApprovalsRequestRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1ApprovalsRequestRequest` | `v1ApprovalsRequestRequestSchema` | `src/models/v1-approvals-request-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### listApprovals

- **Signature**: `listApprovals(options?: RequestOptions): ApiPromise<Record<string, unknown>, Approvals.ListApprovalsError>`
- **Wire**: `GET /v1/approvals`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Approvals.ListApprovalsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### resolveApproval

- **Signature**: `resolveApproval(request: Approvals.ResolveApprovalRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Approvals.ResolveApprovalError>`
- **Wire**: `POST /v1/approvals/{id}`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Approvals.ResolveApprovalError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Approvals.ResolveApprovalRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |
| `body` | `body` | `V1ApprovalsRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1ApprovalsRequest` | `v1ApprovalsRequestSchema` | `src/models/v1-approvals-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

