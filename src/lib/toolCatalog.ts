/** Public tool pages and their companion guides. Keep this data server-safe. */
export const TOOL_CATALOG = [
  {
    id: "model-picker",
    title: "Model Picker",
    category: "Choose a model",
    description: "Match a model to your task, constraints, and working style.",
    outcome: "A shortlist with reasons and tradeoffs",
    instruction:
      "Answer five short questions, then compare the three suggestions and copy your shortlist.",
    guide: "reasoning-vs-fast",
    guideTitle: "Reasoning vs. fast models",
  },
  {
    id: "model-tinder",
    title: "Model Personalities",
    category: "Choose a model",
    description: "Explore working styles and save the models you want to try.",
    outcome: "Your own model shortlist",
    instruction:
      "Browse the profiles, save useful candidates, and explore a scripted example of their working style.",
    guide: "model-personalities",
    guideTitle: "Model personalities",
  },
  {
    id: "model-compare",
    title: "Model Compare",
    category: "Choose a model",
    description:
      "Compare context capacity and prepare a developer review checklist.",
    outcome: "A context fit comparison and checklist",
    instruction:
      "Set your context needs to see which models have room. Use Developer checks to compare the candidates on a real task.",
    guide: "model-personalities",
    guideTitle: "Model personalities",
  },
  {
    id: "cost-calculator",
    title: "Cost Calculator",
    category: "Plan the work",
    description:
      "Estimate API spending for your token usage and task frequency.",
    outcome: "A copyable monthly cost estimate",
    instruction:
      "Choose a task preset, adjust its tokens and frequency, and compare the estimates. A month assumes 30 days.",
    guide: "reasoning-vs-fast",
    guideTitle: "Reasoning vs. fast models",
  },
  {
    id: "model-mixer",
    title: "Model Mixer",
    category: "Plan the work",
    description:
      "Assign models to workflow steps and compare cost assumptions.",
    outcome: "A model plan for each step",
    instruction:
      "Choose a workflow, assign a model to each step, and adjust attempts for both approaches. Copy the plan into your task notes.",
    guide: "spec-to-pr",
    guideTitle: "From spec to pull request",
  },
  {
    id: "max-mode-viz",
    title: "Context & Cost Explorer",
    category: "Plan the work",
    description: "Check whether a request fits and estimate its token cost.",
    outcome: "A request budget and capacity check",
    instruction:
      "Choose a model and enter input, output, and budget assumptions. Check capacity before using the request estimate.",
    guide: "max-mode",
    guideTitle: "Context windows and Max Mode",
  },
  {
    id: "scenario-lab",
    title: "Scenario Lab",
    category: "Practice & configure",
    description:
      "Explore coding examples, workflow choices, and cost assumptions.",
    outcome: "A task takeaway to try in your project",
    instruction:
      "Choose a scenario, inspect the example outputs, and compare direct work with planning where available.",
    guide: "prompting-and-pitfalls",
    guideTitle: "Prompting and pitfalls",
  },
  {
    id: "failure-gallery",
    title: "Failure Gallery",
    category: "Practice & configure",
    description:
      "Practice spotting bugs in AI output and learn how to prevent them.",
    outcome: "A reusable prevention checklist",
    instruction:
      "Read the complete example before revealing the problem. Open Prevention for the fix and a copyable checklist.",
    guide: "ai-code-review",
    guideTitle: "AI code review",
  },
  {
    id: "config-generator",
    title: "Config Generator",
    category: "Practice & configure",
    description:
      "Turn project conventions into a ready-to-edit agent instruction file.",
    outcome: "AGENTS.md, CLAUDE.md, or a Cursor rule",
    instruction:
      "Choose a format and project stack, then add your commands and conventions. Review the generated text before copying it into your repository.",
    guide: "agents-and-skills",
    guideTitle: "Agents and skills",
  },
] as const;

export type ToolId = (typeof TOOL_CATALOG)[number]["id"];
export const TOOL_CATEGORIES = [
  "Choose a model",
  "Plan the work",
  "Practice & configure",
] as const;
