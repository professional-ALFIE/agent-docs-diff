> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Enterprise Managed Auth for Claude

> Set up Enterprise Managed Auth (EMA) so Claude connects to Exa MCP through your identity provider, with no per-user OAuth login or consent screen. Includes Okta Cross App Access (XAA) setup.

By default, every member connects the [Exa connector](/docs/reference/exa-mcp) in Claude by signing in to Exa once through OAuth. With **Enterprise Managed Auth (EMA)** they get it silently through Okta instead: no Exa login screen, no consent prompt, no API keys handed around.

Access follows your directory: deprovision someone in Okta and their Exa access through Claude stops with it. EMA is the MCP [enterprise managed authorization extension](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization).

## Before you start

* A Claude Team or Enterprise organization with your identity provider connected, and admin access to it.
* An Exa **organization** (not a personal team) with SSO and directory sync, and admin access to it.
* Okta as your identity provider, on Okta Identity Engine with [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) enabled, and Super Admin access to the tenant. Okta is the only identity provider supported today.

## Exa values you'll need

| Field                                   | Value                    |
| --------------------------------------- | ------------------------ |
| Issuer URL (Exa's authorization server) | `https://auth.exa.ai`    |
| Resource / MCP server URL               | `https://mcp.exa.ai/mcp` |
| Scope                                   | `mcp:tools`              |

## Set up EMA

<Steps>
  <Step title="Provision your members in Exa">
    Every member who will use the connector must already exist in Exa and belong to a team in your Exa organization, with the same email address Okta asserts, on a domain verified on your organization. EMA never creates accounts. Use directory sync, or [invite them to the team](/docs/reference/setting-up-team).
  </Step>

  <Step title="Register your identity provider in Exa">
    In the Exa dashboard, open [Organization](https://dashboard.exa.ai/organization), find **Enterprise-managed auth (Claude MCP)**, and click **Register identity provider**. Paste your Okta SSO / app embed URL (`https://your-org.okta.com/app/.../sso/saml`). Exa validates the URL when you register it.

    The registration stays **Pending verification** until the first provisioned member successfully connects Claude through Okta, then flips to **Active** on its own. There is nothing else to click. Issuers that Exa set up for you show as **Managed by Exa**; contact support to change those. If Exa doesn't recognize your URL, contact [support@exa.ai](mailto:support@exa.ai).
  </Step>

  <Step title="Configure Cross App Access in Okta">
    Follow [Okta's Cross App Access guide for Claude EMA](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide). For Exa:

    1. Open the Exa application in the Okta Admin Console, go to **Resource Server**, enable XAA, and set the Resource URL and Issuer URL to `https://auth.exa.ai`. Leave Audience/tenant ID empty.
    2. If the Exa app is a custom SAML app, confirm its **Name ID Format** is `EmailAddress`, since Exa matches the asserted email to the member's Exa account.
    3. Register the Claude AI Agent under **Directory → AI Agents**, add its public key from Anthropic, add the Claude app as a delegated caller, and add Exa as a **Resource Connection** using the Client ID Anthropic gives you.
  </Step>

  <Step title="Turn on managed authorization in Claude">
    In Claude, go to **Organization settings → Connectors**, select the Exa connector, and on the **Configuration** tab click **Set up** next to Managed authorization. Confirm the IdP connection, run the test, choose the roles that inherit the connector, and save. See [Anthropic's admin guide](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization) for the role and scope options.
  </Step>
</Steps>

Members get the connector the next time they sign in. You can leave browser sign-in enabled alongside managed authorization; Claude tries managed authorization first and falls back to the normal OAuth login if it fails.

<Note>
  Usage through Claude bills to the member's Exa team, under that team's plan and rate limits, the same as anything else they run on the team.
</Note>

## Revoking access

* **One member:** remove them in Okta, or from their team in Exa. Either one ends their access through Claude.
* **Everyone:** remove the issuer on the Organization page, or turn managed authorization off in Claude. New connections stop immediately and sessions already open end shortly after. You can register the issuer again at any time.

## Troubleshooting

<AccordionGroup>
  <Accordion title="It works for some members but not others">
    The failing member isn't resolvable in Exa. Check that they exist in Exa with the exact email Okta asserts, on a domain verified on your organization, and that they belong to a team in that organization. A directory sync group mapping is the usual culprit.
  </Accordion>

  <Accordion title="Nothing works for anyone">
    Check the issuer's status on the Organization page. Still **Pending verification** means no connection has succeeded yet. Usually the Okta configuration isn't finished, the Issuer URL on the Exa app doesn't match `https://auth.exa.ai`, or the member who tried isn't provisioned in Exa. Fix that, then connect again as a provisioned member.
  </Accordion>

  <Accordion title="Registration says the identity provider is already registered">
    An issuer belongs to exactly one Exa organization. If it isn't listed on your Organization page, contact [support@exa.ai](mailto:support@exa.ai).
  </Accordion>
</AccordionGroup>

<Note>
  For anything else, contact [support@exa.ai](mailto:support@exa.ai) with your Exa organization name, the affected member's email, and roughly when the attempt happened.
</Note>
