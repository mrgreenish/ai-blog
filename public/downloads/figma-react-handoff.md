# Figma to React handoff

## Inputs
- Figma node URL:
- Existing React component:
- Token definitions:
- Variants and interaction states to implement:

## Prompt
Retrieve design context and a screenshot for the node. Inspect the existing
component and tokens. List the mapping and missing states before implementing.
Reuse the component where possible. Preserve native semantics, keyboard focus,
and disabled behaviour. Keep changes within the agreed variant and scope.
Run component checks and compare the browser result with the screenshot.
Report what you checked, any mismatches, and assumptions still to resolve.

## Acceptance checks
- Values map to existing semantic tokens.
- All required variants and states are covered.
- Keyboard activation, focus, and disabled behaviour work.
- Form submission follows the intended button type.
- Narrow widths and text zoom do not clip the component.
- Compare at the same scale with the source screenshot.
