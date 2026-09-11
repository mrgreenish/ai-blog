# Data audit — September 11, 2026

This audit followed the repository's `validate-all-data` workflow: structural integrity first, the shared model registry second, and factual article claims third. Provider documentation was treated as authoritative for current model names, context limits, modalities, and API prices. Vendor benchmark numbers remain attributed to the vendor rather than presented as independent results.

## Structural integrity

- Checked 19 chapters and 51 dated updates.
- Confirmed unique chapter slugs and numbers, valid frontmatter, registered MDX components, valid model IDs, and valid internal chapter, update, and download links.
- Added all five current models to the shared selectors used by the picker, mixer, cost calculator, context comparison, scenario lab, failure gallery, model comparison, Tinder, guidelines, and Max Mode calculator.
- Added Tinder conversation data for the four newly registered models. Kimi K3 already had one.
- Updated the search-index selection to 26 of 51 updates; the Kimi weights follow-up is a brief and remains non-indexable.

## Model specifications

Twenty-one registry records were checked. Four current records were added:

| Model | Standard input / output per 1M tokens | Context | Current pricing detail |
| --- | ---: | ---: | --- |
| Gemini 3.8 Flash | $1.50 / $7.50 | 1,048,576 | $0.75 / $3.75 through Dec. 31, 2026 |
| Claude Fable 5.1 | $10 / $50 | 1,000,000 | Cached reads are $0.25 per 1M tokens |
| GPT-6 Astra | $10 / $50 | 1,050,000 | Above 272K input: 2× input and 1.5× output |
| DeepSeek-V4.1-Flash | $0.30 / $1.20 peak | 1,000,000 | Off-peak uncached rates are $0.15 / $0.60 |

Kimi K3 remains $3 / $15 for cache-miss input/output with a 1,048,576-token context; its full weights are now published under the Kimi K3 license.

Corrections to existing records:

- GPT-5.6 Luna: $1 / $6 → $0.20 / $1.20.
- GPT-5.6 Terra: $2.50 / $15 → $2 / $12.
- GPT-5.6 Sol: $5 / $30 → $4 / $20. OpenAI calls this promotional through at least Nov. 21, so it must be checked again after that date.
- Claude Sonnet 5: retained at $2 / $10 after Anthropic cancelled the planned increase.
- Gemini 3 Flash and Gemini 3.1 Pro: clarified the Preview names.
- DeepSeek-V4-Flash: marked as historical and retired from current recommendations; compatibility aliases now route to V4.1 Flash.
- OpenAI models and Gemini 3.1 Pro: added documented long-context pricing thresholds to the shared estimator.
- Claude Opus fast mode: clarified as Claude Opus 5 Fast and first-party availability.

Primary references: [OpenAI pricing](https://developers.openai.com/api/docs/pricing), [Astra model page](https://developers.openai.com/api/docs/models/gpt-6-astra), [OpenAI changelog](https://developers.openai.com/api/docs/changelog), [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing), [Fable 5.1 model page](https://platform.claude.com/docs/en/models/fable-5-1/overview), [Google pricing](https://ai.google.dev/gemini-api/docs/pricing), [Gemini 3.8 Flash model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash), [DeepSeek pricing and model details](https://api-docs.deepseek.com/quick_start/pricing/), [Kimi K3 model card](https://huggingface.co/moonshotai/Kimi-K3), [Kimi API](https://platform.kimi.ai/), and [Cursor model pricing](https://cursor.com/docs/models-and-pricing).

## Article claims

All 70 MDX documents were scanned for dated product claims, model names, prices, context limits, benchmark language, and primary-source links. The changes with a current factual impact were:

- Added five sourced September updates for Fable 5.1, Gemini 3.8 Flash, GPT-6 Astra, DeepSeek-V4.1-Flash, and the Kimi K3 weights.
- Replaced old GPT-5.6 prices and documented the temporary status of Sol's rate.
- Corrected the Sonnet 5 article after Anthropic cancelled its planned price rise.
- Corrected the July Kimi K3 article now that the promised weights have shipped.
- Removed an unsupported absolute claim that self-hosted Cursor workers keep all code and secrets inside the user's infrastructure. Cursor's agent loop remains in its cloud while tool calls run on the user's machine.
- Narrowed screenshot accessibility advice to visible issues; DOM semantics and keyboard behavior require the rendered interface.
- Corrected “Tailwind's cva” to the separate `class-variance-authority` package.
- Replaced an unrelated privacy-help link in the ChatGPT Work article and removed unsupported comparative claims.
- Kept original model-session anecdotes as dated personal observations. New models are explicitly marked “not tested” wherever local results do not exist.

## Verification result

- `pnpm test:ci`: 135 tests passed in 9 files.
- `npx tsc --noEmit`: passed.
- TypeScript/TSX ESLint: passed. The repository does not configure ESLint to parse MDX; MDX is compiled by Next.js instead.
- `pnpm build`: passed, including all 156 generated pages.
- `git diff --check`: passed.

## Manual review

Three evidence limits remain visible rather than being guessed away:

1. Historical Dev Benchmark pass/fail cells do not have preserved run logs. Newly added models are marked “not tested,” and the UI says the older matrix is an editorial record rather than a fresh benchmark.
2. The May 19 Karpathy update uses Karpathy's own X post as its primary source; no equivalent Anthropic hiring announcement was found during this audit.
3. The July 6 Appless update also relies on its founder's X announcement. Its claims should be rechecked if a durable first-party product page appears.

The next time-sensitive checks are GPT-5.6 Sol after Nov. 21, 2026 and Gemini 3.8 Flash after Dec. 31, 2026. Gemini's boundary is encoded in the calculator and covered by a test; Sol's future price is not yet published, so the current rate carries a recheck note rather than a guessed replacement.
