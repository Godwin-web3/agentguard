<!-- Generated file — do not edit; regenerated with the SDK. -->

# Passkeys — operations

Accessor: `client.passkeys` · Source: `agent_guard_api/apis/passkeys.py` · 9 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.passkeys.cancel_recovery

- **Route**: `POST /v1/users/{id}/recovery/cancel`
- **Signature**: `def cancel_recovery(id_: str, body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `body`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, CancelRecoveryErrorBody]`
- **Error**: `CancelRecoveryErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1UsersRecoveryCancelRequest` | `agent_guard_api/models/v1_users_recovery_cancel_request.py` |
| `V1UsersRecoveryCancelRequestDict` | `agent_guard_api/models/v1_users_recovery_cancel_request.py` |
| `CancelRecoveryErrorBody` | `agent_guard_api/errors/cancel_recovery_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.create_enrollment_link

- **Route**: `POST /v1/users/{id}/enrollments`
- **Auth**: `admin`
- **Signature**: `def create_enrollment_link(id_: str, *, body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, CreateEnrollmentLinkErrorBody]`
- **Error**: `CreateEnrollmentLinkErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1UsersEnrollmentsRequest` | `agent_guard_api/models/v1_users_enrollments_request.py` |
| `V1UsersEnrollmentsRequestDict` | `agent_guard_api/models/v1_users_enrollments_request.py` |
| `CreateEnrollmentLinkErrorBody` | `agent_guard_api/errors/create_enrollment_link_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.enroll_passkey

- **Route**: `POST /v1/enroll`
- **Signature**: `def enroll_passkey(body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, EnrollPasskeyErrorBody]`
- **Error**: `EnrollPasskeyErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1EnrollRequest` | `agent_guard_api/models/v1_enroll_request.py` |
| `V1EnrollRequestDict` | `agent_guard_api/models/v1_enroll_request.py` |
| `EnrollPasskeyErrorBody` | `agent_guard_api/errors/enroll_passkey_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.get_enrollment_options

- **Route**: `POST /v1/enroll/options`
- **Signature**: `def get_enrollment_options(body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `body`
- **Params**: `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetEnrollmentOptionsErrorBody]`
- **Error**: `GetEnrollmentOptionsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1EnrollOptionsRequest` | `agent_guard_api/models/v1_enroll_options_request.py` |
| `V1EnrollOptionsRequestDict` | `agent_guard_api/models/v1_enroll_options_request.py` |
| `GetEnrollmentOptionsErrorBody` | `agent_guard_api/errors/get_enrollment_options_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.get_recovery_cancel_options

- **Route**: `POST /v1/users/{id}/recovery/cancel-request`
- **Signature**: `def get_recovery_cancel_options(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetRecoveryCancelOptionsErrorBody]`
- **Error**: `GetRecoveryCancelOptionsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetRecoveryCancelOptionsErrorBody` | `agent_guard_api/errors/get_recovery_cancel_options_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.get_recovery_state

- **Route**: `GET /v1/users/{id}/recovery`
- **Auth**: `admin`
- **Signature**: `def get_recovery_state(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetRecoveryStateErrorBody]`
- **Error**: `GetRecoveryStateErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetRecoveryStateErrorBody` | `agent_guard_api/errors/get_recovery_state_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.get_reenrollment_options

- **Route**: `POST /v1/users/{id}/reenroll-request`
- **Auth**: `admin`
- **Signature**: `def get_reenrollment_options(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetReenrollmentOptionsErrorBody]`
- **Error**: `GetReenrollmentOptionsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetReenrollmentOptionsErrorBody` | `agent_guard_api/errors/get_reenrollment_options_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.get_user_passkey

- **Route**: `GET /v1/users/{id}/passkey`
- **Auth**: `admin`
- **Signature**: `def get_user_passkey(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetUserPasskeyErrorBody]`
- **Error**: `GetUserPasskeyErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetUserPasskeyErrorBody` | `agent_guard_api/errors/get_user_passkey_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.passkeys.reenroll_passkey

- **Route**: `POST /v1/users/{id}/reenroll`
- **Auth**: `admin`
- **Signature**: `def reenroll_passkey(id_: str, body: V1UsersReenrollRequest | V1UsersReenrollRequestDict, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`, `body`
- **Params**: `id_` — path `id` · `body` — JSON body
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ReenrollPasskeyErrorBody]`
- **Error**: `ReenrollPasskeyErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `V1UsersReenrollRequest` | `agent_guard_api/models/v1_users_reenroll_request.py` |
| `V1UsersReenrollRequestDict` | `agent_guard_api/models/v1_users_reenroll_request.py` |
| `ReenrollPasskeyErrorBody` | `agent_guard_api/errors/reenroll_passkey_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

