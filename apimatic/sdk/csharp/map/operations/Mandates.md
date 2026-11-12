<!-- Generated file — do not edit; regenerated with the SDK. -->

# Mandates — operations

Accessor: `client.Mandates` · Source: `src/AgentGuardApi/Api/Mandates.cs` · 8 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### ConfirmMandate

- **Auth**: `options.Admin`
- **Signature**: `ConfirmMandate(ConfirmMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `Body`
- **Returns**: `object`
- **Error**: `ApiException<ConfirmMandateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ConfirmMandateRequest` | `src/AgentGuardApi/Requests/Mandates/ConfirmMandateRequest.cs` |
| `V1MandatesConfirmRequest` | `src/AgentGuardApi/Models/V1MandatesConfirmRequest.cs` |
| `ConfirmMandateError` | `src/AgentGuardApi/Errors/ConfirmMandateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### CreateMandate

- **Auth**: `options.Admin`
- **Signature**: `CreateMandate(CreateMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `object`
- **Error**: `ApiException<CreateMandateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `CreateMandateRequest` | `src/AgentGuardApi/Requests/Mandates/CreateMandateRequest.cs` |
| `V1MandatesRequest` | `src/AgentGuardApi/Models/V1MandatesRequest.cs` |
| `CreateMandateError` | `src/AgentGuardApi/Errors/CreateMandateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### DraftMandateFromText

- **Auth**: `options.Admin`
- **Signature**: `DraftMandateFromText(DraftMandateFromTextRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `object`
- **Error**: `ApiException<DraftMandateFromTextError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `DraftMandateFromTextRequest` | `src/AgentGuardApi/Requests/Mandates/DraftMandateFromTextRequest.cs` |
| `V1MandatesDraftFromTextRequest` | `src/AgentGuardApi/Models/V1MandatesDraftFromTextRequest.cs` |
| `DraftMandateFromTextError` | `src/AgentGuardApi/Errors/DraftMandateFromTextError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetMandate

- **Auth**: `options.Admin`
- **Signature**: `GetMandate(GetMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetMandateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetMandateRequest` | `src/AgentGuardApi/Requests/Mandates/GetMandateRequest.cs` |
| `GetMandateError` | `src/AgentGuardApi/Errors/GetMandateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetMandateRevocationOptions

- **Auth**: `options.Admin`
- **Signature**: `GetMandateRevocationOptions(GetMandateRevocationOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetMandateRevocationOptionsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetMandateRevocationOptionsRequest` | `src/AgentGuardApi/Requests/Mandates/GetMandateRevocationOptionsRequest.cs` |
| `GetMandateRevocationOptionsError` | `src/AgentGuardApi/Errors/GetMandateRevocationOptionsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetMandateSigningOptions

- **Auth**: `options.Admin`
- **Signature**: `GetMandateSigningOptions(GetMandateSigningOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<GetMandateSigningOptionsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetMandateSigningOptionsRequest` | `src/AgentGuardApi/Requests/Mandates/GetMandateSigningOptionsRequest.cs` |
| `GetMandateSigningOptionsError` | `src/AgentGuardApi/Errors/GetMandateSigningOptionsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ListMandates

- **Auth**: `options.Admin`
- **Signature**: `ListMandates(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<ListMandatesError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListMandatesError` | `src/AgentGuardApi/Errors/ListMandatesError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### RevokeMandate

- **Auth**: `options.Admin`
- **Signature**: `RevokeMandate(RevokeMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `object`
- **Error**: `ApiException<RevokeMandateError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `RevokeMandateRequest` | `src/AgentGuardApi/Requests/Mandates/RevokeMandateRequest.cs` |
| `V1MandatesRevokeRequest` | `src/AgentGuardApi/Models/V1MandatesRevokeRequest.cs` |
| `RevokeMandateError` | `src/AgentGuardApi/Errors/RevokeMandateError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

