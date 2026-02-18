export type Category = "models" | "workflows" | "tooling";

export type InteractiveTool =
  | "model-picker"
  | "model-mixer"
  | "workflow-recipe"
  | "prompt-lab"
  | "failure-gallery"
  | "dev-benchmark"
  | "config-generator"
  | "cost-calculator"
  | "diff-viewer"
  | "context-window-viz";

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
      "When to reach for which model — from real shipping experience. Reasoning vs fast, coding vs vision, long context vs RAG.",
    accent: "text-blue-400",
    accentBg: "bg-blue-400/10 border-blue-400/20",
  },
  workflows: {
    label: "Workflows",
    description:
      "Battle-tested flows I actually run as a developer. Spec to PR, bug to fix, design to Storybook — with guardrails and expected outputs.",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10 border-emerald-400/20",
  },
  tooling: {
    label: "Tooling",
    description:
      "Claude Code, Codex, Figma MCP, agent guardrails, and the emerging skills ecosystem. What I use, how I configure it, what broke.",
    accent: "text-violet-400",
    accentBg: "bg-violet-400/10 border-violet-400/20",
  },
};
