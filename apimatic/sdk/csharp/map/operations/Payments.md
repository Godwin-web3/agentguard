<!-- Generated file — do not edit; regenerated with the SDK. -->

# Payments — operations

Accessor: `client.Payments` · Source: `src/AgentGuardApi/Api/Payments.cs` · 3 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### ListPayments

- **Auth**: `options.Admin`
- **Signature**: `ListPayments(ListPaymentsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Query params (wire ← C#)**: `limit` ← `Limit`
- **Returns**: `object`
- **Error**: `ApiException<ListPaymentsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListPaymentsRequest` | `src/AgentGuardApi/Requests/Payments/ListPaymentsRequest.cs` |
| `ListPaymentsError` | `src/AgentGuardApi/Errors/ListPaymentsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ListStuckPayments

- **Auth**: `options.Admin`
- **Signature**: `ListStuckPayments(ListStuckPaymentsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Query params (wire ← C#)**: `older_than_ms` ← `OlderThanMs`
- **Returns**: `object`
- **Error**: `ApiException<ListStuckPaymentsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListStuckPaymentsRequest` | `src/AgentGuardApi/Requests/Payments/ListStuckPaymentsRequest.cs` |
| `ListStuckPaymentsError` | `src/AgentGuardApi/Errors/ListStuckPaymentsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### RecoverPayments

- **Auth**: `options.Admin`
- **Signature**: `RecoverPayments(RecoverPaymentsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<RecoverPaymentsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `RecoverPaymentsRequest` | `src/AgentGuardApi/Requests/Payments/RecoverPaymentsRequest.cs` |
| `V1RecoverRequest` | `src/AgentGuardApi/Models/V1RecoverRequest.cs` |
| `RecoverPaymentsError` | `src/AgentGuardApi/Errors/RecoverPaymentsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

