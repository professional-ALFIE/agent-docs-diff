> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Create an Import

> Creates a new import to upload your data into Websets. Imports can be used to:

- **Enrich**: Enhance your data with additional information using our AI-powered enrichment engine
- **Search**: Query your data using Websets' agentic search with natural language filters
- **Exclude**: Prevent duplicate or already known results from appearing in your searches

Once the import is created, you can upload your data to the returned `uploadUrl` until `uploadValidUntil` (by default 1 hour).



## OpenAPI

````yaml post /v0/imports
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
  /v0/imports:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Imports
      summary: Create an Import
      description: >-
        Creates a new import to upload your data into Websets. Imports can be
        used to:


        - **Enrich**: Enhance your data with additional information using our
        AI-powered enrichment engine

        - **Search**: Query your data using Websets' agentic search with natural
        language filters

        - **Exclude**: Prevent duplicate or already known results from appearing
        in your searches


        Once the import is created, you can upload your data to the returned
        `uploadUrl` until `uploadValidUntil` (by default 1 hour).
      operationId: imports-create
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateImportParameters'
      responses:
        '201':
          description: Import created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateImportResponse'
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
    CreateImportParameters:
      discriminator:
        propertyName: format
      oneOf:
        - type:
            - object
          properties:
            size:
              type:
                - number
              maximum: 50000000
              description: The size of the file in bytes. Maximum size is 50 MB.
            count:
              type:
                - number
              description: The number of records to import
            title:
              type:
                - string
              description: The title of the import
            format:
              type:
                - string
              enum:
                - csv
              description: >-
                When the import is in CSV format, we expect a column containing
                the key identifier for the entity - for now URL. If not
                provided, import will fail to be processed.
            metadata:
              description: Set of key-value pairs you want to associate with this object.
              type:
                - object
              additionalProperties:
                type:
                  - string
                maxLength: 1000
            entity:
              oneOf:
                - $ref: '#/components/schemas/CompanyEntity'
                  type:
                    - object
                - $ref: '#/components/schemas/PersonEntity'
                  type:
                    - object
                - $ref: '#/components/schemas/ArticleEntity'
                  type:
                    - object
                - $ref: '#/components/schemas/ResearchPaperEntity'
                  type:
                    - object
                - $ref: '#/components/schemas/CustomEntity'
                  type:
                    - object
              description: >-
                What type of entity the import contains (e.g. People, Companies,
                etc.), and thus should be attempted to be resolved as.
            csv:
              type:
                - object
              properties:
                identifier:
                  type:
                    - integer
                  minimum: 0
                  description: >-
                    Column containing the key identifier for the entity (e.g.
                    URL, Name, etc.). If not provided, we will try to infer it
                    from the file.
              description: When format is `csv`, these are the specific import parameters.
          required:
            - size
            - count
            - format
            - entity
    CreateImportResponse:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the Import
        object:
          type:
            - string
          enum:
            - import
          description: The type of object
        status:
          type:
            - string
          enum:
            - pending
            - processing
            - completed
            - failed
            - canceled
          description: The status of the Import
        format:
          type:
            - string
          enum:
            - csv
            - webset
          description: The format of the import.
        entity:
          $ref: '#/components/schemas/Entity'
          description: The type of entity the import contains.
          nullable: true
        title:
          type:
            - string
          description: The title of the import
        count:
          type:
            - number
          description: The number of entities in the import
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
        failedReason:
          type: string
          enum:
            - invalid_format
            - invalid_file_content
            - missing_identifier
          description: The reason the import failed
          nullable: true
        failedAt:
          type: string
          format: date-time
          description: When the import failed
          nullable: true
        failedMessage:
          type: string
          description: A human readable message of the import failure
          nullable: true
        createdAt:
          type:
            - string
          format: date-time
          description: When the import was created
        updatedAt:
          type:
            - string
          format: date-time
          description: When the import was last updated
        uploadUrl:
          type:
            - string
          description: The URL to upload the file to
        uploadValidUntil:
          type:
            - string
          description: >-
            The date and time until the upload URL is valid. The upload URL will
            be valid for 1 hour.
      required:
        - id
        - object
        - status
        - format
        - entity
        - title
        - count
        - metadata
        - failedReason
        - failedAt
        - failedMessage
        - createdAt
        - updatedAt
        - uploadUrl
        - uploadValidUntil
      description: >-
        The response to a successful import. Includes the upload URL and the
        upload valid until date.
    CompanyEntity:
      type:
        - object
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: Company
    PersonEntity:
      type:
        - object
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: Person
    ArticleEntity:
      type:
        - object
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: Article
    ResearchPaperEntity:
      type:
        - object
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: Research Paper
    CustomEntity:
      type:
        - object
      properties:
        type:
          type: string
          const: custom
          default: custom
        description:
          type:
            - string
          minLength: 2
          maxLength: 200
      required:
        - type
        - description
      title: Custom
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
          type:
            - object
        - $ref: '#/components/schemas/PersonEntity'
          type:
            - object
        - $ref: '#/components/schemas/ArticleEntity'
          type:
            - object
        - $ref: '#/components/schemas/ResearchPaperEntity'
          type:
            - object
        - $ref: '#/components/schemas/CustomEntity'
          type:
            - object
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