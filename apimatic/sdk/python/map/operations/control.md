<!-- Generated file — do not edit; regenerated with the SDK. -->

# Control — operations

Accessor: `client.control` · Source: `agent_guard_api/apis/control.py` · 3 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.control.get_pause_state

- **Route**: `GET /v1/control/pause`
- **Auth**: `admin`
- **Signature**: `def get_pause_state(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `PauseState`
- **Returns (raw)**: `ApiResult[PauseState, GetPauseStateErrorBody]`
- **Error**: `GetPauseStateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `PauseState` | `agent_guard_api/models/pause_state.py` |
| `GetPauseStateErrorBody` | `agent_guard_api/errors/get_pause_state_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.control.pause

- **Route**: `POST /v1/control/pause`
- **Auth**: `admin`
- **Signature**: `def pause(*, body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, PauseErrorBody]`
- **Error**: `PauseErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1ControlPauseRequest` | `agent_guard_api/models/v1_control_pause_request.py` |
| `V1ControlPauseRequestDict` | `agent_guard_api/models/v1_control_pause_request.py` |
| `PauseErrorBody` | `agent_guard_api/errors/pause_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.control.resume

- **Route**: `POST /v1/control/resume`
- **Auth**: `admin`
- **Signature**: `def resume(*, body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ResumeErrorBody]`
- **Error**: `ResumeErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1ControlResumeRequest` | `agent_guard_api/models/v1_control_resume_request.py` |
| `V1ControlResumeRequestDict` | `agent_guard_api/models/v1_control_resume_request.py` |
| `ResumeErrorBody` | `agent_guard_api/errors/resume_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

