# Data Inventory

Complete reference of every data location in the blog, what it contains, and what to validate it against.

---

## Canonical sources of truth

| Source | File | What it defines |
|--------|------|-----------------|
| Model registry | `src/lib/modelSpecs.ts` → `MODEL_REGISTRY` | All model names, pricing, context windows, tiers, personality |
| Pricing metadata | `src/lib/modelSpecs.ts` → `PRICING_META` | `verifiedDate`, currency note |
| Model picker scoring | `src/lib/modelPickerScoring.ts` → `score()` | Hardcoded model IDs used in scoring branches |
| Category metadata | `src/lib/types.ts` → `CATEGORY_META` | Category display names and descriptions |
| Article content | `content/{models,workflows,tooling}/*.mdx` | Prose claims, frontmatter, tool references |

---

## Inline component data

These files contain hardcoded strings that do **not** derive from `modelSpecs.ts`.

### ConfigGenerator.tsx
**File:** `src/components/interactive/ConfigGenerator.tsx`

| Data | Current value | Validate against |
|------|---------------|-----------------|
| Framework string in `MOCK_OUTPUT` | `"Next.js 15 App Router"` | Current Next.js stable version |
| Framework string in preview | `"Next.js 15 (App Router)"` | Current Next.js stable version |
| AI tools string in preview | `"Cursor + Claude Code"` | Current tool names |
| Output file name in preview | `"CLAUDE.md"` | Still the canonical config file name for Claude Code? |
| Config file names in tagline | `.cursorrules`, `CLAUDE.md`, `AGENTS.md` | Still the canonical names for each tool? |

### PromptLab.tsx
**File:** `src/components/interactive/PromptLab.tsx`

| Data | Current value | Validate against |
|------|---------------|-----------------|
| Model name col 1 | `"Claude Sonnet"` | `MODEL_REGISTRY` — does a model with this display name exist? |
| Model name col 2 | `"GPT-4o"` | `MODEL_REGISTRY` — does a model with this display name exist? |

### WorkflowRecipe.tsx
**File:** `src/components/interactive/WorkflowRecipe.tsx`

| Data | Current value | Validate against |
|------|---------------|-----------------|
| Tools step | `"Cursor + Claude Code + GitHub Actions"` | Current tool names |

### FailureGallery.tsx
**File:** `src/components/interactive/FailureGallery.tsx`

| Data | Current value | Validate against |
|------|---------------|-----------------|
| Hallucinated API example | `"next/router.prefetch() with args that don't exist in v13+"` | Still accurate? Next.js router API in current version |

### CostCalculator.tsx
**File:** `src/components/interactive/CostCalculator.tsx`

Contains `SCENARIOS` with token estimates per task type. These are illustrative estimates, not factual claims — validate only if the task descriptions reference specific model names or pricing figures.

### ContextWindowViz.tsx
**File:** `src/components/interactive/ContextWindowViz.tsx`

Contains `SEGMENTS` with token allocation examples. These are illustrative — validate only if specific model names are hardcoded.

### DiffViewer.tsx
**File:** `src/components/interactive/DiffViewer.tsx`

Contains `BEFORE_LINES` / `AFTER_LINES` — illustrative code diff. No factual claims to validate.

---

## Article counts

**File:** `src/app/page.tsx` → `SECTION_ARTICLES`

| Category | Hardcoded count | Actual count (count .mdx files) |
|----------|-----------------|----------------------------------|
| `models` | 4 | Count files in `content/models/` |
| `workflows` | 8 | Count files in `content/workflows/` |
| `tooling` | 7 | Count files in `content/tooling/` |

Current MDX files (as of last audit):
- `content/models/`: `reasoning-vs-fast.mdx`, `design-to-code-and-back.mdx`, `model-personalities.mdx` → **3 files**
- `content/workflows/`: `building-blocks.mdx`, `design-to-storybook.mdx`, `claude-mobile.mdx`, `common-pitfalls.mdx`, `spec-to-pr.mdx`, `bug-to-fix.mdx`, `jira-to-cursor.mdx`, `ai-code-review.mdx`, `prompting-guide.mdx` → **9 files**
- `content/tooling/`: `agents-and-skills.mdx`, `figma-mcp.mdx`, `code-to-canvas.mdx`, `diff-review-loops.mdx`, `cursor-custom-modes.mdx`, `claude-code-codex.mdx`, `agent-guardrails.mdx` → **7 files**

> Always recount by listing the directory — these counts may be stale.

---

## Cross-data consistency targets

### claim-categories.md model table
**File:** `.cursor/skills/validate-blog-claims/claim-categories.md`

The table lists models by registry ID. Must match `MODEL_REGISTRY` exactly:
- Same IDs
- Same display names
- Same providers
- Pricing figures match `inputPer1M` / `outputPer1M`

### modelPickerScoring.ts model IDs
**File:** `src/lib/modelPickerScoring.ts`

Hardcoded model IDs used in `score()` branches:

| ID used in score() | Must exist in MODEL_REGISTRY |
|--------------------|------------------------------|
| `"gemini-flash"` | Check `id` field |
| `"sonnet-4.6"` | Check `id` field |
| `"opus-4.6"` | Check `id` field |
| `"composer-1"` | Check `id` field |
| `"composer-1-5"` | Check `id` field |

Any model in `MODEL_REGISTRY` not handled by `score()` will receive a default score of 0 — flag these as potential gaps.

### MDX interactiveTools frontmatter
**File:** Every `.mdx` in `content/`

The `interactiveTools` frontmatter field lists component names. Valid component names (matching `title` props in `src/components/interactive/`):

| Component file | Title prop |
|----------------|-----------|
| `ModelPicker.tsx` | Model Picker |
| `ModelTinder.tsx` | Model Tinder |
| `ModelMixer.tsx` | Model Mixer |
| `CostCalculator.tsx` | Cost Calculator |
| `ContextWindowViz.tsx` | Context Window Visualizer *(verify exact title)* |
| `DevBenchmark.tsx` | Dev Benchmark *(verify exact title)* |
| `WorkflowRecipe.tsx` | Workflow Recipe |
| `PromptLab.tsx` | Prompt Lab |
| `ConfigGenerator.tsx` | Config Generator |
| `FailureGallery.tsx` | Failure Gallery |
| `DiffViewer.tsx` | Diff Viewer *(verify exact title)* |

### FEATURED_TOOLS in home page
**File:** `src/app/page.tsx` → `FEATURED_TOOLS`

| Name in FEATURED_TOOLS | Expected component title |
|------------------------|--------------------------|
| `"Model Picker"` | `ModelPicker.tsx` title prop |
| `"Cost Calculator"` | `CostCalculator.tsx` title prop |
| `"Prompt Lab"` | `PromptLab.tsx` title prop |
| `"Config Generator"` | `ConfigGenerator.tsx` title prop |

---

## Official pricing sources

| Provider | URL |
|----------|-----|
| Anthropic | https://docs.anthropic.com/en/docs/about-claude/pricing |
| OpenAI | https://openai.com/api/pricing |
| Google | https://ai.google.dev/gemini-api/docs/pricing |
| DeepSeek | https://api-docs.deepseek.com/quick_start/pricing |
| Cursor | https://cursor.com/docs/models |
