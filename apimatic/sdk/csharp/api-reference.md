# Reference

Every operation below is shown in its throwing form. On an error status it throws `ApiException<TError>` — the status code, headers, content type and the operation's error type, `RawError` (the raw body) when the spec declares none — and where an operation offers an `…AsResult` sibling, that sibling returns `ApiResult<TResponse, TError>` instead. A request that produces no usable response surfaces as `SdkConnectionException` or `SdkTimeoutException`, a body that does not match the documented response type as `ResponseDeserializationException`, and a required credential that is not configured, or one that cannot be applied, as `AuthSchemeException`; all of them derive from `SdkException` and name the failed call. See [README → Error Handling](README.md#error-handling).

> Source: [AgentGuardApiClient](src/AgentGuardApi/AgentGuardApiClient.cs)

## Agent

> Source: [Agent](src/AgentGuardApi/Api/Agent.cs)

<details>
<summary><code>Task&lt;AgentMandate&gt; GetAgentMandate(GetAgentMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Agent.GetAgentMandate(new GetAgentMandateRequest { Id = "some example string" });
    // TODO: Handle 'response' of type AgentMandate
}
catch (ApiException<GetAgentMandateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetAgentMandateRequest](src/AgentGuardApi/Requests/Agent/GetAgentMandateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[AgentMandate](src/AgentGuardApi/Models/AgentMandate.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetAgentMandateError](src/AgentGuardApi/Errors/GetAgentMandateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;PaymentDecision&gt; GetAgentPayment(GetAgentPaymentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Agent.GetAgentPayment(new GetAgentPaymentRequest { Id = "some example string" });
    // TODO: Handle 'response' of type PaymentDecision
}
catch (ApiException<GetAgentPaymentError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetAgentPaymentRequest](src/AgentGuardApi/Requests/Agent/GetAgentPaymentRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[PaymentDecision](src/AgentGuardApi/Models/PaymentDecision.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetAgentPaymentError](src/AgentGuardApi/Errors/GetAgentPaymentError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;ReceiptEnvelope&gt; GetAgentPaymentReceipt(GetAgentPaymentReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Agent.GetAgentPaymentReceipt(new GetAgentPaymentReceiptRequest
    {
        Id = "some example string",
    });
    // TODO: Handle 'response' of type ReceiptEnvelope
}
catch (ApiException<GetAgentPaymentReceiptError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetAgentPaymentReceiptRequest](src/AgentGuardApi/Requests/Agent/GetAgentPaymentReceiptRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ReceiptEnvelope](src/AgentGuardApi/Models/ReceiptEnvelope.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetAgentPaymentReceiptError](src/AgentGuardApi/Errors/GetAgentPaymentReceiptError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;PaymentDecision&gt; ProposePayment(ProposePaymentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Agent.ProposePayment(new ProposePaymentRequest
    {
        Body = new V1AgentPaymentsRequest
        {
            MandateId = "some example string",
            AgentId = "some example string",
            IdempotencyKey = "some example string",
        },
    });
    // TODO: Handle 'response' of type PaymentDecision
}
catch (ApiException<ProposePaymentError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ProposePaymentRequest](src/AgentGuardApi/Requests/Agent/ProposePaymentRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[PaymentDecision](src/AgentGuardApi/Models/PaymentDecision.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ProposePaymentError](src/AgentGuardApi/Errors/ProposePaymentError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;ProductSearchResult&gt; SearchProducts(SearchProductsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Agent.SearchProducts(new SearchProductsRequest
    {
        Body = new V1AgentProductsSearchRequest { MandateId = "some example string", Query = "some example string" },
    });
    // TODO: Handle 'response' of type ProductSearchResult
}
catch (ApiException<SearchProductsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[SearchProductsRequest](src/AgentGuardApi/Requests/Agent/SearchProductsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ProductSearchResult](src/AgentGuardApi/Models/ProductSearchResult.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[SearchProductsError](src/AgentGuardApi/Errors/SearchProductsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Approvals

> Source: [Approvals](src/AgentGuardApi/Api/Approvals.cs)

<details>
<summary><code>Task&lt;object&gt; GetApprovalOptions(GetApprovalOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Approvals.GetApprovalOptions(new GetApprovalOptionsRequest
    {
        Id = "some example string",
        Body = new V1ApprovalsRequestRequest { Approve = true },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetApprovalOptionsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetApprovalOptionsRequest](src/AgentGuardApi/Requests/Approvals/GetApprovalOptionsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetApprovalOptionsError](src/AgentGuardApi/Errors/GetApprovalOptionsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; ListApprovals(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Approvals.ListApprovals();
    // TODO: Handle 'response' of type object
}
catch (ApiException<ListApprovalsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListApprovalsError](src/AgentGuardApi/Errors/ListApprovalsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; ResolveApproval(ResolveApprovalRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Approvals.ResolveApproval(new ResolveApprovalRequest
    {
        Id = "some example string",
        Body = new V1ApprovalsRequest { Approve = true, Assertion = assertion },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<ResolveApprovalError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ResolveApprovalRequest](src/AgentGuardApi/Requests/Approvals/ResolveApprovalRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ResolveApprovalError](src/AgentGuardApi/Errors/ResolveApprovalError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Audit

> Source: [Audit](src/AgentGuardApi/Api/Audit.cs)

<details>
<summary><code>Task&lt;object&gt; AnchorAuditChain(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Audit.AnchorAuditChain();
    // TODO: Handle 'response' of type object
}
catch (ApiException<AnchorAuditChainError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[AnchorAuditChainError](src/AgentGuardApi/Errors/AnchorAuditChainError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetAuditAttestation(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Audit.GetAuditAttestation();
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetAuditAttestationError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetAuditAttestationError](src/AgentGuardApi/Errors/GetAuditAttestationError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; ListAuditAnchors(ListAuditAnchorsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Audit.ListAuditAnchors(new ListAuditAnchorsRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<ListAuditAnchorsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ListAuditAnchorsRequest](src/AgentGuardApi/Requests/Audit/ListAuditAnchorsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListAuditAnchorsError](src/AgentGuardApi/Errors/ListAuditAnchorsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;IReadOnlyList&lt;AuditEntry&gt;&gt; ListAuditEntries(ListAuditEntriesRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Audit.ListAuditEntries(new ListAuditEntriesRequest());
    // TODO: Handle 'response' of type IReadOnlyList<AuditEntry>
}
catch (ApiException<ListAuditEntriesError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ListAuditEntriesRequest](src/AgentGuardApi/Requests/Audit/ListAuditEntriesRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>IReadOnlyList&lt;[AuditEntry](src/AgentGuardApi/Models/AuditEntry.cs)&gt;</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListAuditEntriesError](src/AgentGuardApi/Errors/ListAuditEntriesError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;AuditVerification&gt; VerifyAuditChain(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Audit.VerifyAuditChain();
    // TODO: Handle 'response' of type AuditVerification
}
catch (ApiException<VerifyAuditChainError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[AuditVerification](src/AgentGuardApi/Models/AuditVerification.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[VerifyAuditChainError](src/AgentGuardApi/Errors/VerifyAuditChainError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Catalog

> Source: [Catalog](src/AgentGuardApi/Api/Catalog.cs)

<details>
<summary><code>Task&lt;object&gt; GetProductSearchStatus(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Catalog.GetProductSearchStatus();
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetProductSearchStatusError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetProductSearchStatusError](src/AgentGuardApi/Errors/GetProductSearchStatusError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;ProductSearchResult&gt; SearchProductsForMandate(SearchProductsForMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Catalog.SearchProductsForMandate(new SearchProductsForMandateRequest
    {
        Body = new V1ProductsSearchRequest { MandateId = "some example string", Query = "some example string" },
    });
    // TODO: Handle 'response' of type ProductSearchResult
}
catch (ApiException<SearchProductsForMandateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[SearchProductsForMandateRequest](src/AgentGuardApi/Requests/Catalog/SearchProductsForMandateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ProductSearchResult](src/AgentGuardApi/Models/ProductSearchResult.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[SearchProductsForMandateError](src/AgentGuardApi/Errors/SearchProductsForMandateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Control

> Source: [Control](src/AgentGuardApi/Api/Control.cs)

<details>
<summary><code>Task&lt;PauseState&gt; GetPauseState(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Control.GetPauseState();
    // TODO: Handle 'response' of type PauseState
}
catch (ApiException<GetPauseStateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[PauseState](src/AgentGuardApi/Models/PauseState.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetPauseStateError](src/AgentGuardApi/Errors/GetPauseStateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; Pause(PauseRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Control.Pause(new PauseRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<PauseError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PauseRequest](src/AgentGuardApi/Requests/Control/PauseRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[PauseError](src/AgentGuardApi/Errors/PauseError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; Resume(ResumeRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Control.Resume(new ResumeRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<ResumeError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ResumeRequest](src/AgentGuardApi/Requests/Control/ResumeRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ResumeError](src/AgentGuardApi/Errors/ResumeError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Jobs

> Source: [Jobs](src/AgentGuardApi/Api/Jobs.cs)

<details>
<summary><code>Task&lt;object&gt; RunAnchorJob(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Jobs.RunAnchorJob();
    // TODO: Handle 'response' of type object
}
catch (ApiException<RunAnchorJobError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RunAnchorJobError](src/AgentGuardApi/Errors/RunAnchorJobError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; RunAnchorJobPost(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Jobs.RunAnchorJobPost();
    // TODO: Handle 'response' of type object
}
catch (ApiException<RunAnchorJobPostError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RunAnchorJobPostError](src/AgentGuardApi/Errors/RunAnchorJobPostError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; RunMaintenanceJob(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Jobs.RunMaintenanceJob();
    // TODO: Handle 'response' of type object
}
catch (ApiException<RunMaintenanceJobError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RunMaintenanceJobError](src/AgentGuardApi/Errors/RunMaintenanceJobError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; RunMaintenanceJobPost(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Jobs.RunMaintenanceJobPost();
    // TODO: Handle 'response' of type object
}
catch (ApiException<RunMaintenanceJobPostError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RunMaintenanceJobPostError](src/AgentGuardApi/Errors/RunMaintenanceJobPostError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Keys

> Source: [Keys](src/AgentGuardApi/Api/Keys.cs)

<details>
<summary><code>Task&lt;object&gt; GetIssuerKey(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Keys.GetIssuerKey();
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetIssuerKeyError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetIssuerKeyError](src/AgentGuardApi/Errors/GetIssuerKeyError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;IssuerKeySet&gt; GetIssuerKeySet(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Keys.GetIssuerKeySet();
    // TODO: Handle 'response' of type IssuerKeySet
}
catch (ApiException<GetIssuerKeySetError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[IssuerKeySet](src/AgentGuardApi/Models/IssuerKeySet.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetIssuerKeySetError](src/AgentGuardApi/Errors/GetIssuerKeySetError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; MarkKeyCompromised(MarkKeyCompromisedRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Keys.MarkKeyCompromised(new MarkKeyCompromisedRequest { Kid = "some example string" });
    // TODO: Handle 'response' of type object
}
catch (ApiException<MarkKeyCompromisedError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[MarkKeyCompromisedRequest](src/AgentGuardApi/Requests/Keys/MarkKeyCompromisedRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[MarkKeyCompromisedError](src/AgentGuardApi/Errors/MarkKeyCompromisedError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; RotateIssuerKey(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Keys.RotateIssuerKey();
    // TODO: Handle 'response' of type object
}
catch (ApiException<RotateIssuerKeyError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RotateIssuerKeyError](src/AgentGuardApi/Errors/RotateIssuerKeyError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Mandates

> Source: [Mandates](src/AgentGuardApi/Api/Mandates.cs)

<details>
<summary><code>Task&lt;object&gt; ConfirmMandate(ConfirmMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.ConfirmMandate(new ConfirmMandateRequest
    {
        Id = "some example string",
        Body = new V1MandatesConfirmRequest { MandateHash = "some example string", Assertion = assertion },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<ConfirmMandateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ConfirmMandateRequest](src/AgentGuardApi/Requests/Mandates/ConfirmMandateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ConfirmMandateError](src/AgentGuardApi/Errors/ConfirmMandateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; CreateMandate(CreateMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.CreateMandate(new CreateMandateRequest
    {
        Body = new V1MandatesRequest
        {
            UserId = "some example string",
            AgentId = "some example string",
            Purpose = "some example string",
        },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<CreateMandateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CreateMandateRequest](src/AgentGuardApi/Requests/Mandates/CreateMandateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[CreateMandateError](src/AgentGuardApi/Errors/CreateMandateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; DraftMandateFromText(DraftMandateFromTextRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.DraftMandateFromText(new DraftMandateFromTextRequest
    {
        Body = new V1MandatesDraftFromTextRequest
        {
            UserId = "some example string",
            AgentId = "some example string",
            Text = "some example string",
        },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<DraftMandateFromTextError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[DraftMandateFromTextRequest](src/AgentGuardApi/Requests/Mandates/DraftMandateFromTextRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[DraftMandateFromTextError](src/AgentGuardApi/Errors/DraftMandateFromTextError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetMandate(GetMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.GetMandate(new GetMandateRequest { Id = "some example string" });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetMandateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetMandateRequest](src/AgentGuardApi/Requests/Mandates/GetMandateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetMandateError](src/AgentGuardApi/Errors/GetMandateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetMandateRevocationOptions(GetMandateRevocationOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.GetMandateRevocationOptions(new GetMandateRevocationOptionsRequest
    {
        Id = "some example string",
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetMandateRevocationOptionsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetMandateRevocationOptionsRequest](src/AgentGuardApi/Requests/Mandates/GetMandateRevocationOptionsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetMandateRevocationOptionsError](src/AgentGuardApi/Errors/GetMandateRevocationOptionsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetMandateSigningOptions(GetMandateSigningOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.GetMandateSigningOptions(new GetMandateSigningOptionsRequest
    {
        Id = "some example string",
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetMandateSigningOptionsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetMandateSigningOptionsRequest](src/AgentGuardApi/Requests/Mandates/GetMandateSigningOptionsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetMandateSigningOptionsError](src/AgentGuardApi/Errors/GetMandateSigningOptionsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; ListMandates(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.ListMandates();
    // TODO: Handle 'response' of type object
}
catch (ApiException<ListMandatesError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListMandatesError](src/AgentGuardApi/Errors/ListMandatesError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; RevokeMandate(RevokeMandateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Mandates.RevokeMandate(new RevokeMandateRequest { Id = "some example string" });
    // TODO: Handle 'response' of type object
}
catch (ApiException<RevokeMandateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[RevokeMandateRequest](src/AgentGuardApi/Requests/Mandates/RevokeMandateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RevokeMandateError](src/AgentGuardApi/Errors/RevokeMandateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Meta

> Source: [Meta](src/AgentGuardApi/Api/Meta.cs)

<details>
<summary><code>Task&lt;Health&gt; GetHealth(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Meta.GetHealth();
    // TODO: Handle 'response' of type Health
}
catch (ApiException<GetHealthError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[Health](src/AgentGuardApi/Models/Health.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetHealthError](src/AgentGuardApi/Errors/GetHealthError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetLiveness(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Meta.GetLiveness();
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetLivenessError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetLivenessError](src/AgentGuardApi/Errors/GetLivenessError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task HeadLiveness(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    await client.Meta.HeadLiveness();
}
catch (ApiException<HeadLivenessError> ex)
{
    if (ex.Error.TryGetNoContent(out var error))
    {
        // TODO: Handle 'error' of type RawError
    }
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[HeadLivenessError](src/AgentGuardApi/Errors/HeadLivenessError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Passkeys

> Source: [Passkeys](src/AgentGuardApi/Api/Passkeys.cs)

<details>
<summary><code>Task&lt;object&gt; CancelRecovery(CancelRecoveryRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.CancelRecovery(new CancelRecoveryRequest
    {
        Id = "some example string",
        Body = new V1UsersRecoveryCancelRequest { Assertion = assertion },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<CancelRecoveryError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CancelRecoveryRequest](src/AgentGuardApi/Requests/Passkeys/CancelRecoveryRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[CancelRecoveryError](src/AgentGuardApi/Errors/CancelRecoveryError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; CreateEnrollmentLink(CreateEnrollmentLinkRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.CreateEnrollmentLink(new CreateEnrollmentLinkRequest
    {
        Id = "some example string",
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<CreateEnrollmentLinkError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CreateEnrollmentLinkRequest](src/AgentGuardApi/Requests/Passkeys/CreateEnrollmentLinkRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[CreateEnrollmentLinkError](src/AgentGuardApi/Errors/CreateEnrollmentLinkError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; EnrollPasskey(EnrollPasskeyRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.EnrollPasskey(new EnrollPasskeyRequest
    {
        Body = new V1EnrollRequest { Token = "some example string", Response = response },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<EnrollPasskeyError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[EnrollPasskeyRequest](src/AgentGuardApi/Requests/Passkeys/EnrollPasskeyRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[EnrollPasskeyError](src/AgentGuardApi/Errors/EnrollPasskeyError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetEnrollmentOptions(GetEnrollmentOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.GetEnrollmentOptions(new GetEnrollmentOptionsRequest
    {
        Body = new V1EnrollOptionsRequest { Token = "some example string" },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetEnrollmentOptionsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetEnrollmentOptionsRequest](src/AgentGuardApi/Requests/Passkeys/GetEnrollmentOptionsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetEnrollmentOptionsError](src/AgentGuardApi/Errors/GetEnrollmentOptionsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetRecoveryCancelOptions(GetRecoveryCancelOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.GetRecoveryCancelOptions(new GetRecoveryCancelOptionsRequest
    {
        Id = "some example string",
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetRecoveryCancelOptionsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetRecoveryCancelOptionsRequest](src/AgentGuardApi/Requests/Passkeys/GetRecoveryCancelOptionsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetRecoveryCancelOptionsError](src/AgentGuardApi/Errors/GetRecoveryCancelOptionsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetRecoveryState(GetRecoveryStateRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.GetRecoveryState(new GetRecoveryStateRequest { Id = "some example string" });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetRecoveryStateError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetRecoveryStateRequest](src/AgentGuardApi/Requests/Passkeys/GetRecoveryStateRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetRecoveryStateError](src/AgentGuardApi/Errors/GetRecoveryStateError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetReenrollmentOptions(GetReenrollmentOptionsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.GetReenrollmentOptions(new GetReenrollmentOptionsRequest
    {
        Id = "some example string",
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetReenrollmentOptionsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetReenrollmentOptionsRequest](src/AgentGuardApi/Requests/Passkeys/GetReenrollmentOptionsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetReenrollmentOptionsError](src/AgentGuardApi/Errors/GetReenrollmentOptionsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; GetUserPasskey(GetUserPasskeyRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.GetUserPasskey(new GetUserPasskeyRequest { Id = "some example string" });
    // TODO: Handle 'response' of type object
}
catch (ApiException<GetUserPasskeyError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetUserPasskeyRequest](src/AgentGuardApi/Requests/Passkeys/GetUserPasskeyRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetUserPasskeyError](src/AgentGuardApi/Errors/GetUserPasskeyError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; ReenrollPasskey(ReenrollPasskeyRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Passkeys.ReenrollPasskey(new ReenrollPasskeyRequest
    {
        Id = "some example string",
        Body = new V1UsersReenrollRequest { Assertion = assertion },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<ReenrollPasskeyError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ReenrollPasskeyRequest](src/AgentGuardApi/Requests/Passkeys/ReenrollPasskeyRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ReenrollPasskeyError](src/AgentGuardApi/Errors/ReenrollPasskeyError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Payments

> Source: [Payments](src/AgentGuardApi/Api/Payments.cs)

<details>
<summary><code>Task&lt;object&gt; ListPayments(ListPaymentsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Payments.ListPayments(new ListPaymentsRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<ListPaymentsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ListPaymentsRequest](src/AgentGuardApi/Requests/Payments/ListPaymentsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListPaymentsError](src/AgentGuardApi/Errors/ListPaymentsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; ListStuckPayments(ListStuckPaymentsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Payments.ListStuckPayments(new ListStuckPaymentsRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<ListStuckPaymentsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ListStuckPaymentsRequest](src/AgentGuardApi/Requests/Payments/ListStuckPaymentsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListStuckPaymentsError](src/AgentGuardApi/Errors/ListStuckPaymentsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; RecoverPayments(RecoverPaymentsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Payments.RecoverPayments(new RecoverPaymentsRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<RecoverPaymentsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[RecoverPaymentsRequest](src/AgentGuardApi/Requests/Payments/RecoverPaymentsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RecoverPaymentsError](src/AgentGuardApi/Errors/RecoverPaymentsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Receipts

> Source: [Receipts](src/AgentGuardApi/Api/Receipts.cs)

<details>
<summary><code>Task&lt;ReceiptEnvelope&gt; GetPaymentReceipt(GetPaymentReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Receipts.GetPaymentReceipt(new GetPaymentReceiptRequest { Id = "some example string" });
    // TODO: Handle 'response' of type ReceiptEnvelope
}
catch (ApiException<GetPaymentReceiptError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetPaymentReceiptRequest](src/AgentGuardApi/Requests/Receipts/GetPaymentReceiptRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ReceiptEnvelope](src/AgentGuardApi/Models/ReceiptEnvelope.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetPaymentReceiptError](src/AgentGuardApi/Errors/GetPaymentReceiptError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;ReceiptEnvelope&gt; GetPublicReceipt(GetPublicReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Receipts.GetPublicReceipt(new GetPublicReceiptRequest { Id = "some example string" });
    // TODO: Handle 'response' of type ReceiptEnvelope
}
catch (ApiException<GetPublicReceiptError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetPublicReceiptRequest](src/AgentGuardApi/Requests/Receipts/GetPublicReceiptRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ReceiptEnvelope](src/AgentGuardApi/Models/ReceiptEnvelope.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetPublicReceiptError](src/AgentGuardApi/Errors/GetPublicReceiptError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;ReceiptEnvelope&gt; GetReceipt(GetReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Receipts.GetReceipt(new GetReceiptRequest { Id = "some example string" });
    // TODO: Handle 'response' of type ReceiptEnvelope
}
catch (ApiException<GetReceiptError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[GetReceiptRequest](src/AgentGuardApi/Requests/Receipts/GetReceiptRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[ReceiptEnvelope](src/AgentGuardApi/Models/ReceiptEnvelope.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[GetReceiptError](src/AgentGuardApi/Errors/GetReceiptError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;IReadOnlyList&lt;ReceiptSummary&gt;&gt; ListReceipts(ListReceiptsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Receipts.ListReceipts(new ListReceiptsRequest());
    // TODO: Handle 'response' of type IReadOnlyList<ReceiptSummary>
}
catch (ApiException<ListReceiptsError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ListReceiptsRequest](src/AgentGuardApi/Requests/Receipts/ListReceiptsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>IReadOnlyList&lt;[ReceiptSummary](src/AgentGuardApi/Models/ReceiptSummary.cs)&gt;</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[ListReceiptsError](src/AgentGuardApi/Errors/ListReceiptsError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Setup

> Source: [Setup](src/AgentGuardApi/Api/Setup.cs)

<details>
<summary><code>Task&lt;object&gt; CompleteWalletSetup(CompleteWalletSetupRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Setup.CompleteWalletSetup(new CompleteWalletSetupRequest());
    // TODO: Handle 'response' of type object
}
catch (ApiException<CompleteWalletSetupError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CompleteWalletSetupRequest](src/AgentGuardApi/Requests/Setup/CompleteWalletSetupRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[CompleteWalletSetupError](src/AgentGuardApi/Errors/CompleteWalletSetupError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; LinkWallet(LinkWalletRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Setup.LinkWallet(new LinkWalletRequest
    {
        Body = new V1WalletsLinkRequest { UserId = "some example string", VaultId = "some example string" },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<LinkWalletError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[LinkWalletRequest](src/AgentGuardApi/Requests/Setup/LinkWalletRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[LinkWalletError](src/AgentGuardApi/Errors/LinkWalletError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;AgentCredentials&gt; RegisterAgent(RegisterAgentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Setup.RegisterAgent(new RegisterAgentRequest
    {
        Body = new V1AgentsRequest { UserId = "some example string", AgentId = "some example string" },
    });
    // TODO: Handle 'response' of type AgentCredentials
}
catch (ApiException<RegisterAgentError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[RegisterAgentRequest](src/AgentGuardApi/Requests/Setup/RegisterAgentRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>[AgentCredentials](src/AgentGuardApi/Models/AgentCredentials.cs)</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[RegisterAgentError](src/AgentGuardApi/Errors/RegisterAgentError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task&lt;object&gt; StartWalletSetup(StartWalletSetupRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

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

```csharp
try
{
    var response = await client.Setup.StartWalletSetup(new StartWalletSetupRequest
    {
        Body = new V1WalletsSetupRequest { UserId = "some example string" },
    });
    // TODO: Handle 'response' of type object
}
catch (ApiException<StartWalletSetupError> ex)
{
    if (ex.Error.TryGetErrorResponseModel(out var error))
    {
        // TODO: Handle 'error' of type ErrorResponseModel
    }
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[StartWalletSetupRequest](src/AgentGuardApi/Requests/Setup/StartWalletSetupRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: <code>object</code>

**OnError**: <code>[ApiException](src/AgentGuardApi/Core/Exceptions/ApiException.cs)&lt;[StartWalletSetupError](src/AgentGuardApi/Errors/StartWalletSetupError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

