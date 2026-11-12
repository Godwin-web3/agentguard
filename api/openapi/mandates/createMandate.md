# Create mandate (/api/openapi/mandates/createMandate)

`POST /v1/mandates`

Create a draft mandate from structured constraints

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/mandates:
    post:
      operationId: createMandate
      description: Create a draft mandate from structured constraints
      tags:
        - Mandates
      summary: Create mandate
      security:
        - admin: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                user_id:
                  type: string
                agent_id:
                  type: string
                purpose:
                  type: string
                ttl_minutes:
                  type: integer
                constraints:
                  $ref: "#/components/schemas/MandateConstraints"
              required:
                - user_id
                - agent_id
                - purpose
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties: true
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
            Example: |-
              try
              {
                  var response = await client.Mandates.CreateMandate(
                      new CreateMandateRequest
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
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  response = client.mandates.create_mandate(
                      V1MandatesRequest(
                          user_id="some example string",
                          agent_id="some example string",
                          purpose="some example string",
                      ),
                  )
                  # TODO: Handle 'response' of type Any
              except ApiError as e:
                  # TODO: Handle 'e.error' of type CreateMandateErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.mandates.createMandate({
                  body: {
                    userId: "some example string",
                    agentId: "some example string",
                    purpose: "some example string",
                  },
                });
                // TODO: Handle 'response' of type Record<string, unknown>
              } catch (err) {
                // TODO: Handle 'err' of type Mandates.CreateMandateError, discriminated with 'err.payload.kind'
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
    MandateConstraints:
      type: object
      properties:
        currency:
          type: string
          description: ISO 4217
          example: USD
        max_total:
          type: string
          example: "25.00"
        max_per_transaction:
          type: string
        max_transactions:
          type: integer
        allowed_categories:
          type: array
          items:
            enum:
              - PHYSICAL_GOODS
              - DIGITAL_GOODS
              - DONATION
              - UNSPECIFIED
        payee_allowlist:
          type: array
          items:
            type: string
        payee_blocklist:
          type: array
          items:
            type: string
        max_quantity_per_item:
          type: integer
        require_human_approval_over:
          type: string
        require_merchant_order:
          type: boolean
        sku_allowlist:
          type: array
          items:
            type: string
      required:
        - currency
        - max_total
        - max_transactions
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