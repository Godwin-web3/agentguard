<!-- Generated file — do not edit; regenerated with the SDK. -->

# Control — operations

Accessor: `client.control` · Source: `src/resources/control.ts` · 3 operations · Request and error types: namespace `Control`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getPauseState

- **Signature**: `getPauseState(options?: RequestOptions): ApiPromise<PauseState, Control.GetPauseStateError>`
- **Wire**: `GET /v1/control/pause`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `PauseState`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Control.GetPauseStateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `PauseState` | `pauseStateSchema` | `src/models/pause-state.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### pause

- **Signature**: `pause(request?: Control.PauseRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Control.PauseError>`
- **Wire**: `POST /v1/control/pause`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field. **Optional**: omit it and the request carries no body and no `Content-Type` header at all
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Control.PauseError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Control.PauseRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1ControlPauseRequest` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1ControlPauseRequest` | `v1ControlPauseRequestSchema` | `src/models/v1-control-pause-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### resume

- **Signature**: `resume(request?: Control.ResumeRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Control.ResumeError>`
- **Wire**: `POST /v1/control/resume`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field. **Optional**: omit it and the request carries no body and no `Content-Type` header at all
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Control.ResumeError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Control.ResumeRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1ControlResumeRequest` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1ControlResumeRequest` | `v1ControlResumeRequestSchema` | `src/models/v1-control-resume-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

