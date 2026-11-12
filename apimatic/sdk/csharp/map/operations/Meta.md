<!-- Generated file — do not edit; regenerated with the SDK. -->

# Meta — operations

Accessor: `client.Meta` · Source: `src/AgentGuardApi/Api/Meta.cs` · 3 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetHealth

- **Signature**: `GetHealth(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `Health`
- **Error**: `ApiException<GetHealthError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `Health` | `src/AgentGuardApi/Models/Health.cs` |
| `GetHealthError` | `src/AgentGuardApi/Errors/GetHealthError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetLiveness

- **Signature**: `GetLiveness(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<GetLivenessError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetLivenessError` | `src/AgentGuardApi/Errors/GetLivenessError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### HeadLiveness

- **Signature**: `HeadLiveness(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<HeadLivenessError>` — **Case A (typed)**
- **Error accessors**: `TryGetNoContent([NotNullWhen(true)] out RawError? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `HeadLivenessError` | `src/AgentGuardApi/Errors/HeadLivenessError.cs` |

