# Get agent mandate (/api/openapi/agent/getAgentMandate)

`GET /v1/agent/mandates/{id}`

The agent's own mandate, status and spend

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/agent/mandates/{id}:
    get:
      operationId: getAgentMandate
      description: The agent's own mandate, status and spend
      tags:
        - Agent
      summary: Get agent mandate
      security:
        - agent: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AgentMandate"
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
                  var response = await client.Agent.GetAgentMandate(
                      new GetAgentMandateRequest
                      {
                          Id = "some example string",
                      });
                  // TODO: Handle 'response' of type AgentMandate
              }
              catch (ApiException<GetAgentMandateError> ex)
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
                  response = client.agent.get_agent_mandate(
                      "some example string"
                  )
                  # TODO: Handle 'response' of type AgentMandate
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # GetAgentMandateErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.agent.getAgentMandate({
                  id: "some example string",
                });
                // TODO: Handle 'response' of type AgentMandate
              } catch (err) {
                // TODO: Handle 'err' of type Agent.GetAgentMandateError, discriminated with 'err.payload.kind'
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
    AgentMandate:
      type: object
      properties:
        mandate:
          $ref: "#/components/schemas/Mandate"
        status:
          type: string
          enum:
            - draft
            - unsigned
            - active
            - frozen
            - revoked
            - exhausted
            - expired
        spend:
          $ref: "#/components/schemas/Spend"
      required:
        - mandate
        - status
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
    Mandate:
      type: object
      properties:
        mandate_id:
          type: string
        user_id:
          type: string
        agent_id:
          type: string
        purpose:
          type: string
        constraints:
          $ref: "#/components/schemas/MandateConstraints"
        created_at:
          type: string
        expires_at:
          type: string
        version:
          type: integer
      required:
        - mandate_id
        - user_id
        - agent_id
        - purpose
        - constraints
        - created_at
        - expires_at
    Spend:
      type: object
      properties:
        spent_minor:
          type: integer
        reserved_minor:
          type: integer
        tx_count:
          type: integer
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
info:
  title: AgentGuard API
  version: 0.1.0
```