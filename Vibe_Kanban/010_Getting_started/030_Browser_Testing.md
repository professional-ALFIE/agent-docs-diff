> 원본: https://vibekanban.com/docs/browser-testing.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Browser Testing

> Preview your app in the built-in browser, inspect components, and debug with full devtools

The built-in preview browser lets you test your application, inspect components, and open full devtools — all without leaving the workspace.

## 1. Configure a dev server

If no dev server script is configured, the preview panel shows a setup prompt. Click **Edit Dev Server Script** to open the script dialog.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-no-script.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=01137bd8298ab72c3357863b3e00966f" alt="Preview panel showing prompt to set up a dev server script" width="2970" height="1700" data-path="images/workspaces-preview-no-script.png" />
</Frame>

Enter the command that starts your dev server (e.g. `npm run dev`, `pnpm dev`, `yarn dev`) and click **Save and Test** to verify it works.

<Frame>
  <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-script-dialog.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=4c923f911edca407955edcb8772e5dfb" alt="Script editor dialog with dev server command and Save and Test button" width="1912" height="1656" data-path="images/workspaces-preview-script-dialog.png" />
</Frame>

<Info>
  You can also configure dev server scripts from **Settings** → **Repos** → select your repository → **Dev Server Script**. See [Projects & Repositories](/docs/settings/projects-repositories) for details.
</Info>

## 2. Start the dev server

Once you've saved a script, click **Start dev server** in the preview panel to launch it.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-dev-server-start.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=5eebda3102103b9b74d7e83f192b1c48" alt="Preview panel showing the Start dev server button" width="2986" height="1700" data-path="images/workspaces-preview-dev-server-start.png" />
</Frame>

Logs stream in real-time in the **Log** panel (highlighted in red) on the right side of the workspace. Look for the URL output (e.g. `http://localhost:3000`) — Vibe Kanban detects this automatically and loads it in the preview.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-dev-server-running.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=ff14c426e976207ba51c7a4d19249024" alt="Dev server log output streaming in real-time in the Log panel" width="2986" height="1700" data-path="images/workspaces-preview-dev-server-running.png" />
</Frame>

## 3. The preview browser

Once the dev server starts, your application loads in the built-in browser. Here's an overview of the preview toolbar and what each control does.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-browser-annotated.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=a567e0b8c3abe511e7e5b8e2c8e37959" alt="Annotated preview browser showing the toolbar controls numbered 1 through 7" width="2988" height="1700" data-path="images/workspaces-preview-browser-annotated.png" />
</Frame>

1. **Back / Forward** — navigate between pages
2. **Inspect** (crosshair icon) — enter click-to-component mode
3. **DevTools** (terminal icon) — toggle the built-in devtools panel
4. **URL bar** — shows the current page address; type a URL to navigate manually
5. **Page actions** — submit, copy the URL, open in a new tab, and refresh
6. **Device modes** — switch between Desktop, Mobile, and Responsive views
7. **Pause** — pause or resume the dev server

## 4. Switch device modes

You can test your application across different viewport sizes without resizing your browser window. The device mode buttons in the toolbar let you switch instantly.

| Mode           | What it does                                    |
| -------------- | ----------------------------------------------- |
| **Desktop**    | Full-width browser view                         |
| **Mobile**     | Phone frame at 390×844, with device chrome      |
| **Responsive** | Drag the edges to set a custom width and height |

**Mobile mode** wraps your application in a phone frame so you can see exactly how it looks on a mobile device.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-mobile.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=5264630a6173ed2d2f5d1377a466c043" alt="Mobile device mode showing the application inside a phone frame at 390 by 844 pixels" width="2988" height="1700" data-path="images/workspaces-preview-mobile.png" />
</Frame>

**Responsive mode** lets you drag the edges of the preview to test any custom width and height.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-responsive.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=8a0541a83195669959902bbadf814f5f" alt="Responsive device mode with a custom viewport width" width="2988" height="1700" data-path="images/workspaces-preview-responsive.png" />
</Frame>

## 5. Inspect components

The preview browser includes a built-in click-to-component feature. Click **Select element as context** in the toolbar to enter inspect mode, hover over any element to highlight it, then click to select.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-inspect.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=76ea064462d2f4fb3e4885d538048869" alt="Inspect mode showing the full flow: activating inspect, hovering over a component, and the selected context appearing in the chat" width="2988" height="1700" data-path="images/workspaces-preview-inspect.png" />
</Frame>

When you click a component, inspect mode exits and the component's details are sent to the chat as context — you can then ask your coding agent questions about that specific component. This works automatically with React, Vue, Svelte, Astro, and plain HTML — no packages to install.

## 6. Open DevTools

Click the terminal icon in the toolbar to toggle the built-in devtools panel. The devtools open at the bottom of the preview and give you a full debugging console without leaving the workspace.

<Frame>
  <img src="https://mintcdn.com/vibekanban/fGNpXEiJuUXEFXru/images/workspaces-preview-devtools.png?fit=max&auto=format&n=fGNpXEiJuUXEFXru&q=85&s=66e226c5d669bee6682e93e9706b6487" alt="Eruda devtools panel open at the bottom of the preview browser showing the Console tab" width="2988" height="1700" data-path="images/workspaces-preview-devtools.png" />
</Frame>

The devtools give you access to:

* **Console** — view logs, warnings, errors, and run JavaScript
* **Elements** — inspect and modify the DOM tree
* **Network** — monitor requests and responses
* **Resources** — view cookies, localStorage, and sessionStorage
* **Sources** — view the page source code
* **Info** — check the page URL, user agent, viewport size, and device details

<Info>
  DevTools are powered by [Eruda](https://github.com/liriliri/eruda), a mobile-friendly debugging console. They run inside the preview iframe, so they reflect exactly what your application sees.
</Info>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Preview shows a blank page">
    * Check the log output for errors — the dev server may still be starting
    * Verify the correct URL is detected in the preview address bar
    * Try refreshing the preview with the refresh button
  </Accordion>

  <Accordion title="Preview doesn't update after changes">
    * Check the logs for build errors
    * Try a hard refresh (`Cmd/Ctrl + Shift + R`)
    * Restart the dev server with the play/pause button
    * Verify your framework supports hot module replacement (HMR)
  </Accordion>

  <Accordion title="Port conflict error">
    Another process is using the same port. Find and stop it, or change the port in your project config. Run `lsof -i :3000` (replace 3000 with your port) to see what's using it.
  </Accordion>

  <Accordion title="Inspect mode doesn't detect components">
    * Make sure the dev server is running a **development** build (production builds strip component metadata)
    * For React, ensure the app has loaded before entering inspect mode
    * The HTML fallback always works — if you see tag names instead of component names, the framework adapter couldn't detect the framework
  </Accordion>
</AccordionGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Changes panel" icon="code-compare" href="/docs/workspaces/changes">
    Review diffs and provide feedback to your coding agent
  </Card>

  <Card title="Projects & Repositories" icon="gear" href="/docs/settings/projects-repositories">
    Configure setup, cleanup, and dev server scripts per repository
  </Card>
</CardGroup>
