> 원본: https://exa.ai/docs/websets/dashboard/criteria-versus-enrichments.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Criteria vs Enrichments

**Criteria** are filters that determine which results are included in your search. Every result must satisfy all criteria to be included in your final list. Criteria are binary - a result either meets the criterion or it doesn't. If a result fails even one criterion, it's excluded from your results. Criteria are included in the base search cost.

**Enrichments** are data extractors that pull additional information from results that have already passed your criteria. Enrichments don't affect which results you get - they only add columns of data to the results you've already found. Enrichments cost additional credits per result.

<br />

## When to Use Criteria

Use criteria for any requirement that should filter your results. If a characteristic is essential to whether you want to see a result, it should be a criterion.

**Examples of good criteria usage:**

* "Currently employed as a software engineer" - filters for people in that role
* "Has 5+ years of experience" - filters for seniority level
* "Located in San Francisco" - filters for geography
* "Previously worked at Google" - filters for specific employment history
* "Has experience with React and Node.js" - filters for technical skills

**Common mistake: Using optional preferences as criteria**

If you're not getting enough results, you may have turned "nice-to-have" preferences into hard filters:

* "Has 5+ years of experience" when you'd accept 3+ years - consider making this an enrichment so you can sort by it
* "Knows Node.js" when React is the only must-have - move optional skills to enrichments
* "Previously worked at a startup" when it's just a preference - use as an enrichment to prioritize, not filter

When a criterion is optional or flexible, move it to enrichments. This lets you see all qualified candidates and manually prioritize based on nice-to-have attributes.

<br />

## When to Use Enrichments

Use enrichments for any additional information you want to extract from results that have already passed your criteria. Enrichments are for data you need for outreach, qualification, or deeper research, but that don't affect whether you want to see the result.

**Examples of good enrichment usage:**

* "Email address" - extracts contact information from qualified candidates
* "Current company size" - adds context about their employer
* "Years of experience" - provides the exact number after you've already filtered for 5+ years
* "Key skills" - lists their technical stack
* "LinkedIn profile URL" - provides a link for further research

<br />

## Example: Senior Software Engineers

Let's say you're looking for senior software engineers with specific experience.

**Query:** "Senior software engineers with 5+ years of experience in machine learning. Get their email and current company."

**Criteria (for filtering):**

* Currently employed as a software engineer
* Has 5+ years of experience
* Has experience in machine learning

**Enrichments (for data extraction):**

* Email address
* Current company name

This structure ensures you only get candidates who meet your requirements, and then extracts the additional contact information you need from those qualified results.
