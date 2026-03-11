# Claim Categories in This Blog

Reference of verifiable claim types found across the MDX posts in `content/`.

## Canonical model data source

**`src/lib/modelSpecs.ts`** is the single source of truth for all model-specific data. Before checking MDX posts, read this file. It contains the current registry of models with:
- `name` — display name used in components and prose
- `inputPer1M` / `outputPer1M` — pricing per 1M tokens (USD)
- `contextWindowTokens` — context window size in tokens
- `tier` — `fast | balanced | reasoning`
- `provider` — `Anthropic | OpenAI | Google | DeepSeek | Cursor`

When model data in `modelSpecs.ts` is outdated, update it there. Component UIs derive from this registry automatically.

## Model names and identifiers

Build the expected model list from `MODEL_REGISTRY`, not from this file. Current registry rows:

| Registry ID | Display name | Provider | What to check |
|---|---|---|---|
| `gemini-flash` | Gemini 2.0 Flash | Google | Still current name/version? |
| `gpt4o-mini` | GPT-4o mini | OpenAI | Still available? Renamed? |
| `deepseek-v3` | DeepSeek-V3.2 | DeepSeek | Still current? Newer version? |
| `haiku-4.5` | Claude Haiku 4.5 | Anthropic | Still this version/name? |
| `gpt-5.4` | GPT-5.4 | OpenAI | Still current name/version? |
| `composer-1` | Cursor Composer-1 | Cursor | Still this name? Superseded? |
| `sonnet-4.6` | Claude Sonnet 4.6 | Anthropic | Still this version/name? |
| `opus-4.6` | Claude Opus 4.6 | Anthropic | Still this version/name? |
| `composer-1-5` | Composer 1.5 | Cursor | Still this name? Superseded? |

Also check for any model referenced in MDX prose that is **not** in the registry (older Gemini versions, `o3`, `GPT-4o`, etc.) — those are likely stale references unless the post is explicitly historical.

## Context window sizes

The canonical values are `contextWindowTokens` in `src/lib/modelSpecs.ts`. Current registry values:

| Model | Registry value | What to check |
|---|---|---|
| Gemini 2.0 Flash | 1,000,000 | Still 1M? Increased or renamed? |
| GPT-4o mini | 128,000 | Still 128k? |
| DeepSeek-V3.2 | 128,000 | Still 128k? |
| Claude Haiku 4.5 | 200,000 | Still 200k? |
| GPT-5.4 | 1,050,000 | Still 1.05M? |
| Cursor Composer-1 | 128,000 | Still 128k? |
| Claude Sonnet 4.6 | 200,000 | Still 200k? |
| Claude Opus 4.6 | 200,000 | Still 200k? |
| Composer 1.5 | 200,000 | Still 200k? |

## Tools and products

| Tool / product | What to check |
|---|---|
| Claude Code | Still this name? Major workflow changes? |
| Codex on GitHub / GitHub Codex | Current product naming and GitHub workflow still accurate? |
| Cursor BugBot | Still exists? Renamed? |
| Figma MCP | Feature set and setup flow still accurate? |
| Claude Code to Figma | Still available? Workflow still two-way? |
| Browser MCP | Current name and capabilities still accurate? |

## SDK and API references

| Reference | What to check |
|---|---|
| Next.js 15 | Still current stable version? |
| Next.js 16 Cache Components (`use cache`) | API still current? Naming changed? |
| `next-cache-components` | Package/repo still exists and is still the right reference? |
| `npx skills add` | Command still valid? |
| `CLAUDE.md` | Still the standard config file name? |
| `AGENTS.md` | Still used? |
| `.cursorrules` | Still the config name in Cursor? |

## Pricing and cost claims

Canonical pricing is in `src/lib/modelSpecs.ts` (`inputPer1M` / `outputPer1M`). Current registry values to verify against provider pricing pages:

| Model | Input $/1M | Output $/1M | What to check |
|---|---|---|---|
| Gemini 2.0 Flash | $0.10 | $0.40 | Still current? |
| GPT-4o mini | $0.15 | $0.60 | Still current? |
| DeepSeek-V3.2 | $0.28 | $0.42 | Still current? |
| Claude Haiku 4.5 | $1.00 | $5.00 | Still current? |
| GPT-5.4 | $2.50 | $15.00 | Still current? |
| Cursor Composer-1 | $1.25 | $10.00 | Still current? |
| Claude Sonnet 4.6 | $3.00 | $15.00 | Still current? |
| Composer 1.5 | $3.50 | $17.50 | Still current? |
| Claude Opus 4.6 | $5.00 | $25.00 | Still current? |

Also check prose cost comparisons:
- Any claim like "X costs Yx more than Z" should be recomputed from the current registry before deciding whether the prose is stale.

## Capability claims worth verifying

Use extra scrutiny for:
- Versioned feature claims: native tool use, browser/computer use, MCP capabilities, cache APIs, context-window sizes
- Comparative claims that sound factual rather than editorial: "best at format following", "strongest for architecture", "fastest round-trip"
- Time-bound announcements or launch claims, especially references to release months or "new" capabilities

Treat clearly personal experience language ("in my experience", "feels like", "I use") as editorial unless it cites a concrete factual feature or metric.
