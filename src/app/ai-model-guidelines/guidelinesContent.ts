import type { GuidelinesModelId } from "./guidelinesModels";

export const GUIDELINES_METADATA = {
  owners: "Agentic Engineering Core Team",
  referTo: "Filip van Harreveld",
  description:
    "Opinionated guidelines for picking the right model for the task at hand.",
  status: "DRAFT" as const,
};

export const GUIDELINES_INTRO = {
  title: "Opinionated guidelines for picking the right model for the task.",
  shortVersion:
    "The short version: do not always use the smartest model, and do not always use the cheapest one. Pick the model that matches the task.",
  balance:
    "A model that is too heavy wastes money. A model that is too light wastes time because you need more rounds, more corrections, and sometimes still get worse output.",
};

export type AtAGlanceColumnId =
  | "simple"
  | "mediumLow"
  | "mediumCreative"
  | "complex";

export interface AtAGlanceRow {
  label: string;
  cells: Record<AtAGlanceColumnId, string>;
}

export const AT_A_GLANCE_COLUMNS: { id: AtAGlanceColumnId; title: string }[] = [
  { id: "simple", title: "Simple" },
  { id: "mediumLow", title: "Medium — Low Creativity" },
  { id: "mediumCreative", title: "Medium — Creative" },
  { id: "complex", title: "Complex" },
];

/** Matrix rows — model name cells use modelIds resolved at render time */
export interface AtAGlanceModelCell {
  modelIds: GuidelinesModelId[];
}

export type AtAGlanceCellValue = string | AtAGlanceModelCell;

export const AT_A_GLANCE_ROWS: {
  label: string;
  cells: Record<AtAGlanceColumnId, AtAGlanceCellValue>;
}[] = [
  {
    label: "Best for",
    cells: {
      simple: "Clearly defined, low-risk tasks",
      mediumLow: "Competent coding without heavy invention",
      mediumCreative:
        "Writing, UI ideas, refactoring, judgment-heavy work",
      complex:
        "Multi-file work, deep reasoning, architecture, hard debugging",
    },
  },
  {
    label: "Recommended model",
    cells: {
      simple: { modelIds: ["gpt-5.6-luna", "gemini-flash"] },
      mediumLow: { modelIds: ["gpt-5.6-terra", "composer-2.5"] },
      mediumCreative: { modelIds: ["sonnet-5"] },
      complex: { modelIds: ["gpt-5.6-sol", "claude-fable-5"] },
    },
  },
  {
    label: "Example tasks",
    cells: {
      simple:
        "Rename a prop, formatting, small bug fix, simple extraction, copy tweak",
      mediumLow:
        "Straightforward coding where the outcome is already clear, modest refactors, article edits",
      mediumCreative:
        "Component structure, UX details, copy improvements, mid-size refactors, design exploration",
      complex:
        "Cross-file refactor with tests, architecture options, complex bugs, legal/financial analysis, brand voice",
    },
  },
  {
    label: "Reasoning effort¹",
    cells: {
      simple: "Low",
      mediumLow: "Medium",
      mediumCreative: "Medium",
      complex: "High → Max",
    },
  },
  {
    label: "Mode",
    cells: {
      simple: "Standard (avoid Fast by default)",
      mediumLow: "Standard",
      mediumCreative: "Standard",
      complex:
        "Plan Mode with strong model, then switch to lighter model for implementation; Max Mode only when deep context is needed. If still not working, do the implementation with the heavy model too.",
    },
  },
  {
    label: "Approx. cost²",
    cells: {
      simple: "$",
      mediumLow: "$$",
      mediumCreative: "$$",
      complex: "$$$",
    },
  },
  {
    label: "Avoid",
    cells: {
      simple: "GPT-5.6 Sol, Claude Fable 5, Max Mode, Fast Mode",
      mediumLow: "Opus Fast, defaulting to Max Mode",
      mediumCreative: "Jumping straight to the heaviest model",
      complex:
        "Doing everything in Fable 5 or Sol + Max Mode by default — costs escalate quickly",
    },
  },
];

