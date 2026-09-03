> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Billing

> How billing, auto recharge, and invoices work on Exa's API

***

<Card title="Go to Billing" icon="credit-card" horizontal href="https://dashboard.exa.ai/billing">
  Manage credits, auto-recharge, and invoices in the dashboard
</Card>

## Billing overview

Exa uses a **pay-as-you-go** credit system: you load credits onto your account and are charged based on API usage. Your remaining balance is visible on the [Billing page](https://dashboard.exa.ai/billing).

Requests are billed according to the rates on [exa.ai/pricing](https://exa.ai/pricing) or your enterprise contract.

When your credit balance runs out, API requests are blocked until you add more credits or enable auto-recharge.

## Free tier

New accounts receive **\$20 in free credits** on signup.

Free Tier accounts receive **\$10 in free credits** each month. No payment method is required. See [exa.ai/pricing](https://exa.ai/pricing) for how credits translate to API usage across endpoints.

## Adding credits

Team owners can add credits at any time from the Billing page. Click **Add credits** and enter the amount you'd like to add. Payments are processed through Stripe.

## Auto recharge

Auto-recharge tops up your balance when it falls below your chosen threshold. Configure it from the [Billing page](https://dashboard.exa.ai/billing).

There are three settings:

| Setting                        | Description                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Recharge amount**            | The dollar amount added to your balance each time auto recharge triggers (minimum \$5, maximum \$10,000). |
| **Recharge threshold**         | Auto recharge triggers when your balance drops to this amount.                                            |
| **Monthly maximum** (optional) | Caps the total auto recharge spend per calendar month. Set to \$0 or leave blank for no limit.            |

<Info>
  For example, if you set a recharge amount of \$100, a threshold of \$10, and a monthly maximum of \$500 — your account will automatically add \$100 whenever your balance drops to \$10, up to \$500 in auto recharges per month.
</Info>

## Receipts and invoice history

You will receive email receipts for credit purchases and auto recharges. These emails are sent from **[billing@exa.ai](mailto:billing@exa.ai)**. To make sure you receive them, add this address to your email allow list.

You can also view your full invoice history on the Billing page in the dashboard.

## Enterprise billing

If you are interested in postpaid invoice billing, you must be on an Enterprise plan. Contact [sales@exa.ai](mailto:sales@exa.ai) to learn more.

## Planning high-volume usage

For a large spike in API usage, such as a batch job or product launch, pre-load your balance and set auto-recharge to a higher amount (we recommend at least \$1,000 per recharge). Large bursts of small charges may be declined by your payment provider.

Having a higher balance does not increase your [rate limits](/docs/reference/rate-limits). If you expect to exceed the defaults, contact [sales@exa.ai](mailto:sales@exa.ai).

<Info>
  For any questions about billing, reach out to [billing@exa.ai](mailto:billing@exa.ai).
</Info>
