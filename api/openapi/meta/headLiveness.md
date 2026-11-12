# Head liveness (/api/openapi/meta/headLiveness)

`HEAD /healthz`

Liveness probe, no body

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /healthz:
    head:
      operationId: headLiveness
      description: Liveness probe, no body
      tags:
        - Meta
      summary: Head liveness
      security: []
      responses:
        "200":
          description: OK
        "400":
          description: Bad request
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
                  await client.Meta.HeadLiveness();
              }
              catch (ApiException<HeadLivenessError> ex)
              {
                  if (ex.Error.TryGetNoContent(out var error))
                  {
                      // TODO: Handle 'error' of type RawError
                  }
              }
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  client.meta.head_liveness()
              except ApiError as e:
                  # TODO: Handle 'e.error' of type HeadLivenessErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                await client.meta.headLiveness();
              } catch (err) {
                // TODO: Handle 'err' of type Meta.HeadLivenessError, discriminated with 'err.payload.kind'
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