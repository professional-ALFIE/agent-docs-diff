> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List Runs

> Lists all runs for a monitor with cursor-based pagination. Runs are returned in reverse chronological order.



## OpenAPI

````yaml get /monitors/{id}/runs
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
  /monitors/{id}/runs:
    get:
      tags:
        - Runs
      summary: List Runs
      description: >-
        Lists all runs for a monitor with cursor-based pagination. Runs are
        returned in reverse chronological order.
      operationId: listRuns
      parameters:
        - in: path
          name: id
          schema:
            type: string
            description: The monitor ID
          required: true
          description: The monitor ID
        - in: query
          name: cursor
          schema:
            type: string
            description: Pagination cursor from a previous response
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            maximum: 100
            description: Number of results per page
            default: 50
      responses:
        '200':
          description: A paginated list of runs
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListSearchMonitorRunsResponse'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '404':
          $ref: '#/components/responses/NotFoundResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    ListSearchMonitorRunsResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/SearchMonitorRun'
          description: The list of runs
        hasMore:
          type: boolean
          description: Whether there are more results
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
          description: Cursor for the next page
      required:
        - data
        - hasMore
      additionalProperties: false
    SearchMonitorRun:
      type: object
      properties:
        id:
          type: string
          description: The unique identifier for the run
        monitorId:
          type: string
          description: The monitor this run belongs to
        status:
          type: string
          enum:
            - pending
            - running
            - completed
            - failed
            - cancelled
          description: The status of the run
        output:
          anyOf:
            - $ref: '#/components/schemas/SearchMonitorRunOutput'
            - type: 'null'
          description: The output of the run. Null until the run completes.
        failReason:
          anyOf:
            - type: string
              enum:
                - api_key_invalid
                - insufficient_credits
                - invalid_params
                - rate_limited
                - source_not_available
                - forbidden
                - search_unavailable
                - search_failed
                - internal_error
            - type: 'null'
          description: >-
            The reason the run failed. Null unless status is `failed`.
            `source_not_available` means the search requested a domain Exa
            cannot return (remove it from the search), and `forbidden` means the
            request was otherwise not permitted.
        startedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the run started executing
          format: date-time
        completedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the run completed successfully
          format: date-time
        failedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the run failed
          format: date-time
        cancelledAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the run was cancelled
          format: date-time
        durationMs:
          anyOf:
            - type: integer
            - type: 'null'
          description: Total execution time in milliseconds
        createdAt:
          type: string
          format: date-time
          description: When the run was created
        updatedAt:
          type: string
          format: date-time
          description: When the run was last updated
      required:
        - id
        - monitorId
        - status
        - output
        - failReason
        - startedAt
        - completedAt
        - failedAt
        - cancelledAt
        - durationMs
        - createdAt
        - updatedAt
      additionalProperties: false
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
    SearchMonitorRunOutput:
      type: object
      properties:
        results:
          anyOf:
            - type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
            - type: 'null'
          description: The search results
        content:
          description: >-
            Synthesized content from the search results. Shape depends on
            `outputSchema.type`.
          oneOf:
            - $ref: '#/components/schemas/JsonValue'
            - type: 'null'
        grounding:
          anyOf:
            - type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                    description: The output field this citation applies to
                  citations:
                    type: array
                    items:
                      type: object
                      properties:
                        url:
                          type: string
                          format: uri
                          description: Source URL.
                        title:
                          type: string
                          description: Source title.
                      required:
                        - url
                        - title
                      additionalProperties: false
                  confidence:
                    type: string
                    enum:
                      - low
                      - medium
                      - high
                    description: Model-reported reliability for this field.
                required:
                  - field
                  - citations
                  - confidence
                additionalProperties: false
            - type: 'null'
          description: Field-level citations with confidence levels
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
    NotFoundResponse:
      description: The requested resource does not exist.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 3b1d5f7a9c0e2b4d6f8a0c2e4b6d8f0a
            error: Not found
            tag: NOT_FOUND
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