---
name: validate-model-specs
description: Research and validate all model specs in src/lib/modelSpecs.ts against current official pricing pages and documentation. Use when the user asks to validate, audit, verify, or update model specs, pricing, context windows, or model details in modelSpecs.ts.
---

# Validate Model Specs

Audit every model in `src/lib/modelSpecs.ts` against current official sources. Report discrepancies and apply corrections directly to the file.

## Workflow

```
- [ ] Step 1: Read the registry
- [ ] Step 2: Research each model
- [ ] Step 3: Report findings
- [ ] Step 4: Apply corrections
```

### Step 1: Read the registry

Read `src/lib/modelSpecs.ts` in full. For each entry in `MODEL_REGISTRY`, extract:

- `id`, `name`, `provider`
- `inputPer1M`, `outputPer1M`
- `contextWindowTokens`
- `tier`

Build a checklist of every model to verify.

### Step 2: Research each model

For each model, use **WebSearch** to verify against the provider's official pricing page. Always include the current year in queries.

| Provider | Official source | Example search |
|---|---|---|
| Anthropic | https://docs.anthropic.com/en/docs/about-claude/pricing | `"Claude Sonnet" API pricing per token 2026` |
| OpenAI | https://openai.com/api/pricing | `"GPT-4o mini" API pricing per million tokens 2026` |
| Google | https://ai.google.dev/gemini-api/docs/pricing | `"Gemini Flash" API pricing per token 2026` |
| DeepSeek | https://api-docs.deepseek.com/quick_start/pricing | `"DeepSeek R1" API pricing 2026` |
| Cursor | https://cursor.com/docs/models | `Cursor "Composer 1.5" pricing per token 2026` |

**For each model, verify:**

1. **Name** — does the official name match `name` in the registry? Models get renamed (e.g. "Claude 3.5 Sonnet" → "Claude Sonnet 4.5").
2. **Input price** — does `inputPer1M` match the provider's current input token rate?
3. **Output price** — does `outputPer1M` match the provider's current output token rate?
4. **Context window** — does `contextWindowTokens` match the model's current default context window?
5. **Tier** — is `fast` / `balanced` / `reasoning` still an accurate classification?

Fetch the official pricing page directly with **WebFetch** when search results are ambiguous.

### Step 3: Report findings

For each discrepancy, report:

```
## [model id] — [field]

**Current value:** [value in modelSpecs.ts]
**Correct value:** [value from official source]
**Source:** [URL]
```

If a model has no issues, note it as "verified correct" in a summary table.

### Step 4: Apply corrections

After reporting all findings, apply every correction directly to `src/lib/modelSpecs.ts`. All model data lives in `MODEL_REGISTRY` — that is the only file to edit.

Update `PRICING_META.verifiedDate` to today's date after making corrections.

## Important guidelines

- **Always fetch the live pricing page** when search results conflict or seem stale. Provider pages change without notice.
- **Input vs. cache read**: Some providers (Anthropic, Cursor) distinguish between input, cache write, and cache read prices. Use the standard **input** price for `inputPer1M` (not the cache read rate).
- **Default context window only**: Use the default context window size, not the Max Mode / extended window.
- **Flag uncertainty**: If you cannot confirm a value from an official source, mark it "needs manual verification" rather than guessing.
- **Don't change personality fields** (`why`, `traits`, `bestFor`, `worstFor`, `tagline`, `whenWrong`) unless the user explicitly asks — those are editorial, not factual.
