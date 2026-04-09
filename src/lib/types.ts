export type Part =
  | "understanding-models"
  | "shipping-workflows"
  | "review-quality"
  | "tools-infrastructure";

export const PART_META: Record<Part, { label: string; description: string; number: number }> = {
  "understanding-models": {
    label: "Understanding the Models",
    description: "Model selection, personalities, prompting, and cost tradeoffs.",
    number: 1,
  },
  "shipping-workflows": {
    label: "Shipping Workflows",
    description: "From spec to PR, bug to fix — flows that work in production.",
    number: 2,
  },
  "review-quality": {
    label: "Review & Quality",
    description: "Diff review, AI code review, and guardrail patterns.",
    number: 3,
  },
  "tools-infrastructure": {
    label: "Tools & Infrastructure",
    description: "Context strategy, agents, skills, Figma MCP, and emerging infrastructure.",
    number: 4,
  },
};

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

export interface ChapterFrontmatter {
  title: string;
  subtitle: string;
  chapter: number;
  part: Part;
  partNumber: number;
  wonderQuestion?: string;
  interactiveTools?: InteractiveTool[];
  publishedAt?: string;
  updatedAt?: string;
  illustrationPlaceholders?: string[];
}

export interface Chapter {
  slug: string;
  frontmatter: ChapterFrontmatter;
  content: string;
}

