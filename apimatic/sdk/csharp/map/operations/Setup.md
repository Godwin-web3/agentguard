<!-- Generated file — do not edit; regenerated with the SDK. -->

# Setup — operations

Accessor: `client.Setup` · Source: `src/AgentGuardApi/Api/Setup.cs` · 4 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### CompleteWalletSetup

- **Signature**: `CompleteWalletSetup(CompleteWalletSetupRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Query params (wire ← C#)**: `state` ← `State`, `approval_token_id` ← `ApprovalTokenId`
- **Returns**: `object`
- **Error**: `ApiException<CompleteWalletSetupError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `CompleteWalletSetupRequest` | `src/AgentGuardApi/Requests/Setup/CompleteWalletSetupRequest.cs` |
| `CompleteWalletSetupError` | `src/AgentGuardApi/Errors/CompleteWalletSetupError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### LinkWallet

- **Auth**: `options.Admin`
- **Signature**: `LinkWallet(LinkWalletRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `object`
- **Error**: `ApiException<LinkWalletError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `LinkWalletRequest` | `src/AgentGuardApi/Requests/Setup/LinkWalletRequest.cs` |
| `V1WalletsLinkRequest` | `src/AgentGuardApi/Models/V1WalletsLinkRequest.cs` |
| `LinkWalletError` | `src/AgentGuardApi/Errors/LinkWalletError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### RegisterAgent

- **Auth**: `options.Admin`
- **Signature**: `RegisterAgent(RegisterAgentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `AgentCredentials`
- **Error**: `ApiException<RegisterAgentError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `RegisterAgentRequest` | `src/AgentGuardApi/Requests/Setup/RegisterAgentRequest.cs` |
| `V1AgentsRequest` | `src/AgentGuardApi/Models/V1AgentsRequest.cs` |
| `AgentCredentials` | `src/AgentGuardApi/Models/AgentCredentials.cs` |
| `RegisterAgentError` | `src/AgentGuardApi/Errors/RegisterAgentError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

### StartWalletSetup

- **Auth**: `options.Admin`
- **Signature**: `StartWalletSetup(StartWalletSetupRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Body`
- **Returns**: `object`
- **Error**: `ApiException<StartWalletSetupError>` — **Case A (typed)**
- **Error accessors**: `TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value)` [400, 401, 404, 413, 500] · `TryGetRawError([NotNullWhen(true)] out RawError? error)` [fallback]

| Type | Source |
| --- | --- |
| `StartWalletSetupRequest` | `src/AgentGuardApi/Requests/Setup/StartWalletSetupRequest.cs` |
| `V1WalletsSetupRequest` | `src/AgentGuardApi/Models/V1WalletsSetupRequest.cs` |
| `StartWalletSetupError` | `src/AgentGuardApi/Errors/StartWalletSetupError.cs` |
| `ErrorResponseModel` | `src/AgentGuardApi/Models/ErrorResponseModel.cs` |

