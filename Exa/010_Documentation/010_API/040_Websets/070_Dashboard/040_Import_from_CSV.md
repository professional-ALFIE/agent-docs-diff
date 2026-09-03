> 원본: https://exa.ai/docs/websets/dashboard/import-from-csv.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Import from CSV

> Turn your existing CSV data into a Webset

<br />

## Overview

The Import from CSV feature allows you to transform your existing CSV files containing URLs into fully-functional Websets. This is perfect when you already have a list of websites, companies, or resources that you want to enrich with additional data or apply search criteria to filter.

<br />

## How it works

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. Click "Start from CSV" to select your CSV file
2. Select which column contains the URLs you want to analyze
3. Review how your data will be imported before proceeding
4. Your URLs are transformed into a Webset with enrichments and metadata

<br />

## CSV preparation

Ensure your CSV file has a URL column

* For People searches: URLs must be LinkedIn profile URLs (e.g., [https://linkedin.com/in/username](https://linkedin.com/in/username))
* For Company search: URLs must be company homepage URLs (e.g., [https://example.com](https://example.com))
* For other searches: use any type of URL

If you do not have URLs, Websets will attempt to infer URLs based on the information in each CSV row and any extra info you provide.

The maximum number of results you can import is determined by your plan.

## What happens next?

Once imported, your CSV becomes a full Webset where you can:

### Enrich with custom columns

Add any information you want about each URL:

* Contact information (emails, phone numbers)
* Company metrics (revenue, employee count)
* Content analysis (sentiment, topics, summaries)
* Custom data specific to your use case

### Apply search criteria

Filter your imported URLs based on specific criteria:

* Company stage or size
* Industry or sector
* Geographic location
* Content type or topic
