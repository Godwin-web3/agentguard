<!-- Generated file — do not edit; regenerated with the SDK. -->

# Mandates — operations

Accessor: `client.mandates` · Source: `agent_guard_api/apis/mandates.py` · 8 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.mandates.confirm_mandate

- **Route**: `POST /v1/mandates/{id}/confirm`
- **Auth**: `admin`
- **Signature**: `def confirm_mandate(id_: str, body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `body`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ConfirmMandateErrorBody]`
- **Error**: `ConfirmMandateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1MandatesConfirmRequest` | `agent_guard_api/models/v1_mandates_confirm_request.py` |
| `V1MandatesConfirmRequestDict` | `agent_guard_api/models/v1_mandates_confirm_request.py` |
| `ConfirmMandateErrorBody` | `agent_guard_api/errors/confirm_mandate_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.create_mandate

- **Route**: `POST /v1/mandates`
- **Auth**: `admin`
- **Signature**: `def create_mandate(body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, CreateMandateErrorBody]`
- **Error**: `CreateMandateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1MandatesRequest` | `agent_guard_api/models/v1_mandates_request.py` |
| `V1MandatesRequestDict` | `agent_guard_api/models/v1_mandates_request.py` |
| `CreateMandateErrorBody` | `agent_guard_api/errors/create_mandate_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.draft_mandate_from_text

- **Route**: `POST /v1/mandates/draft-from-text`
- **Auth**: `admin`
- **Signature**: `def draft_mandate_from_text(body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, DraftMandateFromTextErrorBody]`
- **Error**: `DraftMandateFromTextErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1MandatesDraftFromTextRequest` | `agent_guard_api/models/v1_mandates_draft_from_text_request.py` |
| `V1MandatesDraftFromTextRequestDict` | `agent_guard_api/models/v1_mandates_draft_from_text_request.py` |
| `DraftMandateFromTextErrorBody` | `agent_guard_api/errors/draft_mandate_from_text_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.get_mandate

- **Route**: `GET /v1/mandates/{id}`
- **Auth**: `admin`
- **Signature**: `def get_mandate(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetMandateErrorBody]`
- **Error**: `GetMandateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetMandateErrorBody` | `agent_guard_api/errors/get_mandate_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.get_mandate_revocation_options

- **Route**: `POST /v1/mandates/{id}/revoke-request`
- **Auth**: `admin`
- **Signature**: `def get_mandate_revocation_options(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetMandateRevocationOptionsErrorBody]`
- **Error**: `GetMandateRevocationOptionsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetMandateRevocationOptionsErrorBody` | `agent_guard_api/errors/get_mandate_revocation_options_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.get_mandate_signing_options

- **Route**: `POST /v1/mandates/{id}/sign-request`
- **Auth**: `admin`
- **Signature**: `def get_mandate_signing_options(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetMandateSigningOptionsErrorBody]`
- **Error**: `GetMandateSigningOptionsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetMandateSigningOptionsErrorBody` | `agent_guard_api/errors/get_mandate_signing_options_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.list_mandates

- **Route**: `GET /v1/mandates`
- **Auth**: `admin`
- **Signature**: `def list_mandates(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ListMandatesErrorBody]`
- **Error**: `ListMandatesErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ListMandatesErrorBody` | `agent_guard_api/errors/list_mandates_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.mandates.revoke_mandate

- **Route**: `POST /v1/mandates/{id}/revoke`
- **Auth**: `admin`
- **Signature**: `def revoke_mandate(id_: str, *, body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RevokeMandateErrorBody]`
- **Error**: `RevokeMandateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1MandatesRevokeRequest` | `agent_guard_api/models/v1_mandates_revoke_request.py` |
| `V1MandatesRevokeRequestDict` | `agent_guard_api/models/v1_mandates_revoke_request.py` |
| `RevokeMandateErrorBody` | `agent_guard_api/errors/revoke_mandate_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

