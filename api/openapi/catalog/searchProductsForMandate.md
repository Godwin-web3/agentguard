# Search products for mandate (/api/openapi/catalog/searchProductsForMandate)

`POST /v1/products/search`

Owner view of the same Channel3 search, with an advisory mandate-fit check per product

```yaml
openapi: 3.2.0
servers:
  - url: https://agentguard-orcin.vercel.app
    description: Hosted demo (PayPal sandbox)
  - url: http://localhost:8787
    description: Local
paths:
  /v1/products/search:
    post:
      operationId: searchProductsForMandate
      description: Owner view of the same Channel3 search, with an advisory
        mandate-fit check per product
      tags:
        - Catalog
      summary: Search products for mandate
      security:
        - admin: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                mandate_id:
                  type: string
                query:
                  type: string
                  example: laptop stand
                limit:
                  type: integer
                page_token:
                  type: string
              required:
                - mandate_id
                - query
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProductSearchResult"
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
                  var response = await client.Catalog.SearchProductsForMandate(
                      new SearchProductsForMandateRequest
                      {
                          Body = new V1ProductsSearchRequest
                          {
                              MandateId = "some example string",
                              Query = "some example string",
                          },
                      });
                  // TODO: Handle 'response' of type ProductSearchResult
              }
              catch (ApiException<SearchProductsForMandateError> ex)
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
                  response = client.catalog.search_products_for_mandate(
                      V1ProductsSearchRequest(
                          mandate_id="some example string",
                          query="some example string",
                      ),
                  )
                  # TODO: Handle 'response' of type ProductSearchResult
              except ApiError as e:
                  # TODO: Handle 'e.error' of type
                  # SearchProductsForMandateErrorBody
                  ...
        - lang: typescript
          label: TypeScript
          sources:
            Example: >-
              try {
                const response =
                  await client.catalog.searchProductsForMandate({
                    body: {
                      mandateId: "some example string",
                      query: "some example string",
                    },
                  });
                // TODO: Handle 'response' of type ProductSearchResult
              } catch (err) {
                // TODO: Handle 'err' of type Catalog.SearchProductsForMandateError, discriminated with 'err.payload.kind'
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
    ProductSearchResult:
      type: object
      properties:
        provider:
          type: string
          example: channel3
        mandate_id:
          type: string
        query:
          type: string
        max_price:
          type: string
          description: "Price ceiling applied: min(per-payment cap, remaining budget)"
        currency:
          type: string
        products:
          type: array
          items:
            $ref: "#/components/schemas/CatalogProduct"
        next_page_token:
          type:
            - string
            - "null"
        how_to_pay:
          type: string
      required:
        - provider
        - products
        - max_price
        - currency
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
    CatalogProduct:
      type: object
      properties:
        product_id:
          type: string
          description: Use as the PayPal order item sku
          example: channel3:2yh8WH5
        channel3_id:
          type: string
        title:
          type: string
        brand:
          type:
            - string
            - "null"
        image:
          type:
            - string
            - "null"
        category:
          type:
            - string
            - "null"
        offers:
          type: array
          items:
            $ref: "#/components/schemas/CatalogOffer"
        best_offer:
          oneOf:
            - $ref: "#/components/schemas/CatalogOffer"
            - type: "null"
          description: Cheapest in-stock offer within the mandate's currency and ceiling
        mandate_fit:
          type: object
          properties:
            fits:
              type: boolean
            needs_approval:
              type: boolean
            checks:
              type: array
              items:
                $ref: "#/components/schemas/Check"
      required:
        - product_id
        - title
        - offers
    CatalogOffer:
      type: object
      properties:
        domain:
          type: string
          example: bestbuy.com
        url:
          type: string
          description: Retailer buy link
        price:
          type: string
          example: "39.00"
        price_minor:
          type: integer
        currency:
          type: string
          example: USD
        availability:
          type: string
          example: InStock
        condition:
          type:
            - string
            - "null"
          description: new, used, refurbished; null when unknown
      required:
        - domain
        - price
        - currency
    Check:
      type: object
      properties:
        check:
          type: string
          example: per_transaction_limit
        pass:
          type: boolean
        detail:
          type: string
      required:
        - check
        - pass
        - detail
info:
  title: AgentGuard API
  version: 0.1.0
```