# Claim Categories

Taxonomy of verifiable claim types found across the MDX posts in `content/`. Use this as a heuristic guide for what to look for and how to prioritize. Do not use this file as a data source — always derive current values from `src/lib/modelSpecs.ts` and the live content files.

---

## Canonical data sources

Before checking any claim, read these files:

- **`src/lib/modelSpecs.ts`** — canonical source for model names, pricing, context windows, tiers, and providers. Any discrepancy between a blog post and `modelSpecs.ts` is a candidate issue.
- **`src/lib/types.ts`** — canonical source for valid `interactiveTools` slugs.

---

## Claim types by staleness risk

### 1. Model names and versions (highest risk)

AI companies rename models frequently. A model name that was correct 6 months ago may now refer to something different or be deprecated.

**What to look for:**
- Specific model names in prose: "Claude Sonnet 4.6", "GPT-5.4", "Gemini 2.0 Flash"
- Version numbers that may have incremented
- References to models that may have been superseded or discontinued

**How to verify:** Cross-reference against `MODEL_REGISTRY` in `modelSpecs.ts`, then verify against the provider's current documentation.

---

### 2. Pricing and cost comparisons (highest risk)

Pricing changes without notice. Any prose claim about cost — absolute or relative — can go stale.

**What to look for:**
- Dollar amounts: "$X per million tokens", "costs $Y"
- Relative comparisons: "X costs 3× more than Y", "cheapest option"
- Cost justifications that depend on specific price ratios

**How to verify:** Cross-reference against `inputPer1M` / `outputPer1M` in `modelSpecs.ts`, then verify against the provider's current pricing page.

---

### 3. Context window sizes (high risk)

Context windows increase over time. Claims about specific token limits become stale as models are updated.

**What to look for:**
- Token counts: "200K tokens", "1M context window"
- Relative size claims: "largest context window", "fits your entire codebase"
- Specific line-count equivalents derived from token counts

**How to verify:** Cross-reference against `contextWindowTokens` in `modelSpecs.ts`, then verify against current documentation.

---

### 4. Tool names and features (high risk)

AI tooling evolves rapidly. Products get renamed, features change, and workflows shift.

**What to look for:**
- Product names: "Claude Code", "Cursor BugBot", "Codex on GitHub", "Figma MCP"
- Feature availability: "supports X", "can do Y", "doesn't yet support Z"
- Setup workflows that may have changed
- Config file names: `CLAUDE.md`, `SKILL.md`, `.claude/agents/`

**How to verify:** Web search for the current product name and feature set.

---

### 5. SDK and API references (medium risk)

Framework versions and API shapes change, but less frequently than pricing.

**What to look for:**
- Framework versions: "Next.js 15", "React 19"
- Specific API names: `use cache`, `next-cache-components`
- Install commands and package names
- CLI commands: `npx skills add`

**How to verify:** Web search for the current stable version or package.

---

### 6. Capability claims (lower risk)

General claims about what a model or tool can or cannot do. These change, but more slowly.

**What to look for:**
- Comparative capability claims: "best at format following", "strongest for architecture"
- Absolute capability claims: "can run code", "supports vision"
- Claims about failure modes: "tends to hallucinate X", "struggles with Y"

**How to verify:** Web search for current model capability documentation. Be conservative — only flag if demonstrably incorrect.

---

## What not to flag

- Subjective opinions and personal experiences: "in my experience", "feels like", "I prefer"
- General advice that remains valid regardless of specific versions
- Claims that are still accurate
- Editorial voice and style choices

---

## Search query patterns

| Claim type | Example query |
|---|---|
| Model version | `"Claude Sonnet" latest version 2026` |
| Context window | `"Gemini Flash" context window tokens 2026` |
| Tool feature | `"Cursor BugBot" features 2026` |
| Pricing | `"Claude API pricing" per token 2026` |
| SDK version | `"Next.js" latest stable version 2026` |
| Product rename | `"GitHub Codex" renamed OR deprecated 2026` |

Always include the current year in search queries to get the most recent results.
