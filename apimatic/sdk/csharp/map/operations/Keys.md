<!-- Generated file — do not edit; regenerated with the SDK. -->

# Keys — operations

Accessor: `client.Keys` · Source: `src/AgentGuardApi/Api/Keys.cs` · 4 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetIssuerKey

- **Signature**: `GetIssuerKey(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<GetIssuerKeyError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetIssuerKeyError` | `src/AgentGuardApi/Errors/GetIssuerKeyError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetIssuerKeySet

- **Signature**: `GetIssuerKeySet(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `IssuerKeySet`
- **Error**: `ApiException<GetIssuerKeySetError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `IssuerKeySet` | `src/AgentGuardApi/Models/IssuerKeySet.cs` |
| `GetIssuerKeySetError` | `src/AgentGuardApi/Errors/GetIssuerKeySetError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### MarkKeyCompromised

- **Auth**: `options.Admin`
- **Signature**: `MarkKeyCompromised(MarkKeyCompromisedRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Kid`
- **Returns**: `object`
- **Error**: `ApiException<MarkKeyCompromisedError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `MarkKeyCompromisedRequest` | `src/AgentGuardApi/Requests/Keys/MarkKeyCompromisedRequest.cs` |
| `V1KeysCompromisedRequest` | `src/AgentGuardApi/Models/V1KeysCompromisedRequest.cs` |
| `MarkKeyCompromisedError` | `src/AgentGuardApi/Errors/MarkKeyCompromisedError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### RotateIssuerKey

- **Auth**: `options.Admin`
- **Signature**: `RotateIssuerKey(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<RotateIssuerKeyError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `RotateIssuerKeyError` | `src/AgentGuardApi/Errors/RotateIssuerKeyError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

