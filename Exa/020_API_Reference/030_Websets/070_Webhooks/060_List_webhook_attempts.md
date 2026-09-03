> 원본: https://exa.ai/docs/websets/api/webhooks/attempts/list-webhook-attempts.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List webhook attempts

> List all attempts made by a Webhook ordered in descending order.



## OpenAPI

````yaml get /v0/webhooks/{id}/attempts
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
  /v0/webhooks/{id}/attempts:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Webhooks Attempts
      summary: List webhook attempts
      description: List all attempts made by a Webhook ordered in descending order.
      operationId: webhooks-attempts-list
      parameters:
        - name: id
          required: true
          in: path
          description: The ID of the webhook
          schema:
            type: string
        - name: cursor
          required: false
          in: query
          description: The cursor to paginate through the results
          schema:
            minLength: 1
            type: string
        - name: limit
          required: false
          in: query
          description: The number of results to return
          schema:
            minimum: 1
            maximum: 200
            default: 25
            type: integer
        - name: eventType
          required: false
          in: query
          description: The type of event to filter by
          schema:
            type: string
            enum:
              - webset.created
              - webset.deleted
              - webset.paused
              - webset.idle
              - webset.search.created
              - webset.search.canceled
              - webset.search.completed
              - webset.search.updated
              - import.created
              - import.completed
              - webset.item.created
              - webset.item.enriched
              - monitor.created
              - monitor.updated
              - monitor.deleted
              - monitor.run.created
              - monitor.run.completed
              - webset.export.created
              - webset.export.completed
        - name: successful
          required: false
          in: query
          description: Filter attempts by their success status
          schema:
            type: boolean
      responses:
        '200':
          description: List of webhook attempts
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListWebhookAttemptsResponse'
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListWebhookAttemptsResponse:
      type:
        - object
      properties:
        data:
          type:
            - array
          items:
            $ref: '#/components/schemas/WebhookAttempt'
            type:
              - object
          description: The list of webhook attempts
        hasMore:
          type:
            - boolean
          description: Whether there are more results to paginate through
        nextCursor:
          type: string
          description: The cursor to paginate through the next set of results
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
    WebhookAttempt:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the webhook attempt
        object:
          type: string
          const: webhook_attempt
          default: webhook_attempt
        eventId:
          type:
            - string
          description: The unique identifier for the event
        eventType:
          type:
            - string
          enum:
            - webset.created
            - webset.deleted
            - webset.paused
            - webset.idle
            - webset.search.created
            - webset.search.canceled
            - webset.search.completed
            - webset.search.updated
            - import.created
            - import.completed
            - webset.item.created
            - webset.item.enriched
            - monitor.created
            - monitor.updated
            - monitor.deleted
            - monitor.run.created
            - monitor.run.completed
            - webset.export.created
            - webset.export.completed
          description: The type of event
        webhookId:
          type:
            - string
          description: The unique identifier for the webhook
        url:
          type:
            - string
          description: The URL that was used during the attempt
        successful:
          description: Whether the attempt was successful
          type:
            - boolean
        responseHeaders:
          type:
            - object
          additionalProperties:
            type:
              - string
          description: The headers of the response
        responseBody:
          type: string
          description: The body of the response
          nullable: true
        responseStatusCode:
          type:
            - number
          description: The status code of the response
        attempt:
          type:
            - number
          description: The attempt number of the webhook
        attemptedAt:
          type:
            - string
          format: date-time
          description: The date and time the webhook attempt was made
      required:
        - id
        - object
        - eventId
        - eventType
        - webhookId
        - url
        - successful
        - responseHeaders
        - responseBody
        - responseStatusCode
        - attempt
        - attemptedAt
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