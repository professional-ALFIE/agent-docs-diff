> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Generate Keys

> Generate one or more API keys with custom configuration.

<Note>
  **Who can use this feature?**

  This feature is available on the Enterprise plan. [Talk to an expert](https://tavily.com/enterprise) to learn more.
</Note>


## OpenAPI

````yaml POST /generate-keys
openapi: 3.0.3
info:
  title: Tavily Enterprise API Key Generator
  description: >-
    Generate, manage, and deactivate Tavily API keys programmatically with
    custom configurations.
  version: 1.0.0
servers:
  - url: https://api-key-generator.tavily.com/
security: []
paths:
  /generate-keys:
    post:
      summary: Generate API Keys
      description: Generate one or more API keys with custom configuration.
      requestBody:
        description: Parameters for generating API keys.
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - permission_level
              example:
                permission_level: user
                name: projectA
                scope:
                  - api:generate_keys
                key_type: development
                key_limit: 200
                ttl_hours: 10
                count: 2
              properties:
                permission_level:
                  type: string
                  description: The permission level for the key.
                  enum:
                    - admin
                    - user
                name:
                  type: string
                  description: >-
                    The name of the key(s). Auto-generated in the format
                    `{key_type}-{expiration}-#{index}`
                scope:
                  type: array
                  items:
                    type: string
                    enum:
                      - api:generate_keys
                  description: >-
                    Permission scopes for the key. Only applicable when
                    `permission_level` is `"user"`.
                key_type:
                  type: string
                  description: The type of key.
                  default: development
                  enum:
                    - development
                    - production
                key_limit:
                  type: integer
                  description: The number of credits for the generated keys.
                  default: 200
                  minimum: 1
                  maximum: 100000
                ttl_hours:
                  type: integer
                  description: Number of hours before the keys become deactivated.
                  default: 10
                  minimum: 1
                  maximum: 8760
                count:
                  type: integer
                  description: The total number of keys to generate.
                  default: 1
                  minimum: 1
                  maximum: 200
      responses:
        '200':
          description: Keys generated successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  keys:
                    type: array
                    items:
                      type: string
                    description: The generated API keys.
                    example:
                      - tvly-dev-MI9p6...
                      - tvly-dev-f7Wrr...
                  expires_at:
                    type: string
                    description: The expiration timestamp for the keys.
                    example: '2026-02-25T01:14:45Z'
                  created:
                    type: string
                    description: The creation timestamp.
                    example: '2026-02-24T15:14:45'
                  message:
                    type: string
                    description: A summary message about the generated keys.
                    example: >-
                      2 keys generated successfully with 200 credits each. These
                      keys will be automatically deactivated after 10 hours
                  request_id:
                    type: string
                    description: >-
                      Unique identifier for this generation request. Use this to
                      bulk-deactivate the keys later.
                    example: 949297ca-d123-4267-8041-45398a0b847d
      security:
        - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: >-
        Bearer authentication header in the form Bearer <token>, where <token>
        is your Tavily API key (e.g., Bearer tvly-YOUR_API_KEY).

````