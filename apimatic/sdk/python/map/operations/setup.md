<!-- Generated file — do not edit; regenerated with the SDK. -->

# Setup — operations

Accessor: `client.setup` · Source: `agent_guard_api/apis/setup.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.setup.complete_wallet_setup

- **Route**: `GET /v1/wallets/return`
- **Signature**: `def complete_wallet_setup(*, state: str | None = None, approval_token_id: str | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `state` — query · `approval_token_id` — query
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, CompleteWalletSetupErrorBody]`
- **Error**: `CompleteWalletSetupErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `CompleteWalletSetupErrorBody` | `agent_guard_api/errors/complete_wallet_setup_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.setup.link_wallet

- **Route**: `POST /v1/wallets/link`
- **Auth**: `admin`
- **Signature**: `def link_wallet(body: V1WalletsLinkRequest | V1WalletsLinkRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, LinkWalletErrorBody]`
- **Error**: `LinkWalletErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1WalletsLinkRequest` | `agent_guard_api/models/v1_wallets_link_request.py` |
| `V1WalletsLinkRequestDict` | `agent_guard_api/models/v1_wallets_link_request.py` |
| `LinkWalletErrorBody` | `agent_guard_api/errors/link_wallet_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.setup.register_agent

- **Route**: `POST /v1/agents`
- **Auth**: `admin`
- **Signature**: `def register_agent(body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `AgentCredentials`
- **Returns (raw)**: `ApiResult[AgentCredentials, RegisterAgentErrorBody]`
- **Error**: `RegisterAgentErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1AgentsRequest` | `agent_guard_api/models/v1_agents_request.py` |
| `V1AgentsRequestDict` | `agent_guard_api/models/v1_agents_request.py` |
| `AgentCredentials` | `agent_guard_api/models/agent_credentials.py` |
| `RegisterAgentErrorBody` | `agent_guard_api/errors/register_agent_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.setup.start_wallet_setup

- **Route**: `POST /v1/wallets/setup`
- **Auth**: `admin`
- **Signature**: `def start_wallet_setup(body: V1WalletsSetupRequest | V1WalletsSetupRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, StartWalletSetupErrorBody]`
- **Error**: `StartWalletSetupErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1WalletsSetupRequest` | `agent_guard_api/models/v1_wallets_setup_request.py` |
| `V1WalletsSetupRequestDict` | `agent_guard_api/models/v1_wallets_setup_request.py` |
| `StartWalletSetupErrorBody` | `agent_guard_api/errors/start_wallet_setup_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

