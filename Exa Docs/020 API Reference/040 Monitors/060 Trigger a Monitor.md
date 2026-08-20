> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Trigger a Monitor

> Triggers a run immediately, regardless of the schedule. Works for monitors with status `active` or `paused`.



## OpenAPI

````yaml post /monitors/{id}/trigger
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
  /monitors/{id}/trigger:
    post:
      tags:
        - Monitors
      summary: Trigger a Monitor
      description: >-
        Triggers a run immediately, regardless of the schedule. Works for
        monitors with status `active` or `paused`.
      operationId: triggerMonitor
      parameters:
        - in: path
          name: id
          schema:
            type: string
            description: The monitor ID
          required: true
          description: The monitor ID
      responses:
        '200':
          description: Whether the monitor was triggered
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TriggerSearchMonitorResponse'
components:
  schemas:
    TriggerSearchMonitorResponse:
      type: object
      properties:
        triggered:
          type: boolean
          description: Whether the monitor was successfully triggered
      required:
        - triggered
      additionalProperties: false
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