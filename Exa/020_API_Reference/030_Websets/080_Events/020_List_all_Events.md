> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List all Events

> List all events that have occurred in the system.

You can paginate through the results using the `cursor` parameter.



## OpenAPI

````yaml get /v0/events
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
  /v0/events:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Events
      summary: List all Events
      description: |-
        List all events that have occurred in the system.

        You can paginate through the results using the `cursor` parameter.
      operationId: events-list
      parameters:
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
        - name: types
          required: false
          in: query
          description: The types of events to filter by
          schema:
            type: array
            items:
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
        - name: createdBefore
          required: false
          in: query
          description: >-
            Filter events created before or at this timestamp (inclusive). Must
            be a valid ISO 8601 datetime string. All times are in UTC.
          schema:
            type: string
            format: date-time
        - name: createdAfter
          required: false
          in: query
          description: >-
            Filter events created after or at this timestamp (inclusive). Must
            be a valid ISO 8601 datetime string. All times are in UTC.
          schema:
            type: string
            format: date-time
      responses:
        '200':
          description: List of events
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListEventsResponse'
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
    ListEventsResponse:
      type:
        - object
      properties:
        data:
          type:
            - array
          items:
            $ref: '#/components/schemas/Event'
            discriminator:
              propertyName: type
          description: The list of events
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
    Event:
      discriminator:
        propertyName: type
      oneOf:
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.created
              default: webset.created
            data:
              $ref: '#/components/schemas/Webset'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetCreatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.deleted
              default: webset.deleted
            data:
              $ref: '#/components/schemas/Webset'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetDeletedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.idle
              default: webset.idle
            data:
              $ref: '#/components/schemas/Webset'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetIdleEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.paused
              default: webset.paused
            data:
              $ref: '#/components/schemas/Webset'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetPausedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.item.created
              default: webset.item.created
            data:
              $ref: '#/components/schemas/WebsetItem'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetItemCreatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.item.enriched
              default: webset.item.enriched
            data:
              $ref: '#/components/schemas/WebsetItem'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetItemEnrichedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.search.created
              default: webset.search.created
            data:
              $ref: '#/components/schemas/WebsetSearch'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetSearchCreatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.search.updated
              default: webset.search.updated
            data:
              $ref: '#/components/schemas/WebsetSearch'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetSearchUpdatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.search.canceled
              default: webset.search.canceled
            data:
              $ref: '#/components/schemas/WebsetSearch'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetSearchCanceledEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: webset.search.completed
              default: webset.search.completed
            data:
              $ref: '#/components/schemas/WebsetSearch'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: WebsetSearchCompletedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: import.created
              default: import.created
            data:
              $ref: '#/components/schemas/Import'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: ImportCreatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: import.completed
              default: import.completed
            data:
              $ref: '#/components/schemas/Import'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: ImportCompletedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: monitor.created
              default: monitor.created
            data:
              $ref: '#/components/schemas/Monitor'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: MonitorCreatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: monitor.updated
              default: monitor.updated
            data:
              $ref: '#/components/schemas/Monitor'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: MonitorUpdatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: monitor.deleted
              default: monitor.deleted
            data:
              $ref: '#/components/schemas/Monitor'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: MonitorDeletedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: monitor.run.created
              default: monitor.run.created
            data:
              $ref: '#/components/schemas/MonitorRun'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: MonitorRunCreatedEvent
        - type:
            - object
          properties:
            id:
              type:
                - string
              description: The unique identifier for the event
            object:
              type: string
              const: event
              default: event
            type:
              type: string
              const: monitor.run.completed
              default: monitor.run.completed
            data:
              $ref: '#/components/schemas/MonitorRun'
              type:
                - object
            createdAt:
              type:
                - string
              format: date-time
              description: The date and time the event was created
          required:
            - id
            - object
            - type
            - data
            - createdAt
          title: MonitorRunCompletedEvent
      title: Event
    Webset:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the webset
        object:
          type: string
          const: webset
          default: webset
        status:
          type:
            - string
          enum:
            - idle
            - pending
            - running
            - paused
          description: The status of the webset
          title: WebsetStatus
        externalId:
          type: string
          description: The external identifier for the webset
          nullable: true
        title:
          type: string
          description: The title of the webset
          nullable: true
        searches:
          type:
            - array
          items:
            $ref: '#/components/schemas/WebsetSearch'
            type:
              - object
          description: The searches that have been performed on the webset.
        imports:
          type:
            - array
          items:
            $ref: '#/components/schemas/Import'
            type:
              - object
          description: Imports that have been performed on the webset.
        enrichments:
          type:
            - array
          items:
            $ref: '#/components/schemas/WebsetEnrichment'
            type:
              - object
          description: The Enrichments to apply to the Webset Items.
        monitors:
          type:
            - array
          items:
            $ref: '#/components/schemas/Monitor'
            type:
              - object
          description: The Monitors for the Webset.
        excludes:
          type:
            - array
          items:
            type:
              - object
            properties:
              source:
                type:
                  - string
                enum:
                  - import
                  - webset
              id:
                type:
                  - string
            required:
              - source
              - id
          description: >-
            The Excludes sources (existing imports or websets) that apply to all
            operations within this Webset. Any results found within these
            sources will be omitted across all search and import operations.
        metadata:
          default: {}
          description: Set of key-value pairs you want to associate with this object.
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
        dashboardUrl:
          type:
            - string
          format: uri
          description: The URL to view the webset in the Exa dashboard
        createdAt:
          type:
            - string
          format: date-time
          description: The date and time the webset was created
        updatedAt:
          type:
            - string
          format: date-time
          description: The date and time the webset was updated
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
    WebsetItem:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the Webset Item
        object:
          type: string
          const: webset_item
          default: webset_item
        source:
          type:
            - string
          enum:
            - search
            - import
          description: The source of the Item
        sourceId:
          type:
            - string
          description: The unique identifier for the source
        sourceEntityId:
          type:
            - string
          description: >-
            The original identifier used to resolve this item (e.g., email,
            name, or URL). Only relevant when the source is import.
        scopeId:
          type:
            - string
          description: >-
            The import that sourced this item, when the item came from a scoped
            search with evaluate enabled on the import.
        websetId:
          type:
            - string
          description: The unique identifier for the Webset this Item belongs to.
        properties:
          oneOf:
            - $ref: '#/components/schemas/WebsetItemPersonProperties'
              type:
                - object
              title: Person
            - $ref: '#/components/schemas/WebsetItemCompanyProperties'
              type:
                - object
              title: Company
            - $ref: '#/components/schemas/WebsetItemArticleProperties'
              type:
                - object
              title: Article
            - $ref: '#/components/schemas/WebsetItemResearchPaperProperties'
              type:
                - object
              title: Research Paper
            - $ref: '#/components/schemas/WebsetItemCustomProperties'
              type:
                - object
              title: Custom
          description: The properties of the Item
        evaluations:
          type:
            - array
          items:
            $ref: '#/components/schemas/WebsetItemEvaluation'
            type:
              - object
          description: The criteria evaluations of the item
        enrichments:
          type: array
          items:
            $ref: '#/components/schemas/EnrichmentResult'
            type:
              - object
          description: The enrichments results of the Webset item
          nullable: true
        createdAt:
          type:
            - string
          format: date-time
          description: The date and time the item was created
        updatedAt:
          type:
            - string
          format: date-time
          description: The date and time the item was last updated
      required:
        - id
        - object
        - source
        - sourceId
        - websetId
        - properties
        - evaluations
        - enrichments
        - createdAt
        - updatedAt
    WebsetSearch:
      type:
        - object
      properties:
        id:
          type:
            - string
          description: The unique identifier for the search
        object:
          type: string
          const: webset_search
          default: webset_search
        status:
          type:
            - string
          enum:
            - created
            - pending
            - running
            - completed
            - canceled
          description: The status of the search
          title: WebsetSearchStatus
        websetId:
          type:
            - string
          description: The unique identifier for the Webset this search belongs to
        query:
          description: The query used to create the search.
          type:
            - string
          minLength: 1
          maxLength: 5000
        entity:
          $ref: '#/components/schemas/Entity'
          description: >-
            The entity the search will return results for.


            When no entity is provided during creation, we will automatically
            select the best entity based on the query.
          nullable: true
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
                minLength: 1
                maxLength: 1000
                description: The description of the criterion
              successRate:
                type:
                  - number
                minimum: 0
                maximum: 100
                description: >-
                  Value between 0 and 100 representing the percentage of results
                  that meet the criterion.
            required:
              - description
              - successRate
          description: >-
            The criteria the search will use to evaluate the results. If not
            provided, we will automatically generate them for you.
        count:
          type:
            - number
          minimum: 1
          description: >-
            The number of results the search will attempt to find. The actual
            number of results may be less than this number depending on the
            search complexity.
        maxPeoplePerCompany:
          type: integer
          minimum: 1
          description: >-
            The soft cap requested for matching people from the same current
            employer company, or null when no cap was requested.
          nullable: true
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          type:
            - string
          description: >-
            The behavior of the search when it is added to a Webset.


            - `override`: the search will replace the existing Items found in
            the Webset and evaluate them against the new criteria. Any Items
            that don't match the new criteria will be discarded.

            - `append`: the search will add the new Items found to the existing
            Webset. Any Items that don't match the new criteria will be
            discarded.
        exclude:
          type:
            - array
          items:
            type:
              - object
            properties:
              source:
                type:
                  - string
                enum:
                  - import
                  - webset
              id:
                type:
                  - string
            required:
              - source
              - id
          description: >-
            Sources (existing imports or websets) used to omit certain results
            to be found during the search.
        scope:
          type:
            - array
          items:
            type:
              - object
            properties:
              source:
                type:
                  - string
                enum:
                  - import
                  - webset
              id:
                type:
                  - string
              relationship:
                type:
                  - object
                properties:
                  definition:
                    type:
                      - string
                    description: >-
                      What the relationship of the entities you hope to find is
                      relative to the entities contained in the provided source.
                  limit:
                    type:
                      - number
                    minimum: 1
                    maximum: 10
                required:
                  - definition
                  - limit
            required:
              - source
              - id
          description: >-
            The scope of the search. By default, there is no scope - thus
            searching the web.


            If provided during creation, the search will only be performed on
            the sources provided.
        progress:
          type:
            - object
          properties:
            found:
              type:
                - number
              description: The number of results found so far
            analyzed:
              type:
                - number
              description: The number of results analyzed so far
            completion:
              type:
                - number
              minimum: 0
              maximum: 100
              description: The completion percentage of the search
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
        recall:
          type: object
          properties:
            expected:
              type:
                - object
              properties:
                total:
                  type:
                    - number
                  description: The estimated total number of potential matches
                confidence:
                  type:
                    - string
                  enum:
                    - high
                    - medium
                    - low
                  description: The confidence in the estimate
                bounds:
                  type:
                    - object
                  properties:
                    min:
                      type:
                        - number
                      description: The minimum estimated total number of potential matches
                    max:
                      type:
                        - number
                      description: The maximum estimated total number of potential matches
                  required:
                    - min
                    - max
              required:
                - total
                - confidence
                - bounds
            reasoning:
              type:
                - string
              description: The reasoning for the estimate
          required:
            - expected
            - reasoning
          description: >-
            Recall metrics for the search, null if not yet computed or
            requested.
          nullable: true
        metadata:
          default: {}
          description: Set of key-value pairs you want to associate with this object.
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
        canceledAt:
          type: string
          format: date-time
          description: The date and time the search was canceled
          nullable: true
        canceledReason:
          $ref: '#/components/schemas/WebsetSearchCanceledReason'
          type: string
          description: The reason the search was canceled
          nullable: true
        createdAt:
          type:
            - string
          format: date-time
          description: The date and time the search was created
        updatedAt:
          type:
            - string
          format: date-time
          description: The date and time the search was updated
      required:
        - id
        - object
        - websetId
        - status
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
    Import:
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
    WebsetItemPersonProperties:
      type:
        - object
      properties:
        type:
          type: string
          const: person
          default: person
        url:
          type:
            - string
          format: uri
          description: The URL of the person profile
        description:
          type:
            - string
          description: Short description of the relevance of the person
        person:
          type:
            - object
          properties:
            name:
              type:
                - string
              description: The name of the person
            location:
              type: string
              description: The location of the person
              nullable: true
            position:
              type: string
              description: The current work position of the person
              nullable: true
            company:
              type: object
              properties:
                name:
                  type:
                    - string
                  description: The name of the company
                location:
                  type: string
                  description: The location the person is working at the company
                  nullable: true
              required:
                - name
                - location
              title: WebsetItemPersonCompanyPropertiesFields
              nullable: true
            pictureUrl:
              type: string
              format: uri
              description: The image URL of the person
              nullable: true
            workHistory:
              type:
                - array
              items:
                type:
                  - object
                properties:
                  title:
                    type: string
                    description: Job title or position
                    nullable: true
                  location:
                    type: string
                    description: Work location
                    nullable: true
                  dates:
                    type: object
                    properties:
                      from:
                        type: string
                        description: Start date
                        nullable: true
                      to:
                        type: string
                        description: End date
                        nullable: true
                    required:
                      - from
                      - to
                    title: WebsetItemPersonDateRange
                    description: Employment dates
                    nullable: true
                  company:
                    type: object
                    properties:
                      id:
                        type: string
                        description: Entity ID of the company
                        nullable: true
                      name:
                        type: string
                        description: Company name
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: LinkedIn URL of the company
                        nullable: true
                    required:
                      - id
                      - name
                      - linkedinUrl
                    title: WebsetItemPersonWorkHistoryCompanyRef
                    nullable: true
                required:
                  - title
                  - location
                  - dates
                  - company
                title: WebsetItemPersonWorkHistoryEntry
              description: The work history of the person
            educationHistory:
              type:
                - array
              items:
                type:
                  - object
                properties:
                  degree:
                    type: string
                    description: Degree obtained
                    nullable: true
                  dates:
                    type: object
                    properties:
                      from:
                        type: string
                        description: Start date
                        nullable: true
                      to:
                        type: string
                        description: End date
                        nullable: true
                    required:
                      - from
                      - to
                    title: WebsetItemPersonDateRange
                    description: Education dates
                    nullable: true
                  institution:
                    type: object
                    properties:
                      id:
                        type: string
                        description: Entity ID of the institution
                        nullable: true
                      name:
                        type: string
                        description: Institution name
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: LinkedIn URL of the institution
                        nullable: true
                    required:
                      - id
                      - name
                      - linkedinUrl
                    title: WebsetItemPersonEducationInstitutionRef
                    nullable: true
                required:
                  - degree
                  - dates
                  - institution
                title: WebsetItemPersonEducationHistoryEntry
              description: The education history of the person
          required:
            - name
            - location
            - position
            - company
            - pictureUrl
            - workHistory
            - educationHistory
          title: WebsetItemPersonPropertiesFields
      required:
        - type
        - url
        - description
        - person
    WebsetItemCompanyProperties:
      type:
        - object
      properties:
        type:
          type: string
          const: company
          default: company
        url:
          type:
            - string
          format: uri
          description: The URL of the company website
        description:
          type:
            - string
          description: Short description of the relevance of the company
        content:
          type: string
          description: The text content of the company website
          nullable: true
        company:
          type:
            - object
          properties:
            name:
              type:
                - string
              description: The name of the company
            location:
              type: string
              description: The main location of the company
              nullable: true
            employees:
              type: integer
              description: The number of employees of the company
              nullable: true
            industry:
              type: string
              description: The industry of the company
              nullable: true
            about:
              type: string
              description: A short description of the company
              nullable: true
            logoUrl:
              type: string
              format: uri
              description: The logo URL of the company
              nullable: true
            foundedYear:
              type: number
              description: The year the company was founded
              nullable: true
            headquarters:
              type: object
              properties:
                address:
                  type: string
                  description: The street address of the headquarters
                  nullable: true
                city:
                  type: string
                  description: The city of the headquarters
                  nullable: true
                state:
                  type: string
                  description: The state or region of the headquarters
                  nullable: true
                postalCode:
                  type: string
                  description: The postal code of the headquarters
                  nullable: true
                country:
                  type: string
                  description: The country of the headquarters
                  nullable: true
                countryCode:
                  type: string
                  description: The ISO country code of the headquarters
                  nullable: true
              required:
                - address
                - city
                - state
                - postalCode
                - country
                - countryCode
              title: WebsetItemCompanyHeadquarters
              description: The structured headquarters address of the company
              nullable: true
            financials:
              type: object
              properties:
                revenueAnnual:
                  type: number
                  description: The annual revenue of the company (USD)
                  nullable: true
                fundingTotal:
                  type: number
                  description: The total funding raised by the company (USD)
                  nullable: true
                fundingLatestRound:
                  type: object
                  properties:
                    name:
                      type: string
                      description: The name of the funding round (e.g. Series A)
                      nullable: true
                    date:
                      type: string
                      description: The date of the funding round
                      nullable: true
                    amount:
                      type: number
                      description: The amount raised in the funding round (USD)
                      nullable: true
                  required:
                    - name
                    - date
                    - amount
                  title: WebsetItemCompanyFundingRound
                  description: The latest funding round
                  nullable: true
              required:
                - revenueAnnual
                - fundingTotal
                - fundingLatestRound
              title: WebsetItemCompanyFinancials
              description: Financial information about the company
              nullable: true
            webTraffic:
              type: object
              properties:
                visitsMonthly:
                  type: number
                  description: The estimated monthly website visits
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: The estimated monthly unique visitors
                  nullable: true
              required:
                - visitsMonthly
                - uniqueVisitors
              title: WebsetItemCompanyWebTraffic
              description: Web traffic metrics for the company
              nullable: true
          required:
            - name
            - location
            - employees
            - industry
            - about
            - logoUrl
            - foundedYear
            - headquarters
            - financials
            - webTraffic
          title: WebsetItemCompanyPropertiesFields
      required:
        - type
        - url
        - description
        - content
        - company
    WebsetItemArticleProperties:
      type:
        - object
      properties:
        type:
          type: string
          const: article
          default: article
        url:
          type:
            - string
          format: uri
          description: The URL of the article
        description:
          type:
            - string
          description: Short description of the relevance of the article
        content:
          type: string
          description: The text content for the article
          nullable: true
        article:
          type:
            - object
          properties:
            title:
              type: string
              description: The title of the article
              nullable: true
            author:
              type: string
              description: The author(s) of the article
              nullable: true
            publishedAt:
              type: string
              description: The date and time the article was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemArticlePropertiesFields
      required:
        - type
        - url
        - description
        - content
        - article
    WebsetItemResearchPaperProperties:
      type:
        - object
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
        url:
          type:
            - string
          format: uri
          description: The URL of the research paper
        description:
          type:
            - string
          description: Short description of the relevance of the research paper
        content:
          type: string
          description: The text content of the research paper
          nullable: true
        researchPaper:
          type:
            - object
          properties:
            title:
              type: string
              description: The title of the research paper
              nullable: true
            author:
              type: string
              description: The author(s) of the research paper
              nullable: true
            publishedAt:
              type: string
              description: The date and time the research paper was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemResearchPaperPropertiesFields
      required:
        - type
        - url
        - description
        - content
        - researchPaper
    WebsetItemCustomProperties:
      type:
        - object
      properties:
        type:
          type: string
          const: custom
          default: custom
        url:
          type:
            - string
          format: uri
          description: The URL of the Item
        description:
          type:
            - string
          description: Short description of the Item
        content:
          type: string
          description: The text content of the Item
          nullable: true
        custom:
          type:
            - object
          properties:
            title:
              type: string
              description: The title of the website
              nullable: true
            author:
              type: string
              description: The author(s) of the website
              nullable: true
            publishedAt:
              type: string
              description: The date and time the website was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemCustomPropertiesFields
      required:
        - type
        - url
        - description
        - content
        - custom
    WebsetItemEvaluation:
      type:
        - object
      properties:
        criterion:
          type:
            - string
          description: The description of the criterion
        reasoning:
          type:
            - string
          description: The reasoning for the result of the evaluation
        satisfied:
          type:
            - string
          enum:
            - 'yes'
            - 'no'
            - unclear
          description: The satisfaction of the criterion
        references:
          default: []
          type:
            - array
          items:
            type:
              - object
            properties:
              title:
                type: string
                description: The title of the reference
                nullable: true
              snippet:
                type: string
                description: The relevant snippet of the reference content
                nullable: true
              url:
                type:
                  - string
                format: uri
                description: The URL of the reference
            required:
              - title
              - snippet
              - url
          description: The references used to generate the result.
      required:
        - criterion
        - reasoning
        - satisfied
    EnrichmentResult:
      type:
        - object
      properties:
        object:
          type: string
          const: enrichment_result
          default: enrichment_result
        status:
          type:
            - string
          enum:
            - pending
            - completed
            - canceled
          description: The status of the enrichment result.
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          type:
            - string
        result:
          type: array
          items:
            type:
              - string
          description: The result of the enrichment.
          nullable: true
        reasoning:
          type: string
          description: The reasoning for the result when an Agent is used.
          nullable: true
        references:
          type:
            - array
          items:
            type:
              - object
            properties:
              title:
                type: string
                description: The title of the reference
                nullable: true
              snippet:
                type: string
                description: The relevant snippet of the reference content
                nullable: true
              url:
                type:
                  - string
                format: uri
                description: The URL of the reference
            required:
              - title
              - snippet
              - url
          description: The references used to generate the result.
        enrichmentId:
          type:
            - string
          description: The id of the Enrichment that generated the result
      required:
        - object
        - status
        - format
        - result
        - reasoning
        - references
        - enrichmentId
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
    WebsetSearchBehavior:
      type: string
      enum:
        - override
        - append
    WebsetSearchCanceledReason:
      type: string
      enum:
        - webset_deleted
        - webset_canceled
        - out_of_credits
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