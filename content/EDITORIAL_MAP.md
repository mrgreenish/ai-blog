# Editorial Ownership Map

Each major idea has one **canonical article** that teaches it from first principles.
All other articles should **reference** the canonical piece rather than re-explain it.

## Concept → Canonical Article

| Concept | Canonical Article | Other articles: reference only |
|---|---|---|
| Model choice & cost tradeoffs | `models/reasoning-vs-fast.mdx` | `workflows/spec-to-pr.mdx`, `workflows/jira-to-cursor.mdx` |
| Model personality & prompting style | `models/model-personalities.mdx` | — |
| Context window strategy (Max Mode) | `tooling/max-mode.mdx` | — |
| Prompting habits & failure modes | `workflows/ai-mindset.mdx` | `workflows/spec-to-pr.mdx`, `workflows/building-blocks.mdx` |
| Default shipping loop (spec→PR) | `workflows/spec-to-pr.mdx` | `workflows/jira-to-cursor.mdx` |
| Debugging flow | `workflows/bug-to-fix.mdx` | — |
| Diff review & "looks fine" trap | `tooling/diff-review-loops.mdx` | `workflows/ai-code-review.mdx` |
| AI code review (BugBot, Codex) | `workflows/ai-code-review.mdx` | — |
| Guardrails & scope control | `tooling/agent-guardrails.mdx` | `workflows/ai-mindset.mdx` |
| Spec files as durable context | `workflows/spec-files.mdx` | `workflows/spec-to-pr.mdx` |
| Skills & subagents | `tooling/agents-and-skills.mdx` | `workflows/building-blocks.mdx` |
| Building blocks / atomic structure | `workflows/building-blocks.mdx` | — |
| Figma MCP fundamentals | `tooling/figma-mcp.mdx` | `tooling/code-to-canvas.mdx`, `workflows/design-to-storybook.mdx`, `workflows/jira-to-cursor.mdx` |
| Code → Figma reverse loop | `tooling/code-to-canvas.mdx` | `tooling/figma-mcp.mdx` (brief mention only) |
| Design token → component workflow | `workflows/design-to-storybook.mdx` | — |
## Worldview Statements — Where They Live

These ideas should be established **once** on the homepage and lightly reinforced on category pages.
Articles should not re-prove them in their intros.

| Statement | Lives on |
|---|---|
| "Real shipping experience, not theory" | Homepage hero + subtitle |
| "Things are changing fast" | Homepage narrative section |
| "Models behave differently" | Models category page intro |
| "Guardrails matter" | Tooling category page intro |
| "Same prompt, different output" | `workflows/ai-mindset.mdx` (canonical) |

## Reading Sequence

The blog reads front-to-back in this order:

1. `models/reasoning-vs-fast.mdx`
2. `models/model-personalities.mdx`
3. `workflows/ai-mindset.mdx`
4. `workflows/spec-to-pr.mdx`
5. `workflows/bug-to-fix.mdx`
6. `workflows/design-to-storybook.mdx`
7. `workflows/jira-to-cursor.mdx`
8. `workflows/ai-code-review.mdx`
9. `workflows/spec-files.mdx`
10. `workflows/building-blocks.mdx`
11. `tooling/diff-review-loops.mdx`
12. `tooling/agent-guardrails.mdx`
13. `tooling/max-mode.mdx`
14. `tooling/agents-and-skills.mdx`
15. `tooling/figma-mcp.mdx`
16. `tooling/code-to-canvas.mdx`
