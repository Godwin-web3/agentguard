<!-- Generated file — do not edit; regenerated with the SDK. -->

# Catalog — operations

Accessor: `client.Catalog` · Source: `src/AgentGuardApi/Api/Catalog.cs` · 2 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetProductSearchStatus

- **Auth**: `options.Admin`
- **Signature**: `GetProductSearchStatus(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<GetProductSearchStatusError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetProductSearchStatusError` | `src/AgentGuardApi/Errors/GetProductSearchStatusError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### SearchProductsForMandate

- **Auth**: `options.Admin`
- **Signature**: `SearchProductsForMandate(SearchProductsForMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `ProductSearchResult`
- **Error**: `ApiException<SearchProductsForMandateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `SearchProductsForMandateRequest` | `src/AgentGuardApi/Requests/Catalog/SearchProductsForMandateRequest.cs` |
| `V1ProductsSearchRequest` | `src/AgentGuardApi/Models/V1ProductsSearchRequest.cs` |
| `ProductSearchResult` | `src/AgentGuardApi/Models/ProductSearchResult.cs` |
| `SearchProductsForMandateError` | `src/AgentGuardApi/Errors/SearchProductsForMandateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

