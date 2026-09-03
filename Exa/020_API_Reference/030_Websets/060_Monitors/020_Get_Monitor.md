> 원본: https://exa.ai/docs/websets/api/monitors/get-monitor.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Monitor

> Gets a specific monitor.



## OpenAPI

````yaml get /v0/monitors/{id}
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
  /v0/monitors/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors
      summary: Get Monitor
      description: Gets a specific monitor.
      operationId: monitors-get
      parameters:
        - name: id
          required: true
          in: path
          description: The id of the Monitor
          schema:
            type: string
      responses:
        '200':
          description: Monitor details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Monitor'
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
    Monitor:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the Monitor
        object:
          type:
            - string
          enum:
            - monitor
          description: The type of object
        status:
          type:
            - string
          enum:
            - enabled
            - disabled
          description: The status of the Monitor
        websetId:
          type:
            - string
          description: The id of the Webset the Monitor belongs to
        cadence:
          type:
            - object
          properties:
            cron:
              description: >-
                Cron expression for monitor cadence (must be a valid Unix cron
                with 5 fields). The schedule must trigger at most once per day.
              type:
                - string
            timezone:
              description: IANA timezone (e.g., "America/New_York")
              default: Etc/UTC
              type:
                - string
          required:
            - cron
          description: How often the monitor will run
        behavior:
          type:
            - object
          properties:
            type:
              type: string
              const: search
              default: search
            config:
              type:
                - object
              properties:
                query:
                  type:
                    - string
                  minLength: 2
                  maxLength: 10000
                  description: >-
                    The query to search for. By default, the query from the last
                    search is used.
                criteria:
                  type:
                    - array
                  items:
                    type:
                      - object
                    properties:
                      description:
                        type:
                          - string
                        minLength: 2
                        maxLength: 1000
                    required:
                      - description
                  maxItems: 5
                  description: >-
                    The criteria to search for. By default, the criteria from
                    the last search is used.
                entity:
                  $ref: '#/components/schemas/Entity'
                  title: Entity
                  description: >-
                    The entity to search for. By default, the entity from the
                    last search/import is used.
                count:
                  type:
                    - number
                  exclusiveMinimum: 0
                  description: The maximum number of results to find
                behavior:
                  default: append
                  type:
                    - string
                  enum:
                    - override
                    - append
                  description: The behaviour of the Search when it is added to a Webset.
              required:
                - count
              description: >-
                Specify the search parameters for the Monitor.


                By default, the search parameters (query, entity and criteria)
                from the last search are used when no parameters are provided.
          required:
            - type
            - config
          description: Behavior to perform when monitor runs
        lastRun:
          $ref: '#/components/schemas/MonitorRun'
          type: object
          title: MonitorRun
          description: The last run of the monitor
          nullable: true
        nextRunAt:
          type: string
          format: date-time
          description: Date and time when the next run will occur in
          nullable: true
        metadata:
          description: Set of key-value pairs you want to associate with this object.
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
          description: When the monitor was created
        updatedAt:
          type:
            - string
          format: date-time
          description: When the monitor was last updated
      required:
        - id
        - object
        - status
        - websetId
        - cadence
        - behavior
        - lastRun
        - nextRunAt
        - metadata
        - createdAt
        - updatedAt
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
    MonitorRun:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the Monitor Run
        object:
          type:
            - string
          enum:
            - monitor_run
          description: The type of object
        status:
          type:
            - string
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: The status of the Monitor Run
        monitorId:
          type:
            - string
          description: The monitor that the run is associated with
        type:
          type:
            - string
          enum:
            - search
            - refresh
          description: The type of the Monitor Run
        completedAt:
          type: string
          format: date-time
          description: When the run completed
          nullable: true
        failedAt:
          type: string
          format: date-time
          description: When the run failed
          nullable: true
        failedReason:
          type: string
          description: The reason the run failed
          nullable: true
        canceledAt:
          type: string
          format: date-time
          description: When the run was canceled
          nullable: true
        createdAt:
          type:
            - string
          format: date-time
          description: When the run was created
        updatedAt:
          type:
            - string
          format: date-time
          description: When the run was last updated
      required:
        - id
        - object
        - monitorId
        - status
        - type
        - completedAt
        - failedAt
        - failedReason
        - canceledAt
        - createdAt
        - updatedAt
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