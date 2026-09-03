> 원본: https://docs.tavily.com/documentation/partnerships/amazon.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Amazon Bedrock AgentCore

> Integrate Tavily MCP Server with Amazon Bedrock AgentCore for scalable AI agent deployment on AWS.

## Overview

The [Tavily MCP Server](https://aws.amazon.com/marketplace/pp/prodview-twjga5bwmoszq) is available on the AWS Marketplace and can be deployed as a managed MCP server on [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/), enabling developers to securely run and scale AI agents with access to Tavily's real-time web search, content extraction, crawling, and site mapping capabilities.

## Prerequisites

* [AWS account](https://aws.amazon.com/)
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and [configured](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html)
* [Tavily API Key](https://app.tavily.com/home) for authenticating the Tavily MCP Server
* An IAM role with a trust policy allowing `bedrock-agentcore.amazonaws.com` to assume the role

## Setup

<Steps>
  <Step title="Subscribe on the AWS Marketplace">
    Visit the [Tavily MCP Server listing](https://aws.amazon.com/marketplace/pp/prodview-twjga5bwmoszq)
    on the AWS Marketplace. Click **View purchase options**, scroll down, and
    select **Subscribe**. Once your request has been processed, click **Launch
    your software** in the pop-up that appears.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/5NP947bTr_pJ-R0f/images/partnerships/aws/tavilymcppurchase.gif?s=af9c9d2acf4c3a844b038fe441edee68" alt="Tavily MCP Server listing on the AWS Marketplace" width="2214" height="1302" data-path="images/partnerships/aws/tavilymcppurchase.gif" />
    </Frame>
  </Step>

  <Step title="Select Amazon Bedrock AgentCore">
    On the launch page, select **Amazon Bedrock AgentCore console** as the
    Launch Method.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/5NP947bTr_pJ-R0f/images/partnerships/aws/launchpage.gif?s=5502a869711cfbaa9d8d445669f44157" alt="Select Amazon Bedrock AgentCore as the deployment target" width="2214" height="1302" data-path="images/partnerships/aws/launchpage.gif" />
    </Frame>
  </Step>

  <Step title="Create an IAM Role">
    Create an IAM role that allows Bedrock AgentCore to assume it. When
    creating the role, select **Custom trust policy** and replace the default
    JSON with the following:

    ```json theme={null}
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "Statement1",
          "Effect": "Allow",
          "Principal": {
            "Service": "bedrock-agentcore.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }
    ```

    Make sure to run `aws configure` in your terminal and add the access keys
    associated with the account where you created the IAM role.
  </Step>

  <Step title="Deploy the Agent Runtime">
    From AWS CloudShell or a Linux/macOS terminal, run the following command.
    Replace the placeholders with your own values:

    * `<AGENT_NAME>`: A name of your choice
    * `<AGENT_DESCRIPTION>`: A description of your choice
    * `<AGENT_ROLE_ARN>`: The ARN of the IAM role created in the previous step
    * `<your-tavily-api-key>`: Your [Tavily API key](https://app.tavily.com/home)

    ```bash theme={null}
    aws bedrock-agentcore-control create-agent-runtime \
      --region us-east-1 \
      --agent-runtime-name "<AGENT_NAME>" \
      --description "<AGENT_DESCRIPTION>" \
      --agent-runtime-artifact '{
        "containerConfiguration": {
          "containerUri": "709825985650.dkr.ecr.us-east-1.amazonaws.com/tavily/tavily-mcp:v6"
        }
      }' \
      --role-arn "<AGENT_ROLE_ARN>" \
      --network-configuration '{
        "networkMode": "PUBLIC"
      }' \
      --protocol-configuration '{
        "serverProtocol": "MCP"
      }' \
      --environment-variables '{
        "TAVILY_API_KEY": "<your-tavily-api-key>"
      }'
    ```

    Once the command completes, you will receive an output containing the
    `agentRuntimeArn`. Save this value for the next step.

    ```json theme={null}
    {
      "agentRuntimeArn": "...",
      "workloadIdentityDetails": {
        "workloadIdentityArn": "..."
      },
      "agentRuntimeId": "...",
      "agentRuntimeVersion": "...",
      "createdAt": "...",
      "status": "..."
    }
    ```
  </Step>

  <Step title="Invoke the Agent Runtime">
    Use the `agentRuntimeArn` from the previous step to invoke Tavily MCP
    tools. For example, to list all available tools:

    ```bash theme={null}
    export PAYLOAD='{ "jsonrpc": "2.0", "id": 1, "method": "tools/list",
      "params": { "_meta": { "progressToken": 1 }}}'

    aws bedrock-agentcore invoke-agent-runtime \
      --agent-runtime-arn "<AGENT_RUNTIME_ARN>" \
      --content-type "application/json" \
      --accept "application/json, text/event-stream" \
      --payload "$(echo -n "$PAYLOAD" | base64)" output.json
    ```

    You can also invoke specific tools by changing the payload. Here are some
    examples:

    **[Search](/documentation/api-reference/endpoint/search) the web:**

    ```json theme={null}
    {
      "jsonrpc": "2.0",
      "id": "1",
      "method": "tools/call",
      "params": {
        "name": "tavily_search",
        "arguments": { "query": "latest AI news", "max_results": 10 }
      }
    }
    ```

    **[Extract](/documentation/api-reference/endpoint/extract) content from a URL:**

    ```json theme={null}
    {
      "jsonrpc": "2.0",
      "id": "1",
      "method": "tools/call",
      "params": {
        "name": "tavily_extract",
        "arguments": { "urls": ["www.tavily.com"] }
      }
    }
    ```

    **[Crawl](/documentation/api-reference/endpoint/crawl) a website:**

    ```json theme={null}
    {
      "jsonrpc": "2.0",
      "id": "1",
      "method": "tools/call",
      "params": {
        "name": "tavily_crawl",
        "arguments": { "url": "www.tavily.com" }
      }
    }
    ```

    **[Map](/documentation/api-reference/endpoint/map) a website's structure:**

    ```json theme={null}
    {
      "jsonrpc": "2.0",
      "id": "1",
      "method": "tools/call",
      "params": {
        "name": "tavily_map",
        "arguments": { "url": "www.tavily.com" }
      }
    }
    ```
  </Step>
</Steps>

## Resources

* [Amazon Bedrock AgentCore Documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-get-started-toolkit.html)
* [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [Tavily MCP Documentation](/documentation/mcp)
* [Tavily API Reference](/documentation/api-reference/endpoint/search)
