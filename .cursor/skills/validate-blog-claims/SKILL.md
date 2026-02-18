---
name: validate-blog-claims
description: Validate factual claims in blog posts against current information. Checks AI model names/versions, tool features, context window sizes, pricing, API references, and capability claims. Use when the user asks to validate, fact-check, audit, or verify blog content, or mentions checking if claims are outdated.
---

# Validate Blog Claims

Scan all MDX blog posts in `content/` for verifiable factual claims, check them against current information using web search, and report only the ones that are outdated or incorrect.

## Workflow

Copy this checklist and track progress:

```
- [ ] Step 1: Scan posts for claims
- [ ] Step 2: Categorize and prioritize
- [ ] Step 3: Verify against current info
- [ ] Step 4: Report findings
```

### Step 1: Scan posts for claims

**First, read `src/lib/modelSpecs.ts`.** This is the canonical source of truth for all model-specific data in this blog — names, pricing, context windows, tiers, and personality. Use it as the baseline when validating model-related claims. Any discrepancy between a blog post and `modelSpecs.ts` is a candidate issue.

Then read all `.mdx` files in `content/models/`, `content/tooling/`, and `content/workflows/`. Extract every verifiable factual claim. Focus on:

1. **Model names and versions** — check against the `name` and `id` fields in `MODEL_REGISTRY` in `src/lib/modelSpecs.ts`. Also check if any models in the registry have been renamed, deprecated, or superseded since the registry was last updated.
2. **Context window sizes** — check against `contextWindowTokens` in `MODEL_REGISTRY`. Also verify these are still current via web search.
3. **Pricing claims** — check against `inputPer1M` / `outputPer1M` in `MODEL_REGISTRY`. Pricing changes without notice; always verify against current provider pricing pages.
4. **Tool names and features** — Claude Code, Codex, Cursor BugBot, Figma MCP, etc.
5. **API/SDK references** — Next.js versions, `use cache`, specific package names, install commands
6. **Capability claims** — what a model or tool can/cannot do
7. **Product availability** — features described as available or in beta

For each claim, record: the file, the exact quote, and the category.

For detailed claim categories and known claims in this blog, see [claim-categories.md](claim-categories.md).

> **Note on fixing model data:** If a model name, price, or context window is outdated, the fix goes in `src/lib/modelSpecs.ts` — not in the MDX files. The components that render interactive tools (ModelMixer, CostCalculator, ContextWindowViz, etc.) all pull from that registry. Only prose references in `.mdx` files need direct edits.

### Step 2: Categorize and prioritize

Prioritize verification in this order (most likely to go stale first):

1. Model versions and names (models get renamed/deprecated frequently)
2. Pricing and cost comparisons (change without notice)
3. Context window sizes (increase over time)
4. Tool features and availability (evolve rapidly)
5. SDK/API references (versions change)
6. General capability claims (slower to change)

### Step 3: Verify against current info

For each claim, use **WebSearch** to check current accuracy. Use targeted queries:

| Claim type | Example search query |
|---|---|
| Model version | `"Claude Opus" latest version 2026` |
| Context window | `"Gemini" context window size tokens 2026` |
| Tool feature | `"Cursor BugBot" features 2026` |
| Pricing | `"Claude API pricing" per token 2026` |
| SDK version | `"Next.js" latest stable version` |
| Product rename | `"GitHub Codex" renamed OR deprecated 2026` |

**Only flag a claim if it is demonstrably outdated or incorrect.** Do not flag:
- Subjective opinions or personal experiences
- General advice that remains valid
- Claims that are still accurate

### Step 4: Report findings

For each outdated claim, report using this format:

```
## [filename.mdx] — [claim category]

**Current text:**
> [exact quote from the post]

**Issue:** [what's wrong — be specific]

**Current reality:** [what's accurate now, with source]

**Suggested fix:**
> [replacement text that preserves the author's voice and style]
```

Group findings by file. If a post has no outdated claims, don't mention it.

### Summary

After all findings, add a summary:

```
## Summary

- Posts checked: X/17
- Posts with outdated claims: X
- Total outdated claims: X
- By category: models (X), pricing (X), tools (X), APIs (X)
```

## Important guidelines

- **Preserve the author's voice.** Suggestions should match the conversational, opinionated writing style. Don't make them sound like documentation.
- **Don't rewrite paragraphs.** Only suggest the minimal change needed to fix the factual issue.
- **Flag uncertainty.** If you can't definitively confirm whether a claim is still accurate, note it as "needs manual verification" rather than suggesting a change.
- **Include today's date** in every search query to get the most current results.
- **Check model naming carefully.** AI companies frequently rename models (e.g., GPT-4 Turbo → GPT-4o, Claude 3 → Claude 3.5 → Claude 4). A model name that was correct 6 months ago may now refer to something different.
