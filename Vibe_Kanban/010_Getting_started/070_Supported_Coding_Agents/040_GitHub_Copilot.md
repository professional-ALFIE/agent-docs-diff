> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# GitHub Copilot

> Set up GitHub Copilot CLI

<Steps>
  <Step title="Run GitHub Copilot">
    ```bash theme={null}
    npx -y @github/copilot
    ```
  </Step>

  <Step title="Follow the login instructions">
    When prompted, follow the on-screen instructions to authenticate using the `/login` command. For more details, see the [GitHub Copilot CLI documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli).
  </Step>

  <Step title="Start Vibe Kanban">
    Once authenticated, launch Vibe Kanban:

    ```bash theme={null}
    npx vibe-kanban
    ```

    You can now select GitHub Copilot when creating task attempts.
  </Step>
</Steps>
