# Spec: Header

**File:** `src/components/layout/Header.tsx`

## Overview
A fixed navigation bar for AI Field Notes, shared across every page.

## Inputs
No props. Navigation labels and destinations are defined in the component.

## Outputs
- Home link labelled AI Field Notes, pointing to `/`.
- Main navigation: Guides (`/guides`), Tools (`/tools`),
  Updates (`/chapters/what-is-happening`), Search (`/search`).

## Behaviour / Logic
Links use Next.js Link. The header is fixed at the top with a 3.5rem height.
Navigation links wrap within the available width on narrow screens.
No active-route indicator or route-dependent state is implemented.

## Constraints
Use existing typography, colour, and border tokens. Render as a Server Component.
The root layout offsets the main content by the header height.
Every link must remain reachable by keyboard and have a visible label.

## Edge Cases
Verify the navigation at 320px width and with long page titles below it.
Long titles must not change the header width or cover its links.

## Acceptance Criteria
- Home navigates to `/`.
- Each labelled navigation link resolves to its stated destination.
- All links remain visible without horizontal page overflow at 320px.

## Not in scope
A mobile menu, active-route highlighting, authentication, or theme controls.

## Verification
Open the homepage and a chapter at desktop and mobile widths.
Tab through the navigation and follow all four destinations.
