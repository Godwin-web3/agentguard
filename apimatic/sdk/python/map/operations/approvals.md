<!-- Generated file — do not edit; regenerated with the SDK. -->

# Approvals — operations

Accessor: `client.approvals` · Source: `agent_guard_api/apis/approvals.py` · 3 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.approvals.get_approval_options

- **Route**: `POST /v1/approvals/{id}/request`
- **Auth**: `admin`
- **Signature**: `def get_approval_options(id_: str, body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `body`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetApprovalOptionsErrorBody]`
- **Error**: `GetApprovalOptionsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1ApprovalsRequestRequest` | `agent_guard_api/models/v1_approvals_request_request.py` |
| `V1ApprovalsRequestRequestDict` | `agent_guard_api/models/v1_approvals_request_request.py` |
| `GetApprovalOptionsErrorBody` | `agent_guard_api/errors/get_approval_options_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.approvals.list_approvals

- **Route**: `GET /v1/approvals`
- **Auth**: `admin`
- **Signature**: `def list_approvals(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ListApprovalsErrorBody]`
- **Error**: `ListApprovalsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ListApprovalsErrorBody` | `agent_guard_api/errors/list_approvals_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.approvals.resolve_approval

- **Route**: `POST /v1/approvals/{id}`
- **Auth**: `admin`
- **Signature**: `def resolve_approval(id_: str, body: V1ApprovalsRequest | V1ApprovalsRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `body`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ResolveApprovalErrorBody]`
- **Error**: `ResolveApprovalErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1ApprovalsRequest` | `agent_guard_api/models/v1_approvals_request.py` |
| `V1ApprovalsRequestDict` | `agent_guard_api/models/v1_approvals_request.py` |
| `ResolveApprovalErrorBody` | `agent_guard_api/errors/resolve_approval_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

