<!-- Generated file — do not edit; regenerated with the SDK. -->

# Meta — operations

Accessor: `client.meta` · Source: `agent_guard_api/apis/meta.py` · 3 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.meta.get_health

- **Route**: `GET /health`
- **Signature**: `def get_health(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Health`
- **Returns (raw)**: `ApiResult[Health, GetHealthErrorBody]`
- **Error**: `GetHealthErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `Health` | `agent_guard_api/models/health.py` |
| `GetHealthErrorBody` | `agent_guard_api/errors/get_health_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.meta.get_liveness

- **Route**: `GET /healthz`
- **Signature**: `def get_liveness(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetLivenessErrorBody]`
- **Error**: `GetLivenessErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetLivenessErrorBody` | `agent_guard_api/errors/get_liveness_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.meta.head_liveness

- **Route**: `HEAD /healthz`
- **Signature**: `def head_liveness(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, HeadLivenessErrorBody]`
- **Error**: `HeadLivenessErrorBody` — **Case A (typed)**
- **Error arms**: `RawError` [400, 404, 413, 500, anything unmapped]

| Type | Source |
| --- | --- |
| `HeadLivenessErrorBody` | `agent_guard_api/errors/head_liveness_error.py` |

