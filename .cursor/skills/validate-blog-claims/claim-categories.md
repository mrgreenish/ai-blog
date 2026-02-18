# Claim Categories in This Blog

Reference of verifiable claim types found across the 17 MDX posts in `content/`.

## Canonical model data source

**`src/lib/modelSpecs.ts`** is the single source of truth for all model-specific data. Before checking MDX posts, read this file. It contains the current registry of models with:
- `name` — display name used in components and prose
- `inputPer1M` / `outputPer1M` — pricing per 1M tokens (USD)
- `contextWindowTokens` — context window size in tokens
- `tier` — `fast | balanced | reasoning`
- `provider` — `Anthropic | OpenAI | Google | DeepSeek | Cursor`

When model data in `modelSpecs.ts` is outdated, update it there. Component UIs (ModelMixer, CostCalculator, ContextWindowViz, etc.) all derive from this registry automatically.

## Model names and identifiers

These are the models currently registered in `MODEL_REGISTRY` in `src/lib/modelSpecs.ts`. Check if any have been renamed, deprecated, or superseded:

| Registry ID | Display name | Provider | Posts referencing it | What to check |
|---|---|---|---|---|
| `gemini-flash` | Gemini 2.0 Flash | Google | reasoning-vs-fast, model-personalities, long-context | Still current version? Gemini 2.5 released? |
| `gpt4o-mini` | GPT-4o mini | OpenAI | reasoning-vs-fast | Still available? Renamed? |
| `deepseek-r1` | DeepSeek R1 | DeepSeek | reasoning-vs-fast | Still current? Newer version (R2, etc.)? |
| `haiku-4.5` | Claude Haiku 4.5 | Anthropic | reasoning-vs-fast | Still this version? Haiku 4.6 released? |
| `composer-1` | Cursor Composer-1 | Cursor | model-personalities, coding-refactor-vs-greenfield | Still this name? Superseded? |
| `o3` | o3 | OpenAI | reasoning-vs-fast, coding-refactor-vs-greenfield | Still current name? Successor released? |
| `gpt4o` | GPT-4o | OpenAI | model-personalities, coding-refactor-vs-greenfield | Still current? GPT-4.5/5 released? |
| `sonnet-4.6` | Claude Sonnet 4.6 | Anthropic | model-personalities, coding-refactor-vs-greenfield | Still this version? Sonnet 5 released? |
| `opus-4.6` | Claude Opus 4.6 | Anthropic | model-personalities | Version number? Still available? |
| `o3-pro` | o3-pro | OpenAI | reasoning-vs-fast | Still available? Renamed? |
| `composer-1-5` | Cursor Composer-1.5 | Cursor | model-personalities | Still this name? Superseded? |

Also check for any model referenced in MDX prose that is **not** in the registry (e.g. `o1`, older Gemini versions) — those may be stale references.

## Context window sizes

The canonical values are `contextWindowTokens` in `src/lib/modelSpecs.ts`. Current registry values:

| Model | Registry value | Post | What to check |
|---|---|---|---|
| Claude Sonnet 4.6 | 200,000 | long-context | Still 200k? |
| Gemini 2.0 Flash | 1,000,000 | long-context | Still 1M? Increased? |
| GPT-4o | 128,000 | long-context | Still 128k? |
| Cursor Composer-1 | 128,000 | — | Still 128k? |
| Cursor Composer-1.5 | 200,000 | — | Still 200k? |

## Tools and products

| Tool | Posts | What to check |
|---|---|---|
| Claude Code | claude-code-codex, agent-guardrails | Still this name? Major feature changes? |
| GitHub Codex | claude-code-codex, ai-code-review | Still this name? Still GitHub-native? |
| Cursor BugBot | ai-code-review | Still exists? Renamed? |
| Figma MCP | figma-mcp, code-to-canvas, design-to-storybook, vision-tasks | Feature set still accurate? |
| Figma Code to Canvas | code-to-canvas | Still available? How it works changed? |

## SDK and API references

| Reference | Post | What to check |
|---|---|---|
| Next.js 15 | long-context | Is 15 still current or is there a newer stable? |
| Next.js 16 Cache Components (`use cache`) | agents-and-skills | Still in Next.js 16? API changed? |
| `vercel-labs/next-skills` repo | agents-and-skills | Repo still exists? Renamed? |
| `npx skills add` command | agents-and-skills | Command still valid? |
| CLAUDE.md | claude-code-codex, agent-guardrails | Still the standard config file name? |
| AGENTS.md | agent-guardrails, agents-and-skills | Still used? |
| .cursorrules | agent-guardrails, agents-and-skills | Still the config name in Cursor? |

## Pricing and cost claims

Canonical pricing is in `src/lib/modelSpecs.ts` (`inputPer1M` / `outputPer1M`). Current registry values to verify against provider pricing pages:

| Model | Input $/1M | Output $/1M | Post | What to check |
|---|---|---|---|---|
| Gemini 2.0 Flash | $0.10 | $0.40 | reasoning-vs-fast | Still current? |
| GPT-4o mini | $0.15 | $0.60 | reasoning-vs-fast | Still current? |
| DeepSeek R1 | $0.55 | $2.19 | reasoning-vs-fast | Still current? |
| Claude Haiku 4.5 | $1.00 | $5.00 | reasoning-vs-fast | Still current? |
| Cursor Composer-1 | $1.25 | $10.00 | — | Still current? |
| o3 | $2.00 | $8.00 | reasoning-vs-fast | Still current? |
| GPT-4o | $2.50 | $10.00 | — | Still current? |
| Claude Sonnet 4.6 | $3.00 | $15.00 | reasoning-vs-fast | Still current? |
| Cursor Composer-1.5 | $3.00 | $15.00 | — | Still current? |
| Claude Opus 4.6 | $5.00 | $25.00 | — | Still current? |
| o3-pro | $20.00 | $80.00 | — | Still current? |

Also check prose cost comparisons:

| Claim | Post | What to check |
|---|---|---|
| "cost 15x more than Sonnet" (about o3) | reasoning-vs-fast | Current pricing ratio between o3 and Sonnet |

## Capability claims worth verifying

| Claim | Post | What to check |
|---|---|---|
| Gemini "lost in the middle" problem | long-context | Has this been fixed in newer Gemini versions? |
| "GPT is the most consistent at following output format instructions" | model-personalities | Still true with latest GPT and competing models? |
