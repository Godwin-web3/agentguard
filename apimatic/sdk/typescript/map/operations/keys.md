<!-- Generated file — do not edit; regenerated with the SDK. -->

# Keys — operations

Accessor: `client.keys` · Source: `src/resources/keys.ts` · 4 operations · Request and error types: namespace `Keys`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `agent-guard-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### getIssuerKey

- **Signature**: `getIssuerKey(options?: RequestOptions): ApiPromise<Record<string, unknown>, Keys.GetIssuerKeyError>`
- **Wire**: `GET /.well-known/agentguard-key`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Keys.GetIssuerKeyError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### getIssuerKeySet

- **Signature**: `getIssuerKeySet(options?: RequestOptions): ApiPromise<IssuerKeySet, Keys.GetIssuerKeySetError>`
- **Wire**: `GET /.well-known/agentguard-keys`
- **Auth**: none — public; no credential is sent
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `IssuerKeySet`
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Keys.GetIssuerKeySetError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [404] `ErrorResponse` · `"errorResponse3"` [413] `ErrorResponse` · `"errorResponse4"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `IssuerKeySet` | `issuerKeySetSchema` | `src/models/issuer-key-set.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### markKeyCompromised

- **Signature**: `markKeyCompromised(request: Keys.MarkKeyCompromisedRequest, options?: RequestOptions): ApiPromise<Record<string, unknown>, Keys.MarkKeyCompromisedError>`
- **Wire**: `POST /v1/keys/{kid}/compromised`
- **Auth**: `admin`
- **Request body**: `application/json` — the `body` field. **Optional**: omit it and the request carries no body and no `Content-Type` header at all
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Keys.MarkKeyCompromisedError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

**Fields** — `Keys.MarkKeyCompromisedRequest` (2):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `kid` | `path` | `string` | yes |
| `body` | `body` | `V1KeysCompromisedRequest` | no |

| Type | Schema value | Source |
| --- | --- | --- |
| `V1KeysCompromisedRequest` | `v1KeysCompromisedRequestSchema` | `src/models/v1-keys-compromised-request.ts` |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

### rotateIssuerKey

- **Signature**: `rotateIssuerKey(options?: RequestOptions): ApiPromise<Record<string, unknown>, Keys.RotateIssuerKeyError>`
- **Wire**: `POST /v1/keys/rotate`
- **Auth**: `admin`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `Record<string, unknown>` — a bare `application/json` map; the success type *is* the map
- **Error**: `AgentGuardApiError` with `kind: "api"`, an instance of `Keys.RotateIssuerKeyError` — **typed arms**, narrowed on `err.payload.kind`
- **Error arms**: `"errorResponse"` [400] `ErrorResponse` · `"errorResponse2"` [401] `ErrorResponse` · `"errorResponse3"` [404] `ErrorResponse` · `"errorResponse4"` [413] `ErrorResponse` · `"errorResponse5"` [500] `ErrorResponse` · `"undeclared"` [any other] `rawBody: ArrayBuffer`

| Type | Schema value | Source |
| --- | --- | --- |
| `ErrorResponse` | `errorResponseSchema` | `src/models/error-response.ts` |

