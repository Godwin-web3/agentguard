# Reference

> Source: [AgentGuardApiClient](src/client.ts)

## Meta

> Source: [Meta](src/resources/meta.ts)

<details>
<summary><code>getHealth(options?: RequestOptions): ApiPromise&lt;Health, Meta.GetHealthError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Health: ok, stuck payment count, last recovery run

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.meta.getHealth();
  // TODO: Handle 'response' of type Health
} catch (err) {
  // TODO: Handle 'err' of type Meta.GetHealthError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.meta.getHealth().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Health
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.meta.getHealth()`

- **OnSuccess**: <code>[Health](src/models/health.ts)</code>
- **OnError**: throws <code>[Meta.GetHealthError](src/resources/meta.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.meta.getHealth().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Health, Meta.GetHealthError&gt;</code>, with `result.value` of type <code>[Health](src/models/health.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getLiveness(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Meta.GetLivenessError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Liveness probe (plain 200)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.meta.getLiveness();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Meta.GetLivenessError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.meta.getLiveness().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.meta.getLiveness()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Meta.GetLivenessError](src/resources/meta.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.meta.getLiveness().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Meta.GetLivenessError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>headLiveness(options?: RequestOptions): ApiPromise&lt;undefined, Meta.HeadLivenessError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Liveness probe, no body

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  await client.meta.headLiveness();
} catch (err) {
  // TODO: Handle 'err' of type Meta.HeadLivenessError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.meta.headLiveness().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: The call succeeded and resolves to no body
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.meta.headLiveness()`

- **OnSuccess**: <code>undefined</code>
- **OnError**: throws <code>[Meta.HeadLivenessError](src/resources/meta.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.meta.headLiveness().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;undefined, Meta.HeadLivenessError&gt;</code>, with `result.value` of type <code>undefined</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Jobs

> Source: [Jobs](src/resources/jobs.ts)

<details>
<summary><code>runAnchorJob(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Jobs.RunAnchorJobError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.jobs.runAnchorJob();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Jobs.RunAnchorJobError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.jobs.runAnchorJob().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.jobs.runAnchorJob()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Jobs.RunAnchorJobError](src/resources/jobs.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.jobs.runAnchorJob().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Jobs.RunAnchorJobError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>runAnchorJobPost(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Jobs.RunAnchorJobPostError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Same as GET, for pg_net callers

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.jobs.runAnchorJobPost();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Jobs.RunAnchorJobPostError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.jobs.runAnchorJobPost().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.jobs.runAnchorJobPost()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Jobs.RunAnchorJobPostError](src/resources/jobs.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.jobs.runAnchorJobPost().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Jobs.RunAnchorJobPostError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>runMaintenanceJob(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Jobs.RunMaintenanceJobError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Expire recovery locks, retry notifications, converge stuck payments

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.jobs.runMaintenanceJob();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Jobs.RunMaintenanceJobError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.jobs.runMaintenanceJob().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.jobs.runMaintenanceJob()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Jobs.RunMaintenanceJobError](src/resources/jobs.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.jobs.runMaintenanceJob().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Jobs.RunMaintenanceJobError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>runMaintenanceJobPost(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Jobs.RunMaintenanceJobPostError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Same as GET, for pg_net callers

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.jobs.runMaintenanceJobPost();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Jobs.RunMaintenanceJobPostError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.jobs.runMaintenanceJobPost().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.jobs.runMaintenanceJobPost()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Jobs.RunMaintenanceJobPostError](src/resources/jobs.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.jobs.runMaintenanceJobPost().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Jobs.RunMaintenanceJobPostError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Keys

> Source: [Keys](src/resources/keys.ts)

<details>
<summary><code>getIssuerKey(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Keys.GetIssuerKeyError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Active issuer public key (legacy single-key form)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.keys.getIssuerKey();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Keys.GetIssuerKeyError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.keys.getIssuerKey().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.keys.getIssuerKey()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Keys.GetIssuerKeyError](src/resources/keys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.keys.getIssuerKey().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Keys.GetIssuerKeyError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getIssuerKeySet(options?: RequestOptions): ApiPromise&lt;IssuerKeySet, Keys.GetIssuerKeySetError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.keys.getIssuerKeySet();
  // TODO: Handle 'response' of type IssuerKeySet
} catch (err) {
  // TODO: Handle 'err' of type Keys.GetIssuerKeySetError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.keys.getIssuerKeySet().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type IssuerKeySet
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.keys.getIssuerKeySet()`

- **OnSuccess**: <code>[IssuerKeySet](src/models/issuer-key-set.ts)</code>
- **OnError**: throws <code>[Keys.GetIssuerKeySetError](src/resources/keys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.keys.getIssuerKeySet().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;IssuerKeySet, Keys.GetIssuerKeySetError&gt;</code>, with `result.value` of type <code>[IssuerKeySet](src/models/issuer-key-set.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>markKeyCompromised(request: Keys.MarkKeyCompromisedRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Keys.MarkKeyCompromisedError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Mark a key compromised as of `at` (rotates first if active)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.keys.markKeyCompromised({ kid: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Keys.MarkKeyCompromisedError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.keys.markKeyCompromised({ kid: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>kid</code> | <code>string</code> | - |
| <code>body?</code> | <code>[V1KeysCompromisedRequest](src/models/v1-keys-compromised-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.keys.markKeyCompromised(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Keys.MarkKeyCompromisedError](src/resources/keys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.keys.markKeyCompromised(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Keys.MarkKeyCompromisedError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>rotateIssuerKey(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Keys.RotateIssuerKeyError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retire the active issuer key and create a new one (audited)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.keys.rotateIssuerKey();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Keys.RotateIssuerKeyError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.keys.rotateIssuerKey().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.keys.rotateIssuerKey()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Keys.RotateIssuerKeyError](src/resources/keys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.keys.rotateIssuerKey().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Keys.RotateIssuerKeyError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Receipts

> Source: [Receipts](src/resources/receipts.ts)

<details>
<summary><code>getPaymentReceipt(request: Receipts.GetPaymentReceiptRequest, options?: RequestOptions): ApiPromise&lt;ReceiptEnvelope, Receipts.GetPaymentReceiptError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Receipt for a payment

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.receipts.getPaymentReceipt({ id: "some example string" });
  // TODO: Handle 'response' of type ReceiptEnvelope
} catch (err) {
  // TODO: Handle 'err' of type Receipts.GetPaymentReceiptError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.receipts.getPaymentReceipt({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ReceiptEnvelope
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.receipts.getPaymentReceipt(request)`

- **OnSuccess**: <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: throws <code>[Receipts.GetPaymentReceiptError](src/resources/receipts.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.receipts.getPaymentReceipt(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ReceiptEnvelope, Receipts.GetPaymentReceiptError&gt;</code>, with `result.value` of type <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getPublicReceipt(request: Receipts.GetPublicReceiptRequest, options?: RequestOptions): ApiPromise&lt;ReceiptEnvelope, Receipts.GetPublicReceiptError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.receipts.getPublicReceipt({ id: "some example string" });
  // TODO: Handle 'response' of type ReceiptEnvelope
} catch (err) {
  // TODO: Handle 'err' of type Receipts.GetPublicReceiptError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.receipts.getPublicReceipt({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ReceiptEnvelope
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.receipts.getPublicReceipt(request)`

- **OnSuccess**: <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: throws <code>[Receipts.GetPublicReceiptError](src/resources/receipts.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.receipts.getPublicReceipt(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ReceiptEnvelope, Receipts.GetPublicReceiptError&gt;</code>, with `result.value` of type <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getReceipt(request: Receipts.GetReceiptRequest, options?: RequestOptions): ApiPromise&lt;ReceiptEnvelope, Receipts.GetReceiptError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Receipt by id

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.receipts.getReceipt({ id: "some example string" });
  // TODO: Handle 'response' of type ReceiptEnvelope
} catch (err) {
  // TODO: Handle 'err' of type Receipts.GetReceiptError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.receipts.getReceipt({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ReceiptEnvelope
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.receipts.getReceipt(request)`

- **OnSuccess**: <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: throws <code>[Receipts.GetReceiptError](src/resources/receipts.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.receipts.getReceipt(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ReceiptEnvelope, Receipts.GetReceiptError&gt;</code>, with `result.value` of type <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>listReceipts(request?: Receipts.ListReceiptsRequest, options?: RequestOptions): ApiPromise&lt;ReceiptSummary[], Receipts.ListReceiptsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

List receipts

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.receipts.listReceipts();
  // TODO: Handle 'response' of type ReceiptSummary[]
} catch (err) {
  // TODO: Handle 'err' of type Receipts.ListReceiptsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.receipts.listReceipts().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ReceiptSummary[]
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit?</code> | <code>string</code> | Default 100 |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.receipts.listReceipts(request)`

- **OnSuccess**: <code>[ReceiptSummary](src/models/receipt-summary.ts)[]</code>
- **OnError**: throws <code>[Receipts.ListReceiptsError](src/resources/receipts.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.receipts.listReceipts(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ReceiptSummary[], Receipts.ListReceiptsError&gt;</code>, with `result.value` of type <code>[ReceiptSummary](src/models/receipt-summary.ts)[]</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Setup

> Source: [Setup](src/resources/setup.ts)

<details>
<summary><code>completeWalletSetup(request?: Setup.CompleteWalletSetupRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Setup.CompleteWalletSetupError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

PayPal redirect target after buyer consent; links the vaulted wallet

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.setup.completeWalletSetup();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Setup.CompleteWalletSetupError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.setup.completeWalletSetup().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>state?</code> | <code>string</code> | One-time state from /v1/wallets/setup |
| <code>approvalTokenId?</code> | <code>string</code> | PayPal setup token id |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.setup.completeWalletSetup(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Setup.CompleteWalletSetupError](src/resources/setup.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.setup.completeWalletSetup(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Setup.CompleteWalletSetupError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>linkWallet(request: Setup.LinkWalletRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Setup.LinkWalletError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Link an existing PayPal vault id to a user

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.setup.linkWallet({
    body: { userId: "some example string", vaultId: "some example string" },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Setup.LinkWalletError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.setup
  .linkWallet({ body: { userId: "some example string", vaultId: "some example string" } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1WalletsLinkRequest](src/models/v1-wallets-link-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.setup.linkWallet(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Setup.LinkWalletError](src/resources/setup.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.setup.linkWallet(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Setup.LinkWalletError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>registerAgent(request: Setup.RegisterAgentRequest, options?: RequestOptions): ApiPromise&lt;AgentCredentials, Setup.RegisterAgentError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Register an agent and return its API key (shown once)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.setup.registerAgent({
    body: { userId: "some example string", agentId: "some example string" },
  });
  // TODO: Handle 'response' of type AgentCredentials
} catch (err) {
  // TODO: Handle 'err' of type Setup.RegisterAgentError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.setup
  .registerAgent({ body: { userId: "some example string", agentId: "some example string" } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type AgentCredentials
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1AgentsRequest](src/models/v1-agents-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.setup.registerAgent(request)`

- **OnSuccess**: <code>[AgentCredentials](src/models/agent-credentials.ts)</code>
- **OnError**: throws <code>[Setup.RegisterAgentError](src/resources/setup.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.setup.registerAgent(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;AgentCredentials, Setup.RegisterAgentError&gt;</code>, with `result.value` of type <code>[AgentCredentials](src/models/agent-credentials.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>startWalletSetup(request: Setup.StartWalletSetupRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Setup.StartWalletSetupError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Start PayPal wallet vaulting; returns the setup token with the buyer consent link

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.setup.startWalletSetup({ body: { userId: "some example string" } });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Setup.StartWalletSetupError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.setup.startWalletSetup({ body: { userId: "some example string" } }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1WalletsSetupRequest](src/models/v1-wallets-setup-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.setup.startWalletSetup(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Setup.StartWalletSetupError](src/resources/setup.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.setup.startWalletSetup(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Setup.StartWalletSetupError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Mandates

> Source: [Mandates](src/resources/mandates.ts)

<details>
<summary><code>confirmMandate(request: Mandates.ConfirmMandateRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.ConfirmMandateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Activate a mandate with the user's passkey assertion

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.confirmMandate({
    id: "some example string",
    body: { mandateHash: "some example string", assertion: {} },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.ConfirmMandateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates
  .confirmMandate({ id: "some example string", body: { mandateHash: "some example string", assertion: {} } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body</code> | <code>[V1MandatesConfirmRequest](src/models/v1-mandates-confirm-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.confirmMandate(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.ConfirmMandateError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.confirmMandate(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.ConfirmMandateError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>createMandate(request: Mandates.CreateMandateRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.CreateMandateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Create a draft mandate from structured constraints

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.createMandate({
    body: { userId: "some example string", agentId: "some example string", purpose: "some example string" },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.CreateMandateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates
  .createMandate({
    body: { userId: "some example string", agentId: "some example string", purpose: "some example string" },
  })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1MandatesRequest](src/models/v1-mandates-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.createMandate(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.CreateMandateError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.createMandate(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.CreateMandateError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>draftMandateFromText(request: Mandates.DraftMandateFromTextRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.DraftMandateFromTextError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Draft a mandate from plain English (model proposes, deterministic parser bounds it)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.draftMandateFromText({
    body: { userId: "some example string", agentId: "some example string", text: "some example string" },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.DraftMandateFromTextError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates
  .draftMandateFromText({
    body: { userId: "some example string", agentId: "some example string", text: "some example string" },
  })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1MandatesDraftFromTextRequest](src/models/v1-mandates-draft-from-text-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.draftMandateFromText(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.DraftMandateFromTextError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.draftMandateFromText(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.DraftMandateFromTextError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getMandate(request: Mandates.GetMandateRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.GetMandateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Mandate, status and spend

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.getMandate({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.GetMandateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates.getMandate({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.getMandate(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.GetMandateError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.getMandate(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.GetMandateError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getMandateRevocationOptions(request: Mandates.GetMandateRevocationOptionsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.GetMandateRevocationOptionsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Get WebAuthn options for revocation

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.getMandateRevocationOptions({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.GetMandateRevocationOptionsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates.getMandateRevocationOptions({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.getMandateRevocationOptions(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.GetMandateRevocationOptionsError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.getMandateRevocationOptions(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.GetMandateRevocationOptionsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getMandateSigningOptions(request: Mandates.GetMandateSigningOptionsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.GetMandateSigningOptionsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Get WebAuthn options whose challenge is the mandate hash

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.getMandateSigningOptions({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.GetMandateSigningOptionsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates.getMandateSigningOptions({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.getMandateSigningOptions(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.GetMandateSigningOptionsError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.getMandateSigningOptions(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.GetMandateSigningOptionsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>listMandates(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.ListMandatesError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

List mandates with spend state and summary

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.listMandates();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.ListMandatesError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates.listMandates().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.listMandates()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.ListMandatesError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.listMandates().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.ListMandatesError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>revokeMandate(request: Mandates.RevokeMandateRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Mandates.RevokeMandateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Revoke with the user's passkey (drafts can be discarded without one)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.mandates.revokeMandate({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Mandates.RevokeMandateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.mandates.revokeMandate({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body?</code> | <code>[V1MandatesRevokeRequest](src/models/v1-mandates-revoke-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.mandates.revokeMandate(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Mandates.RevokeMandateError](src/resources/mandates.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.mandates.revokeMandate(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Mandates.RevokeMandateError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Passkeys

> Source: [Passkeys](src/resources/passkeys.ts)

<details>
<summary><code>cancelRecovery(request: Passkeys.CancelRecoveryRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.CancelRecoveryError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Cancel a pending recovery

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.cancelRecovery({
    id: "some example string",
    body: { assertion: {} },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.CancelRecoveryError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys
  .cancelRecovery({ id: "some example string", body: { assertion: {} } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body</code> | <code>[V1UsersRecoveryCancelRequest](src/models/v1-users-recovery-cancel-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.cancelRecovery(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.CancelRecoveryError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.cancelRecovery(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.CancelRecoveryError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>createEnrollmentLink(request: Passkeys.CreateEnrollmentLinkRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.CreateEnrollmentLinkError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Issue a single-use enrollment link (15 min default)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.createEnrollmentLink({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.CreateEnrollmentLinkError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys.createEnrollmentLink({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body?</code> | <code>[V1UsersEnrollmentsRequest](src/models/v1-users-enrollments-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.createEnrollmentLink(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.CreateEnrollmentLinkError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.createEnrollmentLink(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.CreateEnrollmentLinkError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>enrollPasskey(request: Passkeys.EnrollPasskeyRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.EnrollPasskeyError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeem step 2: register the passkey

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.enrollPasskey({
    body: { token: "some example string", response: {} },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.EnrollPasskeyError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys
  .enrollPasskey({ body: { token: "some example string", response: {} } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1EnrollRequest](src/models/v1-enroll-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.enrollPasskey(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.EnrollPasskeyError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.enrollPasskey(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.EnrollPasskeyError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getEnrollmentOptions(request: Passkeys.GetEnrollmentOptionsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.GetEnrollmentOptionsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeem step 1: registration options for an enrollment token

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.getEnrollmentOptions({ body: { token: "some example string" } });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.GetEnrollmentOptionsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys
  .getEnrollmentOptions({ body: { token: "some example string" } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1EnrollOptionsRequest](src/models/v1-enroll-options-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.getEnrollmentOptions(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.GetEnrollmentOptionsError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.getEnrollmentOptions(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.GetEnrollmentOptionsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getRecoveryCancelOptions(request: Passkeys.GetRecoveryCancelOptionsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.GetRecoveryCancelOptionsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Options to cancel a recovery with the current passkey

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.getRecoveryCancelOptions({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.GetRecoveryCancelOptionsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys.getRecoveryCancelOptions({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.getRecoveryCancelOptions(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.GetRecoveryCancelOptionsError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.getRecoveryCancelOptions(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.GetRecoveryCancelOptionsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getRecoveryState(request: Passkeys.GetRecoveryStateRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.GetRecoveryStateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Time-locked recovery state

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.getRecoveryState({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.GetRecoveryStateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys.getRecoveryState({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.getRecoveryState(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.GetRecoveryStateError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.getRecoveryState(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.GetRecoveryStateError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getReenrollmentOptions(request: Passkeys.GetReenrollmentOptionsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.GetReenrollmentOptionsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Options for replacing a passkey with the current one

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.getReenrollmentOptions({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.GetReenrollmentOptionsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys.getReenrollmentOptions({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.getReenrollmentOptions(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.GetReenrollmentOptionsError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.getReenrollmentOptions(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.GetReenrollmentOptionsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getUserPasskey(request: Passkeys.GetUserPasskeyRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.GetUserPasskeyError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Whether the user has a passkey, and its credential id

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.getUserPasskey({ id: "some example string" });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.GetUserPasskeyError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys.getUserPasskey({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.getUserPasskey(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.GetUserPasskeyError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.getUserPasskey(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.GetUserPasskeyError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>reenrollPasskey(request: Passkeys.ReenrollPasskeyRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Passkeys.ReenrollPasskeyError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Mint a re-enrollment token authorized by the current passkey

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.passkeys.reenrollPasskey({
    id: "some example string",
    body: { assertion: {} },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Passkeys.ReenrollPasskeyError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.passkeys
  .reenrollPasskey({ id: "some example string", body: { assertion: {} } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body</code> | <code>[V1UsersReenrollRequest](src/models/v1-users-reenroll-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.passkeys.reenrollPasskey(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Passkeys.ReenrollPasskeyError](src/resources/passkeys.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.passkeys.reenrollPasskey(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Passkeys.ReenrollPasskeyError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Approvals

> Source: [Approvals](src/resources/approvals.ts)

<details>
<summary><code>getApprovalOptions(request: Approvals.GetApprovalOptionsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Approvals.GetApprovalOptionsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Approval statement and WebAuthn options (5-minute nonce)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.approvals.getApprovalOptions({
    id: "some example string",
    body: { approve: true },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Approvals.GetApprovalOptionsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.approvals
  .getApprovalOptions({ id: "some example string", body: { approve: true } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body</code> | <code>[V1ApprovalsRequestRequest](src/models/v1-approvals-request-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.approvals.getApprovalOptions(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Approvals.GetApprovalOptionsError](src/resources/approvals.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.approvals.getApprovalOptions(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Approvals.GetApprovalOptionsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>listApprovals(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Approvals.ListApprovalsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Payments held for the owner

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.approvals.listApprovals();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Approvals.ListApprovalsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.approvals.listApprovals().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.approvals.listApprovals()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Approvals.ListApprovalsError](src/resources/approvals.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.approvals.listApprovals().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Approvals.ListApprovalsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>resolveApproval(request: Approvals.ResolveApprovalRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Approvals.ResolveApprovalError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Approve or deny with the user's passkey. The admin token alone is refused.

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.approvals.resolveApproval({
    id: "some example string",
    body: { approve: true, assertion: {} },
  });
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Approvals.ResolveApprovalError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.approvals
  .resolveApproval({ id: "some example string", body: { approve: true, assertion: {} } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |
| <code>body</code> | <code>[V1ApprovalsRequest](src/models/v1-approvals-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.approvals.resolveApproval(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Approvals.ResolveApprovalError](src/resources/approvals.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.approvals.resolveApproval(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Approvals.ResolveApprovalError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Agent

> Source: [Agent](src/resources/agent.ts)

<details>
<summary><code>getAgentMandate(request: Agent.GetAgentMandateRequest, options?: RequestOptions): ApiPromise&lt;AgentMandate, Agent.GetAgentMandateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

The agent's own mandate, status and spend

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.agent.getAgentMandate({ id: "some example string" });
  // TODO: Handle 'response' of type AgentMandate
} catch (err) {
  // TODO: Handle 'err' of type Agent.GetAgentMandateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.agent.getAgentMandate({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type AgentMandate
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.agent.getAgentMandate(request)`

- **OnSuccess**: <code>[AgentMandate](src/models/agent-mandate.ts)</code>
- **OnError**: throws <code>[Agent.GetAgentMandateError](src/resources/agent.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.agent.getAgentMandate(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;AgentMandate, Agent.GetAgentMandateError&gt;</code>, with `result.value` of type <code>[AgentMandate](src/models/agent-mandate.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getAgentPayment(request: Agent.GetAgentPaymentRequest, options?: RequestOptions): ApiPromise&lt;PaymentDecision, Agent.GetAgentPaymentError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Payment status (the calling agent's own only)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.agent.getAgentPayment({ id: "some example string" });
  // TODO: Handle 'response' of type PaymentDecision
} catch (err) {
  // TODO: Handle 'err' of type Agent.GetAgentPaymentError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.agent.getAgentPayment({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type PaymentDecision
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.agent.getAgentPayment(request)`

- **OnSuccess**: <code>[PaymentDecision](src/models/payment-decision.ts)</code>
- **OnError**: throws <code>[Agent.GetAgentPaymentError](src/resources/agent.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.agent.getAgentPayment(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;PaymentDecision, Agent.GetAgentPaymentError&gt;</code>, with `result.value` of type <code>[PaymentDecision](src/models/payment-decision.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getAgentPaymentReceipt(request: Agent.GetAgentPaymentReceiptRequest, options?: RequestOptions): ApiPromise&lt;ReceiptEnvelope, Agent.GetAgentPaymentReceiptError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Proof-of-Intent receipt for a captured payment

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.agent.getAgentPaymentReceipt({ id: "some example string" });
  // TODO: Handle 'response' of type ReceiptEnvelope
} catch (err) {
  // TODO: Handle 'err' of type Agent.GetAgentPaymentReceiptError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.agent.getAgentPaymentReceipt({ id: "some example string" }).asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ReceiptEnvelope
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>id</code> | <code>string</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.agent.getAgentPaymentReceipt(request)`

- **OnSuccess**: <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: throws <code>[Agent.GetAgentPaymentReceiptError](src/resources/agent.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.agent.getAgentPaymentReceipt(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ReceiptEnvelope, Agent.GetAgentPaymentReceiptError&gt;</code>, with `result.value` of type <code>[ReceiptEnvelope](src/models/receipt-envelope.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>proposePayment(request: Agent.ProposePaymentRequest, options?: RequestOptions): ApiPromise&lt;PaymentDecision, Agent.ProposePaymentError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Propose a payment (30/min per agent; 429 above)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.agent.proposePayment({
    body: {
      mandateId: "some example string",
      agentId: "some example string",
      idempotencyKey: "some example string",
    },
  });
  // TODO: Handle 'response' of type PaymentDecision
} catch (err) {
  // TODO: Handle 'err' of type Agent.ProposePaymentError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.agent
  .proposePayment({
    body: {
      mandateId: "some example string",
      agentId: "some example string",
      idempotencyKey: "some example string",
    },
  })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type PaymentDecision
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1AgentPaymentsRequest](src/models/v1-agent-payments-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.agent.proposePayment(request)`

- **OnSuccess**: <code>[PaymentDecision](src/models/payment-decision.ts)</code>
- **OnError**: throws <code>[Agent.ProposePaymentError](src/resources/agent.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.agent.proposePayment(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;PaymentDecision, Agent.ProposePaymentError&gt;</code>, with `result.value` of type <code>[PaymentDecision](src/models/payment-decision.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>searchProducts(request: Agent.SearchProductsRequest, options?: RequestOptions): ApiPromise&lt;ProductSearchResult, Agent.SearchProductsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never pays)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.agent.searchProducts({
    body: { mandateId: "some example string", query: "some example string" },
  });
  // TODO: Handle 'response' of type ProductSearchResult
} catch (err) {
  // TODO: Handle 'err' of type Agent.SearchProductsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.agent
  .searchProducts({ body: { mandateId: "some example string", query: "some example string" } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ProductSearchResult
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1AgentProductsSearchRequest](src/models/v1-agent-products-search-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.agent.searchProducts(request)`

- **OnSuccess**: <code>[ProductSearchResult](src/models/product-search-result.ts)</code>
- **OnError**: throws <code>[Agent.SearchProductsError](src/resources/agent.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.agent.searchProducts(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ProductSearchResult, Agent.SearchProductsError&gt;</code>, with `result.value` of type <code>[ProductSearchResult](src/models/product-search-result.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Catalog

> Source: [Catalog](src/resources/catalog.ts)

<details>
<summary><code>getProductSearchStatus(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Catalog.GetProductSearchStatusError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Whether Channel3 product search is configured (CHANNEL3_API_KEY)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.catalog.getProductSearchStatus();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Catalog.GetProductSearchStatusError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.catalog.getProductSearchStatus().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.catalog.getProductSearchStatus()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Catalog.GetProductSearchStatusError](src/resources/catalog.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.catalog.getProductSearchStatus().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Catalog.GetProductSearchStatusError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>searchProductsForMandate(request: Catalog.SearchProductsForMandateRequest, options?: RequestOptions): ApiPromise&lt;ProductSearchResult, Catalog.SearchProductsForMandateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Owner view of the same Channel3 search, with an advisory mandate-fit check per product

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.catalog.searchProductsForMandate({
    body: { mandateId: "some example string", query: "some example string" },
  });
  // TODO: Handle 'response' of type ProductSearchResult
} catch (err) {
  // TODO: Handle 'err' of type Catalog.SearchProductsForMandateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.catalog
  .searchProductsForMandate({ body: { mandateId: "some example string", query: "some example string" } })
  .asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type ProductSearchResult
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body</code> | <code>[V1ProductsSearchRequest](src/models/v1-products-search-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.catalog.searchProductsForMandate(request)`

- **OnSuccess**: <code>[ProductSearchResult](src/models/product-search-result.ts)</code>
- **OnError**: throws <code>[Catalog.SearchProductsForMandateError](src/resources/catalog.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.catalog.searchProductsForMandate(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;ProductSearchResult, Catalog.SearchProductsForMandateError&gt;</code>, with `result.value` of type <code>[ProductSearchResult](src/models/product-search-result.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Payments

> Source: [Payments](src/resources/payments.ts)

<details>
<summary><code>listPayments(request?: Payments.ListPaymentsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Payments.ListPaymentsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

List payments

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.payments.listPayments();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Payments.ListPaymentsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.payments.listPayments().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit?</code> | <code>string</code> | Default 200 |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.payments.listPayments(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Payments.ListPaymentsError](src/resources/payments.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.payments.listPayments(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Payments.ListPaymentsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>listStuckPayments(request?: Payments.ListStuckPaymentsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Payments.ListStuckPaymentsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Payments in reserved/authorized older than a threshold

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.payments.listStuckPayments();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Payments.ListStuckPaymentsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.payments.listStuckPayments().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>olderThanMs?</code> | <code>string</code> | Default 60000 |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.payments.listStuckPayments(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Payments.ListStuckPaymentsError](src/resources/payments.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.payments.listStuckPayments(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Payments.ListStuckPaymentsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>recoverPayments(request?: Payments.RecoverPaymentsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Payments.RecoverPaymentsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Converge stuck payments with PayPal now

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.payments.recoverPayments();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Payments.RecoverPaymentsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.payments.recoverPayments().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body?</code> | <code>[V1RecoverRequest](src/models/v1-recover-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.payments.recoverPayments(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Payments.RecoverPaymentsError](src/resources/payments.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.payments.recoverPayments(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Payments.RecoverPaymentsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Control

> Source: [Control](src/resources/control.ts)

<details>
<summary><code>getPauseState(options?: RequestOptions): ApiPromise&lt;PauseState, Control.GetPauseStateError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Kill-switch state

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.control.getPauseState();
  // TODO: Handle 'response' of type PauseState
} catch (err) {
  // TODO: Handle 'err' of type Control.GetPauseStateError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.control.getPauseState().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type PauseState
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.control.getPauseState()`

- **OnSuccess**: <code>[PauseState](src/models/pause-state.ts)</code>
- **OnError**: throws <code>[Control.GetPauseStateError](src/resources/control.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.control.getPauseState().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;PauseState, Control.GetPauseStateError&gt;</code>, with `result.value` of type <code>[PauseState](src/models/pause-state.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>pause(request?: Control.PauseRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Control.PauseError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Block every new proposal and approval (503)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.control.pause();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Control.PauseError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.control.pause().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body?</code> | <code>[V1ControlPauseRequest](src/models/v1-control-pause-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.control.pause(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Control.PauseError](src/resources/control.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.control.pause(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Control.PauseError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>resume(request?: Control.ResumeRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Control.ResumeError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lift the kill-switch

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.control.resume();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Control.ResumeError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.control.resume().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>body?</code> | <code>[V1ControlResumeRequest](src/models/v1-control-resume-request.ts)</code> | - |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.control.resume(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Control.ResumeError](src/resources/control.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.control.resume(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Control.ResumeError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

## Audit

> Source: [Audit](src/resources/audit.ts)

<details>
<summary><code>anchorAuditChain(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Audit.AnchorAuditChainError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.audit.anchorAuditChain();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Audit.AnchorAuditChainError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.audit.anchorAuditChain().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.audit.anchorAuditChain()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Audit.AnchorAuditChainError](src/resources/audit.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.audit.anchorAuditChain().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Audit.AnchorAuditChainError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>getAuditAttestation(options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Audit.GetAuditAttestationError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Chain head signed with the active issuer key

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.audit.getAuditAttestation();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Audit.GetAuditAttestationError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.audit.getAuditAttestation().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.audit.getAuditAttestation()`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Audit.GetAuditAttestationError](src/resources/audit.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.audit.getAuditAttestation().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Audit.GetAuditAttestationError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>listAuditAnchors(request?: Audit.ListAuditAnchorsRequest, options?: RequestOptions): ApiPromise&lt;Record&lt;string, unknown&gt;, Audit.ListAuditAnchorsError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Published anchors; keep copies to detect forks

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.audit.listAuditAnchors();
  // TODO: Handle 'response' of type Record<string, unknown>
} catch (err) {
  // TODO: Handle 'err' of type Audit.ListAuditAnchorsError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.audit.listAuditAnchors().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type Record<string, unknown>
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit?</code> | <code>string</code> | Default 100 |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.audit.listAuditAnchors(request)`

- **OnSuccess**: <code>Record&lt;string, unknown&gt;</code>
- **OnError**: throws <code>[Audit.ListAuditAnchorsError](src/resources/audit.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.audit.listAuditAnchors(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;Record&lt;string, unknown&gt;, Audit.ListAuditAnchorsError&gt;</code>, with `result.value` of type <code>Record&lt;string, unknown&gt;</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>listAuditEntries(request?: Audit.ListAuditEntriesRequest, options?: RequestOptions): ApiPromise&lt;AuditEntry[], Audit.ListAuditEntriesError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Hash-chained audit log

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.audit.listAuditEntries();
  // TODO: Handle 'response' of type AuditEntry[]
} catch (err) {
  // TODO: Handle 'err' of type Audit.ListAuditEntriesError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.audit.listAuditEntries().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type AuditEntry[]
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Parameters

<dl>
<dd>

| Name | Type | Description |
| --- | --- | --- |
| <code>limit?</code> | <code>string</code> | Default 200 |

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.audit.listAuditEntries(request)`

- **OnSuccess**: <code>[AuditEntry](src/models/audit-entry.ts)[]</code>
- **OnError**: throws <code>[Audit.ListAuditEntriesError](src/resources/audit.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.audit.listAuditEntries(request).asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;AuditEntry[], Audit.ListAuditEntriesError&gt;</code>, with `result.value` of type <code>[AuditEntry](src/models/audit-entry.ts)[]</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>verifyAuditChain(options?: RequestOptions): ApiPromise&lt;AuditVerification, Audit.VerifyAuditChainError&gt;</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Recompute and verify the whole chain

</dd>
</dl>

### Direct Usage

<dl>
<dd>

```ts
try {
  const response = await client.audit.verifyAuditChain();
  // TODO: Handle 'response' of type AuditVerification
} catch (err) {
  // TODO: Handle 'err' of type Audit.VerifyAuditChainError, discriminated with 'err.payload.kind'
}
```

</dd>
</dl>

### Usage as ApiResult

<dl>
<dd>

```ts
const result = await client.audit.verifyAuditChain().asApiResult();
// TODO: Use 'result.status' and 'result.headers' to read the raw response status and headers
if (result.ok) {
  // TODO: Use 'result.value' of type AuditVerification
} else {
  // TODO: Handle 'result', discriminated with 'result.payload.kind'
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**Direct**: `await client.audit.verifyAuditChain()`

- **OnSuccess**: <code>[AuditVerification](src/models/audit-verification.ts)</code>
- **OnError**: throws <code>[Audit.VerifyAuditChainError](src/resources/audit.ts)</code>, with `err.payload` discriminated on `kind`

**As ApiResult**: `await client.audit.verifyAuditChain().asApiResult()`

- **OnSuccess**: <code>[ApiResult](src/core/api-promise.ts)&lt;AuditVerification, Audit.VerifyAuditChainError&gt;</code>, with `result.value` of type <code>[AuditVerification](src/models/audit-verification.ts)</code>
- **OnError**: `result.payload` discriminated on `kind`, with `result.message`

**Thrown**: <code>[AgentGuardApiError](src/core/errors.ts)</code> on any operational failure — a caller abort and a programmer error stay outside the family and reach you raw

</dd>
</dl>

</dd>
</dl>

</details>

