> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Cancel a running Enrichment

> All running enrichments will be canceled. You can not resume an Enrichment after it has been canceled.



## OpenAPI

````yaml post /v0/websets/{webset}/enrichments/{id}/cancel
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
  /v0/websets/{webset}/enrichments/{id}/cancel:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Enrichments
      summary: Cancel a running Enrichment
      description: >-
        All running enrichments will be canceled. You can not resume an
        Enrichment after it has been canceled.
      operationId: websets-enrichments-cancel
      parameters:
        - name: webset
          required: true
          in: path
          description: The id or externalId of the Webset
          schema:
            type: string
        - name: id
          required: true
          in: path
          description: The id of the Enrichment
          schema:
            type: string
      responses:
        '200':
          description: Enrichment cancelled
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
      x-codeSamples:
        - lang: javascript
          label: JavaScript
          source: >-
            // npm install exa-js

            import Exa from "exa-js";

            const exa = new Exa("YOUR_EXA_API_KEY");


            const enrichment = await exa.websets.enrichments.cancel("webset_id",
            "enrichment_id");


            console.log(`Cancelled enrichment: ${enrichment.id}`);
        - lang: python
          label: Python
          source: >-
            # pip install exa-py

            from exa_py import Exa


            exa = Exa("YOUR_EXA_API_KEY")


            enrichment = exa.websets.enrichments.cancel("webset_id",
            "enrichment_id")


            print(f"Cancelled enrichment: {enrichment.id}")
components:
  schemas:
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