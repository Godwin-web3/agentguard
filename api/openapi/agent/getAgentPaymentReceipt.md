# Get agent payment receipt (/api/openapi/agent/getAgentPaymentReceipt)

`GET /v1/agent/payments/{id}/receipt`

Proof-of-Intent receipt for a captured payment

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/agent/payments/{id}/receipt:
    get:
      operationId: getAgentPaymentReceipt
      description: Proof-of-Intent receipt for a captured payment
      tags:
        - Agent
      summary: Get agent payment receipt
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
                $ref: "#/components/schemas/ReceiptEnvelope"
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
                  var response = await client.Agent.GetAgentPaymentReceipt(
                      new GetAgentPaymentReceiptRequest
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
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  response = client.agent.get_agent_payment_receipt(
                      "some example string"
                  )
                  # TODO: Handle 'response' of type ReceiptEnvelope
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # GetAgentPaymentReceiptErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response =
                  await client.agent.getAgentPaymentReceipt({
                    id: "some example string",
                  });
                // TODO: Handle 'response' of type ReceiptEnvelope
              } catch (err) {
                // TODO: Handle 'err' of type Agent.GetAgentPaymentReceiptError, discriminated with 'err.payload.kind'
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
    ReceiptEnvelope:
      type: object
      properties:
        receipt:
          type: object
          additionalProperties: true
          description: "agentguard.proof-of-intent/v1 receipt: mandate + passkey
            signature, PayPal order snapshot, decision, capture"
        signature:
          type: object
          properties:
            alg:
              type: string
              example: Ed25519
            kid:
              type: string
            key_id:
              type: string
            public_key_pem:
              type: string
            value:
              type: string
          required:
            - alg
            - value
        timestamps:
          type: array
          items:
            type: object
            additionalProperties: true
            description: RFC 3161 timestamp token
        anchor:
          type: object
          additionalProperties: true
          description: Merkle inclusion proof for the audit-chain anchor
      required:
        - receipt
        - signature
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