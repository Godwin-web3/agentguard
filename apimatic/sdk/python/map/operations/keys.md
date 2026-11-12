<!-- Generated file — do not edit; regenerated with the SDK. -->

# Keys — operations

Accessor: `client.keys` · Source: `agent_guard_api/apis/keys.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.keys.get_issuer_key

- **Route**: `GET /.well-known/agentguard-key`
- **Signature**: `def get_issuer_key(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetIssuerKeyErrorBody]`
- **Error**: `GetIssuerKeyErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetIssuerKeyErrorBody` | `agent_guard_api/errors/get_issuer_key_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.keys.get_issuer_key_set

- **Route**: `GET /.well-known/agentguard-keys`
- **Signature**: `def get_issuer_key_set(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `IssuerKeySet`
- **Returns (raw)**: `ApiResult[IssuerKeySet, GetIssuerKeySetErrorBody]`
- **Error**: `GetIssuerKeySetErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `IssuerKeySet` | `agent_guard_api/models/issuer_key_set.py` |
| `GetIssuerKeySetErrorBody` | `agent_guard_api/errors/get_issuer_key_set_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.keys.mark_key_compromised

- **Route**: `POST /v1/keys/{kid}/compromised`
- **Auth**: `admin`
- **Signature**: `def mark_key_compromised(kid: str, *, body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `kid`
- **Params**: `kid` — path · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, MarkKeyCompromisedErrorBody]`
- **Error**: `MarkKeyCompromisedErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1KeysCompromisedRequest` | `agent_guard_api/models/v1_keys_compromised_request.py` |
| `V1KeysCompromisedRequestDict` | `agent_guard_api/models/v1_keys_compromised_request.py` |
| `MarkKeyCompromisedErrorBody` | `agent_guard_api/errors/mark_key_compromised_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.keys.rotate_issuer_key

- **Route**: `POST /v1/keys/rotate`
- **Auth**: `admin`
- **Signature**: `def rotate_issuer_key(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RotateIssuerKeyErrorBody]`
- **Error**: `RotateIssuerKeyErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `RotateIssuerKeyErrorBody` | `agent_guard_api/errors/rotate_issuer_key_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

