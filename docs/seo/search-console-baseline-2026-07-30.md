# Google Search Console baseline — 2026-07-30

Property: `https://www.aifieldnotes.dev/`

This is the pre-deployment baseline for the Google Search Growth and Indexing
Recovery work. Search Console query rows are privacy-filtered, so page-level
performance is the primary prioritization signal.

## Baseline

| Window or report | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 2026-04-29 through 2026-07-28 | 4 | 307 | 1.3% | 19.9 |
| 2026-07-01 through 2026-07-28 | 0 | 196 | 0% | 20.9 |

Indexing report:

- Indexed: 31
- Excluded: 37
- Discovered — currently not indexed: 30
- Crawled — currently not indexed: 7
- Submitted sitemap URLs: 67
- External links reported: 0
- Internal links reported: 3

The repository contains 46 dated news entries. This corrects the preliminary
planning count of 47.

## Priority pages

| Page | Latest 28-day impressions | Average position |
| --- | ---: | ---: |
| `/chapters/jira-to-cursor` | 54 | 18.7 |
| `/chapters/design-to-storybook` | 46 | 17.2 |
| `/chapters/diff-review-loops` | 32 | 29.4 |
| `/chapters/reasoning-vs-fast` | 16 | 18.6 |
| `/chapters/bug-to-fix` | 11 | 12.3 |

## Indexable news allowlist

The 22 entries with `indexable: true` are:

1. GPT-5.6 splits into three durable tiers
2. Cursor productivity study
3. ChatGPT Work becomes a standing agent
4. Claude Fable 5 preview
5. Composer 2.5
6. Codex expands beyond developers
7. GPT-5.5
8. Claude Opus 4.8
9. Kimi K3
10. Claude Sonnet 5
11. Anthropic measures AI building AI
12. Vercel cloud-agent stack
13. Cursor SDK
14. GPT Live
15. Cursor Agentic Security Review
16. Cloud agents on user-controlled hardware
17. Managed Cursor Security Review
18. Cursor agent queue on iPhone
19. Cursor Auto Review run mode
20. Appless
21. Mythos Preview
22. Cursor parallel agents and worktrees

All other dated reports remain public and in RSS but use `noindex,follow` and
are excluded from the sitemap.

## Post-deployment checks

- [ ] Production sitemap contains 41 URLs.
- [ ] Five priority chapters return 200 and self-canonical.
- [ ] `/chapters/ai-code-review` returns 301 to `/chapters/diff-review-loops`.
- [ ] A selected news report is indexable and present in the sitemap.
- [ ] A noindex report remains accessible and is absent from the sitemap.
- [ ] Three Markdown resources return 200.
- [ ] Resubmit `https://www.aifieldnotes.dev/sitemap.xml`.
- [ ] Request indexing for the five priority chapters.

## Measurement template

| Checkpoint | Indexed chapters | Discovered, not indexed | Crawled, not indexed | Priority-page impressions | Priority-page clicks | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Baseline — 2026-07-30 | 5 of 19 | 30 total / 14 chapters | 7 | 159 | 0 | Before consolidation |
| Day 7 |  |  |  |  |  |  |
| Day 14 |  |  |  |  |  |  |
| Day 28 |  |  |  |  |  | Directional goal: at least 10 of 18 chapters indexed |

Do not interpret intentional `noindex` reports as indexing failures. Compare
Google's exclusion reasons with the frontmatter policy before changing scope.

