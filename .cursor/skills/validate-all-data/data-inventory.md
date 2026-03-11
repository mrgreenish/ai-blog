# Data Inventory

Complete reference of every data location in the blog, what it contains, and what to validate it against.

---

## Canonical sources of truth

| Source | File | What it defines |
|--------|------|-----------------|
| Model registry | `src/lib/modelSpecs.ts` → `MODEL_REGISTRY` | Model names, pricing, context windows, tiers, qualitative metadata |
| Pricing metadata | `src/lib/modelSpecs.ts` → `PRICING_META` | `verifiedDate`, attribution copy, provider URLs |
| Model picker scoring | `src/lib/modelPickerScoring.ts` → `score()` | Hardcoded scoring branches by model ID |
| Scenario lab data | `src/lib/scenarioLabData.ts` → `SCENARIOS`, `VERDICT_META` | Scenario labels, recommended model IDs, result cards, cost notes |
| Workflow finder data | `src/lib/decisionTreeData.ts` → `TREE_NODES` | Workflow recommendations, tool names, article links |
| Tool slugs and category metadata | `src/lib/types.ts` → `InteractiveTool`, `CATEGORY_META` | Valid `interactiveTools` slugs and category labels |
| Article content | `content/{models,workflows,tooling}/*.mdx` | Prose claims, frontmatter, embedded tool references |

---

## Centralized interactive data

These are the primary places to audit before touching thin render components.

### ScenarioLab data
**File:** `src/lib/scenarioLabData.ts`

- `recommendedModelId` and every `results[].modelId` must exist in `MODEL_REGISTRY`
- Cost notes and price comparisons should not contradict current pricing in `src/lib/modelSpecs.ts`
- Scenario labels, descriptions, and excerpts are editorial unless they make factual product/version claims

### Workflow finder data
**File:** `src/lib/decisionTreeData.ts`

- `model` strings should match current display names when they name a specific model
- `tools` strings should use current product names
- `articleLink` and `relatedLinks` must resolve to real article routes
- Recommendation copy is editorial unless it includes factual model/version/product claims

### Workflow recipe data
**File:** `src/components/interactive/WorkflowRecipe.tsx`

- `RECIPES[].tools` strings should use current product names
- Config file names like `SKILL.md`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules` should still be canonical
- Workflow copy is editorial unless it includes factual version/product claims

### Legacy aliases
**Files:** `src/components/interactive/PromptLab.tsx`, `src/components/interactive/DevBenchmark.tsx`

These are re-export shims to `ScenarioLab`. Do **not** audit them for content strings. Only confirm alias behavior if `prompt-lab` / `dev-benchmark` still appear in frontmatter or MDX embeds.

---

## Inline component data

These files still contain a few reader-visible strings that do not come from centralized data modules.

### ConfigGenerator.tsx
**File:** `src/components/interactive/ConfigGenerator.tsx`

| Data | Current value | Validate against |
|------|---------------|-----------------|
| Framework string in `MOCK_OUTPUT` | `"Next.js 15 App Router"` | Current Next.js stable version |
| Framework string in preview | `"Next.js 15 (App Router)"` | Current Next.js stable version |
| AI tools string in preview | `"Cursor + Claude Code"` | Current tool names |
| Output file name in preview | `"CLAUDE.md"` | Still the canonical config file name for Claude Code? |
| Config file names in tagline | `.cursorrules`, `CLAUDE.md`, `AGENTS.md` | Still the canonical names for each tool? |

### FailureGallery.tsx
**File:** `src/components/interactive/FailureGallery.tsx`

| Data | Current value | Validate against |
|------|---------------|-----------------|
| Hallucinated API example | `"next/router.prefetch() with args that don't exist in v13+"` | Still accurate for current Next.js router APIs? |

### ContextWindowViz.tsx
**File:** `src/components/interactive/ContextWindowViz.tsx`

Contains `SEGMENTS` with token allocation examples. These are illustrative. Validate only if they imply factual model/version claims.

### CostCalculator.tsx
**File:** `src/components/interactive/CostCalculator.tsx`

Scenario presets and token estimates are illustrative. Validate only if task descriptions reference specific model names, prices, or versioned product claims.

---

## Article counts

**File:** `src/app/page.tsx` → `SECTION_ARTICLES`

Compare the current object values in `src/app/page.tsx` against the actual `.mdx` counts:

| Category | Compare against | Actual count |
|----------|------------------|--------------|
| `models` | `SECTION_ARTICLES.models` | 3 |
| `workflows` | `SECTION_ARTICLES.workflows` | 7 |
| `tooling` | `SECTION_ARTICLES.tooling` | 7 |

Current MDX files:
- `content/models/`: `reasoning-vs-fast.mdx`, `design-to-code-and-back.mdx`, `model-personalities.mdx`
- `content/workflows/`: `building-blocks.mdx`, `bug-to-fix.mdx`, `jira-to-cursor.mdx`, `spec-to-pr.mdx`, `ai-code-review.mdx`, `design-to-storybook.mdx`, `ai-mindset.mdx`
- `content/tooling/`: `agent-guardrails.mdx`, `figma-mcp.mdx`, `cursor-custom-modes.mdx`, `code-to-canvas.mdx`, `agents-and-skills.mdx`, `diff-review-loops.mdx`, `claude-code-codex.mdx`

> Always recount by listing the directory. These lists can drift.

---

## Cross-data consistency targets

### claim-categories.md model table
**File:** `.cursor/skills/validate-blog-claims/claim-categories.md`

The model table must match `MODEL_REGISTRY` exactly:
- Same IDs
- Same display names
- Same providers
- Pricing figures match `inputPer1M` / `outputPer1M`

Build the expected table from `MODEL_REGISTRY`, not from older snapshots in `claim-categories.md`.

### modelPickerScoring.ts model IDs
**File:** `src/lib/modelPickerScoring.ts`

- Extract every `if (modelId === "...")` branch from `score()`
- Each branch ID must exist in `MODEL_REGISTRY`
- `getPickerModelsV2()` returns all registered models, so missing score branches are likely bugs or deliberate defaults that deserve review

### MDX interactiveTools frontmatter
**File:** Every `.mdx` in `content/`

The `interactiveTools` field uses slug IDs. The source of truth is `InteractiveTool` in `src/lib/types.ts`.

Current valid slugs:
- `model-picker`
- `model-tinder`
- `model-mixer`
- `workflow-recipe`
- `scenario-lab`
- `prompt-lab`
- `failure-gallery`
- `dev-benchmark`
- `config-generator`
- `cost-calculator`
- `context-window-viz`
- `decision-tree`

`prompt-lab` and `dev-benchmark` are legacy aliases that currently point to `ScenarioLab`.

### FEATURED_TOOLS in home page
**File:** `src/app/page.tsx` → `FEATURED_TOOLS`

| Name in FEATURED_TOOLS | Expected tool |
|------------------------|---------------|
| `"Model Picker"` | `src/components/interactive/ModelPicker.tsx` |
| `"Cost Calculator"` | `src/components/interactive/CostCalculator.tsx` |
| `"Scenario Lab"` | `src/components/interactive/ScenarioLab.tsx` |
| `"Config Generator"` | `src/components/interactive/ConfigGenerator.tsx` |

---

## Official pricing sources

| Provider | URL |
|----------|-----|
| Anthropic | https://docs.anthropic.com/en/docs/about-claude/pricing |
| OpenAI | https://openai.com/api/pricing |
| Google | https://ai.google.dev/gemini-api/docs/pricing |
| DeepSeek | https://api-docs.deepseek.com/quick_start/pricing |
| Cursor | https://cursor.com/docs/models-and-pricing |
