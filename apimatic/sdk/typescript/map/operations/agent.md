<!-- Generated file — do not edit; regenerated with the SDK. -->

# Agent — operations

Accessor: `client.agent` · Source: `src/resources/agent.ts` · 5 operations · Request and error types: namespace `Agent`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getAgentMandate

- **Signature**: `getAgentMandate(request: Agent.GetAgentMandateRequest, options?: RequestOptions): ApiPromise<AgentMandate, Agent.GetAgentMandateError>`
- **Wire**: `GET /v1/agent/mandates/{id}`
- **Auth**: `agent`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `AgentMandate`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Agent.GetAgentMandateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Agent.GetAgentMandateRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `AgentMandate` | `agentMandateSchema` | `src/models/agent-mandate.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getAgentPayment

- **Signature**: `getAgentPayment(request: Agent.GetAgentPaymentRequest, options?: RequestOptions): ApiPromise<PaymentDecision, Agent.GetAgentPaymentError>`
- **Wire**: `GET /v1/agent/payments/{id}`
- **Auth**: `agent`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `PaymentDecision`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Agent.GetAgentPaymentError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Agent.GetAgentPaymentRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `PaymentDecision` | `paymentDecisionSchema` | `src/models/payment-decision.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getAgentPaymentReceipt

- **Signature**: `getAgentPaymentReceipt(request: Agent.GetAgentPaymentReceiptRequest, options?: RequestOptions): ApiPromise<ReceiptEnvelope, Agent.GetAgentPaymentReceiptError>`
- **Wire**: `GET /v1/agent/payments/{id}/receipt`
- **Auth**: `agent`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `ReceiptEnvelope`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Agent.GetAgentPaymentReceiptError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Agent.GetAgentPaymentReceiptRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ReceiptEnvelope` | `receiptEnvelopeSchema` | `src/models/receipt-envelope.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### proposePayment

- **Signature**: `proposePayment(request: Agent.ProposePaymentRequest, options?: RequestOptions): ApiPromise<PaymentDecision, Agent.ProposePaymentError>`
- **Wire**: `POST /v1/agent/payments`
- **Auth**: `agent`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `PaymentDecision`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Agent.ProposePaymentError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [429] `ErrorResponse` · `"errorResponse6"` [500] `ErrorResponse` · `"errorResponse7"` [503] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Agent.ProposePaymentRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1AgentPaymentsRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1AgentPaymentsRequest` | `v1AgentPaymentsRequestSchema` | `src/models/v1-agent-payments-request.ts` |
| `PaymentDecision` | `paymentDecisionSchema` | `src/models/payment-decision.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### searchProducts

- **Signature**: `searchProducts(request: Agent.SearchProductsRequest, options?: RequestOptions): ApiPromise<ProductSearchResult, Agent.SearchProductsError>`
- **Wire**: `POST /v1/agent/products/search`
- **Auth**: `agent`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `ProductSearchResult`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Agent.SearchProductsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Agent.SearchProductsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1AgentProductsSearchRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1AgentProductsSearchRequest` | `v1AgentProductsSearchRequestSchema` | `src/models/v1-agent-products-search-request.ts` |
| `ProductSearchResult` | `productSearchResultSchema` | `src/models/product-search-result.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

