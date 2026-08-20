> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List Monitor Runs

> Lists all runs for the Monitor.



## OpenAPI

````yaml get /v0/monitors/{monitor}/runs
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
  /v0/monitors/{monitor}/runs:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors Runs
      summary: List Monitor Runs
      description: Lists all runs for the Monitor.
      operationId: monitors-runs-list
      parameters:
        - name: monitor
          required: true
          in: path
          description: The id of the Monitor to list runs for
          schema:
            type: string
      responses:
        '200':
          description: List of monitor runs
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListMonitorRunsResponse'
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
            import Exa from "exa-js";
            const exa = new Exa("YOUR_EXA_API_KEY");

            const runs = await exa.websets.monitors.runs.list("monitor_id");

            console.log(`Found ${runs.data.length} monitor runs`);
            runs.data.forEach((run) => {
              console.log(`- ${run.id}: ${run.status}`);
            });
        - lang: python
          label: Python
          source: |-
            # pip install exa-py
            from exa_py import Exa

            exa = Exa("YOUR_EXA_API_KEY")

            runs = exa.websets.monitors.runs.list("monitor_id")

            print(f"Found {len(runs.data)} monitor runs")
            for run in runs.data:
                print(f"- {run.id}: {run.status}")
components:
  schemas:
    ListMonitorRunsResponse:
      type:
        - object
      properties:
        data:
          type:
            - array
          items:
            $ref: '#/components/schemas/MonitorRun'
            type:
              - object
          description: The list of monitor runs
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