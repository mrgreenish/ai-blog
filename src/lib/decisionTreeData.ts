// --- Types ---

export interface TreeResult {
  title: string;
  emoji: string;
  description: string;
  model: string;
  tools: string[];
  steps: { label: string; description: string }[];
  guardrails: string[];
  output: string;
  articleLink: { href: string; label: string };
  relatedLinks?: { href: string; label: string }[];
}

export interface TreeOption {
  id: string;
  label: string;
  description: string;
  /** Either a node ID (string) to continue, or a TreeResult for a leaf */
  next: string | TreeResult;
}

export interface TreeNode {
  id: string;
  question: string;
  options: TreeOption[];
}

// --- Tree data ---

export const TREE_NODES: Record<string, TreeNode> = {
  root: {
    id: "root",
    question: "What are you trying to do?",
    options: [
      {
        id: "build",
        label: "Build something new",
        description: "Feature, component, or integration from scratch",
        next: "build",
      },
      {
        id: "fix",
        label: "Fix a bug",
        description: "Debug and resolve an issue in existing code",
        next: "fix",
      },
      {
        id: "review",
        label: "Review code",
        description: "Get AI-assisted code review on a PR",
        next: {
          title: "AI Code Review",
          emoji: "\u{1F50D}",
          description:
            "Use AI to catch mechanical bugs, type errors, and security issues before human review.",
          model: "Claude Sonnet 4.6",
          tools: ["Cursor BugBot", "Codex on GitHub", "GitHub PR"],
          steps: [
            {
              label: "Open PR",
              description:
                "Push your changes and open the pull request with a clear description.",
            },
            {
              label: "Run AI review",
              description:
                "Run BugBot or Codex review. Let it scan for type errors, null checks, security issues, and inconsistencies.",
            },
            {
              label: "Triage findings",
              description:
                "Review each finding. Treat them as suggestions \u2014 some are valid, some are false positives.",
            },
            {
              label: "Fix valid issues",
              description:
                "Address the real issues. Ignore out-of-scope refactor suggestions.",
            },
            {
              label: "Human review",
              description:
                "Request human review with mechanical issues already resolved.",
            },
          ],
          guardrails: [
            "Treat AI findings as suggestions, not mandates",
            "Ignore out-of-scope refactor suggestions",
            "Verify fixes don\u2019t introduce new issues",
            "AI catches mechanical bugs \u2014 humans review business logic",
          ],
          output:
            "Clean PR with mechanical issues resolved before human review begins.",
          articleLink: {
            href: "/chapters/ai-code-review",
            label: "AI Code Review",
          },
          relatedLinks: [
            { href: "/chapters/diff-review-loops", label: "Diff Review Loops" },
            {
              href: "/chapters/agent-guardrails",
              label: "Agent Guardrails",
            },
          ],
        },
      },
      {
        id: "tooling",
        label: "Set up AI tooling",
        description: "Configure Cursor, Claude Code, MCP, or agents",
        next: "tooling",
      },
      {
        id: "learn",
        label: "Learn the basics",
        description: "Understand AI-assisted development fundamentals",
        next: {
          title: "AI Development Fundamentals",
          emoji: "\u{1F9E0}",
          description:
            "Start with the mental model for AI-assisted development, then learn when to use which model.",
          model: "Start with any model",
          tools: ["Cursor", "Claude Code"],
          steps: [
            {
              label: "Read the mindset guide",
              description:
                "Understand the core principles: AI as a collaborator, not a replacement. Learn when to trust, when to verify.",
            },
            {
              label: "Learn model trade-offs",
              description:
                "Understand reasoning vs fast models, when each shines, and when to switch.",
            },
            {
              label: "Try the Model Picker",
              description:
                "Use the interactive picker to find the right model for your first task.",
            },
            {
              label: "Pick a simple workflow",
              description:
                "Start with Bug \u2192 Fix or AI Code Review \u2014 low risk, high learning.",
            },
          ],
          guardrails: [
            "Start with low-risk tasks to build intuition",
            "Always review AI output before committing",
            "Learn one tool well before adding more",
            "Read error messages \u2014 AI often explains what went wrong",
          ],
          output:
            "Mental model for AI-assisted development and a first successful AI-powered task.",
          articleLink: {
            href: "/chapters/prompting-and-pitfalls",
            label: "The AI Mindset",
          },
          relatedLinks: [
            {
              href: "/chapters/reasoning-vs-fast",
              label: "Reasoning vs Fast Models",
            },
            {
              href: "/chapters/model-personalities",
              label: "Model Personalities",
            },
          ],
        },
      },
    ],
  },

  build: {
    id: "build",
    question: "What\u2019s your starting point?",
    options: [
      {
        id: "figma",
        label: "Figma design",
        description: "Turning a design into code with token mapping",
        next: {
          title: "Design \u2192 Storybook",
          emoji: "\u{1F3A8}",
          description:
            "Go from Figma design to production component with typed props, design tokens, and Storybook stories.",
          model: "Claude Sonnet 4.6",
          tools: ["Figma MCP", "Cursor", "Storybook", "SKILL.md"],
          steps: [
            {
              label: "Token skill",
              description:
                "Create a SKILL.md that maps Figma tokens to your Tailwind config. Persistent context for all design-to-code work.",
            },
            {
              label: "Design tokens",
              description:
                "Use the skill to map Figma variables to existing Tailwind tokens.",
            },
            {
              label: "Component spec",
              description:
                "Use Figma MCP to pull properties, variants, and constraints. Generate a TypeScript interface.",
            },
            {
              label: "Implementation",
              description:
                "Build the component against the spec with actual design values \u2014 no guessing from screenshots.",
            },
            {
              label: "Storybook stories",
              description:
                "Generate stories for each variant. Cover all combinations of size, color, and state.",
            },
            {
              label: "Visual review",
              description:
                "Compare Storybook output against the Figma design using Figma MCP for side-by-side verification.",
            },
          ],
          guardrails: [
            "Create the token skill once \u2014 reuse it across all design-to-code tasks",
            "Use actual token values, not guessed ones",
            "Reuse existing atoms \u2014 don\u2019t create duplicates",
            "Generate stories for all variants, not just the default",
          ],
          output:
            "Token-mapping skill plus a production component with typed props, matching design tokens, and Storybook stories for every variant.",
          articleLink: {
            href: "/chapters/design-to-storybook",
            label: "Design \u2192 Storybook",
          },
          relatedLinks: [
            { href: "/chapters/figma-mcp", label: "Figma MCP" },
            {
              href: "/chapters/design-to-code-and-back",
              label: "Design to Code and Back",
            },
          ],
        },
      },
      {
        id: "jira",
        label: "Jira ticket",
        description: "Ticket with acceptance criteria and Figma link",
        next: {
          title: "Jira \u2192 PR",
          emoji: "\u{1F3AB}",
          description:
            "Turn a Jira ticket into a working PR using acceptance criteria as test cases and edge cases as guardrails.",
          model: "Claude Sonnet 4.6",
          tools: ["AI ticket generator", "Cursor", "Figma MCP", "GitHub"],
          steps: [
            {
              label: "Generate ticket",
              description:
                "Use AI to generate a Jira ticket with scope, acceptance criteria, edge cases, and analytics.",
            },
            {
              label: "Set up context",
              description:
                "Paste the ticket into Cursor. Add the Figma link. Keep Figma Desktop open for MCP access.",
            },
            {
              label: "Plan",
              description:
                "Let the model plan using ticket scope as boundaries and acceptance criteria as checkpoints.",
            },
            {
              label: "Implement",
              description:
                "Build against the plan. Acceptance criteria become test cases, edge cases become guardrails.",
            },
            {
              label: "PR from criteria",
              description:
                "Write the PR description from the ticket\u2019s acceptance criteria. It maps directly to what was built.",
            },
          ],
          guardrails: [
            "Acceptance criteria become test cases",
            "Edge cases from the ticket become guardrails",
            "Stay within ticket scope \u2014 out-of-scope work gets its own ticket",
            "Keep Figma Desktop open during the session",
          ],
          output:
            "PR that maps directly to ticket acceptance criteria with design-accurate implementation.",
          articleLink: {
            href: "/chapters/jira-to-cursor",
            label: "Jira \u2192 PR",
          },
          relatedLinks: [
            {
              href: "/chapters/agents-and-skills",
              label: "Agents & Skills",
            },
            {
              href: "/chapters/max-mode",
              label: "Cursor Max Mode",
            },
          ],
        },
      },
      {
        id: "spec",
        label: "Written spec",
        description: "Feature spec with inputs, outputs, and constraints",
        next: {
          title: "Spec \u2192 PR",
          emoji: "\u{1F4DD}",
          description:
            "Go from a developer spec to a working PR with tests, following a plan-first approach.",
          model: "Claude Opus 4.6",
          tools: ["Cursor", "Claude Code", "GitHub Actions"],
          steps: [
            {
              label: "Spec",
              description:
                "Write a developer spec with inputs, outputs, edge cases, and constraints.",
            },
            {
              label: "Plan",
              description:
                "Ask the model to produce a plan \u2014 files to create/modify, key decisions. Review before coding.",
            },
            {
              label: "Code",
              description:
                "Implement against the plan. One feature, one PR. Pull the model back if it goes out of scope.",
            },
            {
              label: "Review",
              description:
                "Ask the model to review its own code: \u201CWhat edge cases might this miss? What would break this?\u201D",
            },
            {
              label: "Tests",
              description:
                "Generate tests from the review\u2019s edge cases.",
            },
            {
              label: "PR description",
              description:
                "Generate the PR description from the spec and the diff. Full context produces clear descriptions.",
            },
          ],
          guardrails: [
            "One feature, one PR \u2014 keep scope tight",
            "Review the plan before writing code",
            "Don\u2019t let the model touch files outside scope",
            "Ask before refactoring adjacent code",
          ],
          output:
            "Working PR with passing CI, clear description, and tests covering the identified edge cases.",
          articleLink: {
            href: "/chapters/spec-to-pr",
            label: "Spec \u2192 PR",
          },
          relatedLinks: [
            {
              href: "/chapters/spec-files",
              label: "Spec Files",
            },
            {
              href: "/chapters/diff-review-loops",
              label: "Diff Review Loops",
            },
          ],
        },
      },
      {
        id: "components",
        label: "Existing components",
        description: "Composing from atoms, molecules, and organisms",
        next: {
          title: "Building Blocks",
          emoji: "\u{1F9F1}",
          description:
            "Build new features by composing existing components using atomic design principles.",
          model: "Claude Sonnet 4.6",
          tools: ["Cursor with project rules", "Storybook", "cva"],
          steps: [
            {
              label: "Audit",
              description:
                "Check existing atoms, molecules, and organisms. Know what\u2019s available before building anything new.",
            },
            {
              label: "Plan composition",
              description:
                "Identify what to reuse vs. what to create. New atoms only when nothing existing fits.",
            },
            {
              label: "Build atoms first",
              description:
                "If new primitives are needed, build them first. Typed props, defined variants, no business logic.",
            },
            {
              label: "Compose up",
              description:
                "Assemble atoms into molecules, molecules into organisms. Each layer only uses the layer below.",
            },
            {
              label: "Storybook stories",
              description:
                "Generate stories for each new component. Cover default state, variants, and edge cases.",
            },
          ],
          guardrails: [
            "One component, one job \u2014 split if it does two things",
            "Typed props always \u2014 TypeScript interfaces for every component",
            "Variants over conditionals \u2014 use cva patterns",
            "Shared tokens only \u2014 no hardcoded colors or spacing",
          ],
          output:
            "New component composed from existing building blocks with typed props, defined variants, and Storybook coverage.",
          articleLink: {
            href: "/chapters/building-blocks",
            label: "Building Blocks",
          },
          relatedLinks: [
            {
              href: "/chapters/agents-and-skills",
              label: "Agents & Skills",
            },
          ],
        },
      },
    ],
  },

  fix: {
    id: "fix",
    question: "Can you reproduce the bug reliably?",
    options: [
      {
        id: "yes",
        label: "Yes, I can reproduce it",
        description: "I have a consistent way to trigger the bug",
        next: {
          title: "Bug \u2192 Fix (Isolate & Fix)",
          emoji: "\u{1F41B}",
          description:
            "You can reproduce it \u2014 skip straight to isolating and fixing the bug.",
          model: "Claude Sonnet 4.6",
          tools: ["Cursor", "Claude Code"],
          steps: [
            {
              label: "Isolate",
              description:
                "Strip away everything unnecessary. Reduce to the smallest case that still shows the bug.",
            },
            {
              label: "Diagnose",
              description:
                "With the minimal repro, ask: \u201CWhat\u2019s causing this?\u201D The model works best with focused input.",
            },
            {
              label: "Fix",
              description:
                "Implement the fix narrowly \u2014 fix the specific bug, don\u2019t refactor adjacent code.",
            },
            {
              label: "Regression test",
              description:
                "Write a test that would have caught this bug. Prevents it from coming back.",
            },
          ],
          guardrails: [
            "Keep the fix narrow \u2014 one bug, one fix",
            "Ask \u201Cwhy does this fix work?\u201D \u2014 if the explanation doesn\u2019t make sense, the fix might be wrong",
            "Don\u2019t refactor adjacent code in the same PR",
            "Always create a minimal repro first",
          ],
          output:
            "Targeted fix with a regression test that would have caught the original bug.",
          articleLink: {
            href: "/chapters/bug-to-fix",
            label: "Bug \u2192 Fix",
          },
          relatedLinks: [
            {
              href: "/chapters/diff-review-loops",
              label: "Diff Review Loops",
            },
          ],
        },
      },
      {
        id: "no",
        label: "No, it\u2019s intermittent",
        description: "It happens sometimes but I can\u2019t trigger it on demand",
        next: {
          title: "Bug \u2192 Fix (Reproduce First)",
          emoji: "\u{1F41B}",
          description:
            "You can\u2019t reproduce it yet \u2014 start by building a reliable repro before fixing anything.",
          model: "Claude Sonnet 4.6",
          tools: ["Cursor", "Claude Code"],
          steps: [
            {
              label: "Reproduce",
              description:
                "Reliably reproduce the bug. Try different inputs, timing, and state combinations until you can trigger it consistently.",
            },
            {
              label: "Isolate",
              description:
                "Strip away everything unnecessary. Reduce to the smallest case that still shows the bug.",
            },
            {
              label: "Diagnose",
              description:
                "With the minimal repro, ask the model what\u2019s causing it. Focused input produces focused answers.",
            },
            {
              label: "Fix",
              description:
                "Implement the fix narrowly \u2014 fix the specific bug, don\u2019t refactor adjacent code.",
            },
            {
              label: "Regression test",
              description:
                "Write a test that would have caught this bug. Prevents it from coming back.",
            },
          ],
          guardrails: [
            "Always create a minimal repro first",
            "Keep the fix narrow \u2014 one bug, one fix",
            "Ask \u201Cwhy does this fix work?\u201D \u2014 if the explanation doesn\u2019t make sense, the fix might be wrong",
            "Don\u2019t refactor adjacent code in the same PR",
          ],
          output:
            "Reliable repro, targeted fix, and a regression test that would have caught the original bug.",
          articleLink: {
            href: "/chapters/bug-to-fix",
            label: "Bug \u2192 Fix",
          },
          relatedLinks: [
            {
              href: "/chapters/diff-review-loops",
              label: "Diff Review Loops",
            },
          ],
        },
      },
    ],
  },

  tooling: {
    id: "tooling",
    question: "Which tool are you setting up?",
    options: [
      {
        id: "cursor",
        label: "Cursor",
        description: "Project rules and AI-powered editor setup",
        next: {
          title: "Cursor Setup",
          emoji: "\u{1F5B1}\uFE0F",
          description:
            "Configure Cursor with project rules and optimized settings for AI-assisted development.",
          model: "Claude Sonnet 4.6 (in Cursor)",
          tools: ["Cursor", ".cursorrules"],
          steps: [
            {
              label: "Install & configure",
              description:
                "Set up Cursor with your preferred model and API key.",
            },
            {
              label: "Create project rules",
              description:
                "Add .cursorrules with your codebase conventions, tech stack, and coding standards.",
            },
            {
              label: "Test with a real task",
              description:
                "Try a small feature or bug fix using the new configuration. Adjust rules based on results.",
            },
          ],
          guardrails: [
            "Keep .cursorrules focused \u2014 too many rules confuse the model",
            "Update rules as your codebase evolves",
          ],
          output:
            "Cursor configured with project rules tailored to your workflow.",
          articleLink: {
            href: "/chapters/agents-and-skills",
            label: "Agents & Skills",
          },
          relatedLinks: [
            {
              href: "/chapters/agents-and-skills",
              label: "Agents & Skills",
            },
          ],
        },
      },
      {
        id: "claude-code",
        label: "Claude Code",
        description: "CLI setup, CLAUDE.md, and Codex workflows",
        next: {
          title: "Claude Code & Codex",
          emoji: "\u{1F4BB}",
          description:
            "Set up Claude Code CLI and Codex for terminal-based AI development with CLAUDE.md project context.",
          model: "Claude Opus 4.6 / Sonnet 4.6",
          tools: ["Claude Code CLI", "CLAUDE.md", "GitHub Codex"],
          steps: [
            {
              label: "Install Claude Code",
              description:
                "Install the CLI and authenticate with your API key.",
            },
            {
              label: "Create CLAUDE.md",
              description:
                "Add a CLAUDE.md to your repo root with project context, conventions, and common commands.",
            },
            {
              label: "Configure permissions",
              description:
                "Set up allowed/blocked commands and file patterns for safe autonomous operation.",
            },
            {
              label: "Try a workflow",
              description:
                "Run a Spec \u2192 PR or Bug \u2192 Fix workflow through the CLI to validate the setup.",
            },
          ],
          guardrails: [
            "Keep CLAUDE.md under 500 lines \u2014 focused context beats exhaustive context",
            "Block destructive commands (rm -rf, DROP TABLE, etc.)",
            "Start with conservative permissions, loosen as you build trust",
            "Review generated commits before pushing",
          ],
          output:
            "Claude Code configured with project context, safe permissions, and a working workflow.",
          articleLink: {
            href: "/chapters/agent-guardrails",
            label: "Agent Guardrails",
          },
          relatedLinks: [
            {
              href: "/chapters/diff-review-loops",
              label: "Diff Review Loops",
            },
          ],
        },
      },
      {
        id: "figma-mcp",
        label: "Figma MCP",
        description: "Connect Figma to your AI tools via MCP",
        next: {
          title: "Figma MCP Setup",
          emoji: "\u{1F308}",
          description:
            "Connect Figma to your AI development tools via Model Context Protocol for design-to-code workflows.",
          model: "Claude Sonnet 4.6",
          tools: ["Figma MCP", "Figma Desktop", "Cursor"],
          steps: [
            {
              label: "Install Figma MCP",
              description:
                "Set up the Figma MCP server and connect it to your AI tool (Cursor or Claude Code).",
            },
            {
              label: "Configure access",
              description:
                "Grant access to the relevant Figma files and set up authentication.",
            },
            {
              label: "Test token extraction",
              description:
                "Pull design tokens from a Figma component to verify the connection works.",
            },
            {
              label: "Try Design \u2192 Storybook",
              description:
                "Run the full design-to-code workflow on a simple component to validate the setup.",
            },
          ],
          guardrails: [
            "Keep Figma Desktop open during MCP sessions",
            "Use the token skill for consistent mappings",
            "Verify extracted values against Figma \u2014 MCP can misread nested groups",
            "Start with a simple component, not a complex page layout",
          ],
          output:
            "Figma MCP connected and verified with a successful design-to-code workflow.",
          articleLink: {
            href: "/chapters/figma-mcp",
            label: "Figma MCP",
          },
          relatedLinks: [
            {
              href: "/chapters/design-to-storybook",
              label: "Design \u2192 Storybook",
            },
            {
              href: "/chapters/code-to-canvas",
              label: "Code to Canvas",
            },
          ],
        },
      },
      {
        id: "agents",
        label: "Agents & guardrails",
        description: "AI agents, skills ecosystem, and safety patterns",
        next: {
          title: "Agents, Skills & Guardrails",
          emoji: "\u{1F916}",
          description:
            "Set up AI agents with proper guardrails and learn the skills ecosystem for safe autonomous operation.",
          model: "Claude Opus 4.6",
          tools: ["Claude Code", "SKILL.md", "GitHub Actions"],
          steps: [
            {
              label: "Understand agents",
              description:
                "Learn the difference between chat, agents, and skills. Know when each is appropriate.",
            },
            {
              label: "Set up guardrails",
              description:
                "Configure file restrictions, command blocks, and review gates before giving agents autonomy.",
            },
            {
              label: "Create skills",
              description:
                "Build SKILL.md files for repeated tasks (token mapping, test writing, PR descriptions).",
            },
            {
              label: "Test with constraints",
              description:
                "Run an agent on a real task with guardrails active. Verify it respects boundaries.",
            },
          ],
          guardrails: [
            "Always set up guardrails before granting autonomy",
            "Skills should be single-purpose and reusable",
            "Review agent output before committing \u2014 especially early on",
            "Start with read-only agents, graduate to write access",
          ],
          output:
            "Agents configured with guardrails and reusable skills for safe autonomous development.",
          articleLink: {
            href: "/chapters/agents-and-skills",
            label: "Agents & Skills",
          },
          relatedLinks: [
            {
              href: "/chapters/agent-guardrails",
              label: "Agent Guardrails",
            },
          ],
        },
      },
    ],
  },
};

