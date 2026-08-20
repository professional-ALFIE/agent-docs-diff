> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# HIPAA

> Use HIPAA compliance mode for eligible cached retrieval requests.

<Info>
  HIPAA compliance is available for Enterprise customers after Exa enables it for your team. Contact [sales@exa.ai](mailto:sales@exa.ai) to discuss Enterprise access, BAA requirements, and enablement.
</Info>

HIPAA mode is controlled per request with a top-level `compliance` field:

```json theme={null}
{
  "compliance": "hipaa"
}
```

When this field is present on an eligible team, Exa handles the request with HIPAA compliance controls. If your team is not enabled, the API returns `403 FEATURE_DISABLED`.

HIPAA mode includes Zero Data Retention for those requests: Exa does not persist PHI.

## Supported endpoints

The `compliance` field is recognized on:

* [`/search`](/docs/reference/search)
* [`/contents`](/docs/reference/get-contents)

Other endpoints reject the field.

## Requirements

HIPAA mode supports cached retrieval only. Compatible requests:

* On `/search`, set `type` to `instant` or `fast`
* Request `text` or `highlights` (not `summary`)
* Use cache-only content: omit freshness fields, or set `maxAgeHours: -1` on `/contents`

Incompatible requests return `400 INVALID_REQUEST_BODY`, including:

* `summary` on `/contents`, or `contents.summary` on `/search`
* Freshness settings that require a live fetch, such as `maxAgeHours: 0` or a positive `maxAgeHours`
* Search requests that omit `type`, or use a type other than `instant` or `fast`

## Example

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }' | jq
  ```
</CodeGroup>

## Access

To enable HIPAA mode for your team, contact [sales@exa.ai](mailto:sales@exa.ai). See the [Trust Center](https://trust.exa.ai) for Exa security documentation.
