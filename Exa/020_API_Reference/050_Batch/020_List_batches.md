> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List batches

> Retrieve a paginated list of batches for your team.

Batches are returned from newest to oldest. Use `limit` to control page size and `cursor` with the `nextCursor` from the previous response to fetch the next page. Pass `status=completed` to list only completed batches; completed listings use their own cursor, so keep sending `status=completed` on every page.

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />


## OpenAPI

````yaml get /batches
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
  /batches:
    get:
      tags:
        - Batches
      summary: List batches
      description: List batches for your team, ordered from newest to oldest.
      operationId: listBatches
      parameters:
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
            description: >-
              Maximum number of batches to return per page. Defaults to 100 when
              omitted; there is no upper bound.
            default: 100
        - in: query
          name: status
          schema:
            type: string
            const: completed
            description: >-
              Filter the listing to completed batches. `completed` is the only
              supported value; any other value returns a 400. Completed listings
              are ordered by expiry and use a distinct cursor, so keep sending
              `status=completed` on every cursor-paginated request.
        - $ref: '#/components/parameters/BatchesBetaHeader'
      responses:
        '200':
          description: OK
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              example:
                object: list
                data:
                  - id: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
                    object: batch
                    status: completed
                    requestCounts:
                      total: 2
                      completed: 2
                      failed: 0
                    createdAt: '2026-06-06T12:00:00.000Z'
                    expiresAt: '2026-06-13T12:00:00.000Z'
                    endedAt: '2026-06-06T12:01:30.000Z'
                    resultsUrl: >-
                      https://exa-batch-results.s3.us-east-1.amazonaws.com/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/results.jsonl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=EXAMPLESIGNATURE
                    metadata:
                      project: weekly-digest
                hasMore: false
                nextCursor: null
              schema:
                $ref: '#/components/schemas/BatchList'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  parameters:
    BatchesBetaHeader:
      in: header
      name: Exa-Beta
      schema:
        type: string
        enum:
          - batches-2026-06-06
        description: Required beta token for the Batch API.
      required: true
      description: Required beta token for the Batch API.
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    BatchList:
      type: object
      properties:
        object:
          type: string
          const: list
          description: The object type, always `list`.
        data:
          type: array
          items:
            $ref: '#/components/schemas/Batch'
          description: The page of batches, newest first.
        hasMore:
          type: boolean
          description: Whether there are more results
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
          description: Cursor for the next page
      required:
        - object
        - data
        - hasMore
        - nextCursor
      additionalProperties: false
    Batch:
      type: object
      properties:
        id:
          type: string
          description: Batch ID. New batch IDs are returned with the `batch_` prefix.
          example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
        object:
          type: string
          const: batch
          description: The object type, always `batch`.
        status:
          $ref: '#/components/schemas/BatchStatus'
        requestCounts:
          $ref: '#/components/schemas/BatchRequestCounts'
        createdAt:
          type: string
          format: date-time
          description: When the batch was created.
        expiresAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the batch expires, or `null` if it does not expire.
          format: date-time
        endedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: >-
            When the batch reached a terminal status, or `null` while it is
            still running.
          format: date-time
        resultsUrl:
          anyOf:
            - type: string
            - type: 'null'
          description: >-
            Short-lived presigned download URL for the batch results file
            (JSONL), or `null` until the batch completes. This is a direct
            object-store download link, not an API route; fetch it as-is and
            re-fetch the batch to mint a fresh URL once it expires.
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: Caller-provided key-value metadata for your own tracking.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
      required:
        - id
        - object
        - status
        - requestCounts
        - createdAt
        - expiresAt
        - endedAt
        - resultsUrl
        - metadata
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
    BatchStatus:
      type: string
      enum:
        - in_progress
        - completed
        - cancelling
        - cancelled
        - expired
      description: Lifecycle status of the batch.
    BatchRequestCounts:
      type: object
      properties:
        total:
          type: integer
          minimum: 0
          description: Total requests in the batch.
        completed:
          type: integer
          minimum: 0
          description: Requests that have completed successfully.
        failed:
          type: integer
          minimum: 0
          description: Requests that have failed.
      required:
        - total
        - completed
        - failed
      additionalProperties: false
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