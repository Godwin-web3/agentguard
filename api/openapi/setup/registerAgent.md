# Register agent (/api/openapi/setup/registerAgent)

`POST /v1/agents`

Register an agent and return its API key (shown once)

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/agents:
    post:
      operationId: registerAgent
      description: Register an agent and return its API key (shown once)
      tags:
        - Setup
      summary: Register agent
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
                  description: Owner user id
                  example: demo-user
                agent_id:
                  type: string
                  description: Agent id
                  example: shopper
              required:
                - user_id
                - agent_id
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AgentCredentials"
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
                  var response = await client.Setup.RegisterAgent(
                      new RegisterAgentRequest
                      {
                          Body = new V1AgentsRequest
                          {
                              UserId = "some example string",
                              AgentId = "some example string",
                          },
                      });
                  // TODO: Handle 'response' of type AgentCredentials
              }
              catch (ApiException<RegisterAgentError> ex)
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
                  response = client.setup.register_agent(
                      V1AgentsRequest(
                          user_id="some example string",
                          agent_id="some example string",
                      ),
                  )
                  # TODO: Handle 'response' of type AgentCredentials
              except ApiError as e:
                  # TODO: Handle 'e.error' of type RegisterAgentErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.setup.registerAgent({
                  body: {
                    userId: "some example string",
                    agentId: "some example string",
                  },
                });
                // TODO: Handle 'response' of type AgentCredentials
              } catch (err) {
                // TODO: Handle 'err' of type Setup.RegisterAgentError, discriminated with 'err.payload.kind'
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
    AgentCredentials:
      type: object
      properties:
        agent_id:
          type: string
        api_key:
          type: string
          description: Shown once; store it as the agent's secret
      required:
        - agent_id
        - api_key
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