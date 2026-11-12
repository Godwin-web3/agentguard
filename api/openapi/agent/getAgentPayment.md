# Get agent payment (/api/openapi/agent/getAgentPayment)

`GET /v1/agent/payments/{id}`

Payment status (the calling agent's own only)

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/agent/payments/{id}:
    get:
      operationId: getAgentPayment
      description: Payment status (the calling agent's own only)
      tags:
        - Agent
      summary: Get agent payment
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
                $ref: "#/components/schemas/PaymentDecision"
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
                  var response = await client.Agent.GetAgentPayment(
                      new GetAgentPaymentRequest
                      {
                          Id = "some example string",
                      });
                  // TODO: Handle 'response' of type PaymentDecision
              }
              catch (ApiException<GetAgentPaymentError> ex)
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
                  response = client.agent.get_agent_payment(
                      "some example string"
                  )
                  # TODO: Handle 'response' of type PaymentDecision
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # GetAgentPaymentErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.agent.getAgentPayment({
                  id: "some example string",
                });
                // TODO: Handle 'response' of type PaymentDecision
              } catch (err) {
                // TODO: Handle 'err' of type Agent.GetAgentPaymentError, discriminated with 'err.payload.kind'
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
    PaymentDecision:
      type: object
      properties:
        payment_id:
          type: string
          example: pay_…
        decision:
          type: string
          enum:
            - approve
            - reject
            - needs_human
        status:
          type: string
          enum:
            - rejected
            - needs_human
            - reserved
            - authorized
            - captured
            - voided
            - failed
        evaluation:
          $ref: "#/components/schemas/Evaluation"
        approval_id:
          type:
            - string
            - "null"
          description: Set when the payment waits for the user's passkey approval
        paypal:
          type: object
          properties:
            order_id:
              type:
                - string
                - "null"
            authorization_id:
              type:
                - string
                - "null"
            capture_id:
              type:
                - string
                - "null"
        error:
          type:
            - string
            - "null"
      required:
        - payment_id
        - decision
        - status
        - evaluation
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
    Evaluation:
      type: object
      properties:
        decision:
          type: string
          enum:
            - approve
            - reject
            - needs_human
        proposal_hash:
          type: string
          description: sha256 of the canonical proposal
        amount_minor:
          type: integer
          description: Amount in minor units, from the PayPal order
        checks:
          type: array
          items:
            $ref: "#/components/schemas/Check"
        risk:
          type: array
          items:
            $ref: "#/components/schemas/RiskSignal"
        reasons:
          type: array
          items:
            type: string
      required:
        - decision
        - proposal_hash
        - amount_minor
        - checks
        - risk
        - reasons
    Check:
      type: object
      properties:
        check:
          type: string
          example: per_transaction_limit
        pass:
          type: boolean
        detail:
          type: string
      required:
        - check
        - pass
        - detail
    RiskSignal:
      type: object
      properties:
        signal:
          type: string
          example: catalog_price_above_market
        severity:
          type: string
          enum:
            - low
            - medium
            - high
        detail:
          type: string
      required:
        - signal
        - severity
        - detail
info:
  title: AgentGuard API
  version: 0.1.0
```