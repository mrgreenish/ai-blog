# AI Model Guidelines

Internal guidelines page aligned with [Model Selection Guidelines on Confluence](https://confluence.hosted-tools.com/display/IOAIP/Model+Selection+Guidelines).

## Two sources of truth

| Source | Owns |
|--------|------|
| **Confluence** | Page structure, section order, at-a-glance matrix layout, editorial tips |
| **`src/lib/modelSpecs.ts`** | Model names, pricing per 1M tokens, computed example costs, verified date |

When Confluence and the registry disagree (e.g. “Composer 2” vs Composer 2.5, April vs May pricing), **modelSpecs wins**.

## Files

- `guidelinesContent.ts` — structure and editorial copy; references models by `modelId` only
- `guidelinesModels.ts` — resolves IDs to `MODEL_REGISTRY`, pricing helpers
- `_components/GuidelinesDocument.tsx` — shared renderer (`blog` and `sharepoint` variants)
- `page.tsx` — blog route `/ai-model-guidelines`
- `export/page.tsx` — SharePoint HTML + **Copy HTML** at `/ai-model-guidelines/export`

## Workflow

1. **Structure changes** — edit Confluence, then sync `guidelinesContent.ts` (sections, matrix rows, tips).
2. **Price or model changes** — run the `validate-model-specs` skill, update `modelSpecs.ts`, then refresh the guidelines pages.
3. **SharePoint** — open `/ai-model-guidelines/export`, click **Copy HTML**, paste into SharePoint’s HTML/source editor. Do not edit prices in SharePoint as the source of truth.
4. **Image** — the reasoning-effort screenshot uses `/images/cursor-reasoning-effort.png`. Upload it to SharePoint or update the `img` URL after paste.

## Validation

```bash
pnpm test:integrity
```

The integrity suite checks that every `modelId` in `guidelinesContent.ts` and `GUIDELINES_MODEL_IDS` exists in `MODEL_REGISTRY`.
