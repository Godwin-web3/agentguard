# Reference

**Parsed** endpoints return the typed payload and raise `ApiError` on a documented non-2xx. For the raw endpoints, see [Raw API Reference](raw-api-reference.md).

> Source: [AgentGuardApiClient](agent_guard_api/client.py)

## Agent

> Source: [Agent](agent_guard_api/apis/agent.py)

<details>
<summary><code>def get_agent_mandate(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> AgentMandate</code></summary>

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
try:
    response = client.agent.get_agent_mandate("some example string")
    # TODO: Handle 'response' of type AgentMandate
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAgentMandateErrorBody
```

**Async**

```python
try:
    response = await async_client.agent.get_agent_mandate("some example string")
    # TODO: Handle 'response' of type AgentMandate
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAgentMandateErrorBody
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

**OnSuccess**: <code>[AgentMandate](agent_guard_api/models/agent_mandate.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetAgentMandateErrorBody](agent_guard_api/errors/get_agent_mandate_error.py)&#93;</code>

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
<summary><code>def get_agent_payment(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> PaymentDecision</code></summary>

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
try:
    response = client.agent.get_agent_payment("some example string")
    # TODO: Handle 'response' of type PaymentDecision
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAgentPaymentErrorBody
```

**Async**

```python
try:
    response = await async_client.agent.get_agent_payment("some example string")
    # TODO: Handle 'response' of type PaymentDecision
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAgentPaymentErrorBody
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

**OnSuccess**: <code>[PaymentDecision](agent_guard_api/models/payment_decision.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetAgentPaymentErrorBody](agent_guard_api/errors/get_agent_payment_error.py)&#93;</code>

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
<summary><code>def get_agent_payment_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope</code></summary>

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
try:
    response = client.agent.get_agent_payment_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAgentPaymentReceiptErrorBody
```

**Async**

```python
try:
    response = await async_client.agent.get_agent_payment_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAgentPaymentReceiptErrorBody
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

**OnSuccess**: <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetAgentPaymentReceiptErrorBody](agent_guard_api/errors/get_agent_payment_receipt_error.py)&#93;</code>

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
<summary><code>def propose_payment(body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> PaymentDecision</code></summary>

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
try:
    response = client.agent.propose_payment(
        V1AgentPaymentsRequest(
            mandate_id="some example string", agent_id="some example string", idempotency_key="some example string"
        ),
    )
    # TODO: Handle 'response' of type PaymentDecision
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ProposePaymentErrorBody
```

**Async**

```python
try:
    response = await async_client.agent.propose_payment(
        V1AgentPaymentsRequest(
            mandate_id="some example string", agent_id="some example string", idempotency_key="some example string"
        ),
    )
    # TODO: Handle 'response' of type PaymentDecision
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ProposePaymentErrorBody
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

**OnSuccess**: <code>[PaymentDecision](agent_guard_api/models/payment_decision.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ProposePaymentErrorBody](agent_guard_api/errors/propose_payment_error.py)&#93;</code>

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
<summary><code>def search_products(body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ProductSearchResult</code></summary>

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
try:
    response = client.agent.search_products(
        V1AgentProductsSearchRequest(mandate_id="some example string", query="some example string")
    )
    # TODO: Handle 'response' of type ProductSearchResult
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type SearchProductsErrorBody
```

**Async**

```python
try:
    response = await async_client.agent.search_products(
        V1AgentProductsSearchRequest(mandate_id="some example string", query="some example string")
    )
    # TODO: Handle 'response' of type ProductSearchResult
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type SearchProductsErrorBody
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

**OnSuccess**: <code>[ProductSearchResult](agent_guard_api/models/product_search_result.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[SearchProductsErrorBody](agent_guard_api/errors/search_products_error.py)&#93;</code>

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
<summary><code>def get_approval_options(id_: str, body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.approvals.get_approval_options("some example string", V1ApprovalsRequestRequest(approve=True))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetApprovalOptionsErrorBody
```

**Async**

```python
try:
    response = await async_client.approvals.get_approval_options(
        "some example string", V1ApprovalsRequestRequest(approve=True)
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetApprovalOptionsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetApprovalOptionsErrorBody](agent_guard_api/errors/get_approval_options_error.py)&#93;</code>

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
<summary><code>def list_approvals(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.approvals.list_approvals()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListApprovalsErrorBody
```

**Async**

```python
try:
    response = await async_client.approvals.list_approvals()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListApprovalsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListApprovalsErrorBody](agent_guard_api/errors/list_approvals_error.py)&#93;</code>

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
<summary><code>def resolve_approval(id_: str, body: V1ApprovalsRequest | V1ApprovalsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.approvals.resolve_approval("some example string", V1ApprovalsRequest(approve=True, assertion={}))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ResolveApprovalErrorBody
```

**Async**

```python
try:
    response = await async_client.approvals.resolve_approval(
        "some example string", V1ApprovalsRequest(approve=True, assertion={})
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ResolveApprovalErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ResolveApprovalErrorBody](agent_guard_api/errors/resolve_approval_error.py)&#93;</code>

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
<summary><code>def anchor_audit_chain(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.audit.anchor_audit_chain()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type AnchorAuditChainErrorBody
```

**Async**

```python
try:
    response = await async_client.audit.anchor_audit_chain()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type AnchorAuditChainErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[AnchorAuditChainErrorBody](agent_guard_api/errors/anchor_audit_chain_error.py)&#93;</code>

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
<summary><code>def get_audit_attestation(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.audit.get_audit_attestation()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAuditAttestationErrorBody
```

**Async**

```python
try:
    response = await async_client.audit.get_audit_attestation()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetAuditAttestationErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetAuditAttestationErrorBody](agent_guard_api/errors/get_audit_attestation_error.py)&#93;</code>

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
<summary><code>def list_audit_anchors(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.audit.list_audit_anchors()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListAuditAnchorsErrorBody
```

**Async**

```python
try:
    response = await async_client.audit.list_audit_anchors()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListAuditAnchorsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListAuditAnchorsErrorBody](agent_guard_api/errors/list_audit_anchors_error.py)&#93;</code>

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
<summary><code>def list_audit_entries(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> list[AuditEntry]</code></summary>

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
try:
    response = client.audit.list_audit_entries()
    # TODO: Handle 'response' of type list[AuditEntry]
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListAuditEntriesErrorBody
```

**Async**

```python
try:
    response = await async_client.audit.list_audit_entries()
    # TODO: Handle 'response' of type list[AuditEntry]
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListAuditEntriesErrorBody
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

**OnSuccess**: <code>list&#91;[AuditEntry](agent_guard_api/models/audit_entry.py)&#93;</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListAuditEntriesErrorBody](agent_guard_api/errors/list_audit_entries_error.py)&#93;</code>

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
<summary><code>def verify_audit_chain(*, request_options: RequestOptionsOrDict | None = None) -> AuditVerification</code></summary>

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
try:
    response = client.audit.verify_audit_chain()
    # TODO: Handle 'response' of type AuditVerification
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type VerifyAuditChainErrorBody
```

**Async**

```python
try:
    response = await async_client.audit.verify_audit_chain()
    # TODO: Handle 'response' of type AuditVerification
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type VerifyAuditChainErrorBody
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

**OnSuccess**: <code>[AuditVerification](agent_guard_api/models/audit_verification.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[VerifyAuditChainErrorBody](agent_guard_api/errors/verify_audit_chain_error.py)&#93;</code>

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
<summary><code>def get_product_search_status(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.catalog.get_product_search_status()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetProductSearchStatusErrorBody
```

**Async**

```python
try:
    response = await async_client.catalog.get_product_search_status()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetProductSearchStatusErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetProductSearchStatusErrorBody](agent_guard_api/errors/get_product_search_status_error.py)&#93;</code>

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
<summary><code>def search_products_for_mandate(body: V1ProductsSearchRequest | V1ProductsSearchRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> ProductSearchResult</code></summary>

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
try:
    response = client.catalog.search_products_for_mandate(
        V1ProductsSearchRequest(mandate_id="some example string", query="some example string")
    )
    # TODO: Handle 'response' of type ProductSearchResult
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type SearchProductsForMandateErrorBody
```

**Async**

```python
try:
    response = await async_client.catalog.search_products_for_mandate(
        V1ProductsSearchRequest(mandate_id="some example string", query="some example string")
    )
    # TODO: Handle 'response' of type ProductSearchResult
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type SearchProductsForMandateErrorBody
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

**OnSuccess**: <code>[ProductSearchResult](agent_guard_api/models/product_search_result.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[SearchProductsForMandateErrorBody](agent_guard_api/errors/search_products_for_mandate_error.py)&#93;</code>

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
<summary><code>def get_pause_state(*, request_options: RequestOptionsOrDict | None = None) -> PauseState</code></summary>

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
try:
    response = client.control.get_pause_state()
    # TODO: Handle 'response' of type PauseState
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetPauseStateErrorBody
```

**Async**

```python
try:
    response = await async_client.control.get_pause_state()
    # TODO: Handle 'response' of type PauseState
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetPauseStateErrorBody
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

**OnSuccess**: <code>[PauseState](agent_guard_api/models/pause_state.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetPauseStateErrorBody](agent_guard_api/errors/get_pause_state_error.py)&#93;</code>

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
<summary><code>def pause(*, body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.control.pause()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type PauseErrorBody
```

**Async**

```python
try:
    response = await async_client.control.pause()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type PauseErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[PauseErrorBody](agent_guard_api/errors/pause_error.py)&#93;</code>

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
<summary><code>def resume(*, body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.control.resume()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ResumeErrorBody
```

**Async**

```python
try:
    response = await async_client.control.resume()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ResumeErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ResumeErrorBody](agent_guard_api/errors/resume_error.py)&#93;</code>

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
<summary><code>def run_anchor_job(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.jobs.run_anchor_job()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunAnchorJobErrorBody
```

**Async**

```python
try:
    response = await async_client.jobs.run_anchor_job()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunAnchorJobErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RunAnchorJobErrorBody](agent_guard_api/errors/run_anchor_job_error.py)&#93;</code>

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
<summary><code>def run_anchor_job_post(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.jobs.run_anchor_job_post()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunAnchorJobPostErrorBody
```

**Async**

```python
try:
    response = await async_client.jobs.run_anchor_job_post()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunAnchorJobPostErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RunAnchorJobPostErrorBody](agent_guard_api/errors/run_anchor_job_post_error.py)&#93;</code>

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
<summary><code>def run_maintenance_job(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.jobs.run_maintenance_job()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunMaintenanceJobErrorBody
```

**Async**

```python
try:
    response = await async_client.jobs.run_maintenance_job()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunMaintenanceJobErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RunMaintenanceJobErrorBody](agent_guard_api/errors/run_maintenance_job_error.py)&#93;</code>

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
<summary><code>def run_maintenance_job_post(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.jobs.run_maintenance_job_post()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunMaintenanceJobPostErrorBody
```

**Async**

```python
try:
    response = await async_client.jobs.run_maintenance_job_post()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RunMaintenanceJobPostErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RunMaintenanceJobPostErrorBody](agent_guard_api/errors/run_maintenance_job_post_error.py)&#93;</code>

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
<summary><code>def get_issuer_key(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.keys.get_issuer_key()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetIssuerKeyErrorBody
```

**Async**

```python
try:
    response = await async_client.keys.get_issuer_key()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetIssuerKeyErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetIssuerKeyErrorBody](agent_guard_api/errors/get_issuer_key_error.py)&#93;</code>

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
<summary><code>def get_issuer_key_set(*, request_options: RequestOptionsOrDict | None = None) -> IssuerKeySet</code></summary>

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
try:
    response = client.keys.get_issuer_key_set()
    # TODO: Handle 'response' of type IssuerKeySet
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetIssuerKeySetErrorBody
```

**Async**

```python
try:
    response = await async_client.keys.get_issuer_key_set()
    # TODO: Handle 'response' of type IssuerKeySet
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetIssuerKeySetErrorBody
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

**OnSuccess**: <code>[IssuerKeySet](agent_guard_api/models/issuer_key_set.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetIssuerKeySetErrorBody](agent_guard_api/errors/get_issuer_key_set_error.py)&#93;</code>

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
<summary><code>def mark_key_compromised(kid: str, *, body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.keys.mark_key_compromised("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type MarkKeyCompromisedErrorBody
```

**Async**

```python
try:
    response = await async_client.keys.mark_key_compromised("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type MarkKeyCompromisedErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[MarkKeyCompromisedErrorBody](agent_guard_api/errors/mark_key_compromised_error.py)&#93;</code>

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
<summary><code>def rotate_issuer_key(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.keys.rotate_issuer_key()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RotateIssuerKeyErrorBody
```

**Async**

```python
try:
    response = await async_client.keys.rotate_issuer_key()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RotateIssuerKeyErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RotateIssuerKeyErrorBody](agent_guard_api/errors/rotate_issuer_key_error.py)&#93;</code>

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
<summary><code>def confirm_mandate(id_: str, body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.confirm_mandate(
        "some example string", V1MandatesConfirmRequest(mandate_hash="some example string", assertion={})
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ConfirmMandateErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.confirm_mandate(
        "some example string", V1MandatesConfirmRequest(mandate_hash="some example string", assertion={})
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ConfirmMandateErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ConfirmMandateErrorBody](agent_guard_api/errors/confirm_mandate_error.py)&#93;</code>

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
<summary><code>def create_mandate(body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.create_mandate(
        V1MandatesRequest(user_id="some example string", agent_id="some example string", purpose="some example string")
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CreateMandateErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.create_mandate(
        V1MandatesRequest(user_id="some example string", agent_id="some example string", purpose="some example string")
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CreateMandateErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[CreateMandateErrorBody](agent_guard_api/errors/create_mandate_error.py)&#93;</code>

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
<summary><code>def draft_mandate_from_text(body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.draft_mandate_from_text(
        V1MandatesDraftFromTextRequest(
            user_id="some example string", agent_id="some example string", text="some example string"
        ),
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type DraftMandateFromTextErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.draft_mandate_from_text(
        V1MandatesDraftFromTextRequest(
            user_id="some example string", agent_id="some example string", text="some example string"
        ),
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type DraftMandateFromTextErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[DraftMandateFromTextErrorBody](agent_guard_api/errors/draft_mandate_from_text_error.py)&#93;</code>

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
<summary><code>def get_mandate(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.get_mandate("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetMandateErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.get_mandate("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetMandateErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetMandateErrorBody](agent_guard_api/errors/get_mandate_error.py)&#93;</code>

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
<summary><code>def get_mandate_revocation_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.get_mandate_revocation_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetMandateRevocationOptionsErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.get_mandate_revocation_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetMandateRevocationOptionsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetMandateRevocationOptionsErrorBody](agent_guard_api/errors/get_mandate_revocation_options_error.py)&#93;</code>

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
<summary><code>def get_mandate_signing_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.get_mandate_signing_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetMandateSigningOptionsErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.get_mandate_signing_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetMandateSigningOptionsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetMandateSigningOptionsErrorBody](agent_guard_api/errors/get_mandate_signing_options_error.py)&#93;</code>

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
<summary><code>def list_mandates(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.list_mandates()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListMandatesErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.list_mandates()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListMandatesErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListMandatesErrorBody](agent_guard_api/errors/list_mandates_error.py)&#93;</code>

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
<summary><code>def revoke_mandate(id_: str, *, body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.mandates.revoke_mandate("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RevokeMandateErrorBody
```

**Async**

```python
try:
    response = await async_client.mandates.revoke_mandate("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RevokeMandateErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RevokeMandateErrorBody](agent_guard_api/errors/revoke_mandate_error.py)&#93;</code>

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
<summary><code>def get_health(*, request_options: RequestOptionsOrDict | None = None) -> Health</code></summary>

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
try:
    response = client.meta.get_health()
    # TODO: Handle 'response' of type Health
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetHealthErrorBody
```

**Async**

```python
try:
    response = await async_client.meta.get_health()
    # TODO: Handle 'response' of type Health
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetHealthErrorBody
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

**OnSuccess**: <code>[Health](agent_guard_api/models/health.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetHealthErrorBody](agent_guard_api/errors/get_health_error.py)&#93;</code>

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
<summary><code>def get_liveness(*, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.meta.get_liveness()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetLivenessErrorBody
```

**Async**

```python
try:
    response = await async_client.meta.get_liveness()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetLivenessErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetLivenessErrorBody](agent_guard_api/errors/get_liveness_error.py)&#93;</code>

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
<summary><code>def head_liveness(*, request_options: RequestOptionsOrDict | None = None) -> None</code></summary>

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
try:
    client.meta.head_liveness()
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type HeadLivenessErrorBody
```

**Async**

```python
try:
    await async_client.meta.head_liveness()
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type HeadLivenessErrorBody
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

**OnSuccess**: No content

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[HeadLivenessErrorBody](agent_guard_api/errors/head_liveness_error.py)&#93;</code>

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
<summary><code>def cancel_recovery(id_: str, body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.cancel_recovery("some example string", V1UsersRecoveryCancelRequest(assertion={}))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CancelRecoveryErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.cancel_recovery(
        "some example string", V1UsersRecoveryCancelRequest(assertion={})
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CancelRecoveryErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[CancelRecoveryErrorBody](agent_guard_api/errors/cancel_recovery_error.py)&#93;</code>

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
<summary><code>def create_enrollment_link(id_: str, *, body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.create_enrollment_link("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CreateEnrollmentLinkErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.create_enrollment_link("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CreateEnrollmentLinkErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[CreateEnrollmentLinkErrorBody](agent_guard_api/errors/create_enrollment_link_error.py)&#93;</code>

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
<summary><code>def enroll_passkey(body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.enroll_passkey(V1EnrollRequest(token="some example string", response={}))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type EnrollPasskeyErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.enroll_passkey(V1EnrollRequest(token="some example string", response={}))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type EnrollPasskeyErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[EnrollPasskeyErrorBody](agent_guard_api/errors/enroll_passkey_error.py)&#93;</code>

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
<summary><code>def get_enrollment_options(body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.get_enrollment_options(V1EnrollOptionsRequest(token="some example string"))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetEnrollmentOptionsErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.get_enrollment_options(V1EnrollOptionsRequest(token="some example string"))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetEnrollmentOptionsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetEnrollmentOptionsErrorBody](agent_guard_api/errors/get_enrollment_options_error.py)&#93;</code>

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
<summary><code>def get_recovery_cancel_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.get_recovery_cancel_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetRecoveryCancelOptionsErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.get_recovery_cancel_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetRecoveryCancelOptionsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetRecoveryCancelOptionsErrorBody](agent_guard_api/errors/get_recovery_cancel_options_error.py)&#93;</code>

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
<summary><code>def get_recovery_state(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.get_recovery_state("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetRecoveryStateErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.get_recovery_state("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetRecoveryStateErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetRecoveryStateErrorBody](agent_guard_api/errors/get_recovery_state_error.py)&#93;</code>

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
<summary><code>def get_reenrollment_options(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.get_reenrollment_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetReenrollmentOptionsErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.get_reenrollment_options("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetReenrollmentOptionsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetReenrollmentOptionsErrorBody](agent_guard_api/errors/get_reenrollment_options_error.py)&#93;</code>

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
<summary><code>def get_user_passkey(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.get_user_passkey("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetUserPasskeyErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.get_user_passkey("some example string")
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetUserPasskeyErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetUserPasskeyErrorBody](agent_guard_api/errors/get_user_passkey_error.py)&#93;</code>

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
<summary><code>def reenroll_passkey(id_: str, body: V1UsersReenrollRequest | V1UsersReenrollRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.passkeys.reenroll_passkey("some example string", V1UsersReenrollRequest(assertion={}))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ReenrollPasskeyErrorBody
```

**Async**

```python
try:
    response = await async_client.passkeys.reenroll_passkey("some example string", V1UsersReenrollRequest(assertion={}))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ReenrollPasskeyErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ReenrollPasskeyErrorBody](agent_guard_api/errors/reenroll_passkey_error.py)&#93;</code>

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
<summary><code>def list_payments(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.payments.list_payments()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListPaymentsErrorBody
```

**Async**

```python
try:
    response = await async_client.payments.list_payments()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListPaymentsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListPaymentsErrorBody](agent_guard_api/errors/list_payments_error.py)&#93;</code>

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
<summary><code>def list_stuck_payments(*, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.payments.list_stuck_payments()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListStuckPaymentsErrorBody
```

**Async**

```python
try:
    response = await async_client.payments.list_stuck_payments()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListStuckPaymentsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListStuckPaymentsErrorBody](agent_guard_api/errors/list_stuck_payments_error.py)&#93;</code>

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
<summary><code>def recover_payments(*, body: V1RecoverRequest | V1RecoverRequestDict | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.payments.recover_payments()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RecoverPaymentsErrorBody
```

**Async**

```python
try:
    response = await async_client.payments.recover_payments()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RecoverPaymentsErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RecoverPaymentsErrorBody](agent_guard_api/errors/recover_payments_error.py)&#93;</code>

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
<summary><code>def get_payment_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope</code></summary>

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
try:
    response = client.receipts.get_payment_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetPaymentReceiptErrorBody
```

**Async**

```python
try:
    response = await async_client.receipts.get_payment_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetPaymentReceiptErrorBody
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

**OnSuccess**: <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetPaymentReceiptErrorBody](agent_guard_api/errors/get_payment_receipt_error.py)&#93;</code>

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
<summary><code>def get_public_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope</code></summary>

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
try:
    response = client.receipts.get_public_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetPublicReceiptErrorBody
```

**Async**

```python
try:
    response = await async_client.receipts.get_public_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetPublicReceiptErrorBody
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

**OnSuccess**: <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetPublicReceiptErrorBody](agent_guard_api/errors/get_public_receipt_error.py)&#93;</code>

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
<summary><code>def get_receipt(id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope</code></summary>

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
try:
    response = client.receipts.get_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetReceiptErrorBody
```

**Async**

```python
try:
    response = await async_client.receipts.get_receipt("some example string")
    # TODO: Handle 'response' of type ReceiptEnvelope
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type GetReceiptErrorBody
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

**OnSuccess**: <code>[ReceiptEnvelope](agent_guard_api/models/receipt_envelope.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[GetReceiptErrorBody](agent_guard_api/errors/get_receipt_error.py)&#93;</code>

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
<summary><code>def list_receipts(*, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> list[ReceiptSummary]</code></summary>

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
try:
    response = client.receipts.list_receipts()
    # TODO: Handle 'response' of type list[ReceiptSummary]
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListReceiptsErrorBody
```

**Async**

```python
try:
    response = await async_client.receipts.list_receipts()
    # TODO: Handle 'response' of type list[ReceiptSummary]
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type ListReceiptsErrorBody
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

**OnSuccess**: <code>list&#91;[ReceiptSummary](agent_guard_api/models/receipt_summary.py)&#93;</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[ListReceiptsErrorBody](agent_guard_api/errors/list_receipts_error.py)&#93;</code>

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
<summary><code>def complete_wallet_setup(*, state: str | None = None, approval_token_id: str | None = None, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.setup.complete_wallet_setup()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CompleteWalletSetupErrorBody
```

**Async**

```python
try:
    response = await async_client.setup.complete_wallet_setup()
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type CompleteWalletSetupErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[CompleteWalletSetupErrorBody](agent_guard_api/errors/complete_wallet_setup_error.py)&#93;</code>

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
<summary><code>def link_wallet(body: V1WalletsLinkRequest | V1WalletsLinkRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.setup.link_wallet(
        V1WalletsLinkRequest(user_id="some example string", vault_id="some example string")
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type LinkWalletErrorBody
```

**Async**

```python
try:
    response = await async_client.setup.link_wallet(
        V1WalletsLinkRequest(user_id="some example string", vault_id="some example string")
    )
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type LinkWalletErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[LinkWalletErrorBody](agent_guard_api/errors/link_wallet_error.py)&#93;</code>

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
<summary><code>def register_agent(body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> AgentCredentials</code></summary>

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
try:
    response = client.setup.register_agent(
        V1AgentsRequest(user_id="some example string", agent_id="some example string")
    )
    # TODO: Handle 'response' of type AgentCredentials
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RegisterAgentErrorBody
```

**Async**

```python
try:
    response = await async_client.setup.register_agent(
        V1AgentsRequest(user_id="some example string", agent_id="some example string")
    )
    # TODO: Handle 'response' of type AgentCredentials
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type RegisterAgentErrorBody
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

**OnSuccess**: <code>[AgentCredentials](agent_guard_api/models/agent_credentials.py)</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[RegisterAgentErrorBody](agent_guard_api/errors/register_agent_error.py)&#93;</code>

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
<summary><code>def start_wallet_setup(body: V1WalletsSetupRequest | V1WalletsSetupRequestDict, *, request_options: RequestOptionsOrDict | None = None) -> Any</code></summary>

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
try:
    response = client.setup.start_wallet_setup(V1WalletsSetupRequest(user_id="some example string"))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type StartWalletSetupErrorBody
```

**Async**

```python
try:
    response = await async_client.setup.start_wallet_setup(V1WalletsSetupRequest(user_id="some example string"))
    # TODO: Handle 'response' of type Any
except ApiError as e:
    ...  # TODO: Handle 'e.error' of type StartWalletSetupErrorBody
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

**OnSuccess**: <code>Any</code> -- OK

**OnError**: <code>[ApiError](agent_guard_api/core/exceptions.py)&#91;[StartWalletSetupErrorBody](agent_guard_api/errors/start_wallet_setup_error.py)&#93;</code>

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

