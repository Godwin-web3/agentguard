<!-- Generated file — do not edit; regenerated with the SDK. -->

# Payments — operations

Accessor: `client.payments` · Source: `agent_guard_api/apis/payments.py` · 3 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.payments.list_payments

- **Route**: `GET /v1/payments`
- **Auth**: `admin`
- **Signature**: `def list_payments(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `limit` — query
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ListPaymentsErrorBody]`
- **Error**: `ListPaymentsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ListPaymentsErrorBody` | `agent_guard_api/errors/list_payments_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.payments.list_stuck_payments

- **Route**: `GET /v1/payments/stuck`
- **Auth**: `admin`
- **Signature**: `def list_stuck_payments(*, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `older_than_ms` — query
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ListStuckPaymentsErrorBody]`
- **Error**: `ListStuckPaymentsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ListStuckPaymentsErrorBody` | `agent_guard_api/errors/list_stuck_payments_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.payments.recover_payments

- **Route**: `POST /v1/recover`
- **Auth**: `admin`
- **Signature**: `def recover_payments(*, body: V1RecoverRequest | V1RecoverRequestDict | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RecoverPaymentsErrorBody]`
- **Error**: `RecoverPaymentsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1RecoverRequest` | `agent_guard_api/models/v1_recover_request.py` |
| `V1RecoverRequestDict` | `agent_guard_api/models/v1_recover_request.py` |
| `RecoverPaymentsErrorBody` | `agent_guard_api/errors/recover_payments_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

