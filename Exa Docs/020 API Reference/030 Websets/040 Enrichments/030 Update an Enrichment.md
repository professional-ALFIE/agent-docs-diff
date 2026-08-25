> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Update an Enrichment

> Update an Enrichment configuration for a Webset.



## OpenAPI

````yaml patch /v0/websets/{webset}/enrichments/{id}
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
  /v0/websets/{webset}/enrichments/{id}:
    servers:
      - url: https://api.exa.ai/websets
    patch:
      tags:
        - Enrichments
      summary: Update an Enrichment
      description: Update an Enrichment configuration for a Webset.
      operationId: websets-enrichments-update
      parameters:
        - name: webset
          required: true
          in: path
          schema:
            type: string
        - name: id
          required: true
          in: path
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateEnrichmentParameters'
      responses:
        '200':
          description: ''
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
    UpdateEnrichmentParameters:
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
          type: object
          additionalProperties:
            type:
              - string
            maxLength: 1000
          nullable: true
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