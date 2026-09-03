> 원본: https://exa.ai/docs/websets/api/websets/searches/create-a-search.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a Search

> Creates a new Search for the Webset.

The default behavior is to reuse the previous Search results and evaluate them against the new criteria.



## OpenAPI

````yaml post /v0/websets/{webset}/searches
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
  /v0/websets/{webset}/searches:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Searches
      summary: Create a Search
      description: >-
        Creates a new Search for the Webset.


        The default behavior is to reuse the previous Search results and
        evaluate them against the new criteria.
      operationId: websets-searches-create
      parameters:
        - name: webset
          required: true
          in: path
          description: The id of the Webset
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWebsetSearchParameters'
      responses:
        '200':
          description: Webset Search created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetSearch'
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
    CreateWebsetSearchParameters:
      type:
        - object
      properties:
        count:
          type:
            - number
          minimum: 1
          description: >-
            Number of Items the Search will attempt to find.


            The actual number of Items found may be less than this number
            depending on the query complexity.
        query:
          type:
            - string
          minLength: 1
          maxLength: 5000
          description: >-
            Natural language search query describing what you are looking for.


            Be specific and descriptive about your requirements,
            characteristics, and any constraints that help narrow down the
            results.


            Any URLs provided will be crawled and used as additional context for
            the search.
          examples:
            - >-
              Marketing agencies based in the US, that focus on consumer
              products. Get brands worked with and city
            - AI startups in Europe that raised Series A funding in 2024
            - SaaS companies with 50-200 employees in the fintech space
        entity:
          $ref: '#/components/schemas/Entity'
          description: >-
            Entity the search will return results for.


            It is not required to provide it, we automatically detect the entity
            from all the information provided in the query. Only use this when
            you need more fine control.
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
            detect the criteria from all the information provided in the query.
            Only use this when you need more fine control.
        maxPeoplePerCompany:
          type:
            - integer
          minimum: 1
          description: >-
            Optional soft cap for people searches. When set, the search will try
            to include at most this many matching people from the same current
            employer company.
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
            results. Any results found within these sources will be omitted to
            prevent finding them during search.
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
            Limit the search to specific sources (existing imports). Any results
            found within these sources matching the search criteria will be
            included in the Webset.
        recall:
          type:
            - boolean
          description: >-
            Whether to provide an estimate of how many total relevant results
            could exist for this search.

            Result of the analysis will be available in the `recall` field
            within the search request.
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          type:
            - string
          description: >-
            How this search interacts with existing items in the Webset:


            - **override**: Replace existing items and evaluate all items
            against new criteria

            - **append**: Add new items to existing ones, keeping items that
            match the new criteria
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          type:
            - object
          additionalProperties:
            type:
              - string
            maxLength: 1000
      required:
        - count
        - query
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