# Cancel recovery (/api/openapi/passkeys/cancelRecovery)

`POST /v1/users/{id}/recovery/cancel`

Cancel a pending recovery

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/users/{id}/recovery/cancel:
    post:
      operationId: cancelRecovery
      description: Cancel a pending recovery
      tags:
        - Passkeys
      summary: Cancel recovery
      security: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                assertion:
                  type: object
                  additionalProperties: true
                  description: WebAuthn assertion (navigator.credentials.get response,
                    JSON-encoded) over the challenge returned by the matching
                    *-request call
              required:
                - assertion
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
                  var response = await client.Passkeys.CancelRecovery(
                      new CancelRecoveryRequest
                      {
                          Id = "some example string",
                          Body = new V1UsersRecoveryCancelRequest
                          {
                              Assertion = assertion,
                          },
                      });
                  // TODO: Handle 'response' of type object
              }
              catch (ApiException<CancelRecoveryError> ex)
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
                  response = client.passkeys.cancel_recovery(
                      "some example string",
                      V1UsersRecoveryCancelRequest(assertion={}),
                  )
                  # TODO: Handle 'response' of type Any
              except ApiError as e:
                  # TODO: Handle 'e.error' of type CancelRecoveryErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.passkeys.cancelRecovery({
                  id: "some example string",
                  body: { assertion: {} },
                });
                // TODO: Handle 'response' of type Record<string, unknown>
              } catch (err) {
                // TODO: Handle 'err' of type Passkeys.CancelRecoveryError, discriminated with 'err.payload.kind'
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