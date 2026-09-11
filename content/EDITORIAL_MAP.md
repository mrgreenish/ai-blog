# Editorial Ownership Map

Each major idea has one **canonical chapter** that teaches it from first principles.
All other chapters should **reference** the canonical piece rather than re-explain it.

## Concept → Canonical Chapter

| Concept | Canonical Chapter | Other chapters: reference only |
|---|---|---|
| Model choice & cost tradeoffs | `chapters/01-reasoning-vs-fast.mdx` | `chapters/04-spec-to-pr.mdx`, `chapters/07-jira-to-cursor.mdx` |
| Model personality & prompting style | `chapters/02-model-personalities.mdx` | — |
| Context window strategy (Max Mode) | `chapters/13-max-mode.mdx` | — |
| Prompting habits & failure modes | `chapters/03-prompting-and-pitfalls.mdx` | `chapters/04-spec-to-pr.mdx`, `chapters/10-building-blocks.mdx` |
| Default shipping loop (spec→PR) | `chapters/04-spec-to-pr.mdx` | `chapters/07-jira-to-cursor.mdx` |
| Debugging flow | `chapters/05-bug-to-fix.mdx` | — |
| Diff review & "looks fine" trap | `chapters/11-diff-review-loops.mdx` | `chapters/08-ai-code-review.mdx` |
| AI code review (BugBot, Codex) | `chapters/08-ai-code-review.mdx` | — |
| Guardrails & scope control | `chapters/12-agent-guardrails.mdx` | `chapters/03-prompting-and-pitfalls.mdx` |
| Spec files as durable context | `chapters/09-spec-files.mdx` | `chapters/04-spec-to-pr.mdx` |
| Skills & subagents | `chapters/14-agents-and-skills.mdx` | `chapters/10-building-blocks.mdx` |
| Building blocks / atomic structure | `chapters/10-building-blocks.mdx` | — |
| Figma MCP fundamentals | `chapters/15-figma-mcp.mdx` | `chapters/16-code-to-canvas.mdx`, `chapters/06-design-to-storybook.mdx`, `chapters/07-jira-to-cursor.mdx` |
| Code → Figma reverse loop | `chapters/16-code-to-canvas.mdx` | `chapters/15-figma-mcp.mdx` (brief mention only) |
| Design token → component workflow | `chapters/06-design-to-storybook.mdx` | — |

## Worldview Statements — Where They Live

These ideas should be established **once** on the homepage and lightly reinforced.
Chapters should not re-prove them in their intros.

| Statement | Lives on |
|---|---|
| "Real shipping experience, not theory" | Homepage hero + subtitle |
| "Things are changing fast" | Homepage narrative section |
| "Models behave differently" | Part I intro |
| "Guardrails matter" | Part IV intro |
| "Same prompt, different output" | `chapters/03-prompting-and-pitfalls.mdx` (canonical) |

## Reading Sequence

The homepage and `/guides` lead with reader tasks. Chapter order remains an optional reading sequence:

1. `chapters/01-reasoning-vs-fast.mdx`
2. `chapters/02-model-personalities.mdx`
3. `chapters/03-prompting-and-pitfalls.mdx`
4. `chapters/06-design-to-storybook.mdx`
5. `chapters/05-bug-to-fix.mdx`
6. `chapters/04-spec-to-pr.mdx`
7. `chapters/07-jira-to-cursor.mdx`
8. `chapters/08-ai-code-review.mdx`
9. `chapters/09-spec-files.mdx`
10. `chapters/10-building-blocks.mdx`
11. `chapters/11-diff-review-loops.mdx`
12. `chapters/12-agent-guardrails.mdx`
13. `chapters/17-design-to-code-and-back.mdx`
14. `chapters/14-agents-and-skills.mdx`
15. `chapters/13-max-mode.mdx`
16. `chapters/15-figma-mcp.mdx`
17. `chapters/16-code-to-canvas.mdx`
18. `chapters/18-cost-of-ai-coding.mdx`

## Discovery and growth

Task groups and entry points live in `src/lib/discovery.ts`. Every evergreen chapter belongs to one group; news remains under Updates. Existing chapter URLs are canonical. Each chapter has three curated `relatedSlugs`, checked by the content integrity suite.

The three initial promotion guides are spec files, debugging, and Figma MCP. See `content/GROWTH_PLAYBOOK.md` for drafts, campaign links, and measurement. Model-data verification and visual redesign are separate workstreams.
