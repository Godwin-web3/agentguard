<!-- Generated file — do not edit; regenerated with the SDK. -->

# Receipts — operations

Accessor: `client.receipts` · Source: `src/resources/receipts.ts` · 4 operations · Request and error types: namespace `Receipts`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getPaymentReceipt

- **Signature**: `getPaymentReceipt(request: Receipts.GetPaymentReceiptRequest, options?: RequestOptions): ApiPromise<ReceiptEnvelope, Receipts.GetPaymentReceiptError>`
- **Wire**: `GET /v1/payments/{id}/receipt`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `ReceiptEnvelope`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Receipts.GetPaymentReceiptError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Receipts.GetPaymentReceiptRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ReceiptEnvelope` | `receiptEnvelopeSchema` | `src/models/receipt-envelope.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getPublicReceipt

- **Signature**: `getPublicReceipt(request: Receipts.GetPublicReceiptRequest, options?: RequestOptions): ApiPromise<ReceiptEnvelope, Receipts.GetPublicReceiptError>`
- **Wire**: `GET /v1/public/receipts/{id}`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `ReceiptEnvelope`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Receipts.GetPublicReceiptError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Receipts.GetPublicReceiptRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ReceiptEnvelope` | `receiptEnvelopeSchema` | `src/models/receipt-envelope.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getReceipt

- **Signature**: `getReceipt(request: Receipts.GetReceiptRequest, options?: RequestOptions): ApiPromise<ReceiptEnvelope, Receipts.GetReceiptError>`
- **Wire**: `GET /v1/receipts/{id}`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `ReceiptEnvelope`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Receipts.GetReceiptError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Receipts.GetReceiptRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `ReceiptEnvelope` | `receiptEnvelopeSchema` | `src/models/receipt-envelope.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### listReceipts

- **Signature**: `listReceipts(request?: Receipts.ListReceiptsRequest, options?: RequestOptions): ApiPromise<ReceiptSummary[], Receipts.ListReceiptsError>`
- **Wire**: `GET /v1/receipts`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `ReceiptSummary[]` — a bare `application/json` array; the success type *is* the array, not a wrapper model
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Receipts.ListReceiptsError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Receipts.ListReceiptsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `limit` | `query` | `string` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `ReceiptSummary` | `receiptSummarySchema` | `src/models/receipt-summary.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

