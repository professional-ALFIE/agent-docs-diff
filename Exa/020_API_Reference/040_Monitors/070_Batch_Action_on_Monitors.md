> 원본: https://exa.ai/docs/reference/monitors/batch-monitors.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Batch Action on Monitors

> Perform a batch action on monitors matching the provided filters.

Supported actions:
- **delete**: Permanently remove matching monitors
- **pause**: Pause matching monitors
- **unpause**: Unpause matching monitors

Use `dry_run: true` (the default) to preview which monitors would be affected before performing the action. Results are paginated via the `limit` parameter; loop until `has_more` is `false` to process all matching monitors.



## OpenAPI

````yaml post /monitors/batch
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
  /monitors/batch:
    post:
      tags:
        - Monitors
      summary: Batch Action on Monitors
      description: >-
        Perform a batch action on monitors matching the provided filters.


        Supported actions:

        - **delete**: Permanently remove matching monitors

        - **pause**: Pause matching monitors

        - **unpause**: Unpause matching monitors


        Use `dry_run: true` (the default) to preview which monitors would be
        affected before performing the action. Results are paginated via the
        `limit` parameter; loop until `has_more` is `false` to process all
        matching monitors.
      operationId: batchMonitors
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchMonitorsRequest'
      responses:
        '200':
          description: Batch action result
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchMonitorsResponse'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  schemas:
    BatchMonitorsRequest:
      type: object
      properties:
        action:
          type: string
          enum:
            - delete
            - pause
            - unpause
          description: >-
            The action to perform on matching monitors. `delete` permanently
            removes them, `pause` sets their status to paused, and `unpause`
            sets their status to active.
        filter:
          type: object
          properties:
            name:
              type: string
              maxLength: 250
              description: Filter by name (case-insensitive substring match)
            status:
              type: string
              enum:
                - active
                - paused
                - disabled
              description: Filter by monitor status
            metadata:
              type: object
              propertyNames:
                type: string
              additionalProperties:
                type: string
                maxLength: 1000
              description: Filter by metadata key-value pairs (exact match, AND semantics)
          description: >-
            At least one filter field must be provided to prevent accidental
            bulk operations.
        dry_run:
          type: boolean
          description: >-
            When `true`, returns the monitors that would be affected without
            performing the action. Defaults to `true`.
          default: true
        limit:
          type: integer
          minimum: 1
          maximum: 500
          description: >-
            Maximum number of monitors to process in a single request. Defaults
            to 50, maximum 500.
          default: 50
      required:
        - action
        - filter
    BatchMonitorsResponse:
      type: object
      properties:
        action:
          type: string
          enum:
            - delete
            - pause
            - unpause
          description: The action that was performed
        affected:
          type: integer
          description: The number of monitors affected by the action
        ids:
          type: array
          items:
            type: string
          description: The IDs of the monitors that were affected
        dry_run:
          type: boolean
          description: Whether this was a dry run
        has_more:
          type: boolean
          description: >-
            Whether there are more monitors matching the filter. If `true`,
            repeat the request to process the next batch.
      required:
        - action
        - affected
        - ids
        - dry_run
        - has_more
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