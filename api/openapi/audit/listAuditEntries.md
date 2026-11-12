# List audit entries (/api/openapi/audit/listAuditEntries)

`GET /v1/audit`

Hash-chained audit log

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/audit:
    get:
      operationId: listAuditEntries
      description: Hash-chained audit log
      tags:
        - Audit
      summary: List audit entries
      security:
        - admin: []
      parameters:
        - name: limit
          in: query
          description: Default 200
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/AuditEntry"
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
                  var response = await client.Audit.ListAuditEntries(
                      new ListAuditEntriesRequest());
                  // TODO: Handle 'response' of type IReadOnlyList<AuditEntry>
              }
              catch (ApiException<ListAuditEntriesError> ex)
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
                  response = client.audit.list_audit_entries()
                  # TODO: Handle 'response' of type list[AuditEntry]
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # ListAuditEntriesErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response = await client.audit.listAuditEntries();
                // TODO: Handle 'response' of type AuditEntry[]
              } catch (err) {
                // TODO: Handle 'err' of type Audit.ListAuditEntriesError, discriminated with 'err.payload.kind'
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
    AuditEntry:
      type: object
      properties:
        seq:
          type: integer
        ts:
          type: string
        event:
          type: string
          example: payment.captured
        ref:
          type:
            - string
            - "null"
        payload:
          type: object
          additionalProperties: true
        prev_hash:
          type: string
        hash:
          type: string
          description: sha256(prev_hash|ts|event|ref|canonical(payload))
      required:
        - seq
        - ts
        - event
        - prev_hash
        - hash
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