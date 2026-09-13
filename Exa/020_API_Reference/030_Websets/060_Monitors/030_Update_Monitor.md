> 원본: https://exa.ai/docs/websets/api/monitors/update-monitor.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Update Monitor

> Updates a monitor configuration.



## OpenAPI

````yaml patch /v0/monitors/{id}
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
    patch:
      tags:
        - Monitors
      summary: Update Monitor
      description: Updates a monitor configuration.
      operationId: monitors-update
      parameters:
        - name: id
          required: true
          in: path
          description: The id of the Monitor
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateMonitor'
      responses:
        '200':
          description: Monitor updated successfully
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
    UpdateMonitor:
      type:
        - object
      properties:
        status:
          type:
            - string
          enum:
            - enabled
            - disabled
          description: The status of the monitor.
        metadata:
          type:
            - object
          additionalProperties:
            type:
              - string
        cadence:
          $ref: '#/components/schemas/MonitorCadence'
          type:
            - object
        behavior:
          $ref: '#/components/schemas/MonitorBehavior'
          type:
            - object
    Monitor:
      properties:
        id:
          description: The unique identifier for the Monitor
          type: string
        object:
          enum:
            - monitor
          description: The type of object
          type: string
        status:
          enum:
            - enabled
            - disabled
          description: The status of the Monitor
          type: string
        websetId:
          description: The id of the Webset the Monitor belongs to
          type: string
        cadence:
          properties:
            cron:
              description: >-
                Cron expression for monitor cadence (must be a valid Unix cron
                with 5 fields). The schedule must trigger at most once per day.
              type: string
            timezone:
              default: Etc/UTC
              description: IANA timezone (e.g., "America/New_York")
              type: string
          required:
            - cron
          description: How often the monitor will run
          type: object
        behavior:
          properties:
            config:
              properties:
                query:
                  description: >-
                    The query to search for. By default, the query from the last
                    search is used.
                  minLength: 2
                  maxLength: 10000
                  type: string
                criteria:
                  description: >-
                    The criteria to search for. By default, the criteria from
                    the last search is used.
                  maxItems: 5
                  items:
                    properties:
                      description:
                        minLength: 2
                        maxLength: 1000
                        type: string
                    required:
                      - description
                    type: object
                  type: array
                entity:
                  $ref: '#/components/schemas/Entity'
                  title: Entity
                  description: >-
                    The entity to search for. By default, the entity from the
                    last search/import is used.
                count:
                  exclusiveMinimum: 0
                  description: The maximum number of results to find
                  type: number
                behavior:
                  default: append
                  description: The behaviour of the Search when it is added to a Webset.
                  enum:
                    - override
                    - append
                  type: string
              required:
                - count
              description: >-
                Specify the search parameters for the Monitor.


                By default, the search parameters (query, entity and criteria)
                from the last search are used when no parameters are provided.
              type: object
            type:
              type: string
              const: search
              default: search
          required:
            - type
            - config
          description: Behavior to perform when monitor runs
          type: object
        lastRun:
          $ref: '#/components/schemas/MonitorRun'
          title: MonitorRun
          description: The last run of the monitor
          nullable: true
        nextRunAt:
          format: date-time
          type: string
          description: Date and time when the next run will occur in
          nullable: true
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          type: string
          format: date-time
          description: When the monitor was created
        updatedAt:
          type: string
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
      type: object
    MonitorCadence:
      type:
        - object
      properties:
        cron:
          description: >-
            Cron expression for monitor cadence (must be a valid Unix cron with
            5 fields). The schedule must trigger at most once per day.
          type:
            - string
        timezone:
          description: IANA timezone (e.g., "America/New_York")
          default: Etc/UTC
          type:
            - string
      required:
        - cron
    MonitorBehavior:
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
                The criteria to search for. By default, the criteria from the
                last search is used.
            entity:
              $ref: '#/components/schemas/Entity'
              title: Entity
              description: >-
                The entity to search for. By default, the entity from the last
                search/import is used.
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


            By default, the search parameters (query, entity and criteria) from
            the last search are used when no parameters are provided.
      required:
        - type
        - config
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
    MonitorRun:
      properties:
        id:
          description: The unique identifier for the Monitor Run
          type: string
        object:
          enum:
            - monitor_run
          description: The type of object
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: The status of the Monitor Run
          type: string
        monitorId:
          description: The monitor that the run is associated with
          type: string
        completedAt:
          format: date-time
          type: string
          description: When the run completed
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: When the run failed
          nullable: true
        failedReason:
          type: string
          description: The reason the run failed
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: When the run was canceled
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: When the run was created
        updatedAt:
          type: string
          format: date-time
          description: When the run was last updated
        type:
          type: string
          enum:
            - search
            - refresh
          description: The type of the Monitor Run
      required:
        - id
        - object
        - status
        - monitorId
        - type
        - completedAt
        - failedAt
        - failedReason
        - canceledAt
        - createdAt
        - updatedAt
      type: object
    CompanyEntity:
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: Company
      type: object
    PersonEntity:
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: Person
      type: object
    ArticleEntity:
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: Article
      type: object
    ResearchPaperEntity:
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: Research Paper
      type: object
    CustomEntity:
      properties:
        description:
          minLength: 2
          maxLength: 200
          type: string
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - description
      title: Custom
      type: object
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