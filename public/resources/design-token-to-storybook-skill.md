---
name: design-token-mapping
description: Map approved Figma variables to this repository's production tokens and Storybook documentation.
---

# Design Token Mapping

Source guide: https://www.aifieldnotes.dev/chapters/design-to-storybook

Customize the placeholders in this file, then store it with your project's
agent skills or design-system documentation.

## Source of truth

- Production token source: `[path/to/tokens.css or tokens.json]`
- Figma variable collection: `[collection name]`
- Storybook configuration: `[path/to/.storybook/main.ts]`
- Storybook token addon version: `[version compatible with your Storybook]`

Production code is the runtime source of truth. Figma variables mirror approved
semantic tokens; Storybook documents the tokens present in code.

## Mapping rules

| Figma variable | Semantic token | Code output | Usage |
| --- | --- | --- | --- |
| `Button/Background/Primary` | `color.action.primary` | `--color-action-primary` | Primary actions |
| `Text/Default` | `color.text.default` | `--color-text-default` | Default body text |
| `Space/300` | `space.3` | `--space-3` | Component spacing |
| `Type/Body/Default` | `type.body.default` | `--font-body`, `--text-body`, `--leading-body` | Body typography |

## Agent rules

- Never introduce a raw color, spacing, radius, shadow, or type value when an
  approved semantic token exists.
- Report missing or ambiguous mappings. Do not invent a token silently.
- Prefer semantic intent over palette-scale names in component APIs.
- Do not update Figma and code simultaneously unless the requested direction
  of change is explicit.
- Preserve public component APIs unless the task authorizes a migration.
- Keep generated token output separate from hand-authored source files.

## Storybook documentation

- Load the production token stylesheet in Storybook.
- Use `@tokens` and `@presenter` annotations expected by
  `storybook-design-token`.
- Add representative component stories for behavior; do not generate every
  permutation without a review need.
- Cover default, hover, focus-visible, disabled, loading, error, narrow
  container, and supported theme states.

## Verification

1. List variables used by the exact Figma selection.
2. Map each variable to an existing semantic code token.
3. Report missing or duplicate mappings.
4. Run the repository's token build.
5. Run Storybook and the relevant component tests.
6. Compare representative stories with the approved Figma states.
7. Report drift with an explicit direction: Figma changes, code changes, or a
   human decision is required.

## Definition of done

- [ ] Every selected Figma variable has an approved semantic mapping.
- [ ] Components consume production tokens rather than raw values.
- [ ] Storybook documents the same code-owned tokens.
- [ ] Representative states are covered by stories and checks.
- [ ] Missing mappings and intentional deviations are documented in the PR.

