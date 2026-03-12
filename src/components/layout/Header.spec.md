# Spec: `Header` component

**File:** `src/components/layout/Header.tsx`

---

## Overview

A sticky, floating navigation bar rendered at the top of every page. Uses the current pathname to highlight the active route.

---

## Inputs

| Input | Type | Source | Notes |
|---|---|---|---|
| `pathname` | `string` | `usePathname()` hook | Read from Next.js router; no prop |
| `NAV_LINKS` | `{ href: string; label: string }[]` | Module-level constant | Hardcoded — not a prop |

**`NAV_LINKS` (current values):**

| href | label |
|---|---|
| `/models` | Models |
| `/workflows` | Workflows |
| `/tooling` | Tooling |

---

## Outputs

Renders a `<header>` element containing:

1. **Logo link** — navigates to `/`, displays `field notes / ai` with a `Terminal` icon
2. **Nav links** — one `<Link>` per entry in `NAV_LINKS`, each with active/inactive visual state
3. **Active indicator** — a horizontal gradient line (`<span>`) rendered below the active nav item

---

## Behaviour / Logic

**Active state detection:**

```ts
const isActive = pathname === href || pathname.startsWith(`${href}/`);
```

A link is active if the pathname exactly matches or is a sub-path (e.g. `/models/gpt-4` activates `/models`).

**Active styles:** `bg-white/8 text-zinc-100` + bottom gradient underline
**Inactive styles:** `text-zinc-400 hover:bg-white/5 hover:text-zinc-200`

---

## Constraints

- Must be a **Client Component** (`"use client"`) — required for `usePathname()`
- Sticky positioning (`sticky top-0 z-50`) — assumes no other `z-50` element conflicts
- Max content width is capped at `max-w-5xl` — must match the page layout container width
- The logo link always points to `/` — not configurable
- `NAV_LINKS` is a module constant — adding/removing nav items requires a code change (no CMS or prop)

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Pathname is `/` (home) | No nav link is active; logo link is the current page (no visual feedback) |
| Pathname is `/models/some-slug` | `/models` link is active (prefix match) |
| Pathname is `/modelsfoo` | `/models` link is **not** active — `startsWith("/models/")` prevents false positives |
| Pathname is unknown (e.g. `/404`) | No nav link is active; header still renders normally |
| `NAV_LINKS` is empty | Nav renders an empty `<nav>` — no links, no errors |
| Very long pathname | No visual impact; active check is a pure string comparison |

---

## Not in scope

- Mobile/hamburger menu — no responsive collapse behaviour
- Authentication state — header has no user/session awareness
- Dark/light mode toggle — theme is hardcoded dark
- Configurable logo text or icon — hardcoded
