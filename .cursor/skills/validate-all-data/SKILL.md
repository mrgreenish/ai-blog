---
name: validate-all-data
description: Full-site data validation and update for the AI blog. Orchestrates model spec validation, blog claim validation, centralized interactive data checks, article count consistency, and cross-data integrity. Use when the user asks to validate, audit, or update all site data, or mentions checking if pages, tools, or model info are outdated.
---

# Validate All Data

Run a complete audit of every data source in the blog — model specs, blog prose, interactive tool data, article counts, and cross-file consistency. Fix everything that's stale.

## Workflow

```
- [ ] Step 1: Validate model specs (source of truth first)
- [ ] Step 2: Validate blog claims in MDX posts
- [ ] Step 3: Validate interactive tool data
- [ ] Step 4: Validate article counts
- [ ] Step 5: Cross-data consistency checks
- [ ] Step 6: Summary report
```

---

### Step 1: Validate model specs

Follow the **[validate-model-specs](.cursor/skills/validate-model-specs/SKILL.md)** skill in full.

This must run first — `src/lib/modelSpecs.ts` is the canonical source of truth for all model data. Fixing it here means subsequent steps validate against correct values.

---

### Step 2: Validate blog claims

Follow the **[validate-blog-claims](.cursor/skills/validate-blog-claims/SKILL.md)** skill in full.

This validates all MDX prose in `content/` against the now-updated `modelSpecs.ts` and current web sources.

---

### Step 3: Validate interactive tool data

Interactive tool content now lives across centralized data modules and a few inline component literals. Read each file listed in [data-inventory.md](data-inventory.md) under **Centralized interactive data** and **Inline component data**.

For each file:

1. Identify whether the file is a canonical data source, a render component, or a thin alias/re-export shim.
2. Extract reader-visible factual strings: model IDs, model names, tool names, framework versions, config file names, URLs, article slugs, pricing/cost statements.
3. **Model references** — cross-reference IDs against `MODEL_REGISTRY.id` and display names against `MODEL_REGISTRY.name` in `src/lib/modelSpecs.ts`.
4. **Tool and article references** — cross-reference tool slugs against `InteractiveTool` in `src/lib/types.ts`, and article links/slugs against real files in `content/`.
5. **Framework/tool versions** — WebSearch for current stable version. Example queries:
   - `"Next.js" latest stable version 2026`
   - `"Cursor" latest version 2026`
   - `"Claude Code" current name 2026`
6. **Config file names** (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`) — verify these are still the canonical names used by each tool.
7. Apply fixes directly to the canonical data file. Do **not** edit thin alias files like `PromptLab.tsx` or `DevBenchmark.tsx` unless you are intentionally changing alias behavior.

Report each fix using:

```
## [FileName] — [field/string]

**Old value:** [stale string]
**New value:** [corrected string]
**Reason:** [why it changed]
```

---

### Step 4: Validate article counts

Read `src/app/page.tsx` and compare `SECTION_ARTICLES` against the actual `.mdx` files in each content directory:

- `content/models/` → compare to `models`
- `content/workflows/` → compare to `workflows`
- `content/tooling/` → compare to `tooling`

If any count is wrong, update `SECTION_ARTICLES` in `src/app/page.tsx` to match. Do not copy old count snapshots into this skill — always recount from the directories.

---

### Step 5: Cross-data consistency checks

Run these four checks in order:

**5a. claim-categories.md model table**
Read `.cursor/skills/validate-blog-claims/claim-categories.md`. The model table lists every model by registry ID. Compare it against `MODEL_REGISTRY` in `src/lib/modelSpecs.ts`:
- Any model in the registry missing from the table? Add it.
- Any model in the table not in the registry? Remove or update it.
- Any display names, providers, or pricing figures in the table that don't match the registry? Correct them.
- Build the expected model list from `MODEL_REGISTRY`, not from older snapshots in the claim-categories file.

**5b. modelPickerScoring.ts model IDs**
Read `src/lib/modelPickerScoring.ts`. The `score()` function branches on hardcoded model IDs. Extract every `modelId` branch and verify each one exists as an `id` in `MODEL_REGISTRY`. Flag any that don't — the picker will silently skip those models.

**5c. MDX interactiveTools frontmatter**
Read the frontmatter of every `.mdx` file in `content/`. The `interactiveTools` field uses slug IDs, not component titles. Verify every value matches the `InteractiveTool` union in `src/lib/types.ts` (examples: `scenario-lab`, `workflow-recipe`, `decision-tree`). Flag any invalid or stale slugs.

**5d. FEATURED_TOOLS in home page**
Read `src/app/page.tsx`. The `FEATURED_TOOLS` array lists tool names and descriptions. Verify each `name` matches the visible title or canonical label of the corresponding interactive tool component. Flag mismatches.

Report each issue using:

```
## [check] — [file]

**Issue:** [description]
**Fix:** [what was changed or what needs manual review]
```

---

### Step 6: Summary report

After all steps complete, output a unified summary:

```
## Validation Summary

### Step 1 — Model specs
- Models checked: X
- Fields corrected: X (list model IDs and fields)

### Step 2 — Blog claims
- Posts checked: X
- Outdated claims fixed: X

### Step 3 — Interactive tool data
- Data sources checked: X
- Strings updated: X

### Step 4 — Article counts
- Counts checked: 3
- Counts corrected: X

### Step 5 — Cross-data consistency
- claim-categories.md: X issues fixed
- modelPickerScoring.ts: X issues found
- MDX interactiveTools: X issues found
- FEATURED_TOOLS: X issues found

### Total fixes applied: X
### Items needing manual review: X (list them)
```

---

## Important guidelines

- **Fix, don't just report.** Apply every correction you can confirm from an authoritative source. Only leave items as "needs manual review" when you genuinely can't confirm the correct value.
- **modelSpecs.ts is the source of truth for model data.** Never update model data in component files or MDX prose — update the registry and let the components derive from it.
- **Centralized data modules beat render shims.** Prefer files like `src/lib/scenarioLabData.ts` and `src/lib/decisionTreeData.ts` over alias components when fixing tool copy or mappings.
- **Preserve editorial content.** Don't change `why`, `traits`, `bestFor`, `worstFor`, `tagline`, `whenWrong` fields in `modelSpecs.ts` unless the user asks.
- **Include today's date in web searches** to get current results.
- **Avoid hardcoded snapshots in skills.** Derive current model IDs, tool slugs, and article counts from source files each run.
