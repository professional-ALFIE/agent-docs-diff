> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a Run

> Retrieves a single run by its ID, including the full output if the run is completed.



## OpenAPI

````yaml get /monitors/{id}/runs/{runId}
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
  /monitors/{id}/runs/{runId}:
    get:
      tags:
        - Runs
      summary: Get a Run
      description: >-
        Retrieves a single run by its ID, including the full output if the run
        is completed.
      operationId: getRun
      parameters:
        - in: path
          name: id
          schema:
            type: string
            description: The monitor ID
          required: true
          description: The monitor ID
        - in: path
          name: runId
          schema:
            type: string
            description: The run ID
          required: true
          description: The run ID
      responses:
        '200':
          description: The run
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SearchMonitorRun'
components:
  schemas:
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