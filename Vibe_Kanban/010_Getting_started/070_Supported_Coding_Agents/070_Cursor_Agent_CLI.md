> 원본: https://vibekanban.com/docs/agents/cursor-cli.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Cursor Agent CLI

> Set up Cursor's command-line agent

<Steps>
  <Step title="Install Cursor Agent CLI">
    ```bash theme={null}
    curl https://cursor.com/install -fsS | bash
    ```

    Verify installation with `cursor-agent --version`. For more details, see the [official installation guide](https://docs.cursor.com/en/cli/installation).
  </Step>

  <Step title="Follow the login instructions">
    Sign in with `cursor-agent login` (opens a browser). You can also set the `CURSOR_API_KEY` environment variable. Full instructions: [https://docs.cursor.com/en/cli/reference/authentication](https://docs.cursor.com/en/cli/reference/authentication)
  </Step>

  <Step title="Start Vibe Kanban">
    Once authenticated, launch Vibe Kanban:

    ```bash theme={null}
    npx vibe-kanban
    ```

    You can now select Cursor Agent CLI when creating task attempts.
  </Step>
</Steps>
