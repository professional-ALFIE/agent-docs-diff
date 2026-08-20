> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a Webset

> Creates a new Webset with optional search, import, and enrichment configurations. The Webset will automatically begin processing once created.

You can specify an `externalId` to reference the Webset with your own identifiers for easier integration.



## OpenAPI

````yaml post /v0/websets
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
  /v0/websets:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Websets
      summary: Create a Webset
      description: >-
        Creates a new Webset with optional search, import, and enrichment
        configurations. The Webset will automatically begin processing once
        created.


        You can specify an `externalId` to reference the Webset with your own
        identifiers for easier integration.
      operationId: websets-create
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWebsetParameters'
      responses:
        '201':
          description: Webset created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webset'
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
        '409':
          description: Webset with this externalId already exists
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
          source: |-
            // npm install exa-js
            import Exa from 'exa-js';
            const exa = new Exa('YOUR_EXA_API_KEY');

            const webset = await exa.websets.create({
              search: {
                query: "Tech companies in San Francisco",
                count: 10
              }
            });

            console.log(`Created webset: ${webset.id}`);
        - lang: python
          label: Python
          source: |-
            # pip install exa-py
            from exa_py import Exa
            exa = Exa(api_key='YOUR_EXA_API_KEY')

            webset = exa.websets.create(params={
                'search': {
                    'query': 'Tech companies in San Francisco',
                    'count': 10
                }
            })

            print(f'Created webset: {webset.id}')
        - lang: javascript
          label: Filter within CSV Import
          source: |-
            // Filter a CSV import by criteria (no top-level import needed)
            import Exa from 'exa-js';
            const exa = new Exa('YOUR_EXA_API_KEY');

            const webset = await exa.websets.create({
              search: {
                query: "people who changed jobs",
                criteria: ["changed jobs in the last 6 months"],
                count: 10,
                scope: [{
                  source: "import",
                  id: "import_abc123"  // Your existing import ID
                }]
              }
            });

            console.log(`Filtered webset: ${webset.id}`);
        - lang: python
          label: Filter within CSV Import
          source: |-
            from exa_py import Exa
            exa = Exa(api_key='YOUR_EXA_API_KEY')

            webset = exa.websets.create(params={
                'search': {
                    'query': 'people who changed jobs',
                    'criteria': ['changed jobs in the last 6 months'],
                    'count': 10,
                    'scope': [{
                        'source': 'import',
                        'id': 'import_abc123'  # Your existing import ID
                    }]
                }
            })

            print(f'Filtered webset: {webset.id}')
        - lang: javascript
          label: Hop Search (Graph Traversal)
          source: |-
            // Find related entities (e.g., companies -> investors)
            import Exa from 'exa-js';
            const exa = new Exa('YOUR_EXA_API_KEY');

            const webset = await exa.websets.create({
              search: {
                query: "investors",
                scope: [{
                  source: "webset",
                  id: "webset_companies",
                  relationship: {
                    definition: "investors of",
                    limit: 3  // Find up to 3 investors per company
                  }
                }]
              }
            });

            console.log(`Hop search webset: ${webset.id}`);
        - lang: python
          label: Hop Search (Graph Traversal)
          source: |-
            from exa_py import Exa
            exa = Exa(api_key='YOUR_EXA_API_KEY')

            webset = exa.websets.create(params={
                'search': {
                    'query': 'investors',
                    'scope': [{
                        'source': 'webset',
                        'id': 'webset_companies',
                        'relationship': {
                            'definition': 'investors of',
                            'limit': 3  # Find up to 3 investors per company
                        }
                    }]
                }
            })

            print(f'Hop search webset: {webset.id}')
