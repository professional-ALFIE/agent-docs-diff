> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Organization Usage

> Retrieve usage (credits), pay-as-you-go USD cost, and request counts for **every API key under an organization you own**, mirroring the platform's Usage analytics page.

Identify the organization by **name** in the request body. Authenticate with the organization owner's **personal API key** — the key from the owner's own personal account, **not** an organization or enterprise API key. Supports date-range, project, and depth filtering.

<Note>
  **Access to this API is an enterprise feature only.** [Talk to an expert](https://tavily.com/enterprise) to learn more.

  Authenticate with the organization **owner's personal API key** — the key from the owner's own **personal account**, *not* an organization or enterprise API key. Identify the organization by **name** in the request body.
</Note>


## OpenAPI

````yaml POST /org-usage
openapi: 3.0.3
info:
  title: Tavily Search and Extract API
  description: >-
    Our REST API provides seamless access to Tavily Search, a powerful search
    engine for LLM agents, and Tavily Extract, an advanced web scraping solution
    optimized for LLMs.
  version: 1.0.0
servers:
  - url: https://api.tavily.com/
security: []
tags:
  - name: Search
  - name: Extract
  - name: Crawl
  - name: Map
  - name: Research
  - name: Usage
  - name: Logs
paths:
  /org-usage:
    post:
      summary: Get organization usage across all API keys
      description: >-
        Retrieve usage (credits), pay-as-you-go USD cost, and request counts for
        **every API key under an organization you own**, mirroring the
        platform's Usage analytics page.


        Identify the organization by **name** in the request body. Authenticate
        with the organization owner's **personal API key** — the key from the
        owner's own personal account, **not** an organization or enterprise API
        key. Supports date-range, project, and depth filtering.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - organization_name
              properties:
                organization_name:
                  type: string
                  description: >-
                    Exact organization name (case-sensitive). You must be the
                    owner of this organization.
                  example: Acme Inc
                start_date:
                  type: string
                  format: date
                  description: >-
                    Inclusive start of the usage window (YYYY-MM-DD). Defaults
                    to the start of the current billing cycle.
                  example: '2026-05-01'
                end_date:
                  type: string
                  format: date
                  description: >-
                    Inclusive end of the usage window (YYYY-MM-DD). Defaults to
                    today.
                  example: '2026-05-27'
                project_id:
                  type: string
                  description: Scope usage to a single project.
                depth:
                  type: string
                  enum:
                    - basic
                    - advanced
                    - fast
                    - pro
                    - mini
                    - auto
                    - ultra-fast
                  description: Scope usage to a single request depth.
                  example: advanced
      responses:
        '200':
          description: Organization usage returned successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  organization:
                    type: object
                    properties:
                      name:
                        type: string
                        example: Acme Inc
                      filters:
                        type: object
                        description: Echo of the filters applied to this response
                        properties:
                          start_date:
                            type: string
                            example: '2026-05-01'
                          end_date:
                            type: string
                            example: '2026-05-27'
                          project_id:
                            type: string
                            example: null
                          depth:
                            type: string
                            example: null
                  totals:
                    type: object
                    description: >-
                      Aggregated usage across all keys in the organization for
                      the selected window/filters
                    properties:
                      usage:
                        type: integer
                        example: 1820
                      paygo_cost_usd:
                        type: number
                        example: 12.71
                      request_count:
                        type: integer
                        example: 1760
                      by_type:
                        $ref: '#/components/schemas/UsageByType'
                  keys:
                    type: array
                    items:
                      type: object
                      properties:
                        key:
                          type: string
                          description: API key, masked to the last 5 characters
                          example: ...AB3xQ
                        name:
                          type: string
                          description: Key name
                          example: production-key
                        usage:
                          type: integer
                          example: 543
                        paygo_cost_usd:
                          type: number
                          example: 4.34
                        request_count:
                          type: integer
                          example: 528
                        by_type:
                          $ref: '#/components/schemas/UsageByType'
        '400':
          description: Invalid start_date; expected format YYYY-MM-DD.
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: Invalid start_date; expected format YYYY-MM-DD.
        '401':
          description: 'Unauthorized: missing or invalid API key.'
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: 'Unauthorized: missing or invalid API key.'
        '403':
          description: >-
            Please authenticate with the organization owner's personal API key,
            not an organization API key.
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: >-
                    Please authenticate with the organization owner's personal
                    API key, not an organization API key.
        '404':
          description: Organization not found or access denied.
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: Organization not found or access denied.
        '422':
          description: organization_name is required.
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: organization_name is required.
        '429':
          description: Too many requests - Rate limit exceeded
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: >-
                    Your request has been blocked due to excessive requests.
                    Please reduce the rate of requests.
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: Internal server error
        '504':
          description: Gateway timeout - the usage lookup took too long
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: object
                    properties:
                      error:
                        type: string
              example:
                detail:
                  error: >-
                    Request timed out while fetching usage. Please try again or
                    contact our team at support@tavily.com.
      security:
        - ownerBearerAuth: []
      x-codeSamples: []
components:
  schemas:
    UsageByType:
      type: object
      description: Breakdown per request type
      properties:
        search:
          $ref: '#/components/schemas/UsageMetrics'
        crawl:
          $ref: '#/components/schemas/UsageMetrics'
        extract:
          $ref: '#/components/schemas/UsageMetrics'
        map:
          $ref: '#/components/schemas/UsageMetrics'
        research:
          $ref: '#/components/schemas/UsageMetrics'
    UsageMetrics:
      type: object
      properties:
        usage:
          type: integer
          description: Credits consumed
          example: 543
        paygo_cost_usd:
          type: number
          description: >-
            Pay-as-you-go cost in USD (overage credits billed at the account's
            per-credit rate)
          example: 4.34
        request_count:
          type: integer
          description: Number of requests
          example: 528
  securitySchemes:
    ownerBearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: >-
        Bearer authentication header in the form Bearer <token>. The token must
        be the **organization owner's personal API key** (from the owner's own
        personal account, not an organization key).

````