<!-- Generated file — do not edit; regenerated with the SDK. -->

# Approvals — operations

Accessor: `client.Approvals` · Source: `src/AgentGuardApi/Api/Approvals.cs` · 3 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### GetApprovalOptions

- **Auth**: `options.Admin`
- **Signature**: `GetApprovalOptions(GetApprovalOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `Body`
- **Returns**: `object`
- **Error**: `ApiException<GetApprovalOptionsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `GetApprovalOptionsRequest` | `src/AgentGuardApi/Requests/Approvals/GetApprovalOptionsRequest.cs` |
| `V1ApprovalsRequestRequest` | `src/AgentGuardApi/Models/V1ApprovalsRequestRequest.cs` |
| `GetApprovalOptionsError` | `src/AgentGuardApi/Errors/GetApprovalOptionsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ListApprovals

- **Auth**: `options.Admin`
- **Signature**: `ListApprovals(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `object`
- **Error**: `ApiException<ListApprovalsError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ListApprovalsError` | `src/AgentGuardApi/Errors/ListApprovalsError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### ResolveApproval

- **Auth**: `options.Admin`
- **Signature**: `ResolveApproval(ResolveApprovalRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `Body`
- **Returns**: `object`
- **Error**: `ApiException<ResolveApprovalError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `ResolveApprovalRequest` | `src/AgentGuardApi/Requests/Approvals/ResolveApprovalRequest.cs` |
| `V1ApprovalsRequest` | `src/AgentGuardApi/Models/V1ApprovalsRequest.cs` |
| `ResolveApprovalError` | `src/AgentGuardApi/Errors/ResolveApprovalError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

