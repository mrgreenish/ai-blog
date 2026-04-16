---
name: validate-all-data
description: Full-site data validation and update for the AI blog. Orchestrates structural integrity, model spec validation, and blog claim validation in the correct order. Use when the user asks to validate, audit, or update all site data, or mentions checking if pages, tools, or model info are outdated.
---

# Validate All Data

Run a complete audit of every data source in the blog. Fix everything that's stale.

## Workflow

```
- [ ] Step 1: Structural integrity (repo-local, no web)
- [ ] Step 2: Model specs (web-backed pricing and naming)
- [ ] Step 3: Blog claims (web-backed factual prose)
- [ ] Step 4: Summary report
```

---

### Step 1: Structural integrity

Follow the **[validate-structural-integrity](.cursor/skills/validate-structural-integrity/SKILL.md)** skill in full.

This must run first. Broken model IDs, invalid tool slugs, or unregistered components will cause false positives in the factual steps. Fix structural issues before moving on.

---

### Step 2: Model specs

Follow the **[validate-model-specs](.cursor/skills/validate-model-specs/SKILL.md)** skill in full.

`src/lib/modelSpecs.ts` is the canonical source of truth for all model data. Fixing it here means subsequent steps validate against correct values.

---

### Step 3: Blog claims

Follow the **[validate-blog-claims](.cursor/skills/validate-blog-claims/SKILL.md)** skill in full.

This validates all MDX prose in `content/` against the now-updated `modelSpecs.ts` and current web sources.

---

### Step 4: Summary report

After all steps complete, output a unified summary:

```
## Validation Summary

### Step 1 — Structural integrity
- pnpm test:integrity: X tests passed
- Manual checks: X issues found

### Step 2 — Model specs
- Models checked: X
- Fields corrected: X (list model IDs and fields)

### Step 3 — Blog claims
- Posts checked: X
- Outdated claims fixed: X

### Total fixes applied: X
### Items needing manual review: X (list them)
```

---

## Important guidelines

- **Fix, don't just report.** Apply every correction you can confirm from an authoritative source. Only leave items as "needs manual review" when you genuinely can't confirm the correct value.
- **modelSpecs.ts is the source of truth for model data.** Never update model data in component files or MDX prose — update the registry and let the components derive from it.
- **Structural issues block factual checks.** Always resolve Step 1 failures before running Steps 2 and 3.
- **Include today's date in web searches** to get current results.
