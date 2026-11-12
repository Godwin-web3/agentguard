<!-- Generated file — do not edit; regenerated with the SDK. -->

# Control — operations

Accessor: `client.Control` · Source: `src/AgentGuardApi/Api/Control.cs` · 3 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetPauseState

- **Auth**: `options.Admin`
- **Signature**: `GetPauseState(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `PauseState`
- **Error**: `ApiException<GetPauseStateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `PauseState` | `src/AgentGuardApi/Models/PauseState.cs` |
| `GetPauseStateError` | `src/AgentGuardApi/Errors/GetPauseStateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### Pause

- **Auth**: `options.Admin`
- **Signature**: `Pause(PauseRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<PauseError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `PauseRequest` | `src/AgentGuardApi/Requests/Control/PauseRequest.cs` |
| `V1ControlPauseRequest` | `src/AgentGuardApi/Models/V1ControlPauseRequest.cs` |
| `PauseError` | `src/AgentGuardApi/Errors/PauseError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### Resume

- **Auth**: `options.Admin`
- **Signature**: `Resume(ResumeRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<ResumeError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ResumeRequest` | `src/AgentGuardApi/Requests/Control/ResumeRequest.cs` |
| `V1ControlResumeRequest` | `src/AgentGuardApi/Models/V1ControlResumeRequest.cs` |
| `ResumeError` | `src/AgentGuardApi/Errors/ResumeError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

