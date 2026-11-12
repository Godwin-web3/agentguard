<!-- Generated file — do not edit; regenerated with the SDK. -->

# Agent — operations

Accessor: `client.Agent` · Source: `src/AgentGuardApi/Api/Agent.cs` · 5 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetAgentMandate

- **Auth**: `options.Agent`
- **Signature**: `GetAgentMandate(GetAgentMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `AgentMandate`
- **Error**: `ApiException<GetAgentMandateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetAgentMandateRequest` | `src/AgentGuardApi/Requests/Agent/GetAgentMandateRequest.cs` |
| `AgentMandate` | `src/AgentGuardApi/Models/AgentMandate.cs` |
| `GetAgentMandateError` | `src/AgentGuardApi/Errors/GetAgentMandateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetAgentPayment

- **Auth**: `options.Agent`
- **Signature**: `GetAgentPayment(GetAgentPaymentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `PaymentDecision`
- **Error**: `ApiException<GetAgentPaymentError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetAgentPaymentRequest` | `src/AgentGuardApi/Requests/Agent/GetAgentPaymentRequest.cs` |
| `PaymentDecision` | `src/AgentGuardApi/Models/PaymentDecision.cs` |
| `GetAgentPaymentError` | `src/AgentGuardApi/Errors/GetAgentPaymentError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetAgentPaymentReceipt

- **Auth**: `options.Agent`
- **Signature**: `GetAgentPaymentReceipt(GetAgentPaymentReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `ReceiptEnvelope`
- **Error**: `ApiException<GetAgentPaymentReceiptError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetAgentPaymentReceiptRequest` | `src/AgentGuardApi/Requests/Agent/GetAgentPaymentReceiptRequest.cs` |
| `ReceiptEnvelope` | `src/AgentGuardApi/Models/ReceiptEnvelope.cs` |
| `GetAgentPaymentReceiptError` | `src/AgentGuardApi/Errors/GetAgentPaymentReceiptError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ProposePayment

- **Auth**: `options.Agent`
- **Signature**: `ProposePayment(ProposePaymentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `PaymentDecision`
- **Error**: `ApiException<ProposePaymentError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 429, 500, 503] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ProposePaymentRequest` | `src/AgentGuardApi/Requests/Agent/ProposePaymentRequest.cs` |
| `V1AgentPaymentsRequest` | `src/AgentGuardApi/Models/V1AgentPaymentsRequest.cs` |
| `PaymentDecision` | `src/AgentGuardApi/Models/PaymentDecision.cs` |
| `ProposePaymentError` | `src/AgentGuardApi/Errors/ProposePaymentError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### SearchProducts

- **Auth**: `options.Agent`
- **Signature**: `SearchProducts(SearchProductsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `ProductSearchResult`
- **Error**: `ApiException<SearchProductsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `SearchProductsRequest` | `src/AgentGuardApi/Requests/Agent/SearchProductsRequest.cs` |
| `V1AgentProductsSearchRequest` | `src/AgentGuardApi/Models/V1AgentProductsSearchRequest.cs` |
| `ProductSearchResult` | `src/AgentGuardApi/Models/ProductSearchResult.cs` |
| `SearchProductsError` | `src/AgentGuardApi/Errors/SearchProductsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

