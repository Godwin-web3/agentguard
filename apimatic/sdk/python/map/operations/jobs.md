<!-- Generated file — do not edit; regenerated with the SDK. -->

# Jobs — operations

Accessor: `client.jobs` · Source: `agent_guard_api/apis/jobs.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded.

### client.jobs.run_anchor_job

- **Route**: `GET /api/cron/anchor`
- **Auth**: `cron`
- **Signature**: `def run_anchor_job(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RunAnchorJobErrorBody]`
- **Error**: `RunAnchorJobErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `RunAnchorJobErrorBody` | `agent_guard_api/errors/run_anchor_job_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.jobs.run_anchor_job_post

- **Route**: `POST /api/cron/anchor`
- **Auth**: `cron`
- **Signature**: `def run_anchor_job_post(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RunAnchorJobPostErrorBody]`
- **Error**: `RunAnchorJobPostErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `RunAnchorJobPostErrorBody` | `agent_guard_api/errors/run_anchor_job_post_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.jobs.run_maintenance_job

- **Route**: `GET /api/cron/maintenance`
- **Auth**: `cron`
- **Signature**: `def run_maintenance_job(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RunMaintenanceJobErrorBody]`
- **Error**: `RunMaintenanceJobErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `RunMaintenanceJobErrorBody` | `agent_guard_api/errors/run_maintenance_job_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

### client.jobs.run_maintenance_job_post

- **Route**: `POST /api/cron/maintenance`
- **Auth**: `cron`
- **Signature**: `def run_maintenance_job_post(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `Any`
- **Returns (raw)**: `ApiResult[Any, RunMaintenanceJobPostErrorBody]`
- **Error**: `RunMaintenanceJobPostErrorBody` — **Case A (typed)**
- **Error arms**: `ErrorResponse` [400, 401, 404, 413, 500] · `RawError` [anything unmapped]

| Type | Source |
| --- | --- |
| `RunMaintenanceJobPostErrorBody` | `agent_guard_api/errors/run_maintenance_job_post_error.py` |
| `ErrorResponse` | `agent_guard_api/models/error_response.py` |

