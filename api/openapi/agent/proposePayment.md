# Propose a payment (/api/openapi/agent/proposePayment)

`POST /v1/agent/payments`

Propose a payment (30/min per agent; 429 above)

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/agent/payments:
    post:
      operationId: proposePayment
      description: Propose a payment (30/min per agent; 429 above)
      tags:
        - Agent
      summary: Propose a payment
      security:
        - agent: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                mandate_id:
                  type: string
                agent_id:
                  type: string
                idempotency_key:
                  type: string
                paypal_order_id:
                  type: string
                  description: Merchant-created AUTHORIZE order (preferred). Do not combine with
                    payee/currency/items.
                payee:
                  type: object
                  properties:
                    merchant_id:
                      type: string
                    email_address:
                      type: string
                    display_name:
                      type: string
                  description: Vaulted path only (untrusted)
                currency:
                  type: string
                  description: Vaulted path only
                items:
                  type: array
                  items:
                    type: object
                    additionalProperties: true
                    description: "LineItem: name, sku, category, quantity, unit_amount"
                  description: Vaulted path only (untrusted)
                context:
                  type: array
                  items:
                    type: object
                    properties:
                      source_url:
                        type: string
                      excerpt:
                        type: string
                  description: Untrusted context the agent saw; scored for injection, advisory
                    only
                agent_rationale:
                  type: string
              required:
                - mandate_id
                - agent_id
                - idempotency_key
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
        "429":
          description: Rate limited
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
        "503":
          description: Paused by operator kill-switch
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
                  var response = await client.Agent.ProposePayment(
                      new ProposePaymentRequest
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
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  response = client.agent.propose_payment(
                      V1AgentPaymentsRequest(
                          mandate_id="some example string",
                          agent_id="some example string",
                          idempotency_key="some example string",
                      ),
                  )
                  # TODO: Handle 'response' of type PaymentDecision
              except ApiError as e:
                  # TODO: Handle 'e.error' of type ProposePaymentErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
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