# Jira-to-Cursor Workflow Template

Source guide: https://www.aifieldnotes.dev/chapters/jira-to-cursor

Use this template before assigning a Jira work item to Cursor, mentioning
`@Cursor`, or handing the ticket to an agent manually.

## Ticket

### Outcome

Describe the observable user or system behavior that must change.

### Current evidence

- Reproduction URL or command:
- Exact error, failed request, screenshot, or trace:
- First bad version or relevant recent change:

### In scope

- ...

### Out of scope

- ...

### Acceptance criteria

- [ ] ...
- [ ] ...
- [ ] ...

### Constraints

- Public APIs or behavior that must not change:
- Existing components or patterns to reuse:
- Packages or files the change should stay within:
- Data, privacy, security, or compliance requirements:

### Design context

- Exact Figma selection:
- Required component states:
- Responsive behavior:
- Existing implementation to reuse:

### Verification

- Required lint/type/build commands:
- Unit or integration checks:
- Browser flow:
- Security-sensitive behavior requiring human review:

### Definition of done

- [ ] Focused diff
- [ ] Acceptance criteria mapped to evidence
- [ ] Regression coverage
- [ ] Relevant checks pass
- [ ] Human review complete

## Agent instruction

```text
Implement this ticket in the configured repository.

Start by posting a short plan. Keep the change within the stated scope, run
the required checks, and map the PR description to each acceptance criterion.
Do not add dependencies, change public APIs, or make product decisions that
the ticket does not authorize. Stop and ask if required context is missing.
```

## Workflow choice

- **Native Cursor in Jira:** use when Cursor admin access, Jira Commercial
  Cloud, Rovo, and repository routing are available.
- **Manual handoff:** use when a human should curate files, context, or the plan.
- **Jira API/MCP automation:** use when the organization needs custom routing,
  fields, approval gates, or multiple downstream systems.

Keep branch protection, CI, and human merge approval in place for all three.

