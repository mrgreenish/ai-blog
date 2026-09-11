# AI Field Notes — editorial workshop

Implemented September 11, 2026, starting from the freshly pulled `main` commit `f72f5fd`.

## Design

Warm ivory, cobalt, and near-black form the publication palette. Locally hosted Geist handles interface and headline typography; Source Serif 4 handles sustained reading; JetBrains Mono handles code and annotations.

The public site now shares an editorial grid, mobile navigation, task-led discovery, redesigned guide and tool directories, recent updates, article section navigation, reading progress, related reading, and a publication footer. Existing tools retain their data and calculation logic. Their shells, controls, labels, and selected states follow the new visual system.

The hero has a brief entrance and pointer response. SVG connectors draw once. Workflow stages respond to hover, and lower sections enter with a small translation. Reduced-motion CSS disables decorative movement; tool animation uses Framer Motion's user preference. Text is server-rendered and never concealed by the new section reveals.

## Verification

- All **138 tests pass**, including new navigation and Markdown heading-index coverage.
- TypeScript, ESLint, production build, and `git diff --check` pass.
- All **156 static outputs** generate successfully.
- Compared **79 rendered page/indexing baselines** against the pre-redesign build: no changes to titles, descriptions, indexing directives, canonicals, JSON-LD, sitemap/robots content, or existing internal-link destinations. Social-image cache hashes are normalized because those image designs changed.
- No duplicate HTML IDs or broken local anchors. **13 cross-page anchors** resolve, including the newly surfaced tools.
- The indexing suite preserves all **51 public news entries**, the **26-entry search selection**, the **49-URL sitemap**, and complete RSS inclusion.
- Browser checks covered homepage, guides, tools, workflow finder, model guide, updates, and search at 375px with no horizontal overflow; desktop and tablet compositions were inspected at 1440px and 768px.
- Verified menu expansion, Escape and focus restoration, mobile article-section jumps, search results and empty results, workflow selection/recommendation/copy feedback, and calculator frequency updates.
- Final production homepage console had no warnings or errors.
- The long-title social card for the spec-file guide was visually checked.

## Performance

Production build comparison on the same machine:

| Page | Previous first-load JS | Redesigned first-load JS |
| --- | ---: | ---: |
| Homepage | 113 kB | 111 kB |
| Guides / tools directory | 105 kB | 105 kB |
| Article routes | 261 kB | 262 kB |
| Workflow finder | 157 kB | 157 kB |

The hero source WebP is **71,868 bytes**, with responsive Next.js image sizing and explicit dimensions. The previous continuously rendered particle brain is no longer loaded by the homepage.

These are bundle measurements and browser smoke checks, not a Lighthouse or field Core Web Vitals comparison. Reduced motion was verified in implementation; an operating-system media-preference toggle, a JavaScript-disabled browser session, and native 200% browser zoom were not available through the browser controls used here.

## Review artifacts

- [Desktop homepage](home-desktop.png)
- [Mobile homepage](home-mobile.png)
- [Desktop article](article-desktop.png)
- [SEO comparison](seo-comparison.json)

Run `pnpm dev` for development or `pnpm build && pnpm start` for production. The review session serves the production build at `http://localhost:3101`.

## Generated artwork

Final asset: [public/images/workshop-sculpture.webp](../../public/images/workshop-sculpture.webp).

Generated with the **built-in image-generation tool**. The selected original remains in the Codex generated-images directory; the optimized project copy is included in the workspace.

Prompt:

> Use case: stylized-concept. Asset type: signature editorial website hero artwork, landscape 3:2. Create an extraordinarily refined sculptural still life for a design-conscious developer publication called AI Field Notes. No text or letters. An exploded architectural assembly of four large thin square planes arranged vertically in an airy offset stack, viewed at isometric three-quarter angle. Two planes are warm uncoated ivory paper, two are deeply saturated electric cobalt blue optical glass with beautiful edge refractions; tiny precision chrome connectors and a few slender cobalt linking rods imply a workflow passing through the layers. One paper plane has subtle embossed parallel grooves, not text. It feels like a physical model of turning ideas into working software. Composition: entire sculpture centered with generous breathing room, strong diagonal from bottom left to top right, compelling but simple silhouette, no extra objects. Background uniform warm ivory #F5F3EC, subtle realistic ambient contact shadow, soft directional gallery lighting. Premium art-directed product photography meets architectural model, tactile paper fibers, optically beautiful cobalt glass, crisp fine detail, mature Swiss editorial sensibility. No gradients in background, no typography, no brain, no robot, no UI mockup, no rounded blob, no decorative icons. Artwork only.
