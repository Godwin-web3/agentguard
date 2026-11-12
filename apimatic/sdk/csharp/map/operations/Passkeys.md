<!-- Generated file — do not edit; regenerated with the SDK. -->

# Passkeys — operations

Accessor: `client.Passkeys` · Source: `src/AgentGuardApi/Api/Passkeys.cs` · 9 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### CancelRecovery

- **Signature**: `CancelRecovery(CancelRecoveryRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `Body`
- **Returns**: `object`
- **Error**: `ApiException<CancelRecoveryError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `CancelRecoveryRequest` | `src/AgentGuardApi/Requests/Passkeys/CancelRecoveryRequest.cs` |
| `V1UsersRecoveryCancelRequest` | `src/AgentGuardApi/Models/V1UsersRecoveryCancelRequest.cs` |
| `CancelRecoveryError` | `src/AgentGuardApi/Errors/CancelRecoveryError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### CreateEnrollmentLink

- **Auth**: `options.Admin`
- **Signature**: `CreateEnrollmentLink(CreateEnrollmentLinkRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<CreateEnrollmentLinkError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `CreateEnrollmentLinkRequest` | `src/AgentGuardApi/Requests/Passkeys/CreateEnrollmentLinkRequest.cs` |
| `V1UsersEnrollmentsRequest` | `src/AgentGuardApi/Models/V1UsersEnrollmentsRequest.cs` |
| `CreateEnrollmentLinkError` | `src/AgentGuardApi/Errors/CreateEnrollmentLinkError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### EnrollPasskey

- **Signature**: `EnrollPasskey(EnrollPasskeyRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `object`
- **Error**: `ApiException<EnrollPasskeyError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `EnrollPasskeyRequest` | `src/AgentGuardApi/Requests/Passkeys/EnrollPasskeyRequest.cs` |
| `V1EnrollRequest` | `src/AgentGuardApi/Models/V1EnrollRequest.cs` |
| `EnrollPasskeyError` | `src/AgentGuardApi/Errors/EnrollPasskeyError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetEnrollmentOptions

- **Signature**: `GetEnrollmentOptions(GetEnrollmentOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `object`
- **Error**: `ApiException<GetEnrollmentOptionsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetEnrollmentOptionsRequest` | `src/AgentGuardApi/Requests/Passkeys/GetEnrollmentOptionsRequest.cs` |
| `V1EnrollOptionsRequest` | `src/AgentGuardApi/Models/V1EnrollOptionsRequest.cs` |
| `GetEnrollmentOptionsError` | `src/AgentGuardApi/Errors/GetEnrollmentOptionsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetRecoveryCancelOptions

- **Signature**: `GetRecoveryCancelOptions(GetRecoveryCancelOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetRecoveryCancelOptionsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetRecoveryCancelOptionsRequest` | `src/AgentGuardApi/Requests/Passkeys/GetRecoveryCancelOptionsRequest.cs` |
| `GetRecoveryCancelOptionsError` | `src/AgentGuardApi/Errors/GetRecoveryCancelOptionsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetRecoveryState

- **Auth**: `options.Admin`
- **Signature**: `GetRecoveryState(GetRecoveryStateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetRecoveryStateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetRecoveryStateRequest` | `src/AgentGuardApi/Requests/Passkeys/GetRecoveryStateRequest.cs` |
| `GetRecoveryStateError` | `src/AgentGuardApi/Errors/GetRecoveryStateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetReenrollmentOptions

- **Auth**: `options.Admin`
- **Signature**: `GetReenrollmentOptions(GetReenrollmentOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetReenrollmentOptionsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetReenrollmentOptionsRequest` | `src/AgentGuardApi/Requests/Passkeys/GetReenrollmentOptionsRequest.cs` |
| `GetReenrollmentOptionsError` | `src/AgentGuardApi/Errors/GetReenrollmentOptionsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetUserPasskey

- **Auth**: `options.Admin`
- **Signature**: `GetUserPasskey(GetUserPasskeyRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetUserPasskeyError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetUserPasskeyRequest` | `src/AgentGuardApi/Requests/Passkeys/GetUserPasskeyRequest.cs` |
| `GetUserPasskeyError` | `src/AgentGuardApi/Errors/GetUserPasskeyError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ReenrollPasskey

- **Auth**: `options.Admin`
- **Signature**: `ReenrollPasskey(ReenrollPasskeyRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `Body`
- **Returns**: `object`
- **Error**: `ApiException<ReenrollPasskeyError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ReenrollPasskeyRequest` | `src/AgentGuardApi/Requests/Passkeys/ReenrollPasskeyRequest.cs` |
| `V1UsersReenrollRequest` | `src/AgentGuardApi/Models/V1UsersReenrollRequest.cs` |
| `ReenrollPasskeyError` | `src/AgentGuardApi/Errors/ReenrollPasskeyError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

