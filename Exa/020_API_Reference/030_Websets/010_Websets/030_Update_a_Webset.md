> 원본: https://exa.ai/docs/websets/api/websets/update-a-webset.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Update a Webset

> Updates the `title` or `metadata` of a Webset. Searches, imports, and enrichments are managed through their own endpoints.



## OpenAPI

````yaml post /v0/websets/{id}
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
  /v0/websets/{id}:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Websets
      summary: Update a Webset
      description: >-
        Updates the `title` or `metadata` of a Webset. Searches, imports, and
        enrichments are managed through their own endpoints.
      operationId: websets-update
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: The id or externalId of the Webset
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateWebsetRequest'
      responses:
        '200':
          description: Webset updated
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webset'
        '404':
          description: Webset not found
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
    UpdateWebsetRequest:
      properties:
        metadata:
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
          description: Set of key-value pairs you want to associate with this object.
          nullable: true
        title:
          description: Optional name that appears anywhere the Webset is displayed.
          examples:
            - Leading climate tech startups
          minLength: 1
          type: string
      type: object
    Webset:
      properties:
        id:
          description: The unique identifier for the webset
          type: string
        object:
          const: webset
          default: webset
          type: string
        status:
          enum:
            - idle
            - pending
            - running
            - paused
          description: The status of the webset
          title: WebsetStatus
          type: string
        externalId:
          type: string
          description: The external identifier for the webset
          nullable: true
        title:
          type: string
          description: The title of the webset
          nullable: true
        searches:
          items:
            $ref: '#/components/schemas/WebsetSearch'
          description: The searches that have been performed on the webset.
          type: array
        imports:
          items:
            $ref: '#/components/schemas/Import'
          description: Imports that have been performed on the webset.
          type: array
        enrichments:
          items:
            $ref: '#/components/schemas/WebsetEnrichment'
          description: The Enrichments to apply to the Webset Items.
          type: array
        monitors:
          items:
            $ref: '#/components/schemas/Monitor'
          description: The Monitors for the Webset.
          type: array
        excludes:
          description: >-
            The Excludes sources (existing imports or websets) that apply to all
            operations within this Webset. Any results found within these
            sources will be omitted across all search and import operations.
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
            required:
              - source
              - id
            type: object
          type: array
        metadata:
          default: {}
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        dashboardUrl:
          format: uri
          description: The URL to view the webset in the Exa dashboard
          type: string
        createdAt:
          format: date-time
          description: The date and time the webset was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the webset was updated
          type: string
      required:
        - id
        - object
        - status
        - externalId
        - title
        - searches
        - imports
        - enrichments
        - monitors
        - dashboardUrl
        - createdAt
        - updatedAt
      type: object
    WebsetSearch:
      properties:
        id:
          description: The unique identifier for the search
          type: string
        object:
          const: webset_search
          default: webset_search
          type: string
        status:
          enum:
            - created
            - pending
            - running
            - completed
            - canceled
          description: The status of the search
          title: WebsetSearchStatus
          type: string
        websetId:
          description: The unique identifier for the Webset this search belongs to
          type: string
        query:
          minLength: 1
          maxLength: 5000
          description: The query used to create the search.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: >-
            The entity the search will return results for.


            When no entity is provided during creation, we will automatically
            select the best entity based on the query.
          nullable: true
        criteria:
          items:
            properties:
              description:
                minLength: 1
                maxLength: 1000
                description: The description of the criterion
                type: string
              successRate:
                minimum: 0
                maximum: 100
                description: >-
                  Value between 0 and 100 representing the percentage of results
                  that meet the criterion.
                type: number
            required:
              - description
              - successRate
            type: object
          description: >-
            The criteria the search will use to evaluate the results. If not
            provided, we will automatically generate them for you.
          type: array
        count:
          minimum: 1
          description: >-
            The number of results the search will attempt to find. The actual
            number of results may be less than this number depending on the
            search complexity.
          type: number
        maxPeoplePerCompany:
          minimum: 1
          type: integer
          description: >-
            The soft cap requested for matching people from the same current
            employer company, or null when no cap was requested.
          nullable: true
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          description: >-
            The behavior of the search when it is added to a Webset.


            - `override`: the search will replace the existing Items found in
            the Webset and evaluate them against the new criteria. Any Items
            that don't match the new criteria will be discarded.

            - `append`: the search will add the new Items found to the existing
            Webset. Any Items that don't match the new criteria will be
            discarded.
        exclude:
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
            required:
              - source
              - id
            type: object
          description: >-
            Sources (existing imports or websets) used to omit certain results
            to be found during the search.
          type: array
        scope:
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
              relationship:
                properties:
                  definition:
                    description: >-
                      What the relationship of the entities you hope to find is
                      relative to the entities contained in the provided source.
                    type: string
                  limit:
                    minimum: 1
                    maximum: 10
                    type: number
                required:
                  - definition
                  - limit
                type: object
            required:
              - source
              - id
            type: object
          description: >-
            The scope of the search. By default, there is no scope - thus
            searching the web.


            If provided during creation, the search will only be performed on
            the sources provided.
          type: array
        progress:
          properties:
            found:
              description: The number of results found so far
              type: number
            analyzed:
              description: The number of results analyzed so far
              type: number
            completion:
              minimum: 0
              maximum: 100
              description: The completion percentage of the search
              type: number
            timeLeft:
              type: number
              description: The estimated time remaining in seconds, null if unknown
              nullable: true
          required:
            - found
            - analyzed
            - completion
            - timeLeft
          description: The progress of the search
          type: object
        recall:
          properties:
            expected:
              properties:
                total:
                  description: The estimated total number of potential matches
                  type: number
                confidence:
                  enum:
                    - high
                    - medium
                    - low
                  description: The confidence in the estimate
                  type: string
                bounds:
                  properties:
                    min:
                      description: The minimum estimated total number of potential matches
                      type: number
                    max:
                      description: The maximum estimated total number of potential matches
                      type: number
                  required:
                    - min
                    - max
                  type: object
              required:
                - total
                - confidence
                - bounds
              type: object
            reasoning:
              description: The reasoning for the estimate
              type: string
          required:
            - expected
            - reasoning
          type: object
          description: >-
            Recall metrics for the search, null if not yet computed or
            requested.
          nullable: true
        metadata:
          default: {}
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        canceledAt:
          format: date-time
          type: string
          description: The date and time the search was canceled
          nullable: true
        canceledReason:
          $ref: '#/components/schemas/WebsetSearchCanceledReason'
          description: The reason the search was canceled
          nullable: true
        createdAt:
          format: date-time
          description: The date and time the search was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the search was updated
          type: string
      required:
        - id
        - object
        - status
        - websetId
        - query
        - entity
        - criteria
        - count
        - maxPeoplePerCompany
        - exclude
        - scope
        - progress
        - recall
        - canceledAt
        - canceledReason
        - createdAt
        - updatedAt
      type: object
    Import:
      properties:
        id:
          description: The unique identifier for the Import
          type: string
        object:
          enum:
            - import
          description: The type of object
          type: string
        status:
          enum:
            - pending
            - processing
            - completed
            - failed
            - canceled
          description: The status of the Import
          type: string
        format:
          enum:
            - csv
            - webset
          description: The format of the import.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: The type of entity the import contains.
          nullable: true
        title:
          description: The title of the import
          type: string
        count:
          description: The number of entities in the import
          type: number
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        failedReason:
          enum:
            - invalid_format
            - invalid_file_content
            - missing_identifier
          type: string
          description: The reason the import failed
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: When the import failed
          nullable: true
        failedMessage:
          type: string
          description: A human readable message of the import failure
          nullable: true
        createdAt:
          format: date-time
          description: When the import was created
          type: string
        updatedAt:
          format: date-time
          description: When the import was last updated
          type: string
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
      type: object
    WebsetEnrichment:
      properties:
        id:
          description: The unique identifier for the enrichment
          type: string
        object:
          const: webset_enrichment
          default: webset_enrichment
          type: string
        status:
          enum:
            - pending
            - canceled
            - completed
          description: The status of the enrichment
          title: WebsetEnrichmentStatus
          type: string
        websetId:
          description: The unique identifier for the Webset this enrichment belongs to.
          type: string
        title:
          type: string
          description: >-
            The title of the enrichment.


            This will be automatically generated based on the description and
            format.
          nullable: true
        description:
          description: >-
            The description of the enrichment task provided during the creation
            of the enrichment.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          description: The format of the enrichment response.
          nullable: true
        options:
          items:
            properties:
              label:
                description: The label of the option
                type: string
            required:
              - label
            type: object
          type: array
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
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: The date and time the enrichment was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the enrichment was updated
          type: string
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
      type: object
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
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
    WebsetSearchBehavior:
      enum:
        - override
        - append
      type: string
    WebsetSearchCanceledReason:
      enum:
        - webset_deleted
        - webset_canceled
        - out_of_credits
      type: string
    WebsetEnrichmentFormat:
      enum:
        - text
        - date
        - number
        - options
        - email
        - phone
        - url
      type: string
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