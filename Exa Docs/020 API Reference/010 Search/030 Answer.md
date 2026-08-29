> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Answer

> Get an LLM answer to a question informed by Exa search results. `/answer` performs an Exa search and uses an LLM to generate either:
1. A direct answer for specific queries. (i.e. "What is the capital of France?" would return "Paris")
2. A detailed summary with citations for open-ended queries (i.e. "What is the state of ai in healthcare?" would return a summary with citations to relevant sources)

The response includes both the generated answer and the sources used to create it. The endpoint also supports streaming (as `stream=True`), which will return tokens as they are generated.

Alternatively, you can use the OpenAI compatible [chat completions interface](/docs/reference/openai-sdk#answer).


<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

<Info>
  `/answer` supports structured output via the `outputSchema` parameter. Pass a [JSON Schema](https://json-schema.org/draft-07) object and the answer will be returned as structured JSON matching your schema instead of a plain string.
</Info>


## OpenAPI

````yaml post /answer
openapi: 3.1.0
info:
  title: Exa Public API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /answer:
    post:
      summary: Answer
      description: >-
        Performs a search based on the query and generates either a direct
        answer or a detailed summary with citations, depending on the query
        type.
      operationId: answer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnswerRequest'
      responses:
        '200':
          description: OK
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
            x-exa-queued:
              $ref: '#/components/headers/XExaQueued'
            x-exa-queue-ms:
              $ref: '#/components/headers/XExaQueueMs'
          content:
            application/json:
              example:
                requestId: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
                answer: $350 billion.
                citations:
                  - id: >-
                      https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                    url: >-
                      https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                    title: >-
                      SpaceX valued at $350bn as company agrees to buy shares
                      from ...
                    author: Dan Milmo
                    publishedDate: '2024-12-11T00:00:00.000Z'
                    text: >-
                      SpaceX valued at $350bn as company agrees to buy shares
                      from ...
                costDollars:
                  total: 0.005
              schema:
                $ref: '#/components/schemas/AnswerResponse'
            text/event-stream:
              schema:
                $ref: '#/components/schemas/AnswerStreamChunk'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '402':
          $ref: '#/components/responses/PaymentRequiredResponse'
        '429':
          $ref: '#/components/responses/TooManyRequestsResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  schemas:
    AnswerRequest:
      type: object
      properties:
        query:
          type: string
          minLength: 1
          description: Natural-language question or instructions for the request.
          example: What is the latest valuation of SpaceX?
        stream:
          type: boolean
          description: >-
            If true, the response is returned as a server-sent events (SSE)
            stream.
          default: false
        text:
          type: boolean
          title: Simple text retrieval
          description: >-
            If true, returns full page text with default settings. If false,
            disables text return.
          default: false
        model:
          description: The model used to generate the answer.
          default: exa
          type: string
          enum:
            - exa
            - exa-pro
            - exa-research
            - exa-fast
        systemPrompt:
          type: string
          description: >-
            Additional instructions that guide generated output or agent
            behavior. Use this for source preferences, novelty constraints,
            duplication constraints, or other behavior guidance.
          example: Prefer official sources and avoid duplicate results.
        userLocation:
          anyOf:
            - type: string
              description: The two-letter ISO country code of the user, e.g. US.
              example: US
            - type: 'null'
        outputSchema:
          type: object
          properties:
            type:
              type: string
              description: The root schema type (typically "object").
              example: object
            properties:
              type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
              description: >-
                An object where each key is a property name and each value is a
                JSON Schema describing that property (with `type`,
                `description`, etc).
            required:
              type: array
              items:
                type: string
              description: List of required property names.
            description:
              type: string
              description: A description of the schema.
            additionalProperties:
              type: boolean
              description: Whether to allow properties not listed in `properties`.
              default: false
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
          description: >-
            A [JSON Schema Draft 7](https://json-schema.org/draft-07)
            specification for the desired answer structure. When provided, the
            answer is returned as a structured object matching the schema
            instead of a plain string.
      required:
        - query
    AnswerResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Unique identifier for the request.
          example: b5947044c4b78efa9552a7c89b306d95
        answer:
          description: >-
            The generated answer based on search results. Returns a string by
            default, or a structured object matching the provided outputSchema.
          example: $350 billion.
          oneOf:
            - type: string
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
        citations:
          description: Search results used to generate the answer.
          type: array
          items:
            type: object
            properties:
              title:
                type: string
                description: The title of the search result.
                example: >-
                  SpaceX valued at $350bn as company agrees to buy shares from
                  ...
              url:
                type: string
                description: The URL of the search result.
                example: >-
                  https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                format: uri
              publishedDate:
                description: >-
                  An estimate of the creation date, from parsing HTML content.
                  Format is YYYY-MM-DD.
                example: '2023-11-16T01:36:32.547Z'
                format: date-time
                type: string
              author:
                description: If available, the author of the content.
                example: Humza Naveed
                anyOf:
                  - type: string
                  - type: 'null'
              id:
                description: >-
                  The temporary ID for the document. Useful for the /contents
                  endpoint.
                example: https://arxiv.org/abs/2307.06435
                type: string
              image:
                description: >-
                  The URL of an image associated with the search result, if
                  available.
                example: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
                format: uri
                type: string
              favicon:
                description: The URL of the favicon for the search result's domain.
                example: https://arxiv.org/favicon.ico
                format: uri
                type: string
              text:
                description: >-
                  The full text content of each source. Only present when text
                  contents are requested.
                example: >-
                  SpaceX valued at $350bn as company agrees to buy shares from
                  ...
                type: string
            required:
              - title
              - url
            additionalProperties: false
        costDollars:
          $ref: '#/components/schemas/CostDollarsOutput'
      required:
        - answer
      additionalProperties: false
    AnswerStreamChunk:
      description: >-
        Schema for each JSON payload emitted in an `/answer` server-sent event
        stream. Each event is emitted as `data: <json>`.
      oneOf:
        - type: object
          properties:
            choices:
              type: array
              items:
                type: object
                properties:
                  index:
                    type: integer
                    minimum: 0
                    description: Index of this streamed choice.
                  delta:
                    type: object
                    properties:
                      role:
                        type: string
                        const: assistant
                      content:
                        type: string
                      refusal:
                        anyOf:
                          - type: string
                          - type: 'null'
                    additionalProperties:
                      $ref: '#/components/schemas/JsonValue'
                    description: Incremental answer content emitted by the model.
                  finish_reason:
                    description: Reason this streamed choice finished, when present.
                    oneOf:
                      - type: string
                      - type: 'null'
                required:
                  - index
                  - delta
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
              description: >-
                OpenAI-compatible streamed completion choices with internal
                provider fields removed.
          required:
            - choices
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
        - type: object
          properties:
            citations:
              type: array
              items:
                type: object
                properties:
                  title:
                    type: string
                    description: The title of the search result.
                    example: >-
                      SpaceX valued at $350bn as company agrees to buy shares
                      from ...
                  url:
                    type: string
                    description: The URL of the search result.
                    example: >-
                      https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                    format: uri
                  publishedDate:
                    description: >-
                      An estimate of the creation date, from parsing HTML
                      content. Format is YYYY-MM-DD.
                    example: '2023-11-16T01:36:32.547Z'
                    format: date-time
                    type: string
                  author:
                    description: If available, the author of the content.
                    example: Humza Naveed
                    anyOf:
                      - type: string
                      - type: 'null'
                  id:
                    description: >-
                      The temporary ID for the document. Useful for the
                      /contents endpoint.
                    example: https://arxiv.org/abs/2307.06435
                    type: string
                  image:
                    description: >-
                      The URL of an image associated with the search result, if
                      available.
                    example: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
                    format: uri
                    type: string
                  favicon:
                    description: The URL of the favicon for the search result's domain.
                    example: https://arxiv.org/favicon.ico
                    format: uri
                    type: string
                  text:
                    description: >-
                      The full text content of each source. Only present when
                      text contents are requested.
                    example: >-
                      SpaceX valued at $350bn as company agrees to buy shares
                      from ...
                    type: string
                required:
                  - title
                  - url
                additionalProperties: false
              description: Search results cited by the final streamed answer.
          required:
            - citations
          additionalProperties: false
        - type: object
          properties:
            costDollars:
              $ref: '#/components/schemas/CostDollarsOutput'
            requestId:
              type: string
              description: Unique identifier for the request.
              example: b5947044c4b78efa9552a7c89b306d95
          required:
            - costDollars
          additionalProperties: false
        - type: object
          properties:
            tag:
              type: string
              const: ERROR
            payload:
              type: object
              properties:
                error:
                  type: object
                  properties:
                    code:
                      type: integer
                    message:
                      type: string
                  required:
                    - code
                    - message
                  additionalProperties: false
                requestId:
                  type: string
                  description: Unique identifier for the request.
                  example: b5947044c4b78efa9552a7c89b306d95
              required:
                - error
              additionalProperties: false
          required:
            - tag
            - payload
          additionalProperties: false
    JsonValue:
      description: Any JSON value.
      oneOf:
        - type: 'null'
        - type: boolean
        - type: number
        - type: string
        - type: array
          items:
            $ref: '#/components/schemas/JsonValue'
        - type: object
          propertyNames:
            type: string
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
    CostDollarsOutput:
      type: object
      properties:
        total:
          description: >-
            Estimated total dollar cost for the completed request. This response
            value is not an invoice record.
          example: 0.007
          format: float
          type: number
        search:
          description: >-
            Endpoint-dependent estimated search cost breakdown by retrieval
            mode. Instant, fast, and auto search responses may include neural
            search cost. Deep search modes may be reflected only in total.
          type: object
          properties:
            neural:
              description: Cost of neural search operations.
              example: 0.007
              format: float
              type: number
            keyword:
              description: Cost of keyword search operations.
              example: 0.0025
              format: float
              type: number
          additionalProperties: false
        summary:
          description: Cost of synthesized summary generation for search requests.
          example: 0.005
          format: float
          type: number
        contents:
          description: >-
            Estimated cost breakdown for standalone content retrieval (text,
            highlights, and summaries billed outside the bundled search price).
          type: object
          properties:
            text:
              description: Cost of text extraction.
              example: 0.001
              format: float
              type: number
            highlights:
              description: Cost of highlight extraction.
              example: 0.001
              format: float
              type: number
            summary:
              description: Cost of per-result summary generation.
              example: 0.001
              format: float
              type: number
          additionalProperties: false
      additionalProperties: false
      description: >-
        Endpoint-dependent estimated dollar cost breakdown for the completed
        request. Billing is computed from usage counters rather than this
        response object.
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Unique identifier for the request.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: Human-readable message describing the error.
          example: Invalid API key
        tag:
          type: string
          description: >-
            Machine-readable error tag identifying the failure. The set of tags
            is open-ended: new tags may be added at any time, so treat
            unrecognized tags as a generic error of the response's HTTP status.
            Known tags are listed as examples.
          examples:
            - DEFAULT_ERROR
            - INTERNAL_ERROR
            - INVALID_API_KEY
            - INVALID_REQUEST
            - INVALID_REQUEST_BODY
            - INVALID_REQUEST_QUERY
            - INVALID_JSON_SCHEMA
            - INVALID_NUM_RESULTS
            - NUM_RESULTS_EXCEEDED
            - NO_MORE_CREDITS
            - API_KEY_BUDGET_EXCEEDED
            - TEAM_BUDGET_EXCEEDED
            - NO_CONTENT_FOUND
            - PROHIBITED_CONTENT
            - INSUFFICIENT_SCOPE
            - UNABLE_TO_GENERATE_RESPONSE
            - UNSUPPORTED_PUBLICATION_INCLUDE_FILTER
            - SUBPAGES_LIMIT_EXCEEDED
            - FEATURE_DISABLED
            - INVALID_URLS
            - FETCH_DOCUMENT_ERROR
            - TEAM_BLOCKED
            - NOT_FOUND
            - RATE_LIMIT_EXCEEDED
      required:
        - requestId
        - error
        - tag
      additionalProperties: false
      description: Standard error envelope returned by the Exa API for failed requests.
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
    XExaQueued:
      description: >-
        Whether the request waited in the customer rate-limit queue before being
        admitted.
      schema:
        type: string
        enum:
          - 'true'
          - 'false'
      example: 'false'
    XExaQueueMs:
      description: Total milliseconds the request waited in the customer rate-limit queue.
      schema:
        type: string
      example: '0'
  responses:
    BadRequestResponse:
      description: The request body or query parameters failed validation.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 0a1b2c3d4e5f60718293a4b5c6d7e8f9
            error: >-
              Invalid request body: query: Invalid input: expected string,
              received undefined
            tag: INVALID_REQUEST_BODY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    UnauthorizedResponse:
      description: The API key is missing or invalid.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2
            error: Invalid API key
            tag: INVALID_API_KEY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    PaymentRequiredResponse:
      description: The team is out of credits or a spending budget has been exceeded.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 1c3e5a7b9d0f2a4c6e8b0d2f4a6c8e0b
            error: >-
              You have exceeded your credits limit. Please top up to keep using
              Exa at dashboard.exa.ai
            tag: NO_MORE_CREDITS
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    TooManyRequestsResponse:
      description: A rate limit was exceeded.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 7f9b1d3e5a0c2e4b6d8f0a2c4e6b8d0f
            error: >-
              You've exceeded the Exa rate limit for your network. If you
              believe this is in error, please email hello@exa.ai :)
            tag: RATE_LIMIT_EXCEEDED
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerErrorResponse:
      description: An unexpected error occurred while processing the request.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 9b1d3f5e7a0c2e4b6d8f0a2c4e6b8d0f
            error: >-
              Sorry, we encountered an error while processing your request.
              Please try again later
            tag: DEFAULT_ERROR
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.

````