// --- Helpers ---

/** Walk the tree from root using a path of option IDs, returning the current position */
export function resolveTreePath(path: string[]): {
  node: TreeNode | null;
  result: TreeResult | null;
  breadcrumbs: { optionId: string; label: string }[];
} {
  const breadcrumbs: { optionId: string; label: string }[] = [];
  let currentNode: TreeNode = TREE_NODES.root;

  for (const optionId of path) {
    const option = currentNode.options.find((o) => o.id === optionId);
    if (!option) return { node: null, result: null, breadcrumbs };

    breadcrumbs.push({ optionId, label: option.label });

    if (typeof option.next === "string") {
      const nextNode = TREE_NODES[option.next];
      if (!nextNode) return { node: null, result: null, breadcrumbs };
      currentNode = nextNode;
    } else {
      // Leaf — we have a result
      return { node: null, result: option.next, breadcrumbs };
    }
  }

  // Still on a question node
  return { node: currentNode, result: null, breadcrumbs };
}

/** Format a tree result as markdown for clipboard copying */
export function formatResultAsMarkdown(result: TreeResult): string {
  const lines: string[] = [];
  lines.push(`# ${result.title}`);
  lines.push("");
  lines.push(result.description);
  lines.push("");
  lines.push(`**Recommended model:** ${result.model}`);
  lines.push("");
  lines.push("## Steps");
  result.steps.forEach((step, i) => {
    lines.push(`${i + 1}. **${step.label}** \u2014 ${step.description}`);
  });
  lines.push("");
  lines.push("## Tools");
  lines.push(result.tools.join(", "));
  lines.push("");
  lines.push("## Guardrails");
  result.guardrails.forEach((g) => {
    lines.push(`- ${g}`);
  });
  lines.push("");
  lines.push("## Expected output");
  lines.push(result.output);
  return lines.join("\n");
}
