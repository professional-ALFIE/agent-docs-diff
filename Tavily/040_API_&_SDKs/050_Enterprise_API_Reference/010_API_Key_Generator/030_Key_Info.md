> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Key Info

> Get information about an API key. The key to query is specified in the `Authorization` header.

<Note>
  **Who can use this feature?**

  This feature is available on the Enterprise plan. [Talk to an expert](https://tavily.com/enterprise) to learn more.
</Note>


## OpenAPI

````yaml GET /key-info
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
  /key-info:
    get:
      summary: Get Key Info
      description: >-
        Get information about an API key. The key to query is specified in the
        `Authorization` header.
      responses:
        '200':
          description: Key information retrieved successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  name:
                    type: string
                    description: The name of the API key.
                    example: test
                  created:
                    type: string
                    description: The creation timestamp.
                    example: '2026-02-23T21:48:01Z'
                  expires_at:
                    type: string
                    description: >-
                      The expiration timestamp, or `"never"` if the key does not
                      expire.
                    example: never
                  key_type:
                    type: string
                    description: The type of key.
                    enum:
                      - development
                      - production
                    example: development
                  status:
                    type: string
                    description: The current status of the key.
                    enum:
                      - active
                      - deactivated
                    example: active
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