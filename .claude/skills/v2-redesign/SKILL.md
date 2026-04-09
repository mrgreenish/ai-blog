# AI Field Notes — V2 Design System

Use this skill when making any visual, layout, or content changes to the blog.
It defines the design language, component patterns, and conventions that keep the site consistent.

## Design Philosophy

Monochrome editorial reference manual. Think O'Reilly technical books meets Stripe documentation.
Light-only, no dark mode. Serif body text, monospace for labels and metadata.
Quiet, confident, zero decoration — content leads.

## Color System

All colors are semantic design tokens defined in `src/app/globals.css` via `@theme`.
Never use raw Tailwind colors (e.g. `bg-gray-200`) — always use tokens.

### Backgrounds
| Token | Value | Usage |
|---|---|---|
| `bg-bg-page` | `#FAFAF9` | Page background |
| `bg-bg-surface` | `#F5F5F4` | Cards, interactive component wrappers, code blocks |
| `bg-bg-elevated` | `#E7E5E4` | Badges, pills, highlighted areas |
| `bg-bg-overlay` | `rgba(250,250,249,0.92)` | Modals, overlays |
| `bg-white` | `#FFFFFF` | Cards that need to stand out from bg-surface |

### Foreground
| Token | Value | Usage |
|---|---|---|
| `text-fg-primary` | `#1C1917` | Headings, body text |
| `text-fg-secondary` | `#44403C` | Descriptions, supporting text |
| `text-fg-muted` | `#78716C` | Metadata, labels, timestamps |
| `text-fg-placeholder` | `#A8A29E` | Placeholder text, disabled states |

### Borders
| Token | Value | Usage |
|---|---|---|
| `border-border-default` | `#E7E5E4` | Standard borders, dividers |
| `border-border-strong` | `#D6D3D1` | Emphasized borders, active states |
| `border-border-subtle` | `#F5F5F4` | Very light dividers |

### Accent Colors in Interactive Components
When interactive tools need colored accents (buttons, highlights, badges):
- Use Tailwind's `-600` variants for good contrast on light backgrounds
- Example: `text-cyan-600`, `bg-rose-600`, `text-emerald-600`
- Never use `-400` variants — too washed out on light backgrounds
- Keep the `stone-*` palette for neutral interactive elements

## Typography

### Fonts
- **Body/headings**: Source Serif 4 (variable, `--font-sans` / `font-sans`)
- **Code/labels/metadata**: JetBrains Mono (variable, `--font-mono` / `font-mono`)

### Patterns
- Page headings: `text-fg-primary font-sans font-bold`
- Section labels: `font-mono text-xs uppercase tracking-widest text-fg-muted`
- Chapter numbers: `font-mono text-7xl font-light text-stone-300`
- Body text: Handled by `@tailwindcss/typography` prose classes
- Inline code: Custom-styled with `--inline-code-bg/border/color` vars

## Layout

- Max width: `max-w-4xl` (896px)
- Page padding: `px-6 py-16`
- Header: Fixed, `h-14`, `bg-bg-page` with `border-b border-border-default`
- Content: `<main id="main" className="relative pt-14">`
- Skip link: `<a href="#main">` with sr-only / focus:not-sr-only pattern

## Content Structure

### Routing
- All content lives under `/chapters/[slug]`
- No separate routes for models, workflows, tooling, or notes
- Slugs strip numeric prefix: `01-reasoning-vs-fast.mdx` -> `/chapters/reasoning-vs-fast`

### Chapter Frontmatter
```yaml
title: "Chapter Title"
subtitle: "One-line description"
chapter: 1                    # Sequential number
part: "understanding-models"  # One of 4 parts
partNumber: 1
wonderQuestion: "Optional hook question in italics"
interactiveTools: ["model-picker", "model-tinder"]
```

### Parts (4 total)
1. `understanding-models` — Model selection, personalities, prompting
2. `shipping-workflows` — Spec to PR, bug to fix, design to code
3. `review-quality` — Diff review, AI code review, guardrails
4. `tools-infrastructure` — Agents, skills, Figma MCP, infrastructure

### Content Files
- Location: `content/chapters/NN-slug-name.mdx`
- Frontmatter defined in `src/lib/types.ts` (`ChapterFrontmatter`)
- Loaded by `src/lib/content.ts` (`getAllChapters`, `getChapter`, etc.)

## Component Patterns

### Interactive Tool Wrappers
All 13 interactive tools follow this pattern:
```tsx
<div className="not-prose my-8 rounded-xl border border-border-default bg-bg-surface p-6">
  {/* Tool content */}
</div>
```
- Wrapper: `bg-bg-surface` (stone-100)
- Inner cards: `bg-white` to stand out from wrapper
- Inner code/detail blocks: `bg-bg-surface` or `bg-bg-elevated`

### InfoBlock
```tsx
<div className="not-prose my-6 rounded-lg border border-border-default bg-bg-surface p-4">
  <div className="flex items-start gap-3">
    <Info className="mt-0.5 h-5 w-5 shrink-0 text-fg-muted" />
    <div>
      {title && <p className="mb-2 font-semibold text-fg-primary">{title}</p>}
      <div className="text-sm leading-relaxed text-fg-secondary">{children}</div>
    </div>
  </div>
</div>
```

### ChapterLayout
- Breadcrumb: `← Contents` link to homepage
- Part label: `PART {roman} · {PART NAME}` in mono uppercase
- Chapter number: Large `text-7xl font-light text-stone-300`
- Title + subtitle + wonder question
- Body: prose with `max-w-none`
- Footer: prev/next chapter navigation

### Buttons & Interactive States
- Hover: `hover:bg-bg-hover` or `hover:bg-bg-active`
- Active tabs/pills: `bg-fg-primary text-bg-page` (inverted)
- Inactive tabs: `text-fg-muted` with hover to `text-fg-primary`
- Transitions: `transition-colors`
- Disabled: `opacity-40 cursor-not-allowed`

## Don'ts

- No dark mode classes (`dark:*`) — light-only design
- No glassmorphism (backdrop-blur, glass gradients)
- No `zinc-*` palette — use `stone-*` for neutrals
- No `-400` accent colors — use `-600` for light-bg contrast
- No `next-themes` — removed
- No old route patterns (`/models/*`, `/workflows/*`, `/tooling/*`, `/notes/*`)
- No `Category` type — use `Part` for content grouping
- No raw hex colors in components — use design tokens

## Testing

- Build: `pnpm build` (must produce 26+ static pages)
- Tests: `pnpm test` (89 tests across 4 suites)
- Content integrity: `src/lib/__tests__/contentIntegrity.test.ts`
  - Validates chapter frontmatter, slug uniqueness, chapter number uniqueness
  - Checks interactive tool slugs, MDX component registration
  - Verifies model IDs and decision tree links resolve
- Dev server often needs `.next` cache cleared after production builds: `rm -rf .next`
