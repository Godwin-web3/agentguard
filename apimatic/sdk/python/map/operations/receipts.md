<!-- Generated file — do not edit; regenerated with the SDK. -->

# Receipts — operations

Accessor: `client.receipts` · Source: `agent_guard_api/apis/receipts.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.receipts.get_payment_receipt

- **Route**: `GET /v1/payments/{id}/receipt`
- **Auth**: `admin`
- **Signature**: `def get_payment_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `ReceiptEnvelope`
- **Returns (raw)**: `ApiResult[ReceiptEnvelope, GetPaymentReceiptErrorBody]`
- **Error**: `GetPaymentReceiptErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ReceiptEnvelope` | `agent_guard_api/models/receipt_envelope.py` |
| `GetPaymentReceiptErrorBody` | `agent_guard_api/errors/get_payment_receipt_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.receipts.get_public_receipt

- **Route**: `GET /v1/public/receipts/{id}`
- **Signature**: `def get_public_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `ReceiptEnvelope`
- **Returns (raw)**: `ApiResult[ReceiptEnvelope, GetPublicReceiptErrorBody]`
- **Error**: `GetPublicReceiptErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ReceiptEnvelope` | `agent_guard_api/models/receipt_envelope.py` |
| `GetPublicReceiptErrorBody` | `agent_guard_api/errors/get_public_receipt_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.receipts.get_receipt

- **Route**: `GET /v1/receipts/{id}`
- **Auth**: `admin`
- **Signature**: `def get_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `ReceiptEnvelope`
- **Returns (raw)**: `ApiResult[ReceiptEnvelope, GetReceiptErrorBody]`
- **Error**: `GetReceiptErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ReceiptEnvelope` | `agent_guard_api/models/receipt_envelope.py` |
| `GetReceiptErrorBody` | `agent_guard_api/errors/get_receipt_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.receipts.list_receipts

- **Route**: `GET /v1/receipts`
- **Auth**: `admin`
- **Signature**: `def list_receipts(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `limit` — query
- **Returns (parsed)**: `list[ReceiptSummary]`
- **Returns (raw)**: `ApiResult[list[ReceiptSummary], ListReceiptsErrorBody]`
- **Error**: `ListReceiptsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ReceiptSummary` | `agent_guard_api/models/receipt_summary.py` |
| `ListReceiptsErrorBody` | `agent_guard_api/errors/list_receipts_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

