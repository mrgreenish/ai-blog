# Editorial Ownership Map

Each major idea has one **canonical chapter** that teaches it from first
principles. Other chapters should link to the canonical piece rather than
repeating it.

## Concept → Canonical Chapter

| Concept | Canonical chapter | Other chapters: reference only |
| --- | --- | --- |
| Model depth and cost tradeoffs | `chapters/01-reasoning-vs-fast.mdx` | `chapters/02-model-personalities.mdx`, `chapters/12-max-mode.mdx` |
| Model personality and prompting style | `chapters/02-model-personalities.mdx` | `chapters/13-agents-and-skills.mdx` |
| Prompting habits and failure modes | `chapters/03-prompting-and-pitfalls.mdx` | `chapters/05-bug-to-fix.mdx` |
| Default shipping loop (spec → PR) | `chapters/04-spec-to-pr.mdx` | `chapters/07-jira-to-cursor.mdx`, `chapters/08-spec-files.mdx` |
| Debugging flow | `chapters/05-bug-to-fix.mdx` | `chapters/10-diff-review-loops.mdx` |
| Design tokens and Storybook | `chapters/06-design-to-storybook.mdx` | `chapters/14-figma-mcp.mdx`, `chapters/15-code-to-canvas.mdx`, `chapters/16-design-to-code-and-back.mdx` |
| Jira-to-agent handoff | `chapters/07-jira-to-cursor.mdx` | `chapters/04-spec-to-pr.mdx`, `chapters/08-spec-files.mdx`, `chapters/18-what-is-an-ai-harness.mdx` |
| Spec files as durable context | `chapters/08-spec-files.mdx` | `chapters/04-spec-to-pr.mdx`, `chapters/07-jira-to-cursor.mdx` |
| Building blocks and atomic structure | `chapters/09-building-blocks.mdx` | — |
| AI code and diff review | `chapters/10-diff-review-loops.mdx` | `chapters/05-bug-to-fix.mdx`, `chapters/11-agent-guardrails.mdx` |
| Guardrails and scope control | `chapters/11-agent-guardrails.mdx` | `chapters/10-diff-review-loops.mdx` |
| Context-window strategy (Max Mode) | `chapters/12-max-mode.mdx` | `chapters/01-reasoning-vs-fast.mdx` |
| Skills and subagents | `chapters/13-agents-and-skills.mdx` | `chapters/18-what-is-an-ai-harness.mdx` |
| Figma MCP fundamentals | `chapters/14-figma-mcp.mdx` | `chapters/06-design-to-storybook.mdx`, `chapters/15-code-to-canvas.mdx`, `chapters/16-design-to-code-and-back.mdx` |
| Code → Figma reverse loop | `chapters/15-code-to-canvas.mdx` | `chapters/14-figma-mcp.mdx`, `chapters/16-design-to-code-and-back.mdx` |
| Bidirectional design/code loop | `chapters/16-design-to-code-and-back.mdx` | `chapters/06-design-to-storybook.mdx` |
| Dated developments | `chapters/17-what-is-happening.mdx` and `content/news/*.mdx` | — |
| AI harnesses | `chapters/18-what-is-an-ai-harness.mdx` | `chapters/01-reasoning-vs-fast.mdx`, `chapters/07-jira-to-cursor.mdx` |

## Worldview Statements

These ideas should be established once on the homepage and lightly reinforced.

| Statement | Lives on |
| --- | --- |
| “Real shipping experience, not theory” | Homepage hero and subtitle |
| “Things are changing fast” | Homepage narrative section |
| “Models behave differently” | Part I intro |
| “Guardrails matter” | Part III intro |
| “Same prompt, different output” | `chapters/03-prompting-and-pitfalls.mdx` |

## Reading Sequence

1. `chapters/01-reasoning-vs-fast.mdx`
2. `chapters/02-model-personalities.mdx`
3. `chapters/03-prompting-and-pitfalls.mdx`
4. `chapters/04-spec-to-pr.mdx`
5. `chapters/05-bug-to-fix.mdx`
6. `chapters/06-design-to-storybook.mdx`
7. `chapters/07-jira-to-cursor.mdx`
8. `chapters/08-spec-files.mdx`
9. `chapters/09-building-blocks.mdx`
10. `chapters/10-diff-review-loops.mdx`
11. `chapters/11-agent-guardrails.mdx`
12. `chapters/12-max-mode.mdx`
13. `chapters/13-agents-and-skills.mdx`
14. `chapters/14-figma-mcp.mdx`
15. `chapters/15-code-to-canvas.mdx`
16. `chapters/16-design-to-code-and-back.mdx`
17. `chapters/17-what-is-happening.mdx`
18. `chapters/18-what-is-an-ai-harness.mdx`
