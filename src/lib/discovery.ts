import type { Metadata } from "next";
import { SITE_NAME, AUTHOR_TWITTER } from "./siteConfig";
import { TOOL_CATALOG } from "./toolCatalog";

export const GUIDE_GROUPS = [
  {
    title: "Choose models",
    description: "Understand tradeoffs before choosing a model for your task.",
    slugs: ["reasoning-vs-fast", "model-personalities", "max-mode"],
  },
  {
    title: "Ship features",
    description: "Turn a requirement into a small, reviewable pull request.",
    slugs: [
      "spec-to-pr",
      "spec-files",
      "prompting-and-pitfalls",
      "jira-to-cursor",
      "building-blocks",
    ],
  },
  {
    title: "Review and debug",
    description:
      "Reproduce failures, inspect changes, and control agent scope.",
    slugs: [
      "bug-to-fix",
      "ai-code-review",
      "diff-review-loops",
      "agent-guardrails",
    ],
  },
  {
    title: "Configure agents and design tools",
    description:
      "Give agents reusable context and connect design to implementation.",
    slugs: [
      "agents-and-skills",
      "what-is-an-ai-harness",
      "figma-mcp",
      "design-to-storybook",
      "code-to-canvas",
      "design-to-code-and-back",
    ],
  },
];

export const START_TASKS = [
  {
    title: "Ship a feature",
    slug: "spec-to-pr",
    description: "Go from a clear spec to a reviewed PR.",
  },
  {
    title: "Fix a bug",
    slug: "bug-to-fix",
    description: "Reproduce the failure and prove the fix.",
  },
  {
    title: "Review a PR",
    slug: "ai-code-review",
    description: "Triage AI findings before human review.",
  },
  {
    title: "Use Figma with AI",
    slug: "figma-mcp",
    description: "Map design context to your React components.",
  },
];

export const DISCOVERY_PAGES = [
  ...TOOL_CATALOG.map((tool) => ({
    href: `/tools/${tool.id}`,
    title: tool.title,
    description: tool.description,
  })),
  {
    href: "/guides",
    title: "AI Coding Guides",
    description:
      "Practical AI coding guides: choose models, ship features, debug and review code, and configure agents and design tools.",
  },
  {
    href: "/tools",
    title: "AI Developer Tools",
    description:
      "Find a practical AI coding workflow and copy a recipe for your next feature, bug fix, or code review.",
  },
  {
    href: "/tools/ai-coding-workflow",
    title: "AI Coding Workflow Finder and Recipes",
    description:
      "Choose an AI coding workflow for your task. Get steps, prompts, guardrails, and a copyable recipe for features, debugging, and PR review.",
  },
];

export function discoveryMetadata(href: string): Metadata {
  const page = DISCOVERY_PAGES.find((entry) => entry.href === href)!;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: href },
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      url: href,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      creator: AUTHOR_TWITTER,
    },
  };
}
