# List receipts (/api/openapi/receipts/listReceipts)

`GET /v1/receipts`

List receipts

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/receipts:
    get:
      operationId: listReceipts
      description: List receipts
      tags:
        - Receipts
      summary: List receipts
      security:
        - admin: []
      parameters:
        - name: limit
          in: query
          description: Default 100
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/ReceiptSummary"
        "400":
          description: Bad request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "401":
          description: Missing or wrong bearer token
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "404":
          description: Not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "413":
          description: Body over 256 KB
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
      x-apimatic-codeSamples:
        - lang: csharp
          label: C#
          sources:
            Example: >-
              try

              {
                  var response = await client.Receipts.ListReceipts(
                      new ListReceiptsRequest());
                  // TODO: Handle 'response' of type IReadOnlyList<ReceiptSummary>
              }

              catch (ApiException<ListReceiptsError> ex)

              {
                  if (ex.Error.TryGetErrorResponseModel(out var error))
                  {
                      // TODO: Handle 'error' of type ErrorResponseModel
                  }
              }
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  response = client.receipts.list_receipts()
                  # TODO: Handle 'response' of type list[ReceiptSummary]
              except ApiError as e:
                  # TODO: Handle 'e.error' of type ListReceiptsErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.receipts.listReceipts();
                // TODO: Handle 'response' of type ReceiptSummary[]
              } catch (err) {
                // TODO: Handle 'err' of type Receipts.ListReceiptsError, discriminated with 'err.payload.kind'
              }
components:
  securitySchemes:
    admin:
      type: http
      scheme: bearer
      description: AGENTGUARD_ADMIN_TOKEN (owner/operator)
    agent:
      type: http
      scheme: bearer
      description: Per-agent API key from POST /v1/agents
    cron:
      type: http
      scheme: bearer
      description: CRON_SECRET
  schemas:
    ReceiptSummary:
      type: object
      properties:
        receipt_id:
          type: string
        payment_id:
          type: string
        capture_id:
          type: string
        receipt_hash:
          type: string
        issued_at:
          type: string
      required:
        - receipt_id
        - payment_id
    ErrorResponse:
      type: object
      description: Every non-2xx response
      properties:
        error:
          type: string
          description: What went wrong
          example: unauthorized
      required:
        - error
info:
  title: AgentGuard API
  version: 0.1.0
```