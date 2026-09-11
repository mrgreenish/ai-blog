# ai-blog

A Next.js blog about AI coding tools — models, workflows, and tooling — with interactive components built in.

## Development

```bash
pnpm install
pnpm dev
```

## Testing

```bash
pnpm test              # watch mode
pnpm test:ci           # full suite, no watch
pnpm test:integrity    # content/structural integrity checks only (fast, repo-local)
```

## Freshness Workflow

The blog covers a fast-moving space. Three types of things go stale:

| Type | What goes stale | How to check |
|---|---|---|
| **Structural** | Broken slugs, unregistered components, stale model IDs in data files | `pnpm test:integrity` — runs in CI on every PR |
| **Model specs** | Pricing, context windows, model names | `validate-model-specs` skill — web-backed, run monthly or after a model release |
| **Blog claims** | Prose references to models, tools, APIs, versions | `validate-blog-claims` skill — web-backed, run before publishing and quarterly |
| **Full audit** | Any combination of the above, or uncertainty about what changed | `validate-all-data` skill — runs structural integrity first, then model specs, then blog claims |

### When to run each check

**Every PR (automated):** `pnpm test:integrity` runs in CI. It catches broken IDs, invalid slugs, unregistered components, and merge markers before they land.

**When adding a new interactive component:** Run `pnpm test:integrity` locally first. You'll need to update three files in sync: `src/lib/types.ts`, `src/lib/mdxComponents.tsx`, and `src/lib/contentSchema.ts`.

**Monthly or after a model release:** Run the `validate-model-specs` skill. Update `PRICING_META.verifiedDate` in `src/lib/modelSpecs.ts` to today's date after every completed audit, even if nothing changed.

**Before publishing a new article:** Run the `validate-blog-claims` skill on the new post.

**Quarterly or before a major launch:** Run the `validate-all-data` skill for a full audit. This is the umbrella workflow when you want to "check everything." It runs the checks in the correct order: `validate-structural-integrity` first to catch repo-local issues, then `validate-model-specs` to refresh `src/lib/modelSpecs.ts`, then `validate-blog-claims` to verify MDX prose against the updated source of truth.

### When to bump `updatedAt`

Add or update the `updatedAt` field in an article's frontmatter when:
- A factual claim in the prose is corrected
- A section is rewritten with new information
- A referenced tool or model name changes

Do not bump `updatedAt` for copy edits, formatting changes, or when a validation audit finds no issues in that article.

### Adding a new interactive component

1. Create the component in `src/components/interactive/`
2. Add its slug to `InteractiveTool` in `src/lib/types.ts`
3. Add the slug to `VALID_INTERACTIVE_TOOLS` in `src/lib/contentSchema.ts`
4. Add the component to `MDX_COMPONENTS` in `src/lib/mdxComponents.tsx`
5. Run `pnpm test:integrity` to confirm everything is wired correctly
6. Reference the slug in your article's `interactiveTools` frontmatter

## Guide discovery and growth

`src/lib/discovery.ts` defines task groups, homepage entry points, and discovery-page metadata. All evergreen chapters appear once in the guide directory. Each chapter can specify `relatedSlugs`; the integrity suite checks targets, uniqueness, and self-links.

The first promotion cycle, ready-to-edit posts, UTM links, and measurement definitions are in [the growth playbook](content/GROWTH_PLAYBOOK.md). The September 2026 account review confirmed Hobby: keep custom events disabled and use page/referrer reporting; UTM reporting is also unavailable on this plan. Custom-event instrumentation can be enabled via `NEXT_PUBLIC_GROWTH_EVENTS_ENABLED=true` at build time if account support changes. Pageview analytics remain in place regardless of this flag.

The debugging guide's downloadable example can be checked with `node --test public/examples/ai-debugging/pagination.test.mjs`. Its broken counterpart is intentionally faulty and used by the content example test to establish a failing baseline.
