<!-- Generated file — do not edit; regenerated with the SDK. -->

# Agent — operations

Accessor: `client.agent` · Source: `agent_guard_api/apis/agent.py` · 5 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.agent.get_agent_mandate

- **Route**: `GET /v1/agent/mandates/{id}`
- **Auth**: `agent`
- **Signature**: `def get_agent_mandate(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `AgentMandate`
- **Returns (raw)**: `ApiResult[AgentMandate, GetAgentMandateErrorBody]`
- **Error**: `GetAgentMandateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `AgentMandate` | `agent_guard_api/models/agent_mandate.py` |
| `GetAgentMandateErrorBody` | `agent_guard_api/errors/get_agent_mandate_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.agent.get_agent_payment

- **Route**: `GET /v1/agent/payments/{id}`
- **Auth**: `agent`
- **Signature**: `def get_agent_payment(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `PaymentDecision`
- **Returns (raw)**: `ApiResult[PaymentDecision, GetAgentPaymentErrorBody]`
- **Error**: `GetAgentPaymentErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `PaymentDecision` | `agent_guard_api/models/payment_decision.py` |
| `GetAgentPaymentErrorBody` | `agent_guard_api/errors/get_agent_payment_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.agent.get_agent_payment_receipt

- **Route**: `GET /v1/agent/payments/{id}/receipt`
- **Auth**: `agent`
- **Signature**: `def get_agent_payment_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `ReceiptEnvelope`
- **Returns (raw)**: `ApiResult[ReceiptEnvelope, GetAgentPaymentReceiptErrorBody]`
- **Error**: `GetAgentPaymentReceiptErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ReceiptEnvelope` | `agent_guard_api/models/receipt_envelope.py` |
| `GetAgentPaymentReceiptErrorBody` | `agent_guard_api/errors/get_agent_payment_receipt_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.agent.propose_payment

- **Route**: `POST /v1/agent/payments`
- **Auth**: `agent`
- **Signature**: `def propose_payment(body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `PaymentDecision`
- **Returns (raw)**: `ApiResult[PaymentDecision, ProposePaymentErrorBody]`
- **Error**: `ProposePaymentErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 429, 500, 503] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1AgentPaymentsRequest` | `agent_guard_api/models/v1_agent_payments_request.py` |
| `V1AgentPaymentsRequestDict` | `agent_guard_api/models/v1_agent_payments_request.py` |
| `PaymentDecision` | `agent_guard_api/models/payment_decision.py` |
| `ProposePaymentErrorBody` | `agent_guard_api/errors/propose_payment_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.agent.search_products

- **Route**: `POST /v1/agent/products/search`
- **Auth**: `agent`
- **Signature**: `def search_products(body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `ProductSearchResult`
- **Returns (raw)**: `ApiResult[ProductSearchResult, SearchProductsErrorBody]`
- **Error**: `SearchProductsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1AgentProductsSearchRequest` | `agent_guard_api/models/v1_agent_products_search_request.py` |
| `V1AgentProductsSearchRequestDict` | `agent_guard_api/models/v1_agent_products_search_request.py` |
| `ProductSearchResult` | `agent_guard_api/models/product_search_result.py` |
| `SearchProductsErrorBody` | `agent_guard_api/errors/search_products_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

