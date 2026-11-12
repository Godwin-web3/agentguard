# Health check (/api/openapi/meta/getHealth)

`GET /health`

Health: ok, stuck payment count, last recovery run

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /health:
    get:
      operationId: getHealth
      description: "Health: ok, stuck payment count, last recovery run"
      tags:
        - Meta
      summary: Health check
      security: []
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Health"
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
        - lang: python
          label: Python
          sources:
            Example: |-
              try:
                  response = client.meta.get_health()
                  # TODO: Handle 'response' of type Health
              except ApiError as e:
                  ...  # TODO: Handle 'e.error' of type GetHealthErrorBody
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.meta.getHealth();
                // TODO: Handle 'response' of type Health
              } catch (err) {
                // TODO: Handle 'err' of type Meta.GetHealthError, discriminated with 'err.payload.kind'
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
    Health:
      type: object
      properties:
        ok:
          type: boolean
        stuck:
          type: integer
          description: Payments stuck in reserved/authorized for over a minute
        last_recovery:
          type:
            - object
            - "null"
          additionalProperties: true
          description: Last reconciliation run
      required:
        - ok
        - stuck
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