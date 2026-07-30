# AI-Generated Code Review Checklist

Source guide: https://www.aifieldnotes.dev/chapters/diff-review-loops

Use this checklist for code written or substantially modified by an AI coding agent.

## 1. Intent and scope

- [ ] The pull request states the observable behavior being changed.
- [ ] Acceptance criteria are specific enough to test.
- [ ] Changed files match the intended scope.
- [ ] Non-goals and compatibility constraints are preserved.
- [ ] New dependencies, permissions, or infrastructure are called out.

## 2. Behavior

- [ ] Trace the normal path with representative values.
- [ ] Check empty, missing, zero, negative, maximum, and final-item boundaries.
- [ ] Check duplicate, repeated, and out-of-order events.
- [ ] Check failure, timeout, retry, cancellation, and concurrency behavior.
- [ ] Check existing callers, shared state, and execution-order changes.
- [ ] Confirm error behavior is observable and useful.

## 3. Security and data boundaries

- [ ] Authorization is enforced on the server or trusted boundary.
- [ ] Resource and tenant ownership are verified.
- [ ] Untrusted input is validated at runtime.
- [ ] SQL, HTML, shell arguments, URLs, and file paths are constructed safely.
- [ ] Responses and logs avoid secrets, personal data, and internal diagnostics.
- [ ] External and destructive side effects are scoped, idempotent, and recoverable.

## 4. Tests and evidence

- [ ] Tests assert user-visible or API-visible behavior.
- [ ] Tests would fail for a plausible wrong implementation.
- [ ] The regression test fails without the intended fix.
- [ ] Mocks do not hide permissions, serialization, timing, or integration behavior.
- [ ] Relevant lint, type, unit, integration, and build checks pass.
- [ ] UI changes have browser, accessibility, and visual evidence where relevant.

## 5. AI-review triage

For every finding:

1. Name the concrete input and failing path.
2. Classify it as a defect, missing evidence, follow-up, or false positive.
3. Fix the smallest safe scope.
4. Add proof when the finding is real.
5. Record why a false positive does not apply.

Useful review prompt:

```text
Review this diff against the pull-request description.

Prioritize:
1. behavior that contradicts an acceptance criterion
2. authorization or data-boundary regressions
3. missing failure, retry, and concurrency handling
4. tests that pass with a plausible wrong implementation
5. public API or compatibility changes

Report only actionable findings. For each finding, name the failing scenario,
the relevant code, and the smallest safe correction.
```

## 6. Human sign-off

- [ ] A human reviewed product and business behavior.
- [ ] A human reviewed security-sensitive changes.
- [ ] The PR maps acceptance criteria to evidence.
- [ ] Remaining uncertainty is explicit.
- [ ] Branch protection and required approvals remain enabled.

