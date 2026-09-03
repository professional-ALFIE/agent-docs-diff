> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete an Item

> Deletes an Item from the Webset.

This will cancel any enrichment process for it.



## OpenAPI

````yaml delete /v0/websets/{webset}/items/{id}
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
  /v0/websets/{webset}/items/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Items
      summary: Delete an Item
      description: |-
        Deletes an Item from the Webset.

        This will cancel any enrichment process for it.
      operationId: websets-items-delete
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
          description: The id of the Webset item
          schema:
            type: string
      responses:
        '200':
          description: Webset Item deleted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetItem'
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