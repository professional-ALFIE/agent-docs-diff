> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a batch

> Submit a batch of Exa API requests to run asynchronously.

Each item in `requests` is a `POST` to `/search` or `/agent/runs` with a batch-unique `customId`. The same `customId` is returned in the results file so you can map output rows back to your input data. See the [Batch API guide](/docs/reference/batches) for the end-to-end workflow.

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />


## OpenAPI

````yaml post /batches
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
    post:
      tags:
        - Batches
      summary: Create a batch
      description: >-
        Create a batch of requests to run asynchronously. Each request is
        dispatched to its target route and results are made available for
        download when the batch completes.
      operationId: createBatch
      parameters:
        - $ref: '#/components/parameters/BatchesBetaHeader'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateBatchRequest'
            examples:
              searchBatch:
                summary: Batch of search and agent-run requests
                value:
                  requests:
                    - customId: row-1
                      method: POST
                      url: /search
                      body:
                        query: Latest AI infrastructure funding rounds
                    - customId: row-2
                      method: POST
                      url: /agent/runs
                      body:
                        query: Summarize this week's vector database launches
                  metadata:
                    project: weekly-digest
      responses:
        '200':
          description: OK
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              example:
                id: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
                object: batch
                status: in_progress
                requestCounts:
                  total: 2
                  completed: 0
                  failed: 0
                createdAt: '2026-06-06T12:00:00.000Z'
                expiresAt: '2026-06-13T12:00:00.000Z'
                endedAt: null
                resultsUrl: null
                metadata:
                  project: weekly-digest
              schema:
                $ref: '#/components/schemas/Batch'
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
  schemas:
    CreateBatchRequest:
      type: object
      properties:
        requests:
          minItems: 1
          type: array
          items:
            $ref: '#/components/schemas/BatchRequestItem'
          description: >-
            The requests to enqueue. Each `customId` must be unique within the
            batch.
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: Caller-provided metadata stored with the batch.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
      required:
        - requests
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
    BatchRequestItem:
      type: object
      properties:
        customId:
          type: string
          minLength: 1
          maxLength: 64
          description: >-
            Your unique handle for this request; keys the result and must be
            unique in the batch.
          example: row-1
        method:
          type: string
          const: POST
          description: HTTP method of the batched request. POST-only in v1.
        url:
          type: string
          enum:
            - /search
            - /agent/runs
          description: >-
            Target API route for the request. One of `/search` or `/agent/runs`
            in v1.
          example: /search
        body:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
          description: >-
            Request body for the target route. Must be a JSON object; `stream:
            true` is not allowed.
      required:
        - customId
        - method
        - url
        - body
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
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
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