components:
  schemas:
    CreateWebsetParameters:
      type:
        - object
      properties:
        title:
          type: string
          minLength: 1
          description: >-
            Optional name that appears anywhere the Webset is displayed. Leave
            empty to have Exa generate one automatically.
          examples:
            - Leading climate tech startups
          nullable: true
        search:
          type:
            - object
          properties:
            query:
              type:
                - string
              minLength: 1
              maxLength: 5000
              description: >-
                Natural language search query describing what you are looking
                for.


                Be specific and descriptive about your requirements,
                characteristics, and any constraints that help narrow down the
                results.


                Any URLs provided will be crawled and used as additional context
                for the search.
              examples:
                - >-
                  Marketing agencies based in the US, that focus on consumer
                  products.
                - AI startups in Europe that raised Series A funding in 2024
                - SaaS companies with 50-200 employees in the fintech space
            count:
              default: 10
              type:
                - number
              minimum: 1
              description: >-
                Number of Items the Webset will attempt to find.


                The actual number of Items found may be less than this number
                depending on the search complexity.
            entity:
              $ref: '#/components/schemas/Entity'
              description: >-
                Entity the Webset will return results for.


                It is not required to provide it, we automatically detect the
                entity from all the information provided in the query. Only use
                this when you need more fine control.
            criteria:
              type:
                - array
              items:
                $ref: '#/components/schemas/CreateCriterionParameters'
                type:
                  - object
                title: CreateCriterionParameters
              minItems: 1
              maxItems: 5
              description: >-
                Criteria every item is evaluated against.


                It's not required to provide your own criteria, we automatically
                detect the criteria from all the information provided in the
                query. Only use this when you need more fine control.
            maxPeoplePerCompany:
              type:
                - integer
              minimum: 1
              description: >-
                Optional soft cap for people searches. When set, the search will
                try to include at most this many matching people from the same
                current employer company.
            recall:
              type:
                - boolean
              description: >-
                Whether to provide an estimate of how many total relevant
                results could exist for this search.

                Result of the analysis will be available in the `recall` field
                within the search request.
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
                    minLength: 1
                    description: The ID of the source to exclude.
                required:
                  - source
                  - id
              description: >-
                Sources (existing imports or websets) to exclude from search
                results. Any results found within these sources will be omitted
                to prevent finding them during search.
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
                    minLength: 1
                    description: The ID of the source to search.
                  relationship:
                    type:
                      - object
                    properties:
                      definition:
                        type:
                          - string
                        description: >-
                          What the relationship of the entities you hope to find
                          is relative to the entities contained in the provided
                          source.
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
                Limit the search to specific sources (existing imports or
                websets). Any results found within these sources matching the
                search criteria will be included in the Webset.
          required:
            - query
          description: Create initial search for the Webset.
        import:
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
                minLength: 1
                description: The ID of the source to import.
              evaluate:
                type:
                  - boolean
                description: >-
                  When true, items from this import will be evaluated against
                  the search criteria. Requires a search to be provided.
            required:
              - source
              - id
          description: Import data from existing Websets and Imports into this Webset.
        enrichments:
          type:
            - array
          items:
            $ref: '#/components/schemas/CreateEnrichmentParameters'
            type:
              - object
            title: CreateEnrichmentParameters
          description: >-
            Add enrichments to extract additional data from found items.


            Enrichments automatically search for and extract specific
            information (like contact details, funding data, employee counts,
            etc.) from each item added to your Webset.
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
                minLength: 1
                description: The ID of the source to exclude.
            required:
              - source
              - id
          description: >-
            Global exclusion sources (existing imports or websets) that apply to
            all operations within this Webset. Any results found within these
            sources will be omitted across all search and import operations.
        externalId:
          type:
            - string
          maxLength: 300
          description: >-
            The external identifier for the webset.


            You can use this to reference the Webset by your own internal
            identifiers.
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
      examples:
        - search:
            query: >-
              Marketing agencies based in the US, that focus on consumer
              products.
            count: 10
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
    CreateCriterionParameters:
      type:
        - object
      properties:
        description:
          type:
            - string
          minLength: 1
          maxLength: 1000
          description: The description of the criterion
      required:
        - description
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