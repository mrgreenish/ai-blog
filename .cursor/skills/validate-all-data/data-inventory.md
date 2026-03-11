# Data Inventory

How to discover every data location in the blog. Use this as a discovery guide, not a snapshot. Always derive current values from source files.

---

## Canonical sources of truth

| Source | File | What it defines |
|--------|------|-----------------|
| Model registry | `src/lib/modelSpecs.ts` → `MODEL_REGISTRY` | Model names, pricing, context windows, tiers, qualitative metadata |
| Pricing metadata | `src/lib/modelSpecs.ts` → `PRICING_META` | `verifiedDate`, attribution copy, provider URLs |
| Valid tool slugs | `src/lib/types.ts` → `InteractiveTool` | All valid `interactiveTools` frontmatter values |
| MDX component registry | `src/lib/mdxComponents.tsx` → `MDX_COMPONENTS` | All JSX components available inside MDX articles |
| Frontmatter schema | `src/lib/contentSchema.ts` → `VALID_INTERACTIVE_TOOLS` | Mirrors `InteractiveTool` — must stay in sync |
| Model picker scoring | `src/lib/modelPickerScoring.ts` → `scoreDimensions()` | Hardcoded scoring branches by model ID |
| Scenario lab data | `src/lib/scenarioLabData.ts` → `SCENARIOS` | Scenario labels, recommended model IDs, result cards |
| Workflow finder data | `src/lib/decisionTreeData.ts` → `TREE_NODES` | Workflow recommendations, tool names, article links |
| Article content | `content/{models,workflows,tooling}/*.mdx` | Prose claims, frontmatter, embedded tool references |

---

## How to discover current state

**Article counts:** Count `.mdx` files in each `content/` subdirectory. Do not use hardcoded numbers — the homepage derives counts at build time from the filesystem.

**Valid tool slugs:** Read `InteractiveTool` in `src/lib/types.ts`. That union is the authoritative list.

**Registered MDX components:** Read `MDX_COMPONENTS` in `src/lib/mdxComponents.tsx`. That object is the authoritative list.

**Model IDs:** Read `MODEL_REGISTRY` in `src/lib/modelSpecs.ts`. Build any verification checklist from the live file.

**Article links:** Read `TREE_NODES` in `src/lib/decisionTreeData.ts`. Every `articleLink.href` and `relatedLinks[].href` must resolve to a real `.mdx` file.

---

## Where to make fixes

| What changed | Where to fix it |
|---|---|
| Model name, price, context window, tier | `src/lib/modelSpecs.ts` → `MODEL_REGISTRY` |
| New interactive tool | `src/lib/types.ts` + `src/lib/mdxComponents.tsx` + `src/lib/contentSchema.ts` |
| Stale model ID in scenario or scoring | `src/lib/scenarioLabData.ts` or `src/lib/modelPickerScoring.ts` |
| Broken article link | `src/lib/decisionTreeData.ts` |
| Stale tool name or config filename | `src/components/interactive/WorkflowRecipe.tsx` or `src/components/interactive/ConfigGenerator.tsx` |
| Stale prose claim | The `.mdx` file containing the claim |

---

## Official pricing sources

| Provider | URL |
|----------|-----|
| Anthropic | https://docs.anthropic.com/en/docs/about-claude/pricing |
| OpenAI | https://openai.com/api/pricing |
| Google | https://ai.google.dev/gemini-api/docs/pricing |
| DeepSeek | https://api-docs.deepseek.com/quick_start/pricing |
| Cursor | https://cursor.com/docs/models-and-pricing |
