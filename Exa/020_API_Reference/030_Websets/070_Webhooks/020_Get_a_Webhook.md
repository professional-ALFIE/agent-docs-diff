> 원본: https://exa.ai/docs/websets/api/webhooks/get-a-webhook.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a Webhook



## OpenAPI

````yaml get /v0/webhooks/{id}
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
  /v0/webhooks/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Webhooks
      summary: Get a Webhook
      operationId: webhooks-get
      parameters:
        - name: id
          required: true
          in: path
          description: The id of the webhook
          schema:
            type: string
      responses:
        '200':
          description: Webhook
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webhook'
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
        '404':
          description: Webhook not found
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
    Webhook:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the webhook
        object:
          type: string
          const: webhook
          default: webhook
        status:
          type:
            - string
          enum:
            - active
            - inactive
          description: The status of the webhook
          title: WebhookStatus
        events:
          type:
            - array
          items:
            $ref: '#/components/schemas/EventType'
            type:
              - string
          minItems: 1
          description: The events to trigger the webhook
        url:
          type:
            - string
          format: uri
          description: The URL to send the webhook to
        secret:
          type: string
          description: >-
            The secret to verify the webhook signature. Only returned on Webhook
            creation.
          nullable: true
        metadata:
          default: {}
          description: The metadata of the webhook
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
        createdAt:
          type:
            - string
          format: date-time
          description: The date and time the webhook was created
        updatedAt:
          type:
            - string
          format: date-time
          description: The date and time the webhook was last updated
      required:
        - id
        - object
        - status
        - events
        - url
        - secret
        - createdAt
        - updatedAt
    EventType:
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