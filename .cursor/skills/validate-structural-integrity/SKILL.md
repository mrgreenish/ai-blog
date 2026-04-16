---
name: validate-structural-integrity
description: Check repo-local structural invariants — slug uniqueness, interactiveTools slugs, MDX component registration, model ID cross-references, article link integrity, and merge conflict markers. No web requests. Run this before validate-blog-claims or validate-model-specs to catch code-level drift first.
---

# Validate Structural Integrity

Run deterministic, repo-local checks across content, data, and code. No web search needed — everything is verified against source files in this repo.

## Workflow

```
- [ ] Step 1: Run the automated integrity suite
- [ ] Step 2: Check for issues the suite cannot catch automatically
- [ ] Step 3: Report and fix
```

---

### Step 1: Run the automated integrity suite

Run the integrity test suite. It covers all the checks below automatically:

```bash
pnpm test:integrity
```

If all tests pass, structural integrity is confirmed. Skip to Step 3 and report "no issues found."

If any tests fail, read the failure output carefully — each assertion names the specific file and value that failed.

---

### Step 2: Manual checks the suite does not cover

The automated suite handles most invariants. These require human judgment:

**2a. New interactive component without a slug**

If a new component exists in `src/components/interactive/` but has no corresponding slug in `InteractiveTool` in `src/lib/types.ts`, it cannot be referenced from MDX. Check:

- Does `src/lib/types.ts` include the slug?
- Does `src/lib/mdxComponents.tsx` include the component?
- Does `src/lib/contentSchema.ts` include the slug in `VALID_INTERACTIVE_TOOLS`?

All three must be updated together.

**2b. Orphaned articles**

Articles that exist in `content/` but are not reachable from any navigation path. Check:

- Does the article appear in `src/lib/decisionTreeData.ts` as an `articleLink` or `relatedLink`?
- Is it linked from a related article's prose?

Orphaned articles are not errors, but they should be intentional.

**2c. modelPickerScoring coverage gaps**

`src/lib/modelPickerScoring.ts` has explicit `if (modelId === "...")` branches. If a model was added to `MODEL_REGISTRY` but has no scoring branch, it will score 0 for all inputs and never surface in the picker. Check that every model in `MODEL_REGISTRY` has a branch.

---

### Step 3: Report and fix

For each issue found, report using:

```
## [file] — [check]

**Issue:** [what's wrong]
**Fix:** [what was changed or what needs manual review]
```

Apply fixes directly. The canonical locations are:

| What to fix | Where to fix it |
|---|---|
| Missing/invalid `interactiveTools` slug | `src/lib/types.ts` + `src/lib/contentSchema.ts` |
| Unregistered MDX component | `src/lib/mdxComponents.tsx` |
| Stale model ID in data file | `src/lib/scenarioLabData.ts` or `src/lib/modelPickerScoring.ts` |
| Broken article link | `src/lib/decisionTreeData.ts` |
| Merge conflict marker | The file containing the marker |
| Duplicate model ID | `src/lib/modelSpecs.ts` |

---

## Important guidelines

- **This skill is repo-local only.** Do not use web search here. Factual freshness (pricing, model names, tool features) belongs to `validate-model-specs` and `validate-blog-claims`.
- **Run this first.** Structural issues like broken IDs or invalid slugs will cause false positives in the factual validation skills.
- **The automated suite is the source of truth.** If `pnpm test:integrity` passes, structural integrity is confirmed. Manual checks in Step 2 are supplementary.
- **Keep the three files in sync.** `src/lib/types.ts`, `src/lib/mdxComponents.tsx`, and `src/lib/contentSchema.ts` must all agree on which tool slugs and components are valid.
