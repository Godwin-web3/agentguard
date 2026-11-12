<!-- Generated file — do not edit; regenerated with the SDK. -->

# Catalog — operations

Accessor: `client.catalog` · Source: `src/resources/catalog.ts` · 2 operations · Request and error types: namespace `Catalog`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getProductSearchStatus

- **Signature**: `getProductSearchStatus(options?: RequestOptions): ApiPromise<Record<string, unknown>, Catalog.GetProductSearchStatusError>`
- **Wire**: `GET /v1/products/status`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Catalog.GetProductSearchStatusError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### searchProductsForMandate

- **Signature**: `searchProductsForMandate(request: Catalog.SearchProductsForMandateRequest, options?: RequestOptions): ApiPromise<ProductSearchResult, Catalog.SearchProductsForMandateError>`
- **Wire**: `POST /v1/products/search`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `ProductSearchResult`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Catalog.SearchProductsForMandateError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Catalog.SearchProductsForMandateRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1ProductsSearchRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1ProductsSearchRequest` | `v1ProductsSearchRequestSchema` | `src/models/v1-products-search-request.ts` |
| `ProductSearchResult` | `productSearchResultSchema` | `src/models/product-search-result.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

