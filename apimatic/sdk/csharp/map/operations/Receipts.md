<!-- Generated file — do not edit; regenerated with the SDK. -->

# Receipts — operations

Accessor: `client.Receipts` · Source: `src/AgentGuardApi/Api/Receipts.cs` · 4 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetPaymentReceipt

- **Auth**: `options.Admin`
- **Signature**: `GetPaymentReceipt(GetPaymentReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `ReceiptEnvelope`
- **Error**: `ApiException<GetPaymentReceiptError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetPaymentReceiptRequest` | `src/AgentGuardApi/Requests/Receipts/GetPaymentReceiptRequest.cs` |
| `ReceiptEnvelope` | `src/AgentGuardApi/Models/ReceiptEnvelope.cs` |
| `GetPaymentReceiptError` | `src/AgentGuardApi/Errors/GetPaymentReceiptError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetPublicReceipt

- **Signature**: `GetPublicReceipt(GetPublicReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `ReceiptEnvelope`
- **Error**: `ApiException<GetPublicReceiptError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetPublicReceiptRequest` | `src/AgentGuardApi/Requests/Receipts/GetPublicReceiptRequest.cs` |
| `ReceiptEnvelope` | `src/AgentGuardApi/Models/ReceiptEnvelope.cs` |
| `GetPublicReceiptError` | `src/AgentGuardApi/Errors/GetPublicReceiptError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetReceipt

- **Auth**: `options.Admin`
- **Signature**: `GetReceipt(GetReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `ReceiptEnvelope`
- **Error**: `ApiException<GetReceiptError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetReceiptRequest` | `src/AgentGuardApi/Requests/Receipts/GetReceiptRequest.cs` |
| `ReceiptEnvelope` | `src/AgentGuardApi/Models/ReceiptEnvelope.cs` |
| `GetReceiptError` | `src/AgentGuardApi/Errors/GetReceiptError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ListReceipts

- **Auth**: `options.Admin`
- **Signature**: `ListReceipts(ListReceiptsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Query params (wire ← C#)**: `limit` ← `Limit`
- **Returns**: `IReadOnlyList<ReceiptSummary>`
- **Error**: `ApiException<ListReceiptsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListReceiptsRequest` | `src/AgentGuardApi/Requests/Receipts/ListReceiptsRequest.cs` |
| `ReceiptSummary` | `src/AgentGuardApi/Models/ReceiptSummary.cs` |
| `ListReceiptsError` | `src/AgentGuardApi/Errors/ListReceiptsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

