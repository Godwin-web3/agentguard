# Draft mandate from text (/api/openapi/mandates/draftMandateFromText)

`POST /v1/mandates/draft-from-text`

Draft a mandate from plain English (model proposes, deterministic parser bounds it)

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/mandates/draft-from-text:
    post:
      operationId: draftMandateFromText
      description: Draft a mandate from plain English (model proposes, deterministic
        parser bounds it)
      tags:
        - Mandates
      summary: Draft mandate from text
      security:
        - admin: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                user_id:
                  type: string
                agent_id:
                  type: string
                text:
                  type: string
                  example: Buy API credits from shop@example.com, at most $25 total, ask me above
                    $5
              required:
                - user_id
                - agent_id
                - text
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
                  var response = await client.Mandates.DraftMandateFromText(
                      new DraftMandateFromTextRequest
                      {
                          Body = new V1MandatesDraftFromTextRequest
                          {
                              UserId = "some example string",
                              AgentId = "some example string",
                              Text = "some example string",
                          },
                      });
                  // TODO: Handle 'response' of type object
              }
              catch (ApiException<DraftMandateFromTextError> ex)
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
                  response = client.mandates.draft_mandate_from_text(
                      V1MandatesDraftFromTextRequest(
                          user_id="some example string",
                          agent_id="some example string",
                          text="some example string",
                      ),
                  )
                  # TODO: Handle 'response' of type Any
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # DraftMandateFromTextErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response =
                  await client.mandates.draftMandateFromText({
                    body: {
                      userId: "some example string",
                      agentId: "some example string",
                      text: "some example string",
                    },
                  });
                // TODO: Handle 'response' of type Record<string, unknown>
              } catch (err) {
                // TODO: Handle 'err' of type Mandates.DraftMandateFromTextError, discriminated with 'err.payload.kind'
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