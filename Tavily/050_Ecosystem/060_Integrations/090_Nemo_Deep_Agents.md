> 원본: https://docs.tavily.com/documentation/integrations/nemo-deepagents.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Nemo Deep Agents

> Enable Tavily for NVIDIA NemoClaw's nemo-deepagents sandbox so LangChain Deep Agents Code can use web search and extraction through governed OpenShell egress.

## Introduction

[NVIDIA NemoClaw for LangChain Deep Agents Code](https://docs.nvidia.com/nemoclaw/latest/user-guide/deepagents/get-started/quickstart) runs LangChain Deep Agents Code inside an OpenShell sandbox. The `nemo-deepagents` command is the Deep Agents-focused alias for NemoClaw.

The [NemoClaw Deep Agents blueprint](https://www.langchain.com/blog/langchain-and-nvidia-launch-the-nemoclaw-deep-agents-blueprint) brings together LangChain Deep Agents Code, NVIDIA Nemotron 3 Ultra, and the NVIDIA OpenShell runtime so teams can run coding agents with controlled tools, runtime policy, observability, and model routing.

Tavily can be enabled for a `nemo-deepagents` sandbox by applying NemoClaw's `tavily` policy preset and registering a `tavily-search` credential with the OpenShell gateway. The raw Tavily API key stays on the host gateway; it should not be written into the sandbox, project `.env` files, or Deep Agents config files.

<Frame>
  <video controls preload="metadata" aria-label="Configuring Tavily egress for a Nemo Deep Agents sandbox">
    <source src="https://mintcdn.com/tavilyai/LNgGeBVzM-hxhtOq/images/nemo-deepagents.mp4?fit=max&auto=format&n=LNgGeBVzM-hxhtOq&q=85&s=1be14c0c9b51f842e26f659eabba6c92" type="video/mp4" data-path="images/nemo-deepagents.mp4" />
  </video>
</Frame>

## Prerequisites

* Docker is installed and running.
* NemoClaw is installed with the LangChain Deep Agents Code agent available.
* You have a Tavily API key from the [Tavily Dashboard](https://app.tavily.com/home).

<Tip>
  NemoClaw treats Tavily as an explicit sandbox egress opt-in. Registering the credential alone is not enough; the target sandbox also needs the `tavily` policy preset.
</Tip>

## Setup

<AccordionGroup>
  <Accordion title="Step 1: Install or onboard Nemo Deep Agents">
    If NemoClaw is not installed yet, select the LangChain Deep Agents Code agent before running the installer:

    ```bash theme={null}
    export NEMOCLAW_AGENT=langchain-deepagents-code
    curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash
    ```

    If NemoClaw is already installed, start Deep Agents onboarding directly:

    ```bash theme={null}
    nemo-deepagents onboard
    ```

    During onboarding, choose your inference provider, model, sandbox name, and policy tier. The walkthrough uses `dcode-tavily` as the sandbox name:

    ```bash theme={null}
    nemo-deepagents dcode-tavily status
    ```
  </Accordion>

  <Accordion title="Step 2: Review the sandbox policy presets">
    List the active and available policy presets for the sandbox:

    ```bash theme={null}
    nemo-deepagents dcode-tavily policy-list
    ```

    Preview the exact egress changes the Tavily preset will apply:

    ```bash theme={null}
    nemo-deepagents dcode-tavily policy-add tavily --dry-run
    ```
  </Accordion>

  <Accordion title="Step 3: Apply the Tavily policy preset">
    Apply the maintained `tavily` preset to the target sandbox:

    ```bash theme={null}
    nemo-deepagents dcode-tavily policy-add tavily --yes
    ```

    This opens managed Python egress for Tavily search and extract requests to `api.tavily.com`.
  </Accordion>

  <Accordion title="Step 4: Register the Tavily credential with the gateway">
    Export your key only in the host shell long enough for NemoClaw to register it:

    ```bash theme={null}
    export TAVILY_API_KEY="tvly-YOUR_API_KEY"
    nemo-deepagents credentials add tavily-search --type tavily --credential TAVILY_API_KEY
    unset TAVILY_API_KEY
    ```

    If you need to replace an existing credential, reset it first:

    ```bash theme={null}
    nemo-deepagents credentials reset tavily-search
    ```
  </Accordion>

  <Accordion title="Step 5: Rebuild the sandbox">
    Rebuild the sandbox so the new policy and gateway provider attach to the runtime:

    ```bash theme={null}
    nemo-deepagents dcode-tavily rebuild
    ```

    The rebuild should restore the existing workspace state, reapply the policy presets, and restart LangChain Deep Agents Code.
  </Accordion>

  <Accordion title="Step 6: Connect and test web search">
    Open the Deep Agents Code terminal:

    ```bash theme={null}
    nemo-deepagents dcode-tavily connect
    ```

    Ask a current-events question, for example:

    ```text theme={null}
    What is the latest news on AI?
    ```

    When Deep Agents requests a web-search action, review the tool call and approve it if the query is appropriate.
  </Accordion>
</AccordionGroup>

## How Tavily works in Nemo Deep Agents

| Layer                              | What it does                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `tavily` policy preset             | Opens the sandbox Python egress path for Tavily `search` and `extract` API calls.      |
| `tavily-search` gateway credential | Stores the Tavily API key on the OpenShell host gateway and injects it at egress time. |
| Sandbox rebuild                    | Attaches the updated policy and credential provider to the sandbox runtime.            |
| Deep Agents approval               | Lets you review tool calls before the coding agent performs web search.                |

<Warning>
  Do not place `TAVILY_API_KEY` in the sandbox, project `.env` files, `/sandbox/.deepagents`, or Deep Agents config. NemoClaw's managed gateway is designed to keep the raw key outside the sandbox.
</Warning>

## Good tasks for Nemo Deep Agents + Tavily

* researching current package, API, and framework behavior before editing code
* reading and summarizing live documentation during a coding task
* checking recent release notes, issues, or changelogs
* grounding implementation choices in current source material
* extracting clean content from URLs the agent needs to inspect

## Troubleshooting

| Symptom                        | What to check                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------ |
| Web search cannot reach Tavily | Run `nemo-deepagents dcode-tavily policy-list` and confirm `tavily` is active. |
| The key is not being used      | Re-register `tavily-search`, then rebuild the sandbox.                         |

## Learn more

* [LangChain and NVIDIA NemoClaw Deep Agents blueprint announcement](https://www.langchain.com/blog/langchain-and-nvidia-launch-the-nemoclaw-deep-agents-blueprint)
* [NVIDIA NemoClaw Deep Agents quickstart](https://docs.nvidia.com/nemoclaw/latest/user-guide/deepagents/get-started/quickstart)
* [Tavily Search API](/documentation/api-reference/endpoint/search)
* [Tavily Extract API](/documentation/api-reference/endpoint/extract)
