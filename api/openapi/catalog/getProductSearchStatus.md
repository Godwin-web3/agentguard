# Get product search status (/api/openapi/catalog/getProductSearchStatus)

`GET /v1/products/status`

Whether Channel3 product search is configured (CHANNEL3_API_KEY)

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/products/status:
    get:
      operationId: getProductSearchStatus
      description: Whether Channel3 product search is configured (CHANNEL3_API_KEY)
      tags:
        - Catalog
      summary: Get product search status
      security:
        - admin: []
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
                  var response = await client.Catalog.GetProductSearchStatus();
                  // TODO: Handle 'response' of type object
              }
              catch (ApiException<GetProductSearchStatusError> ex)
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
                  response = client.catalog.get_product_search_status()
                  # TODO: Handle 'response' of type Any
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # GetProductSearchStatusErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response =
                  await client.catalog.getProductSearchStatus();
                // TODO: Handle 'response' of type Record<string, unknown>
              } catch (err) {
                // TODO: Handle 'err' of type Catalog.GetProductSearchStatusError, discriminated with 'err.payload.kind'
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