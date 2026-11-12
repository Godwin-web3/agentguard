# Verify audit chain (/api/openapi/audit/verifyAuditChain)

`GET /v1/audit/verify`

Recompute and verify the whole chain

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/audit/verify:
    get:
      operationId: verifyAuditChain
      description: Recompute and verify the whole chain
      tags:
        - Audit
      summary: Verify audit chain
      security:
        - admin: []
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuditVerification"
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
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  response = client.audit.verify_audit_chain()
                  # TODO: Handle 'response' of type AuditVerification
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # VerifyAuditChainErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.audit.verifyAuditChain();
                // TODO: Handle 'response' of type AuditVerification
              } catch (err) {
                // TODO: Handle 'err' of type Audit.VerifyAuditChainError, discriminated with 'err.payload.kind'
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
    AuditVerification:
      type: object
      properties:
        ok:
          type: boolean
        length:
          type: integer
        brokenAt:
          type: integer
          description: First entry whose hash or link does not verify
      required:
        - ok
        - length
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