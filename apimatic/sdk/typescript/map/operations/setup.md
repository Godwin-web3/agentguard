<!-- Generated file — do not edit; regenerated with the SDK. -->

# Setup — operations

Accessor: `client.setup` · Source: `src/resources/setup.ts` · 4 operations · Request and error types: namespace `Setup`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### completeWalletSetup

- **Signature**: `completeWalletSetup(request?: Setup.CompleteWalletSetupRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Setup.CompleteWalletSetupError>`
- **Wire**: `GET /v1/wallets/return`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Setup.CompleteWalletSetupError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Setup.CompleteWalletSetupRequest` (2):

| Field | Channel | Wire | Type | Req |
| --- | --- | --- | --- | --- |
| `state` | `query` | — | `string` | no |
| `approvalTokenId` | `query` | `approval_token_id` | `string` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### linkWallet

- **Signature**: `linkWallet(request: Setup.LinkWalletRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Setup.LinkWalletError>`
- **Wire**: `POST /v1/wallets/link`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Setup.LinkWalletError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Setup.LinkWalletRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1WalletsLinkRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1WalletsLinkRequest` | `v1WalletsLinkRequestSchema` | `src/models/v1-wallets-link-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### registerAgent

- **Signature**: `registerAgent(request: Setup.RegisterAgentRequest, options?: RequestOptions): ApiPromise<AgentCredentials, Setup.RegisterAgentError>`
- **Wire**: `POST /v1/agents`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `AgentCredentials`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Setup.RegisterAgentError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Setup.RegisterAgentRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1AgentsRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1AgentsRequest` | `v1AgentsRequestSchema` | `src/models/v1-agents-request.ts` |
| `AgentCredentials` | `agentCredentialsSchema` | `src/models/agent-credentials.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### startWalletSetup

- **Signature**: `startWalletSetup(request: Setup.StartWalletSetupRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Setup.StartWalletSetupError>`
- **Wire**: `POST /v1/wallets/setup`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Setup.StartWalletSetupError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Setup.StartWalletSetupRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `body` | `body` | `V1WalletsSetupRequest` | yes |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1WalletsSetupRequest` | `v1WalletsSetupRequestSchema` | `src/models/v1-wallets-setup-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

