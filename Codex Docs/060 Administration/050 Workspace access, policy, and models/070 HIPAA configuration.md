# HIPAA configuration guide for Codex Local

> For the complete documentation index, see [llms.txt](https://learn.chatgpt.com/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Who's this for

Use this guide to configure Codex Local for workflows that may handle protected health information (PHI).
Codex Local includes the ChatGPT desktop app, Codex IDE extension, and Codex CLI, which run on your users' computers.

If you use ChatGPT for Healthcare, ChatGPT for Clinicians, or a Regulated workspace, have an applicable OpenAI Business Associate Agreement (BAA), and have the required Codex access, OpenAI handles PHI it receives from Codex Local consistent with the BAA. OpenAI securely handles prompts, files, and other inputs it receives through your use of Codex and securely returns outputs to you.

OpenAI and your organization share responsibility for securing OpenAI services. You are responsible for securely configuring local workstations, source repositories, local retention, local MCP servers, Browser Use and Computer Use activity, desktop apps, and third-party services such as Google Drive or GitHub that Codex can access. This guide explains how to configure these tools.

This guide isn't legal advice. If you're a covered entity or business
  associate, review the final configuration against your HIPAA policies, risk
  analysis, BAA inventory, endpoint controls, and data-flow documentation.

## Shared responsibility

As with most cloud solutions, the cloud service provider and customer share compliance responsibility. ChatGPT Enterprise stores inputs and outputs in the OpenAI cloud. Your users' workstations keep inputs and outputs from Codex Local. Codex sends inputs, such as prompts and files, to OpenAI for inference, and OpenAI returns the outputs. For usage authenticated through ChatGPT, OpenAI keeps audit records for up to 30 days so you can retrieve them through the [Compliance API](https://learn.chatgpt.com/docs/enterprise/governance#compliance-api). OpenAI doesn't train on ChatGPT Enterprise data or Codex Local data.

Your local workstation configuration, specifically its TOML policy files, governs what Codex can do on a user's machine. It affects whether Codex can read and write files, run commands, use network access, invoke plugins or connectors, call MCP tools, open browser surfaces, and keep local transcripts. Those settings don't change OpenAI's BAA obligations, but they're central to your HIPAA safeguards. This guide describes settings you can use to configure Codex Local to match your internal policy on the use and protection of PHI.

## OpenAI security program

OpenAI maintains an enterprise security program designed to protect the data processed by OpenAI services and to support regulated organizations in meeting their compliance obligations.

OpenAI deploys an **Enterprise Risk Management** program and a formal risk governance structure that includes reporting to board committees. Product assurance activities help ensure product launches preserve safeguards such as encryption, least-privileged access, and granular logging to support HIPAA compliance. Product risk assessments, control monitoring, and compliance reviews help identify reasonably anticipated risks to your data, evaluate the effectiveness of safeguards, and support continuous improvement of controls used by ChatGPT Enterprise, the API platform, and Codex-related services.

**Secure development and CI/CD safeguards** help reduce the risk that changes to Codex-related services introduce unauthorized access, data leakage, or integrity issues. These safeguards include controlled source access, peer review, automated testing, security checks in build and deployment workflows, secret-handling controls, and monitored deployment processes. A controlled software-delivery process supports the OpenAI service layer, while you're still responsible for local repository hygiene, workstation security, and the behavior permitted by local policy-file configuration.

**OpenAI's vulnerability management program** includes continuous scans, dependency and infrastructure reviews, severity-based triage, remediation tracking, and validation of fixes. OpenAI also uses internal and external red teams, independent security testing, and responsible-disclosure channels to identify and address security weaknesses before they can affect your data.

**Data protection controls** include encryption of your data in transit and at rest, identity and access controls, role-based administration, logging, and retention controls that follow the applicable ChatGPT Enterprise or API organization settings.

## Codex Local sign-in

Codex supports two OpenAI sign-in methods when using OpenAI models: ChatGPT sign-in for subscription access and API key sign-in for usage-based access. ChatGPT sign-in requires a HIPAA-eligible account, the applicable OpenAI BAA, and the required Codex access and workspace permissions. For API key sign-in, the BAA covers data processed by OpenAI only if it includes API Services with Modified Retention as an Eligible Service. OpenAI must also provision the API organization with Modified Retention unless it specifies otherwise.

With ChatGPT sign-in, Codex usage follows the user's ChatGPT workspace permissions, role-based access control (RBAC), and ChatGPT Enterprise retention and residency settings. With API key sign-in, Codex usage follows the OpenAI API organization's retention, data-sharing, and administrative settings rather than the ChatGPT workspace settings. API key sign-in is commonly used for programmatic Codex CLI workflows, such as trusted CI/CD jobs, but you shouldn't expose API keys in public or untrusted execution environments.

## Your responsibilities

You remain responsible for the workstations where Codex Local runs. Complete your own risk analysis for local Codex use, including controls such as workstation configuration, operating system security, disk encryption, malware protection, device management, patching, user access, secure credential storage, and local retention.

You decide which users may use Codex Local, which sign-in methods they can use, which workspaces they can access, whether they can sign in with an API key, which repositories and folders can contain PHI, and whether Codex may use external services.

You're also responsible for enabled third-party services and which users have access to them. If your organization enables a browser destination, plugin, connector, or MCP server for Microsoft SharePoint, Google Drive, GitHub, or another service in an environment with PHI, confirm that your organization approves the service for PHI and has an appropriate BAA or comparable healthcare addendum. OpenAI's BAA doesn't make another vendor a HIPAA-compliant destination.

The following sections explain how you can manage your HIPAA compliance by using the `requirements.toml` policy configuration file and related settings. Review the OpenAI documentation for other settings, and revisit that review as Codex capabilities change.

## Enable Codex

Follow the [admin setup instructions](https://learn.chatgpt.com/docs/enterprise/admin-setup) to enable Codex Local for your workspace and confirm that users have the required permissions. Contact your OpenAI Account Director to enable Codex HIPAA support for the workspace.

**The BAA doesn't cover Codex cloud. Don't use Codex cloud with PHI.**

## Configure role-based access control

You can customize access to Codex Local and its configuration by using RBAC. For example, users who don't interact with PHI may receive a more permissive configuration, while users who do interact with PHI may receive the configuration in this guide. Control organization-wide access to Codex Local from the [ChatGPT admin permissions and roles page](https://chatgpt.com/admin/permissions). To control access for specific users, create groups and edit the permissions for those groups.

<a id="review-apps-and-plugins"></a>

## Review plugins and connectors

Codex in the ChatGPT desktop app and Codex CLI support plugins, which can include connectors and skills. Plugins aren't available in the IDE extension. Connectors let you exchange data with third-party data sources. Before enabling a plugin with a connector, determine whether you need a BAA with any third party that receives data through the connector. Skills are instructions that operate within the policy configuration. Review skills to make sure they're fit for purpose, as you would any other script.

Workspace admins must make a plugin available through plugin controls and
separately enable its connectors before users can use them. Configure connector
access in [connector settings](https://chatgpt.com/admin/ca).

## Configure managed requirements and defaults

Requirements and managed defaults in TOML configuration files manage Codex behavior. Local workstations store user-level configuration at `~/.codex/config.toml`. The CLI and IDE extension share the same configuration layers. To set admin-enforced constraints that users can't override, use managed requirements in `requirements.toml`. OpenAI recommends using managed configuration to enforce your data-handling requirements for PHI.

Admins can configure cloud-managed requirements on the Codex [Managed configuration page](https://chatgpt.com/codex/settings/managed-configs) by using `requirements.toml`-compatible syntax. They can also distribute requirements through device management such as macOS MDM. Codex applies requirements from lower to higher precedence: system `requirements.toml`, cloud-managed requirements, legacy `managed_config.toml` requirements, and macOS MDM requirements. Higher-precedence layers override ordinary scalar and list values; some requirements have field-specific merge behavior.

To restrict PHI workflows to an approved ChatGPT workspace, deploy both `allowed_login_methods = ["chatgpt"]` and `allowed_chatgpt_workspaces = ["<workspace-id>"]` through system `requirements.toml` or MDM. Cloud-managed requirements ignore both settings, and workspace restrictions alone don't block API key sign-in. API key workflows also require system or MDM requirements because they don't receive workspace cloud-managed requirements.

Managed defaults are separate from requirements. They set the initial configuration that Codex starts with, but users can change those settings during a session. Codex reapplies the defaults the next time it starts. Use managed defaults for standardization, not strict compliance enforcement. For example, you might set a default model, permission profile, or other preferred local behavior. If a setting must be non-bypassable for PHI workflows, put it in requirements instead. For managed defaults, macOS MDM managed preferences have the highest precedence, followed by system `managed_config.toml` and then the user's local `config.toml`.

The following table summarizes some settings available for configuring Codex Local. Review these settings and the resources in [References](#references) to configure Codex Local in a way that aligns with your compliance needs.

| Control                                                                                                 | Setting                                                                                            | Explanation                                                                                           |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Sign-in method](https://learn.chatgpt.com/docs/auth)                                                                           | ChatGPT sign-in; API key sign-in only with BAA-covered API Services with Modified Retention.       | Determines whether ChatGPT workspace controls or API organization controls apply.                     |
| [Workspace pinning](#configure-managed-requirements-and-defaults)                                       | `allowed_login_methods = ["chatgpt"]`<br />`allowed_chatgpt_workspaces = ["<workspace-id>"]`       | Requires ChatGPT sign-in to the approved workspace when deployed through system configuration or MDM. |
| [Approval policy](https://learn.chatgpt.com/docs/enterprise/managed-configuration#admin-enforced-requirements-requirementstoml) | `allowed_approval_policies = ["on-request", "untrusted"]`                                          | Uses the selected policy; use `untrusted` when every untrusted command requires review.               |
| [Approval reviewer](https://learn.chatgpt.com/docs/enterprise/managed-configuration#configure-automatic-review-policy)          | `allowed_approvals_reviewers = ["user"]`                                                           | Uses user review when Codex requests approval; audit approval hooks before relying on user review.    |
| [Permission profiles](https://learn.chatgpt.com/docs/enterprise/managed-configuration#control-available-permission-profiles)    | `default_permissions = ":workspace"`<br />Allow only `:read-only` and `:workspace`.                | Limits writes to workspace roots and temporary directories; review filesystem read access.            |
| [Web search](https://learn.chatgpt.com/docs/config-file/config-basic#web-search-mode)                                           | `allowed_web_search_modes = ["cached"]`                                                            | Limits search to cached results; use `["disabled"]` to turn web search off.                           |
| [Browser and computer-use features](https://learn.chatgpt.com/docs/enterprise/managed-configuration#pin-feature-flags)          | Set `computer_use`, `browser_use`, `browser_use_full_cdp_access`, and `in_app_browser` to `false`. | Reduces the chance that users copy PHI into websites or desktop apps.                                 |
| [MCP servers](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)                                                                               | Leave `[mcp_servers]` empty by default; allowlist only exact, approved servers.                    | Disables local MCP services by default. Add only approved servers or connectors.                      |
| [Local history and plugins](https://learn.chatgpt.com/docs/config-file/config-basic#feature-flags)                              | Set `[history] persistence = "none"` in `config.toml`. Enable plugins only for approved groups.    | Disables `history.jsonl`, not session transcripts, SQLite data, logs, or other local records.         |

### Starter requirements.toml

OpenAI provides ChatGPT Enterprise and Regulated workspaces with a starter configuration that uses a subset of the settings in the preceding table. If you use cloud-managed requirements as the configuration distribution mechanism, find this starter configuration on the Codex [Managed configuration page](https://chatgpt.com/codex/settings/managed-configs) and override it for specific RBAC groups. Deploy sign-in and workspace restrictions, and requirements for API key workflows, through system configuration or MDM instead.

This configuration reduces unauthorized egress while allowing normal, supervised Codex Local work. Review and adapt it before rollout. The following two examples show how you can adapt the configuration to support common workflows.

Permission-profile allowlists require Codex 0.138.0 or later. Deploy this example only after every managed client runs a supported version.

```toml
# Starter requirements.toml for Codex Local use with PHI.
# Review and adapt this policy before rollout.

allowed_approval_policies = ["on-request", "untrusted"]
allowed_approvals_reviewers = ["user"]
allowed_web_search_modes = ["cached"]

default_permissions = ":workspace"

[allowed_permission_profiles]
":read-only" = true
":workspace" = true

[features]
computer_use = false
browser_use = false
browser_use_full_cdp_access = false
in_app_browser = false

[mcp_servers]
# None allowed by default.
```

<a id="example-1-enable-the-google-drive-app"></a>

### Example 1: Enable the Google Drive plugin

Enable Google Drive only for an approved group after confirming its data flow, OAuth scopes, access controls, and third-party BAA posture. OpenAI's BAA governs OpenAI's handling of PHI; it doesn't automatically cover Google as a recipient or holder of PHI.

This workspace-managed connector requires ChatGPT sign-in and isn't available
with API key authentication.

Codex uses the `apps` configuration key for connector settings. This example
sets local defaults for the Google Drive connector. Replace
`<approved-google-drive-app-id>` with the exact app ID from your approved
installation; a display name or guessed ID won't apply the configuration.

```toml
# Example config.toml change for a group approved to use
# the Google Drive connector with PHI, after legal and security review.

[features]
apps = true

[apps."<approved-google-drive-app-id>"]
enabled = true
destructive_enabled = false
default_tools_approval_mode = "prompt"
```

These user-configurable defaults block connector tools marked as destructive and request approval unless app-level or per-tool settings override them. They aren't non-bypassable admin controls. Use workspace and RBAC controls to restrict access, and use managed requirements to disable an app or require approval for specific approved tools. Review Google Workspace audit logs for connector activity where available.

### Example 2: Use GitHub locally

For local development, many teams use Git or the GitHub CLI from the developer workstation. This is different from Codex cloud. If repositories, issues, pull requests, or comments can contain PHI, confirm that your organization approves the GitHub environment for that data before enabling this path.

```toml
# Example requirements.toml addition for local GitHub use.
# This doesn't enable Codex cloud. It keeps repository actions reviewable.

[rules]
prefix_rules = [
  { pattern = [{ token = "git" }, { any_of = ["push", "commit"] }], decision = "prompt", justification = "Require review before changing repository history." },
  { pattern = [{ token = "gh" }], decision = "prompt", justification = "Require review before using GitHub CLI." },
]
```

This policy doesn't block GitHub use. It creates a review point before Codex changes repository history or uses GitHub CLI commands.

### Optional: Use a vetted GitHub MCP server

If your team uses a GitHub MCP server instead of only local Git commands, allowlist the exact approved server identity and restrict tools to the smallest approved set.

```toml
# Optional: allow a vetted GitHub MCP server.
# Use the exact approved server identity for your environment.

# requirements.toml
[mcp_servers.github]
identity = { url = "https://github-mcp.example.com/mcp" }

# config.toml
[mcp_servers.github]
url = "https://github-mcp.example.com/mcp"
enabled = true
default_tools_approval_mode = "prompt"
enabled_tools = ["<approved-read-tools>", "<approved-pr-tools>"]
```

## Practical rollout steps

1. **Select the approved sign-in path.** Decide whether users will [authenticate to Codex Local](https://learn.chatgpt.com/docs/auth) with ChatGPT, use API keys, or use both for separate workflows.
2. **Confirm the BAA with OpenAI.** Confirm that your BAA covers your approved sign-in paths. For API key workflows, confirm that it includes API Services with Modified Retention as an Eligible Service and that OpenAI has provisioned the API organization with Modified Retention. Contact your OpenAI Account Director to enable Codex HIPAA support for a ChatGPT workspace.
3. **Enable Codex Local and define RBAC groups.** Use [Codex Enterprise admin setup](https://learn.chatgpt.com/docs/enterprise/admin-setup) to enable Codex Local, create a small Codex Admin group, and assign Codex access through RBAC groups such as Codex Users and Codex PHI Users.
4. **Deploy admin-enforced `requirements.toml` and managed defaults.** Use cloud-managed requirements, MDM, or system configuration for supported starter-policy settings. Use system configuration or MDM for sign-in restrictions, workspace pinning, and API key workflows. Configure permission profiles, approval policies, web search modes, feature pins, network requirements, command rules, and MCP allowlists.
5. **Train users on approvals and sandbox boundaries.** Use [Agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security) to explain when Codex can act inside the sandbox, when it asks for approval, and why users should review network, file-transfer, repository-write, and third-party connector actions.
6. **Review third-party plugins before PHI use.** Before enabling plugins with connectors such as Google Drive and GitHub, browser destinations, or MCP servers, confirm that your organization approves any third party receiving PHI and has an appropriate BAA with that party.
7. **Track, review, and refresh the deployment.** Use Compliance API exports, workspace analytics, endpoint logs, plugin and connected-service audit logs, and repository audit logs to confirm that the deployed posture stays aligned with your internal policies.

## References

- [Codex authentication](https://learn.chatgpt.com/docs/auth)
- [Codex config basics](https://learn.chatgpt.com/docs/config-file/config-basic)
- [Codex Enterprise admin setup](https://learn.chatgpt.com/docs/enterprise/admin-setup)
- [Codex managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration)
- [Agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security)
- [Codex Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
- [Codex governance](https://learn.chatgpt.com/docs/enterprise/governance)
- [Codex permissions](https://learn.chatgpt.com/docs/permissions)
- [ChatGPT Healthcare and Regulated Workspace functionality](https://help.openai.com/en/articles/20001069-chatgpt-healthcare-and-regulated-workspace-functionality)
- [ChatGPT for Clinicians](https://help.openai.com/en/articles/20001202-chatgpt-for-clinicians)
- [Business Associate Agreement for OpenAI API services](https://help.openai.com/en/articles/8660679-how-can-i-get-a-business-associate-agreement-baa-with-openai)
- [Codex white paper](https://app.safebase.io/portal?itemUid=382f924d-54f3-43a8-a9df-c39e6c959958&source=search)