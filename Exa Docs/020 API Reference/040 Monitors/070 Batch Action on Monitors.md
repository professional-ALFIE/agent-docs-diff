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
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchMonitorsResponse'
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