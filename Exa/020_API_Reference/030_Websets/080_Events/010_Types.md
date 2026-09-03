> 원본: https://exa.ai/docs/websets/api/events/types.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Event Types

> Learn about the events that occur within the Webset API

The Websets API uses events to notify you about changes in your Websets. You can monitor these events through our [events endpoint](/docs/websets/api/events/list-all-events) or by setting up [webhooks](/docs/websets/api/webhooks/create-a-webhook).

Events are retained for 60 days before being automatically deleted.

## Webset

* `webset.created` - Emitted when a new Webset is created.
* `webset.deleted` - Emitted when a Webset is deleted.
* `webset.paused` - Emitted when a Webset's operations are paused.
* `webset.idle` - Emitted when a Webset has no running operations.

## Search

* `webset.search.created` - Emitted when a new search is initiated.
* `webset.search.updated` - Emitted when search progress is updated.
* `webset.search.completed` - Emitted when a search finishes finding all items.
* `webset.search.canceled` - Emitted when a search is manually canceled.

## Item

* `webset.item.created` - Emitted when a new item has been added to the Webset.
* `webset.item.enriched` - Emitted when an item's enrichment is completed.

## Import

* `import.created` - Emitted when a new import is initiated.
* `import.completed` - Emitted when an import has been completed.

## Export

* `webset.export.created` - Emitted when a new export is initiated.
* `webset.export.completed` - Emitted when an export has been completed.

## Monitor

* `monitor.created` - Emitted when a new monitor is created.
* `monitor.updated` - Emitted when a monitor's configuration is updated.
* `monitor.deleted` - Emitted when a monitor is deleted.
* `monitor.run.created` - Emitted when a monitor run starts.
* `monitor.run.completed` - Emitted when a monitor run finishes.

Each event includes:

* A unique `id`
* The event `type`
* A `data` object containing the full resource that triggered the event
* A `createdAt` timestamp

You can use these events to:

* Track the progress of searches and enrichments
* Build real-time dashboards
* Trigger workflows when new items are found
* Monitor the status of your exports
