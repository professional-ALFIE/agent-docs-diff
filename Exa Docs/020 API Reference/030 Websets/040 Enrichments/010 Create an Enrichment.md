> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Create an Enrichment

> Create an Enrichment for a Webset.



## OpenAPI

````yaml post /v0/websets/{webset}/enrichments
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
  /v0/websets/{webset}/enrichments:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Enrichments
      summary: Create an Enrichment
      description: Create an Enrichment for a Webset.
      operationId: websets-enrichments-create
      parameters:
        - name: webset
          required: true
          in: path
          description: The id or externalId of the Webset
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateEnrichmentParameters'
      responses:
        '200':
          description: Enrichment created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetEnrichment'
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
    CreateEnrichmentParameters:
      type:
        - object
      properties:
        description:
          type:
            - string
          minLength: 1
          maxLength: 5000
          description: >-
            Provide a description of the enrichment task you want to perform to
            each Webset Item.
        format:
          type:
            - string
          enum:
            - text
            - date
            - number
            - options
            - email
            - phone
            - url
          description: >-
            Format of the enrichment response.


            We automatically select the best format based on the description. If
            you want to explicitly specify the format, you can do so here.
        options:
          type:
            - array
          items:
            type:
              - object
            properties:
              label:
                type:
                  - string
                description: The label of the option
            required:
              - label
          minItems: 1
          maxItems: 150
          description: >-
            When the format is options, the different options for the enrichment
            agent to choose from.
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
      required:
        - description
    WebsetEnrichment:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the enrichment
        object:
          type: string
          const: webset_enrichment
          default: webset_enrichment
        status:
          type:
            - string
          enum:
            - pending
            - canceled
            - completed
          description: The status of the enrichment
          title: WebsetEnrichmentStatus
        websetId:
          type:
            - string
          description: The unique identifier for the Webset this enrichment belongs to.
        title:
          type: string
          description: >-
            The title of the enrichment.


            This will be automatically generated based on the description and
            format.
          nullable: true
        description:
          type:
            - string
          description: >-
            The description of the enrichment task provided during the creation
            of the enrichment.
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          type: string
          description: The format of the enrichment response.
          nullable: true
        options:
          type: array
          items:
            type:
              - object
            properties:
              label:
                type:
                  - string
                description: The label of the option
            required:
              - label
          description: >-
            When the format is options, the different options for the enrichment
            agent to choose from.
          title: WebsetEnrichmentOptions
          nullable: true
        instructions:
          type: string
          description: >-
            The instructions for the enrichment Agent.


            This will be automatically generated based on the description and
            format.
          nullable: true
        metadata:
          default: {}
          description: The metadata of the enrichment
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
          description: The date and time the enrichment was created
        updatedAt:
          type:
            - string
          format: date-time
          description: The date and time the enrichment was updated
      required:
        - id
        - object
        - status
        - websetId
        - title
        - description
        - format
        - options
        - instructions
        - createdAt
        - updatedAt
    WebsetEnrichmentFormat:
      type: string
      enum:
        - text
        - date
        - number
        - options
        - email
        - phone
        - url
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