<!-- Generated file — do not edit; regenerated with the SDK. -->

# Audit — operations

Accessor: `client.audit` · Source: `agent_guard_api/apis/audit.py` · 5 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.audit.anchor_audit_chain

- **Route**: `POST /v1/audit/anchor`
- **Auth**: `admin`
- **Signature**: `def anchor_audit_chain(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, AnchorAuditChainErrorBody]`
- **Error**: `AnchorAuditChainErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `AnchorAuditChainErrorBody` | `agent_guard_api/errors/anchor_audit_chain_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.audit.get_audit_attestation

- **Route**: `GET /v1/audit/attestation`
- **Auth**: `admin`
- **Signature**: `def get_audit_attestation(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, GetAuditAttestationErrorBody]`
- **Error**: `GetAuditAttestationErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `GetAuditAttestationErrorBody` | `agent_guard_api/errors/get_audit_attestation_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.audit.list_audit_anchors

- **Route**: `GET /v1/audit/anchors`
- **Signature**: `def list_audit_anchors(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `limit` — query
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, ListAuditAnchorsErrorBody]`
- **Error**: `ListAuditAnchorsErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `ListAuditAnchorsErrorBody` | `agent_guard_api/errors/list_audit_anchors_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.audit.list_audit_entries

- **Route**: `GET /v1/audit`
- **Auth**: `admin`
- **Signature**: `def list_audit_entries(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None)`
- **Params**: `limit` — query
- **Returns (parsed)**: `list[AuditEntry]`
- **Returns (raw)**: `ApiResult[list[AuditEntry], ListAuditEntriesErrorBody]`
- **Error**: `ListAuditEntriesErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `AuditEntry` | `agent_guard_api/models/audit_entry.py` |
| `ListAuditEntriesErrorBody` | `agent_guard_api/errors/list_audit_entries_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.audit.verify_audit_chain

- **Route**: `GET /v1/audit/verify`
- **Auth**: `admin`
- **Signature**: `def verify_audit_chain(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `AuditVerification`
- **Returns (raw)**: `ApiResult[AuditVerification, VerifyAuditChainErrorBody]`
- **Error**: `VerifyAuditChainErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `AuditVerification` | `agent_guard_api/models/audit_verification.py` |
| `VerifyAuditChainErrorBody` | `agent_guard_api/errors/verify_audit_chain_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

