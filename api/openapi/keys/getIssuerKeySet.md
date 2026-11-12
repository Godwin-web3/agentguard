# Get issuer key set (/api/openapi/keys/getIssuerKeySet)

`GET /.well-known/agentguard-keys`

Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /.well-known/agentguard-keys:
    get:
      operationId: getIssuerKeySet
      description: "Issuer key set: every key with kid, status, created_at,
        retired_at, compromised_at. Pin this."
      tags:
        - Keys
      summary: Get issuer key set
      security: []
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/IssuerKeySet"
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
                  var response = await client.Keys.GetIssuerKeySet();
                  // TODO: Handle 'response' of type IssuerKeySet
              }
              catch (ApiException<GetIssuerKeySetError> ex)
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
                  response = client.keys.get_issuer_key_set()
                  # TODO: Handle 'response' of type IssuerKeySet
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # GetIssuerKeySetErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.keys.getIssuerKeySet();
                // TODO: Handle 'response' of type IssuerKeySet
              } catch (err) {
                // TODO: Handle 'err' of type Keys.GetIssuerKeySetError, discriminated with 'err.payload.kind'
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
    IssuerKeySet:
      type: object
      properties:
        issuer:
          type: string
        keys:
          type: array
          items:
            $ref: "#/components/schemas/IssuerKey"
      required:
        - keys
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
    IssuerKey:
      type: object
      properties:
        kid:
          type: string
        kty:
          type: string
          example: OKP
        crv:
          type: string
          example: Ed25519
        x:
          type: string
        public_key_pem:
          type: string
        status:
          type: string
        created:
          type: string
        retired:
          type:
            - string
            - "null"
        compromised_at:
          type:
            - string
            - "null"
      required:
        - kid
info:
  title: AgentGuard API
  version: 0.1.0
```