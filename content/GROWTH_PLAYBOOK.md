# AI Field Notes: first publishing cycle

Status: site and article changes prepared locally. These are promotion drafts for Filip to publish after deployment; nothing has been posted or scheduled. The three guide updates ship together in this release, with promotion staggered over three weeks.

## Release and measurement

1. The implementation incorporates the production SEO changes from `origin/main` and preserves selective news indexing: all 46 news reports remain public, with 22 selected for indexing. Deploy through the site's existing release process. Verify `/guides`, `/tools`, `/tools/ai-coding-workflow`, and the three updated chapter URLs in production. Download the assets and inspect social previews before sharing.
2. Vercel Web Analytics is receiving production pageviews. The account review on September 11, 2026 confirmed Hobby: custom events require Pro, and UTM reporting requires Web Analytics Plus. Keep `NEXT_PUBLIC_GROWTH_EVENTS_ENABLED` unset or false on this account. All tools work with events disabled. If the account later supports custom events, set the flag to `true` at build time, rebuild, and verify receipt. No paid plan or account setting was changed. See [Vercel's plan limits](https://vercel.com/docs/analytics/limits-and-pricing).
3. Record the release date and save a private snapshot of the previous 28 complete days of visitors and pageviews for each promoted page, search-engine referrers, other referrers, and tool-page traffic. Record the selected dates, environment, hostname, and metric with each snapshot. Save another snapshot every 28 days: Hobby's reporting window is one month, so the original baseline may no longer be available at the second review. The initial Vercel review used a rolling 30-day window; Search Console used 28 days with a reporting delay. Keep those initial observations separate and use equal-length, complete windows for future comparisons.
4. Promote one guide each week using the drafts below. Use LinkedIn for the short post and one appropriate developer community for the technical excerpt. Check that community's self-promotion rules, provide the useful explanation in the post itself, and respond to relevant questions. Do not bulk-post or message members.
5. After 28 days and 56 days, compare equal-length windows. Record actual counts and release/promotion dates; do not infer causation from a small before/after change. Set the next numerical target after the baseline is known.

| Signal | Definition | Use |
|---|---|---|
| Search exposure | Search Console impressions, clicks, CTR, and average position for each promoted URL and relevant queries | Which guides appear in search and attract clicks |
| Search referrers | Vercel visitors attributed to search-engine referrers, filtered by page where available | Observed arrivals from search; separate from Search Console clicks |
| Distribution referrers | Vercel visitors by recorded referrer and promoted page, alongside a dated promotion log | Directional evidence about distribution; exact post attribution is unavailable on Hobby |
| Guide and tool traffic | Visitors and pageviews for promoted guides and `/tools/ai-coding-workflow` | Reach of useful content and the working tool |
| Bounce rate | Vercel's share of sessions with only one pageview | Diagnostic for onward navigation; does not establish reading quality or tool success |
| `workflow_completed` (disabled on Hobby) | One event when a guided answer reaches a result; property `result` is the curated answer-ID path | Guided usage, not task success |
| `recipe_copied` (disabled on Hobby) | One event after a successful clipboard write; property `recipe` is a recipe ID or guided-result path | Reuse intent; repeated copies count again |
| `related_guide_click` (disabled on Hobby) | Click in a chapter's related-guide section; properties `source` and `target` are chapter slugs | Movement to a relevant second guide |

Vercel visitor identifiers reset daily, so the reported visitor total is not a count of distinct people across the month. Referrers can be absent; do not classify all unattributed traffic as direct or add page-level visitor counts to produce a site total. Custom events do not affect Vercel's bounce-rate calculation. See [metric definitions](https://vercel.com/docs/analytics) and [referrer reporting](https://vercel.com/docs/analytics/using-web-analytics).

Events contain predefined IDs only, no prompt text or search queries. Treat event counts as interactions, not unique users or conversions. Vercel SDK delivery can be blocked by a browser, account limitations, or network conditions. Local tests verify calls; production dashboard receipt must be checked after enabling events. Retain the UTM links below as a consistent campaign convention, but do not promise UTM attribution from the current dashboard. Record publication dates, post URLs, destination pages, and available referrer counts; leave exact campaign counts unavailable.

Search Console is available for `https://www.aifieldnotes.dev/`. Its September 2026 review identified important evergreen guides as discovered but not indexed. After deployment, use URL Inspection on the three promoted guides, confirm they are crawlable with the expected canonical, and request indexing for materially improved pages when appropriate. Check sitemap processing and monitor subsequent report dates; do not validate exclusions as fixed before confirming their cause. Preserve intentional noindex pages. Inspect queries, impressions, clicks, and click-through rate for these landing pages. Prioritize useful pages already earning relevant impressions, then improve the answer and title. Keep existing URLs. A sitemap entry does not guarantee indexing.

## Week 1 — Spec files

### LinkedIn draft

A useful AI coding spec tells your next session what the feature should do, what it must leave alone, and how to check the result.

I updated my spec-files guide with a downloadable Markdown template and the current header from AI Field Notes as a worked example. It includes inputs, outputs, edge cases, acceptance criteria, and explicit scope boundaries.

The file is a starting point. You still need to reference it and check the implementation against it.

Guide and template:
https://www.aifieldnotes.dev/chapters/spec-files?utm_source=linkedin&utm_medium=social&utm_campaign=practical_guides_v1&utm_content=spec_template

### Developer-community draft

Title: A small Markdown spec template for AI-assisted changes

I keep feature requirements beside the implementation so a later session can recover the decisions. The most useful sections are observable behaviour, edge cases, acceptance criteria, and things deliberately out of scope.

For a navigation change, “add a link” leaves several decisions open. A useful criterion is: “The Tools link resolves to /tools and remains reachable by keyboard at 320px width.” The review can then compare both the document and the code with that requirement.

I wrote up the template and a header example here. This is my own guide:
https://www.aifieldnotes.dev/chapters/spec-files?utm_source=developer_community&utm_medium=community&utm_campaign=practical_guides_v1&utm_content=spec_template

## Week 2 — Debugging

### LinkedIn draft

A plausible AI bug fix needs a test that fails before the patch and passes after it.

My updated debugging guide walks through a deliberately small pagination bug: 21 items, 10 per page, but only 2 pages. It includes the broken implementation, four tests, and the one-line patch. You can run the example with Node's built-in test runner.

It's a teaching exercise, with no model benchmark claims. The point is to make the evidence easy to inspect.

https://www.aifieldnotes.dev/chapters/bug-to-fix?utm_source=linkedin&utm_medium=social&utm_campaign=practical_guides_v1&utm_content=debugging_repro

### Developer-community draft

Title: A runnable failing-test-first example for AI debugging

If a pagination function uses Math.floor(total / pageSize), 21 items at 10 per page produces 2 pages. Changing it to Math.ceil fixes the partial page, but also check an exact multiple, zero items, and invalid inputs.

The prompt I use asks the agent to run the unchanged tests, explain the calculation, preserve validation, and make the smallest patch. Then I inspect the diff and recheck the original UI flow. A utility test alone does not establish that page navigation works.

My guide includes a broken file, fixed file, and the same test suite for both:
https://www.aifieldnotes.dev/chapters/bug-to-fix?utm_source=developer_community&utm_medium=community&utm_campaign=practical_guides_v1&utm_content=debugging_repro

## Week 3 — Figma to React

### LinkedIn draft

A design-to-code handoff needs an explicit mapping between design values and the tokens and components already in the repository.

I updated my Figma MCP guide with an illustrative Save button, a mapping table, a React implementation, and checks for focus, disabled state, and form submission. There's also a downloadable handoff prompt.

The example uses stated design assumptions. It isn't a live Figma benchmark or a promise of pixel-perfect output.

https://www.aifieldnotes.dev/chapters/figma-mcp?utm_source=linkedin&utm_medium=social&utm_campaign=practical_guides_v1&utm_content=figma_react

### Developer-community draft

Title: Figma-to-React handoff: verify behaviour as well as pixels

Before generating a component, I want an explicit mapping from the design's values to the repository's existing semantic tokens. A matching colour is not enough to establish that two tokens serve the same purpose.

For a button, I also check whether it unexpectedly submits a form, whether the disabled state actually prevents activation, and whether keyboard focus remains visible. Those checks are separate from comparing the rendered result with the design screenshot.

I put an illustrative React example and a reusable handoff prompt in my guide:
https://www.aifieldnotes.dev/chapters/figma-mcp?utm_source=developer_community&utm_medium=community&utm_campaign=practical_guides_v1&utm_content=figma_react

## Follow-up decisions

The September 11 review of both dashboards supports this order:

1. Release the practical guides and verify indexing for the promoted URLs. Search exposure currently produces few clicks, and some evergreen guides appear in the discovered-but-not-indexed report. Inspect the live pages before deciding whether a technical fix, stronger content, or more relevant links are needed.
2. Run the three-week distribution cycle. Spec files already appears among Vercel's more visited guides, so keep its template first. Promote the useful example directly, with the matching guide as the destination.
3. Use the next review to select a follow-up guide. Jira-to-Cursor has relevant Search Console impressions and is a candidate for a worked example. Connect relevant news stories to durable guides: news already generates search exposure. Keep the release's related-guide links and task directory as clear next steps for readers.

The Vercel sample shows mostly single-page sessions and concentrated country/device traffic. This supports checking traffic quality and keeping the new paths usable on mobile, but it does not establish bot activity, audience fit, or article usefulness. Do not change language targeting or remove content based on country alone. Assess referrers, relevant search queries, and page traffic together as the sample grows.

Keep model pickers and pricing tools off the tools directory until the separate data audit is complete. Leave Config Generator out while it remains a placeholder. Retain news as Updates; do not expand news volume simply to fill a publishing calendar.
