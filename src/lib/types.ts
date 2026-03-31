export type Category = "models" | "workflows" | "tooling" | "notes";

export type InteractiveTool =
  | "model-picker"
  | "model-tinder"
  | "model-mixer"
  | "workflow-recipe"
  | "scenario-lab"
  | "prompt-lab"
  | "failure-gallery"
  | "dev-benchmark"
  | "config-generator"
  | "cost-calculator"
  | "context-window-viz"
  | "decision-tree"
  | "max-mode-viz"
  | "model-compare";

export interface ArticleFrontmatter {
  title: string;
  description: string;
  story?: string;
  category: Category;
  order: number;
  interactiveTools?: InteractiveTool[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface Article {
  slug: string;
  category: Category;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export interface ArticleMeta {
  slug: string;
  category: Category;
  frontmatter: ArticleFrontmatter;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string; accent: string; accentBg: string }
> = {
  models: {
    label: "Models",
    description:
      "Reasoning vs fast, model personalities, and the tradeoffs that shape every task.",
    accent: "text-blue-400",
    accentBg: "bg-blue-400/10 border-blue-400/20",
  },
  workflows: {
    label: "Workflows",
    description:
      "Spec to PR, bug to fix, design to Storybook — step-by-step flows with guardrails and expected outputs.",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10 border-emerald-400/20",
  },
  tooling: {
    label: "Tooling",
    description:
      "Claude Code, Codex, Figma MCP, agent guardrails, and the skills ecosystem. Configuration, usage patterns, and tradeoffs.",
    accent: "text-violet-400",
    accentBg: "bg-violet-400/10 border-violet-400/20",
  },
  notes: {
    label: "Notes",
    description:
      "Things moving fast in agent tooling — hooks, harness design, browser automation, and the emerging infrastructure layer. Currently diving in.",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10 border-amber-400/20",
  },
};
