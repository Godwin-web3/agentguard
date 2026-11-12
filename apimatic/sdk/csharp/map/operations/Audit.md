<!-- Generated file — do not edit; regenerated with the SDK. -->

# Audit — operations

Accessor: `client.Audit` · Source: `src/AgentGuardApi/Api/Audit.cs` · 5 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### AnchorAuditChain

- **Auth**: `options.Admin`
- **Signature**: `AnchorAuditChain(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<AnchorAuditChainError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `AnchorAuditChainError` | `src/AgentGuardApi/Errors/AnchorAuditChainError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### GetAuditAttestation

- **Auth**: `options.Admin`
- **Signature**: `GetAuditAttestation(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<GetAuditAttestationError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetAuditAttestationError` | `src/AgentGuardApi/Errors/GetAuditAttestationError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ListAuditAnchors

- **Signature**: `ListAuditAnchors(ListAuditAnchorsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Query params (wire ← C#)**: `limit` ← `Limit`
- **Returns**: `object`
- **Error**: `ApiException<ListAuditAnchorsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListAuditAnchorsRequest` | `src/AgentGuardApi/Requests/Audit/ListAuditAnchorsRequest.cs` |
| `ListAuditAnchorsError` | `src/AgentGuardApi/Errors/ListAuditAnchorsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ListAuditEntries

- **Auth**: `options.Admin`
- **Signature**: `ListAuditEntries(ListAuditEntriesRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Query params (wire ← C#)**: `limit` ← `Limit`
- **Returns**: `IReadOnlyList<AuditEntry>`
- **Error**: `ApiException<ListAuditEntriesError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListAuditEntriesRequest` | `src/AgentGuardApi/Requests/Audit/ListAuditEntriesRequest.cs` |
| `AuditEntry` | `src/AgentGuardApi/Models/AuditEntry.cs` |
| `ListAuditEntriesError` | `src/AgentGuardApi/Errors/ListAuditEntriesError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### VerifyAuditChain

- **Auth**: `options.Admin`
- **Signature**: `VerifyAuditChain(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `AuditVerification`
- **Error**: `ApiException<VerifyAuditChainError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `AuditVerification` | `src/AgentGuardApi/Models/AuditVerification.cs` |
| `VerifyAuditChainError` | `src/AgentGuardApi/Errors/VerifyAuditChainError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