export const AT_A_GLANCE_FOOTNOTES = [
  {
    marker: "¹",
    label: "Reasoning effort",
    text: "Match to the real risk of the task. Don't overthink a simple prompt; don't underthink a task where a bad answer creates cleanup work.",
  },
  {
    marker: "²",
    label: "Cost",
    text: "Approximate cost per task scales with model size, reasoning effort, and context window. Max Mode multiplies cost — reserve it for large codebases, long chats, or deep debugging.",
  },
];

export const MODEL_PICK_QUESTIONS = [
  {
    label: "Complexity",
    text: "how much reasoning, codebase context, or multi-step work does this need?",
  },
  {
    label: "Creativity",
    text: "do we want the model to invent, write, design, or explore options?",
  },
];

export interface RecommendationBlock {
  title: string;
  modelIds: GuidelinesModelId[];
  note?: string;
}

export const RECOMMENDED_PICKS: RecommendationBlock[] = [
  {
    title: "Complex tasks",
    modelIds: ["gpt-5.6-sol", "claude-fable-5"],
    note: "Use Plan Mode for complex multi-file tasks — see the Tips section below.",
  },
  {
    title: "Medium tasks with creative work",
    modelIds: ["sonnet-5"],
    note: "Usually a good balance for writing, UI ideas, refactoring, and judgment-heavy tasks.",
  },
  {
    title: "Medium tasks with low creativity",
    modelIds: ["gpt-5.6-terra", "composer-2.5"],
    note: "Good when you need competence and context, but not the absolute heaviest model.",
  },
  {
    title: "Simple, clearly defined tasks",
    modelIds: ["gpt-5.6-luna", "gemini-flash"],
    note: "Avoid Fast mode by default. Fast is quicker, but more expensive, and often not worth it if you can do something else while the model works.",
  },
];

export const CREATIVITY_SCALE = [
  {
    title: "No creativity",
    description:
      "Clear implementation, small bug fix, rename, formatting, simple extraction.",
  },
  {
    title: "Low creativity",
    description:
      "Straightforward coding where the desired outcome is already clear.",
  },
  {
    title: "Medium creativity",
    description:
      "Some judgment is needed: component structure, copy improvements, UX details, refactors.",
  },
  {
    title: "High creativity",
    description:
      "Writing, design, product ideas, architecture options, or exploring multiple solutions, open-ended strategy, major redesigns, brand voice, complex product decisions.",
  },
];

export const REASONING_EFFORT = [
  {
    title: "Low",
    description: "Summaries, copy tweaks, simple Q&A, tiny code edits.",
  },
  {
    title: "Medium",
    description:
      "Normal coding tasks, modest refactors, article editing, UI improvements.",
  },
  {
    title: "High",
    description:
      "Multi-step debugging, architecture, tricky code changes, tests, data modeling.",
  },
  {
    title: "Highest",
    description:
      "Hard reasoning, complex bugs, legal/financial analysis, large cross-file changes, or anything where being wrong is expensive.",
  },
];

export const REASONING_EFFORT_CAPTION =
  "In Cursor, reasoning effort is set from the model menu. Choose the model first, then pick the context window and reasoning level for the task.";

export const REASONING_RULE_OF_THUMB =
  "Rule of thumb: match reasoning effort to the real risk of the task. Do not overthink a simple prompt. But do not underthink a task where a bad answer creates cleanup work.";

export const PLAN_MODE_EXAMPLE = {
  quote: "Create a new component in our application.",
  planModelIds: ["gpt-5.6-sol", "claude-fable-5"] as GuidelinesModelId[],
  implementModelIds: ["gpt-5.6-terra", "sonnet-5", "composer-2.5"] as GuidelinesModelId[],
};

export const PROMPT_CHECKLIST = [
  "what you want",
  "why you want it",
  "what constraints matter",
  "what files or systems are relevant",
  "what good looks like",
  "ask the model to ask you questions if anything is unclear",
];

export interface CostExample {
  id: string;
  title: string;
  task: string;
  usage?: { label: string; inputTokens: number; outputTokens: number }[];
  modelCosts: { modelId: GuidelinesModelId; inputTokens: number; outputTokens: number }[];
  approach?: { label: string; modelIds?: GuidelinesModelId[]; text?: string }[];
  extraCosts?: { modelId: GuidelinesModelId; inputTokens: number; outputTokens: number }[];
  totalLine?: { label: string; modelIds: GuidelinesModelId[]; phases: { modelId: GuidelinesModelId; inputTokens: number; outputTokens: number }[] };
  advice: string;
  paragraphs?: string[];
}

