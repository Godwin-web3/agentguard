# Raw Reference

**Raw** endpoints, reached through `with_raw_response`, return `ApiResult[T, E]` and never raise for an API error. For the parsed endpoints, see [API Reference](api-reference.md).

> Source: [AgentGuardApiClient](agent_guard_api/client.py)

## Agent

> Source: [Agent](agent_guard_api/apis/agent.py)

<details>
<summary><code>def get_agent_mandate(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[AgentMandate, GetAgentMandateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

The agent's own mandate, status and spend

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.agent.with_raw_response.get_agent_mandate("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AgentMandate
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAgentMandateErrorBody
```

**Async**

```python
result = await async_client.agent.with_raw_response.get_agent_mandate("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AgentMandate
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAgentMandateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[AgentMandate](agent_guard_api/models/agent_mandate.py), [GetAgentMandateErrorBody](agent_guard_api/errors/get_agent_mandate_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[AgentMandate](agent_guard_api/models/agent_mandate.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetAgentMandateErrorBody](agent_guard_api/errors/get_agent_mandate_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_agent_payment(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[PaymentDecision, GetAgentPaymentErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Payment status (the calling agent's own only)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.agent.with_raw_response.get_agent_payment("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type PaymentDecision
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAgentPaymentErrorBody
```

**Async**

```python
result = await async_client.agent.with_raw_response.get_agent_payment("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type PaymentDecision
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAgentPaymentErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[PaymentDecision](agent_guard_api/models/payment_decision.py), [GetAgentPaymentErrorBody](agent_guard_api/errors/get_agent_payment_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[PaymentDecision](agent_guard_api/models/payment_decision.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetAgentPaymentErrorBody](agent_guard_api/errors/get_agent_payment_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_agent_payment_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ReceiptEnvelope, GetAgentPaymentReceiptErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Proof-of-Intent receipt for a captured payment

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.agent.with_raw_response.get_agent_payment_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAgentPaymentReceiptErrorBody
```

**Async**

```python
result = await async_client.agent.with_raw_response.get_agent_payment_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAgentPaymentReceiptErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py), [GetAgentPaymentReceiptErrorBody](agent_guard_api/errors/get_agent_payment_receipt_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetAgentPaymentReceiptErrorBody](agent_guard_api/errors/get_agent_payment_receipt_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def propose_payment(body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[PaymentDecision, ProposePaymentErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Propose a payment (30/min per agent; 429 above)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.agent.with_raw_response.propose_payment(
    V1AgentPaymentsRequest(
        mandate_id="some example string", agent_id="some example string", idempotency_key="some example string"
    ),
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type PaymentDecision
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ProposePaymentErrorBody
```

**Async**

```python
result = await async_client.agent.with_raw_response.propose_payment(
    V1AgentPaymentsRequest(
        mandate_id="some example string", agent_id="some example string", idempotency_key="some example string"
    ),
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type PaymentDecision
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ProposePaymentErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1AgentPaymentsRequest](agent_guard_api/models/v1_agent_payments_request.py) \| [V1AgentPaymentsRequestDict](agent_guard_api/models/v1_agent_payments_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[PaymentDecision](agent_guard_api/models/payment_decision.py), [ProposePaymentErrorBody](agent_guard_api/errors/propose_payment_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[PaymentDecision](agent_guard_api/models/payment_decision.py)</code> -- OK

**On `Failure`**: `error` is <code>[ProposePaymentErrorBody](agent_guard_api/errors/propose_payment_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 429, 500, 503 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def search_products(body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ProductSearchResult, SearchProductsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never pays)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.agent.with_raw_response.search_products(
    V1AgentProductsSearchRequest(mandate_id="some example string", query="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ProductSearchResult
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type SearchProductsErrorBody
```

**Async**

```python
result = await async_client.agent.with_raw_response.search_products(
    V1AgentProductsSearchRequest(mandate_id="some example string", query="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ProductSearchResult
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type SearchProductsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1AgentProductsSearchRequest](agent_guard_api/models/v1_agent_products_search_request.py) \| [V1AgentProductsSearchRequestDict](agent_guard_api/models/v1_agent_products_search_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[ProductSearchResult](agent_guard_api/models/product_search_result.py), [SearchProductsErrorBody](agent_guard_api/errors/search_products_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ProductSearchResult](agent_guard_api/models/product_search_result.py)</code> -- OK

**On `Failure`**: `error` is <code>[SearchProductsErrorBody](agent_guard_api/errors/search_products_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Approvals

> Source: [Approvals](agent_guard_api/apis/approvals.py)

<details>
<summary><code>def get_approval_options(id_: str, body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetApprovalOptionsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Approval statement and WebAuthn options (5-minute nonce)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.approvals.with_raw_response.get_approval_options(
    "some example string", V1ApprovalsRequestRequest(approve=True)
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetApprovalOptionsErrorBody
```

**Async**

```python
result = await async_client.approvals.with_raw_response.get_approval_options(
    "some example string", V1ApprovalsRequestRequest(approve=True)
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetApprovalOptionsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1ApprovalsRequestRequest](agent_guard_api/models/v1_approvals_request_request.py) \| [V1ApprovalsRequestRequestDict](agent_guard_api/models/v1_approvals_request_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetApprovalOptionsErrorBody](agent_guard_api/errors/get_approval_options_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetApprovalOptionsErrorBody](agent_guard_api/errors/get_approval_options_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def list_approvals(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ListApprovalsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Payments held for the owner

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.approvals.with_raw_response.list_approvals()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListApprovalsErrorBody
```

**Async**

```python
result = await async_client.approvals.with_raw_response.list_approvals()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListApprovalsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ListApprovalsErrorBody](agent_guard_api/errors/list_approvals_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ListApprovalsErrorBody](agent_guard_api/errors/list_approvals_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def resolve_approval(id_: str, body: V1ApprovalsRequest | V1ApprovalsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ResolveApprovalErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Approve or deny with the user's passkey. The admin token alone is refused.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.approvals.with_raw_response.resolve_approval(
    "some example string", V1ApprovalsRequest(approve=True, assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ResolveApprovalErrorBody
```

**Async**

```python
result = await async_client.approvals.with_raw_response.resolve_approval(
    "some example string", V1ApprovalsRequest(approve=True, assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ResolveApprovalErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1ApprovalsRequest](agent_guard_api/models/v1_approvals_request.py) \| [V1ApprovalsRequestDict](agent_guard_api/models/v1_approvals_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ResolveApprovalErrorBody](agent_guard_api/errors/resolve_approval_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ResolveApprovalErrorBody](agent_guard_api/errors/resolve_approval_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Audit

> Source: [Audit](agent_guard_api/apis/audit.py)

<details>
<summary><code>def anchor_audit_chain(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, AnchorAuditChainErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.audit.with_raw_response.anchor_audit_chain()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type AnchorAuditChainErrorBody
```

**Async**

```python
result = await async_client.audit.with_raw_response.anchor_audit_chain()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type AnchorAuditChainErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [AnchorAuditChainErrorBody](agent_guard_api/errors/anchor_audit_chain_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[AnchorAuditChainErrorBody](agent_guard_api/errors/anchor_audit_chain_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_audit_attestation(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetAuditAttestationErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Chain head signed with the active issuer key

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.audit.with_raw_response.get_audit_attestation()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAuditAttestationErrorBody
```

**Async**

```python
result = await async_client.audit.with_raw_response.get_audit_attestation()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetAuditAttestationErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetAuditAttestationErrorBody](agent_guard_api/errors/get_audit_attestation_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetAuditAttestationErrorBody](agent_guard_api/errors/get_audit_attestation_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def list_audit_anchors(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ListAuditAnchorsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Published anchors; keep copies to detect forks

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.audit.with_raw_response.list_audit_anchors()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListAuditAnchorsErrorBody
```

**Async**

```python
result = await async_client.audit.with_raw_response.list_audit_anchors()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListAuditAnchorsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit</code> | <code>str \| None</code> | Default 100<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ListAuditAnchorsErrorBody](agent_guard_api/errors/list_audit_anchors_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ListAuditAnchorsErrorBody](agent_guard_api/errors/list_audit_anchors_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def list_audit_entries(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[list[AuditEntry], ListAuditEntriesErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Hash-chained audit log

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.audit.with_raw_response.list_audit_entries()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type list[AuditEntry]
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListAuditEntriesErrorBody
```

**Async**

```python
result = await async_client.audit.with_raw_response.list_audit_entries()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type list[AuditEntry]
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListAuditEntriesErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit</code> | <code>str \| None</code> | Default 200<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;list&#91;[AuditEntry](agent_guard_api/models/audit_entry.py)&#93;, [ListAuditEntriesErrorBody](agent_guard_api/errors/list_audit_entries_error.py)&#93;</code>

**On `Success`**: `payload` is <code>list&#91;[AuditEntry](agent_guard_api/models/audit_entry.py)&#93;</code> -- OK

**On `Failure`**: `error` is <code>[ListAuditEntriesErrorBody](agent_guard_api/errors/list_audit_entries_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def verify_audit_chain(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[AuditVerification, VerifyAuditChainErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Recompute and verify the whole chain

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.audit.with_raw_response.verify_audit_chain()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AuditVerification
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type VerifyAuditChainErrorBody
```

**Async**

```python
result = await async_client.audit.with_raw_response.verify_audit_chain()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AuditVerification
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type VerifyAuditChainErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[AuditVerification](agent_guard_api/models/audit_verification.py), [VerifyAuditChainErrorBody](agent_guard_api/errors/verify_audit_chain_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[AuditVerification](agent_guard_api/models/audit_verification.py)</code> -- OK

**On `Failure`**: `error` is <code>[VerifyAuditChainErrorBody](agent_guard_api/errors/verify_audit_chain_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Catalog

> Source: [Catalog](agent_guard_api/apis/catalog.py)

<details>
<summary><code>def get_product_search_status(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetProductSearchStatusErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Whether Channel3 product search is configured (CHANNEL3_API_KEY)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.catalog.with_raw_response.get_product_search_status()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetProductSearchStatusErrorBody
```

**Async**

```python
result = await async_client.catalog.with_raw_response.get_product_search_status()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetProductSearchStatusErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetProductSearchStatusErrorBody](agent_guard_api/errors/get_product_search_status_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetProductSearchStatusErrorBody](agent_guard_api/errors/get_product_search_status_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def search_products_for_mandate(body: V1ProductsSearchRequest | V1ProductsSearchRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ProductSearchResult, SearchProductsForMandateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Owner view of the same Channel3 search, with an advisory mandate-fit check per product

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.catalog.with_raw_response.search_products_for_mandate(
    V1ProductsSearchRequest(mandate_id="some example string", query="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ProductSearchResult
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type SearchProductsForMandateErrorBody
```

**Async**

```python
result = await async_client.catalog.with_raw_response.search_products_for_mandate(
    V1ProductsSearchRequest(mandate_id="some example string", query="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ProductSearchResult
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type SearchProductsForMandateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1ProductsSearchRequest](agent_guard_api/models/v1_products_search_request.py) \| [V1ProductsSearchRequestDict](agent_guard_api/models/v1_products_search_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[ProductSearchResult](agent_guard_api/models/product_search_result.py), [SearchProductsForMandateErrorBody](agent_guard_api/errors/search_products_for_mandate_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ProductSearchResult](agent_guard_api/models/product_search_result.py)</code> -- OK

**On `Failure`**: `error` is <code>[SearchProductsForMandateErrorBody](agent_guard_api/errors/search_products_for_mandate_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Control

> Source: [Control](agent_guard_api/apis/control.py)

<details>
<summary><code>def get_pause_state(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[PauseState, GetPauseStateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Kill-switch state

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.control.with_raw_response.get_pause_state()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type PauseState
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetPauseStateErrorBody
```

**Async**

```python
result = await async_client.control.with_raw_response.get_pause_state()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type PauseState
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetPauseStateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[PauseState](agent_guard_api/models/pause_state.py), [GetPauseStateErrorBody](agent_guard_api/errors/get_pause_state_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[PauseState](agent_guard_api/models/pause_state.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetPauseStateErrorBody](agent_guard_api/errors/get_pause_state_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def pause(*, body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, PauseErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Block every new proposal and approval (503)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.control.with_raw_response.pause()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type PauseErrorBody
```

**Async**

```python
result = await async_client.control.with_raw_response.pause()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type PauseErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1ControlPauseRequest](agent_guard_api/models/v1_control_pause_request.py) \| [V1ControlPauseRequestDict](agent_guard_api/models/v1_control_pause_request.py) \| None</code> | The request body.<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [PauseErrorBody](agent_guard_api/errors/pause_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[PauseErrorBody](agent_guard_api/errors/pause_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def resume(*, body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ResumeErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lift the kill-switch

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.control.with_raw_response.resume()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ResumeErrorBody
```

**Async**

```python
result = await async_client.control.with_raw_response.resume()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ResumeErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1ControlResumeRequest](agent_guard_api/models/v1_control_resume_request.py) \| [V1ControlResumeRequestDict](agent_guard_api/models/v1_control_resume_request.py) \| None</code> | The request body.<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ResumeErrorBody](agent_guard_api/errors/resume_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ResumeErrorBody](agent_guard_api/errors/resume_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Jobs

> Source: [Jobs](agent_guard_api/apis/jobs.py)

<details>
<summary><code>def run_anchor_job(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RunAnchorJobErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.jobs.with_raw_response.run_anchor_job()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunAnchorJobErrorBody
```

**Async**

```python
result = await async_client.jobs.with_raw_response.run_anchor_job()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunAnchorJobErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RunAnchorJobErrorBody](agent_guard_api/errors/run_anchor_job_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RunAnchorJobErrorBody](agent_guard_api/errors/run_anchor_job_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def run_anchor_job_post(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RunAnchorJobPostErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Same as GET, for pg_net callers

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.jobs.with_raw_response.run_anchor_job_post()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunAnchorJobPostErrorBody
```

**Async**

```python
result = await async_client.jobs.with_raw_response.run_anchor_job_post()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunAnchorJobPostErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RunAnchorJobPostErrorBody](agent_guard_api/errors/run_anchor_job_post_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RunAnchorJobPostErrorBody](agent_guard_api/errors/run_anchor_job_post_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def run_maintenance_job(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RunMaintenanceJobErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Expire recovery locks, retry notifications, converge stuck payments

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.jobs.with_raw_response.run_maintenance_job()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunMaintenanceJobErrorBody
```

**Async**

```python
result = await async_client.jobs.with_raw_response.run_maintenance_job()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunMaintenanceJobErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RunMaintenanceJobErrorBody](agent_guard_api/errors/run_maintenance_job_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RunMaintenanceJobErrorBody](agent_guard_api/errors/run_maintenance_job_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def run_maintenance_job_post(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RunMaintenanceJobPostErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Same as GET, for pg_net callers

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.jobs.with_raw_response.run_maintenance_job_post()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunMaintenanceJobPostErrorBody
```

**Async**

```python
result = await async_client.jobs.with_raw_response.run_maintenance_job_post()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RunMaintenanceJobPostErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RunMaintenanceJobPostErrorBody](agent_guard_api/errors/run_maintenance_job_post_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RunMaintenanceJobPostErrorBody](agent_guard_api/errors/run_maintenance_job_post_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Keys

> Source: [Keys](agent_guard_api/apis/keys.py)

<details>
<summary><code>def get_issuer_key(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetIssuerKeyErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Active issuer public key (legacy single-key form)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.keys.with_raw_response.get_issuer_key()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetIssuerKeyErrorBody
```

**Async**

```python
result = await async_client.keys.with_raw_response.get_issuer_key()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetIssuerKeyErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetIssuerKeyErrorBody](agent_guard_api/errors/get_issuer_key_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetIssuerKeyErrorBody](agent_guard_api/errors/get_issuer_key_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_issuer_key_set(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[IssuerKeySet, GetIssuerKeySetErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.keys.with_raw_response.get_issuer_key_set()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type IssuerKeySet
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetIssuerKeySetErrorBody
```

**Async**

```python
result = await async_client.keys.with_raw_response.get_issuer_key_set()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type IssuerKeySet
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetIssuerKeySetErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[IssuerKeySet](agent_guard_api/models/issuer_key_set.py), [GetIssuerKeySetErrorBody](agent_guard_api/errors/get_issuer_key_set_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[IssuerKeySet](agent_guard_api/models/issuer_key_set.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetIssuerKeySetErrorBody](agent_guard_api/errors/get_issuer_key_set_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def mark_key_compromised(kid: str, *, body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, MarkKeyCompromisedErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Mark a key compromised as of `at` (rotates first if active)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.keys.with_raw_response.mark_key_compromised("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type MarkKeyCompromisedErrorBody
```

**Async**

```python
result = await async_client.keys.with_raw_response.mark_key_compromised("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type MarkKeyCompromisedErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>kid</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1KeysCompromisedRequest](agent_guard_api/models/v1_keys_compromised_request.py) \| [V1KeysCompromisedRequestDict](agent_guard_api/models/v1_keys_compromised_request.py) \| None</code> | The request body.<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [MarkKeyCompromisedErrorBody](agent_guard_api/errors/mark_key_compromised_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[MarkKeyCompromisedErrorBody](agent_guard_api/errors/mark_key_compromised_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def rotate_issuer_key(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RotateIssuerKeyErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retire the active issuer key and create a new one (audited)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.keys.with_raw_response.rotate_issuer_key()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RotateIssuerKeyErrorBody
```

**Async**

```python
result = await async_client.keys.with_raw_response.rotate_issuer_key()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RotateIssuerKeyErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RotateIssuerKeyErrorBody](agent_guard_api/errors/rotate_issuer_key_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RotateIssuerKeyErrorBody](agent_guard_api/errors/rotate_issuer_key_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Mandates

> Source: [Mandates](agent_guard_api/apis/mandates.py)

<details>
<summary><code>def confirm_mandate(id_: str, body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ConfirmMandateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Activate a mandate with the user's passkey assertion

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.confirm_mandate(
    "some example string", V1MandatesConfirmRequest(mandate_hash="some example string", assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ConfirmMandateErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.confirm_mandate(
    "some example string", V1MandatesConfirmRequest(mandate_hash="some example string", assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ConfirmMandateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1MandatesConfirmRequest](agent_guard_api/models/v1_mandates_confirm_request.py) \| [V1MandatesConfirmRequestDict](agent_guard_api/models/v1_mandates_confirm_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ConfirmMandateErrorBody](agent_guard_api/errors/confirm_mandate_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ConfirmMandateErrorBody](agent_guard_api/errors/confirm_mandate_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def create_mandate(body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, CreateMandateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Create a draft mandate from structured constraints

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.create_mandate(
    V1MandatesRequest(user_id="some example string", agent_id="some example string", purpose="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CreateMandateErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.create_mandate(
    V1MandatesRequest(user_id="some example string", agent_id="some example string", purpose="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CreateMandateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1MandatesRequest](agent_guard_api/models/v1_mandates_request.py) \| [V1MandatesRequestDict](agent_guard_api/models/v1_mandates_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [CreateMandateErrorBody](agent_guard_api/errors/create_mandate_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[CreateMandateErrorBody](agent_guard_api/errors/create_mandate_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def draft_mandate_from_text(body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, DraftMandateFromTextErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Draft a mandate from plain English (model proposes, deterministic parser bounds it)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.draft_mandate_from_text(
    V1MandatesDraftFromTextRequest(
        user_id="some example string", agent_id="some example string", text="some example string"
    ),
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type DraftMandateFromTextErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.draft_mandate_from_text(
    V1MandatesDraftFromTextRequest(
        user_id="some example string", agent_id="some example string", text="some example string"
    ),
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type DraftMandateFromTextErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1MandatesDraftFromTextRequest](agent_guard_api/models/v1_mandates_draft_from_text_request.py) \| [V1MandatesDraftFromTextRequestDict](agent_guard_api/models/v1_mandates_draft_from_text_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [DraftMandateFromTextErrorBody](agent_guard_api/errors/draft_mandate_from_text_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[DraftMandateFromTextErrorBody](agent_guard_api/errors/draft_mandate_from_text_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_mandate(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetMandateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Mandate, status and spend

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.get_mandate("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetMandateErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.get_mandate("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetMandateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetMandateErrorBody](agent_guard_api/errors/get_mandate_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetMandateErrorBody](agent_guard_api/errors/get_mandate_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_mandate_revocation_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetMandateRevocationOptionsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Get WebAuthn options for revocation

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.get_mandate_revocation_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetMandateRevocationOptionsErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.get_mandate_revocation_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetMandateRevocationOptionsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetMandateRevocationOptionsErrorBody](agent_guard_api/errors/get_mandate_revocation_options_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetMandateRevocationOptionsErrorBody](agent_guard_api/errors/get_mandate_revocation_options_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_mandate_signing_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetMandateSigningOptionsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Get WebAuthn options whose challenge is the mandate hash

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.get_mandate_signing_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetMandateSigningOptionsErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.get_mandate_signing_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetMandateSigningOptionsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetMandateSigningOptionsErrorBody](agent_guard_api/errors/get_mandate_signing_options_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetMandateSigningOptionsErrorBody](agent_guard_api/errors/get_mandate_signing_options_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def list_mandates(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ListMandatesErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

List mandates with spend state and summary

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.list_mandates()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListMandatesErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.list_mandates()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListMandatesErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ListMandatesErrorBody](agent_guard_api/errors/list_mandates_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ListMandatesErrorBody](agent_guard_api/errors/list_mandates_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def revoke_mandate(id_: str, *, body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RevokeMandateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Revoke with the user's passkey (drafts can be discarded without one)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.mandates.with_raw_response.revoke_mandate("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RevokeMandateErrorBody
```

**Async**

```python
result = await async_client.mandates.with_raw_response.revoke_mandate("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RevokeMandateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1MandatesRevokeRequest](agent_guard_api/models/v1_mandates_revoke_request.py) \| [V1MandatesRevokeRequestDict](agent_guard_api/models/v1_mandates_revoke_request.py) \| None</code> | The request body.<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RevokeMandateErrorBody](agent_guard_api/errors/revoke_mandate_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RevokeMandateErrorBody](agent_guard_api/errors/revoke_mandate_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Meta

> Source: [Meta](agent_guard_api/apis/meta.py)

<details>
<summary><code>def get_health(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Health, GetHealthErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Health: ok, stuck payment count, last recovery run

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.meta.with_raw_response.get_health()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Health
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetHealthErrorBody
```

**Async**

```python
result = await async_client.meta.with_raw_response.get_health()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Health
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetHealthErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[Health](agent_guard_api/models/health.py), [GetHealthErrorBody](agent_guard_api/errors/get_health_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[Health](agent_guard_api/models/health.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetHealthErrorBody](agent_guard_api/errors/get_health_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_liveness(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetLivenessErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Liveness probe (plain 200)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.meta.with_raw_response.get_liveness()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetLivenessErrorBody
```

**Async**

```python
result = await async_client.meta.with_raw_response.get_liveness()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetLivenessErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetLivenessErrorBody](agent_guard_api/errors/get_liveness_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetLivenessErrorBody](agent_guard_api/errors/get_liveness_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def head_liveness(*, request_options: RequestOptionsOrDict | None = None) -> ApiResult[None, HeadLivenessErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Liveness probe, no body

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.meta.with_raw_response.head_liveness()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type HeadLivenessErrorBody
```

**Async**

```python
result = await async_client.meta.with_raw_response.head_liveness()
match result:
    case Success():
        ...  # 2xx, no content
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type HeadLivenessErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;None, [HeadLivenessErrorBody](agent_guard_api/errors/head_liveness_error.py)&#93;</code>

**On `Success`**: the 2xx carries no content; `payload` is <code>None</code>

**On `Failure`**: `error` is <code>[HeadLivenessErrorBody](agent_guard_api/errors/head_liveness_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[RawError](agent_guard_api/core/results.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Passkeys

> Source: [Passkeys](agent_guard_api/apis/passkeys.py)

<details>
<summary><code>def cancel_recovery(id_: str, body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, CancelRecoveryErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Cancel a pending recovery

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.cancel_recovery(
    "some example string", V1UsersRecoveryCancelRequest(assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CancelRecoveryErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.cancel_recovery(
    "some example string", V1UsersRecoveryCancelRequest(assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CancelRecoveryErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1UsersRecoveryCancelRequest](agent_guard_api/models/v1_users_recovery_cancel_request.py) \| [V1UsersRecoveryCancelRequestDict](agent_guard_api/models/v1_users_recovery_cancel_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [CancelRecoveryErrorBody](agent_guard_api/errors/cancel_recovery_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[CancelRecoveryErrorBody](agent_guard_api/errors/cancel_recovery_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def create_enrollment_link(id_: str, *, body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, CreateEnrollmentLinkErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Issue a single-use enrollment link (15 min default)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.create_enrollment_link("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CreateEnrollmentLinkErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.create_enrollment_link("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CreateEnrollmentLinkErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1UsersEnrollmentsRequest](agent_guard_api/models/v1_users_enrollments_request.py) \| [V1UsersEnrollmentsRequestDict](agent_guard_api/models/v1_users_enrollments_request.py) \| None</code> | The request body.<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [CreateEnrollmentLinkErrorBody](agent_guard_api/errors/create_enrollment_link_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[CreateEnrollmentLinkErrorBody](agent_guard_api/errors/create_enrollment_link_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def enroll_passkey(body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, EnrollPasskeyErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeem step 2: register the passkey

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.enroll_passkey(V1EnrollRequest(token="some example string", response={}))
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type EnrollPasskeyErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.enroll_passkey(
    V1EnrollRequest(token="some example string", response={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type EnrollPasskeyErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1EnrollRequest](agent_guard_api/models/v1_enroll_request.py) \| [V1EnrollRequestDict](agent_guard_api/models/v1_enroll_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [EnrollPasskeyErrorBody](agent_guard_api/errors/enroll_passkey_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[EnrollPasskeyErrorBody](agent_guard_api/errors/enroll_passkey_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_enrollment_options(body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetEnrollmentOptionsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeem step 1: registration options for an enrollment token

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.get_enrollment_options(V1EnrollOptionsRequest(token="some example string"))
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetEnrollmentOptionsErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.get_enrollment_options(
    V1EnrollOptionsRequest(token="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetEnrollmentOptionsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1EnrollOptionsRequest](agent_guard_api/models/v1_enroll_options_request.py) \| [V1EnrollOptionsRequestDict](agent_guard_api/models/v1_enroll_options_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetEnrollmentOptionsErrorBody](agent_guard_api/errors/get_enrollment_options_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetEnrollmentOptionsErrorBody](agent_guard_api/errors/get_enrollment_options_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_recovery_cancel_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetRecoveryCancelOptionsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Options to cancel a recovery with the current passkey

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.get_recovery_cancel_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetRecoveryCancelOptionsErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.get_recovery_cancel_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetRecoveryCancelOptionsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetRecoveryCancelOptionsErrorBody](agent_guard_api/errors/get_recovery_cancel_options_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetRecoveryCancelOptionsErrorBody](agent_guard_api/errors/get_recovery_cancel_options_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_recovery_state(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetRecoveryStateErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Time-locked recovery state

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.get_recovery_state("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetRecoveryStateErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.get_recovery_state("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetRecoveryStateErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetRecoveryStateErrorBody](agent_guard_api/errors/get_recovery_state_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetRecoveryStateErrorBody](agent_guard_api/errors/get_recovery_state_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_reenrollment_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetReenrollmentOptionsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Options for replacing a passkey with the current one

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.get_reenrollment_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetReenrollmentOptionsErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.get_reenrollment_options("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetReenrollmentOptionsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetReenrollmentOptionsErrorBody](agent_guard_api/errors/get_reenrollment_options_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetReenrollmentOptionsErrorBody](agent_guard_api/errors/get_reenrollment_options_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_user_passkey(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, GetUserPasskeyErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Whether the user has a passkey, and its credential id

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.get_user_passkey("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetUserPasskeyErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.get_user_passkey("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetUserPasskeyErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [GetUserPasskeyErrorBody](agent_guard_api/errors/get_user_passkey_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[GetUserPasskeyErrorBody](agent_guard_api/errors/get_user_passkey_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def reenroll_passkey(id_: str, body: V1UsersReenrollRequest | V1UsersReenrollRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ReenrollPasskeyErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Mint a re-enrollment token authorized by the current passkey

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.passkeys.with_raw_response.reenroll_passkey("some example string", V1UsersReenrollRequest(assertion={}))
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ReenrollPasskeyErrorBody
```

**Async**

```python
result = await async_client.passkeys.with_raw_response.reenroll_passkey(
    "some example string", V1UsersReenrollRequest(assertion={})
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ReenrollPasskeyErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>body</code> | <code>[V1UsersReenrollRequest](agent_guard_api/models/v1_users_reenroll_request.py) \| [V1UsersReenrollRequestDict](agent_guard_api/models/v1_users_reenroll_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ReenrollPasskeyErrorBody](agent_guard_api/errors/reenroll_passkey_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ReenrollPasskeyErrorBody](agent_guard_api/errors/reenroll_passkey_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Payments

> Source: [Payments](agent_guard_api/apis/payments.py)

<details>
<summary><code>def list_payments(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ListPaymentsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

List payments

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.payments.with_raw_response.list_payments()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListPaymentsErrorBody
```

**Async**

```python
result = await async_client.payments.with_raw_response.list_payments()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListPaymentsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit</code> | <code>str \| None</code> | Default 200<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ListPaymentsErrorBody](agent_guard_api/errors/list_payments_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ListPaymentsErrorBody](agent_guard_api/errors/list_payments_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def list_stuck_payments(*, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, ListStuckPaymentsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Payments in reserved/authorized older than a threshold

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.payments.with_raw_response.list_stuck_payments()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListStuckPaymentsErrorBody
```

**Async**

```python
result = await async_client.payments.with_raw_response.list_stuck_payments()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListStuckPaymentsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>older_than_ms</code> | <code>str \| None</code> | Default 60000<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [ListStuckPaymentsErrorBody](agent_guard_api/errors/list_stuck_payments_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[ListStuckPaymentsErrorBody](agent_guard_api/errors/list_stuck_payments_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def recover_payments(*, body: V1RecoverRequest | V1RecoverRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, RecoverPaymentsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Converge stuck payments with PayPal now

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.payments.with_raw_response.recover_payments()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RecoverPaymentsErrorBody
```

**Async**

```python
result = await async_client.payments.with_raw_response.recover_payments()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RecoverPaymentsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1RecoverRequest](agent_guard_api/models/v1_recover_request.py) \| [V1RecoverRequestDict](agent_guard_api/models/v1_recover_request.py) \| None</code> | The request body.<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [RecoverPaymentsErrorBody](agent_guard_api/errors/recover_payments_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[RecoverPaymentsErrorBody](agent_guard_api/errors/recover_payments_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Receipts

> Source: [Receipts](agent_guard_api/apis/receipts.py)

<details>
<summary><code>def get_payment_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ReceiptEnvelope, GetPaymentReceiptErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Receipt for a payment

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.receipts.with_raw_response.get_payment_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetPaymentReceiptErrorBody
```

**Async**

```python
result = await async_client.receipts.with_raw_response.get_payment_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetPaymentReceiptErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py), [GetPaymentReceiptErrorBody](agent_guard_api/errors/get_payment_receipt_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetPaymentReceiptErrorBody](agent_guard_api/errors/get_payment_receipt_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_public_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ReceiptEnvelope, GetPublicReceiptErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.receipts.with_raw_response.get_public_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetPublicReceiptErrorBody
```

**Async**

```python
result = await async_client.receipts.with_raw_response.get_public_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetPublicReceiptErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py), [GetPublicReceiptErrorBody](agent_guard_api/errors/get_public_receipt_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetPublicReceiptErrorBody](agent_guard_api/errors/get_public_receipt_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def get_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[ReceiptEnvelope, GetReceiptErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Receipt by id

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.receipts.with_raw_response.get_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetReceiptErrorBody
```

**Async**

```python
result = await async_client.receipts.with_raw_response.get_receipt("some example string")
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type ReceiptEnvelope
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type GetReceiptErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id_</code> | <code>str</code> | Value sent with the request. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py), [GetReceiptErrorBody](agent_guard_api/errors/get_receipt_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**On `Failure`**: `error` is <code>[GetReceiptErrorBody](agent_guard_api/errors/get_receipt_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def list_receipts(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[list[ReceiptSummary], ListReceiptsErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

List receipts

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.receipts.with_raw_response.list_receipts()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type list[ReceiptSummary]
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListReceiptsErrorBody
```

**Async**

```python
result = await async_client.receipts.with_raw_response.list_receipts()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type list[ReceiptSummary]
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type ListReceiptsErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit</code> | <code>str \| None</code> | Default 100<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;list&#91;[ReceiptSummary](agent_guard_api/models/receipt_summary.py)&#93;, [ListReceiptsErrorBody](agent_guard_api/errors/list_receipts_error.py)&#93;</code>

**On `Success`**: `payload` is <code>list&#91;[ReceiptSummary](agent_guard_api/models/receipt_summary.py)&#93;</code> -- OK

**On `Failure`**: `error` is <code>[ListReceiptsErrorBody](agent_guard_api/errors/list_receipts_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

## Setup

> Source: [Setup](agent_guard_api/apis/setup.py)

<details>
<summary><code>def complete_wallet_setup(*, state: str | None = None, approval_token_id: str | None = None, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, CompleteWalletSetupErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

PayPal redirect target after buyer consent; links the vaulted wallet

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.setup.with_raw_response.complete_wallet_setup()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CompleteWalletSetupErrorBody
```

**Async**

```python
result = await async_client.setup.with_raw_response.complete_wallet_setup()
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type CompleteWalletSetupErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>state</code> | <code>str \| None</code> | One-time state from /v1/wallets/setup<br>**Default**: <code>None</code> |
| <code>approval_token_id</code> | <code>str \| None</code> | PayPal setup token id<br>**Default**: <code>None</code> |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [CompleteWalletSetupErrorBody](agent_guard_api/errors/complete_wallet_setup_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[CompleteWalletSetupErrorBody](agent_guard_api/errors/complete_wallet_setup_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def link_wallet(body: V1WalletsLinkRequest | V1WalletsLinkRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, LinkWalletErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Link an existing PayPal vault id to a user

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.setup.with_raw_response.link_wallet(
    V1WalletsLinkRequest(user_id="some example string", vault_id="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type LinkWalletErrorBody
```

**Async**

```python
result = await async_client.setup.with_raw_response.link_wallet(
    V1WalletsLinkRequest(user_id="some example string", vault_id="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type LinkWalletErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1WalletsLinkRequest](agent_guard_api/models/v1_wallets_link_request.py) \| [V1WalletsLinkRequestDict](agent_guard_api/models/v1_wallets_link_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [LinkWalletErrorBody](agent_guard_api/errors/link_wallet_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[LinkWalletErrorBody](agent_guard_api/errors/link_wallet_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def register_agent(body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[AgentCredentials, RegisterAgentErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Register an agent and return its API key (shown once)

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.setup.with_raw_response.register_agent(
    V1AgentsRequest(user_id="some example string", agent_id="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AgentCredentials
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RegisterAgentErrorBody
```

**Async**

```python
result = await async_client.setup.with_raw_response.register_agent(
    V1AgentsRequest(user_id="some example string", agent_id="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type AgentCredentials
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type RegisterAgentErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1AgentsRequest](agent_guard_api/models/v1_agents_request.py) \| [V1AgentsRequestDict](agent_guard_api/models/v1_agents_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;[AgentCredentials](agent_guard_api/models/agent_credentials.py), [RegisterAgentErrorBody](agent_guard_api/errors/register_agent_error.py)&#93;</code>

**On `Success`**: `payload` is <code>[AgentCredentials](agent_guard_api/models/agent_credentials.py)</code> -- OK

**On `Failure`**: `error` is <code>[RegisterAgentErrorBody](agent_guard_api/errors/register_agent_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>def start_wallet_setup(body: V1WalletsSetupRequest | V1WalletsSetupRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ApiResult[Any, StartWalletSetupErrorBody]</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Start PayPal wallet vaulting; returns the setup token with the buyer consent link

</dd>
</dl>

### Usage

<dl>
<dd>

**Sync**

```python
result = client.setup.with_raw_response.start_wallet_setup(V1WalletsSetupRequest(user_id="some example string"))
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type StartWalletSetupErrorBody
```

**Async**

```python
result = await async_client.setup.with_raw_response.start_wallet_setup(
    V1WalletsSetupRequest(user_id="some example string")
)
match result:
    case Success(payload=payload):
        ...  # TODO: Handle 'payload' of type Any
    case Failure(error=error):
        ...  # TODO: Handle 'error' of type StartWalletSetupErrorBody
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1WalletsSetupRequest](agent_guard_api/models/v1_wallets_setup_request.py) \| [V1WalletsSetupRequestDict](agent_guard_api/models/v1_wallets_setup_request.py)</code> | The request body. |
| <code>request_options</code> | <code>[RequestOptionsOrDict](agent_guard_api/core/request_options.py) \| None</code> | Per-call overrides for this one request, such as a timeout, extra headers, or its retry count and statuses. |

</dd>
</dl>

### Response

<dl>
<dd>

**Returns**: <code>[ApiResult](agent_guard_api/core/results.py)&#91;Any, [StartWalletSetupErrorBody](agent_guard_api/errors/start_wallet_setup_error.py)&#93;</code>

**On `Success`**: `payload` is <code>Any</code> -- OK

**On `Failure`**: `error` is <code>[StartWalletSetupErrorBody](agent_guard_api/errors/start_wallet_setup_error.py)</code>

Mapped in first-match order -- an earlier row wins over a later range that also covers the status:

| Status | `error` is |
| --- | --- |
| 400, 401, 404, 413, 500 | <code>[ErrorResponse](agent_guard_api/models/error_response.py)</code> |
| anything unmapped | <code>[RawError](agent_guard_api/core/results.py)</code> |

</dd>
</dl>

</dd>
</dl>

</details>

