<!-- Generated file — do not edit; regenerated with the SDK. -->

# Catalog — operations

Accessor: `client.catalog` · Source: `agent_guard_api/apis/catalog.py` · 2 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.catalog.get_product_search_status

- **Route**: `GET /v1/products/status`
- **Auth**: `admin`
- **Signature**: `def get_product_search_status(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetProductSearchStatusErrorBody]`
- **Error**: `GetProductSearchStatusErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetProductSearchStatusErrorBody` | `agent_guard_api/errors/get_product_search_status_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.catalog.search_products_for_mandate

- **Route**: `POST /v1/products/search`
- **Auth**: `admin`
- **Signature**: `def search_products_for_mandate(body: V1ProductsSearchRequest | V1ProductsSearchRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `ProductSearchResult`
- **Returns (raw)**: `ApiResult[ProductSearchResult, SearchProductsForMandateErrorBody]`
- **Error**: `SearchProductsForMandateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1ProductsSearchRequest` | `agent_guard_api/models/v1_products_search_request.py` |
| `V1ProductsSearchRequestDict` | `agent_guard_api/models/v1_products_search_request.py` |
| `ProductSearchResult` | `agent_guard_api/models/product_search_result.py` |
| `SearchProductsForMandateErrorBody` | `agent_guard_api/errors/search_products_for_mandate_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