export const COST_EXAMPLES: CostExample[] = [
  {
    id: "simple",
    title: "Example 1: Simple Task",
    task: "Rename this prop and update the few places it is used.",
    usage: [{ label: "Estimated usage", inputTokens: 20_000, outputTokens: 2_000 }],
    modelCosts: [
      { modelId: "composer-2.5", inputTokens: 20_000, outputTokens: 2_000 },
      { modelId: "gemini-flash", inputTokens: 20_000, outputTokens: 2_000 },
      { modelId: "gpt-5.6-luna", inputTokens: 20_000, outputTokens: 2_000 },
      { modelId: "gpt-5.6-terra", inputTokens: 20_000, outputTokens: 2_000 },
      { modelId: "gpt-5.6-sol", inputTokens: 20_000, outputTokens: 2_000 },
      { modelId: "claude-fable-5", inputTokens: 20_000, outputTokens: 2_000 },
      { modelId: "opus-fast", inputTokens: 20_000, outputTokens: 2_000 },
    ],
    advice:
      "Do not use Sol or Fable for this unless there is hidden complexity. GPT-5.6 Luna or Gemini 3 Flash is enough.",
  },
  {
    id: "medium-creative",
    title: "Example 2: Medium Creative Task",
    task: "Improve this article section and make the examples clearer.",
    usage: [{ label: "Estimated usage", inputTokens: 80_000, outputTokens: 8_000 }],
    modelCosts: [
      { modelId: "composer-2.5", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "composer-2.5-fast", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "gemini-3.1-pro", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "sonnet-5", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "gpt-5.6-luna", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "gpt-5.6-terra", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "gpt-5.6-sol", inputTokens: 80_000, outputTokens: 8_000 },
      { modelId: "claude-fable-5", inputTokens: 80_000, outputTokens: 8_000 },
    ],
    advice:
      "Sonnet 5 is probably the best fit here. It is strong creatively without jumping straight to the most expensive models.",
  },
  {
    id: "complex",
    title: "Example 3: Complex Codebase Task",
    task: "Plan and implement a cross-file refactor with tests.",
    usage: [
      { label: "Planning phase", inputTokens: 300_000, outputTokens: 20_000 },
      { label: "Implementation phase", inputTokens: 120_000, outputTokens: 20_000 },
    ],
    approach: [
      { label: "Plan in Plan Mode with", modelIds: ["claude-fable-5"] },
      {
        label: "Implement with",
        modelIds: ["gpt-5.6-terra", "composer-2.5"],
        text: "if the plan is clear and the implementation is straightforward.",
      },
    ],
    modelCosts: [
      { modelId: "claude-fable-5", inputTokens: 300_000, outputTokens: 20_000 },
      { modelId: "gpt-5.6-terra", inputTokens: 120_000, outputTokens: 20_000 },
    ],
    extraCosts: [
      { modelId: "gemini-flash", inputTokens: 120_000, outputTokens: 20_000 },
      { modelId: "claude-fable-5", inputTokens: 420_000, outputTokens: 40_000 },
    ],
    totalLine: {
      label: "Total",
      modelIds: ["claude-fable-5", "gpt-5.6-terra"],
      phases: [
        { modelId: "claude-fable-5", inputTokens: 300_000, outputTokens: 20_000 },
        { modelId: "gpt-5.6-terra", inputTokens: 120_000, outputTokens: 20_000 },
      ],
    },
    advice:
      "Use Fable or Sol where the reasoning matters most: understanding the problem, reading the codebase, and making the plan. Once the plan is clear, use Terra or Composer for implementation. Luna or Gemini Flash are useful when the implementation is mechanical and tightly specified.",
    paragraphs: [
      "The real cost is not just token price. If a model is too weak, you may spend five extra rounds fixing bad assumptions. That can be more expensive than choosing the right model once.",
    ],
  },
];

export const PRICING_DISCLAIMER =
  "These examples ignore caching and plan-specific usage pools, so treat them as directionally useful, not exact invoices.";
