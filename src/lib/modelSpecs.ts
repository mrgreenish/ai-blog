// ---------------------------------------------------------------------------
// Central model registry — single source of truth for all model-specific data
// used across interactive components and blog content.
//
// To update a model's pricing, name, or personality: edit here only.
// ---------------------------------------------------------------------------

export type Tier = "fast" | "balanced" | "reasoning";
export type Provider = "Anthropic" | "OpenAI" | "Google" | "DeepSeek" | "Cursor";

export interface ModelSpec {
  // Core identity
  id: string;
  name: string;
  provider: Provider;

  // Pricing (per 1M tokens, USD)
  inputPer1M: number;
  outputPer1M: number;

  // Tier classification for ModelMixer
  tier: Tier;

  // Context window (tokens)
  contextWindowTokens: number;

  // Presentation — used by ModelPicker, ModelTinder, DevBenchmark header
  tagline: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  /** Tailwind bg-* color for context window bar */
  contextBarColor: string;
  /** Tailwind text-* color for cost calculator row */
  costColor: string;

  // Personality — used by ModelPicker
  why: Record<string, string>;
  whenWrong: string;

  // Personality — used by ModelTinder
  traits: string[];
  bestFor: string;
  worstFor: string;

  // DevBenchmark — pass/fail per check key
  benchmark: {
    correctServerAction: boolean;
    followedConstraints: boolean;
    madeUpDocs: boolean;
    hiddenBugsInRefactor: boolean;
  };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const MODEL_REGISTRY: ModelSpec[] = [
  // ── Fast tier ──────────────────────────────────────────────────────────────
  {
    id: "gemini-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    inputPer1M: 0.10,
    outputPer1M: 0.40,
    tier: "fast",
    contextWindowTokens: 1_000_000,
    tagline: "The Careful One",
    emoji: "💎",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    accentColor: "text-cyan-400",
    contextBarColor: "bg-yellow-500",
    costColor: "text-yellow-400",
    why: {
      coding:
        "Gemini executes exactly what you ask — no surprises, no scope creep. For production code where predictability matters, that's a feature.",
      analysis:
        "Gemini stays close to the source material and doesn't over-interpret. Good for structured analysis where you want the facts, not editorializing.",
      writing:
        "Gemini follows your format and constraints reliably. It won't rewrite your voice or restructure what you didn't ask it to touch.",
      vision:
        "Gemini's literal-mindedness works well for vision tasks — it describes what's there, not what it thinks should be there.",
      production:
        "Gemini's risk-averse defaults shine in production contexts. It picks the safest approach and rarely introduces unexpected changes.",
      accuracy:
        "When you need the model to do exactly what you said and nothing more, Gemini's conservative interpretation is the right fit.",
      targeted:
        "Gemini is precise with targeted edits. It won't wander outside the scope you defined.",
    },
    whenWrong:
      "When you need the model to push back, suggest a better approach, or notice that you're solving the wrong problem. Gemini won't do that — you have to ask explicitly.",
    traits: [
      "Literal-minded — does exactly what you say",
      "Risk-averse — picks the safest approach",
      "Consistent in long sessions",
    ],
    bestFor: "Production refactors where surprises are costly",
    worstFor: "Open-ended exploration or design decisions",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "gpt4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    tier: "fast",
    contextWindowTokens: 128_000,
    tagline: "The Balanced One",
    emoji: "⚡",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-500",
    accentColor: "text-emerald-400",
    contextBarColor: "bg-zinc-400",
    costColor: "text-zinc-300",
    why: {
      coding:
        "GPT produces the kind of code that feels like the accepted Stack Overflow answer — sensible, readable, and something your team will understand.",
      everyday:
        "GPT's pragmatic defaults make it ideal for the steady stream of everyday shipping tasks. It fills in reasonable gaps without overstepping.",
      internal:
        "For internal tools where 'good enough' is genuinely good enough, GPT's balanced approach keeps you moving without overthinking.",
      format:
        "GPT is the most consistent at following output format instructions. If you have structured output requirements, it delivers.",
      balance:
        "GPT sits in the sweet spot between speed and accuracy. It's rarely the best at either extreme, but it's reliably solid across the middle.",
    },
    whenWrong:
      "When you need genuine insight or creative problem-solving. GPT optimizes for giving you what you asked for, not what you actually need. It won't surprise you with a better approach.",
    traits: [
      "Pragmatic defaults — Stack Overflow energy",
      "Measured initiative — fills gaps without overstepping",
      "Best at following output format instructions",
    ],
    bestFor: "Everyday shipping in team codebases",
    worstFor: "Tasks that need genuine creative insight",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    inputPer1M: 0.55,
    outputPer1M: 2.19,
    tier: "fast",
    contextWindowTokens: 128_000,
    tagline: "The Open One",
    emoji: "🔓",
    gradientFrom: "from-slate-600",
    gradientTo: "to-slate-500",
    accentColor: "text-slate-400",
    contextBarColor: "bg-slate-500",
    costColor: "text-slate-300",
    why: {},
    whenWrong: "When you need tight data privacy guarantees or enterprise support.",
    traits: [
      "Open-source weights — fully inspectable",
      "Strong reasoning at low cost",
      "Self-hosted option available",
    ],
    bestFor: "Cost-sensitive pipelines where open weights matter",
    worstFor: "Tasks requiring the latest frontier capabilities",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    inputPer1M: 1.00,
    outputPer1M: 5.00,
    tier: "fast",
    contextWindowTokens: 200_000,
    tagline: "The Fast Claude",
    emoji: "🌸",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-500",
    accentColor: "text-rose-400",
    contextBarColor: "bg-rose-500",
    costColor: "text-emerald-400",
    why: {},
    whenWrong: "When the task needs deep reasoning or architectural judgment.",
    traits: [
      "Fastest Anthropic model",
      "Retains Claude's instruction-following quality",
      "Cost-effective for high-volume pipelines",
    ],
    bestFor: "High-volume pipelines and quick structured tasks",
    worstFor: "Complex reasoning or architecture decisions",
    benchmark: {
      correctServerAction: false,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: true,
    },
  },

  // ── Balanced tier ──────────────────────────────────────────────────────────
  {
    id: "composer-1",
    name: "Cursor Composer-1",
    provider: "Cursor",
    inputPer1M: 1.25,
    outputPer1M: 10.00,
    tier: "balanced",
    contextWindowTokens: 128_000,
    tagline: "The Focused One",
    emoji: "🎯",
    gradientFrom: "from-sky-600",
    gradientTo: "to-blue-500",
    accentColor: "text-sky-400",
    contextBarColor: "bg-sky-500",
    costColor: "text-sky-400",
    why: {
      targeted:
        "Composer-1 is built for this. It reads your open files and diffs, executes the targeted change cleanly, and doesn't touch anything you didn't point at.",
      speed:
        "The round-trip from prompt to applied diff is fast. You see the change inline, accept or reject, and move on. Tight feedback loop.",
      ide:
        "You don't have to paste code into a chat window — Composer-1 already has your context from the open tabs and recent edits.",
    },
    whenWrong:
      "When the task requires multiple steps, tool use, or verification. Composer-1 is a precise instrument, not an autonomous agent. It won't run tests, read the output, and fix the failures.",
    traits: [
      "IDE-native — reads your open files and diffs",
      "Tight scope — edits exactly what you point at",
      "Fast iteration — optimized for targeted changes",
    ],
    bestFor: "Precise, single-file edits and quick targeted changes",
    worstFor: "Multi-step tasks that span many files or need tool use",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "sonnet-4.6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    tier: "balanced",
    contextWindowTokens: 200_000,
    tagline: "The Proactive One",
    emoji: "✨",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-500",
    accentColor: "text-violet-400",
    contextBarColor: "bg-blue-500",
    costColor: "text-blue-400",
    why: {
      feature:
        "Sonnet is a genuine thought partner for feature design. It'll suggest a better API surface, spot issues in your data model, and notice things you didn't ask about.",
      multifile:
        "Sonnet handles multi-file work well — it understands how changes ripple across a codebase and coordinates them coherently.",
      architecture:
        "Sonnet's creativity and proactiveness make it strong for architecture exploration. It thinks beyond the immediate task.",
      writing:
        "Sonnet gives the clearest, most useful explanations. It connects your specific situation to the general principle in a way other models don't.",
      analysis:
        "Sonnet notices things. While analyzing, it'll surface connections and implications that weren't in your original question.",
    },
    whenWrong:
      "When scope matters. Sonnet's instinct to be helpful means it expands tasks — fixing naming conventions you didn't ask about, restructuring code to match its taste. Set explicit constraints or you'll review a 40-file diff when you asked for 3.",
    traits: [
      "Genuinely creative — suggests better APIs",
      "Notices things you didn't ask about",
      "Best at explaining complex concepts",
    ],
    bestFor: "Feature design and architecture exploration",
    worstFor: "Tight-scope tasks where drift is expensive",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },

  // ── Reasoning tier ─────────────────────────────────────────────────────────
  {
    id: "opus-4.6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    inputPer1M: 5.00,
    outputPer1M: 25.00,
    tier: "reasoning",
    contextWindowTokens: 200_000,
    tagline: "The Deep Thinker",
    emoji: "🧠",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    accentColor: "text-amber-400",
    contextBarColor: "bg-orange-500",
    costColor: "text-zinc-300",
    why: {
      coding:
        "Opus traces actual logic, not just patterns. It catches bugs that require understanding three levels of indirection, identifies race conditions by simulating concurrent execution, and spots type issues TypeScript itself misses. For production code where correctness is non-negotiable, this depth is the difference.",
      production:
        "Opus's deep accuracy shines in production contexts. It doesn't pattern-match — it reasons through the actual logic, catches subtle bugs, and flags the edge cases other models miss.",
      multifile:
        "Opus thinks in systems, not just in code. Across a multi-file change, it tracks how abstractions interact and will tell you when a design decision will cause problems two features from now.",
      critical:
        "Opus traces actual logic, not just patterns. For critical systems where a subtle bug has real consequences, this depth is worth the cost.",
      architecture:
        "Opus thinks in systems and abstractions. It'll identify that your current abstraction will cause problems two features from now — and explain why.",
      reasoning:
        "Opus doesn't pattern-match — it actually reasons. Multi-step logic, constraint satisfaction, debugging subtle interactions — this is the task type where the gap between Opus and everything else is widest.",
      hard:
        "Where other models pattern-match, Opus reasons through the problem. It catches bugs that require understanding three levels of indirection.",
      accuracy:
        "Opus's thoroughness means it considers more options and explores more edge cases. When you need to be right, not just fast, it's the right choice.",
    },
    whenWrong:
      "For routine tasks. Opus is expensive and slow, and the depth it provides isn't proportional to the value for scaffolding, simple refactors, or boilerplate. You're paying for a level of reasoning the task doesn't need.",
    traits: [
      "Traces actual logic, not just patterns",
      "Thinks in systems and abstractions",
      "Proactive with high-signal observations",
    ],
    bestFor: "Hard problems, architecture reviews, subtle bugs",
    worstFor: "Routine tasks — cost and latency don't justify it",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "o3-pro",
    name: "o3-pro",
    provider: "OpenAI",
    inputPer1M: 20.00,
    outputPer1M: 80.00,
    tier: "reasoning",
    contextWindowTokens: 200_000,
    tagline: "The Heavy Reasoner",
    emoji: "🏋️",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-violet-500",
    accentColor: "text-indigo-400",
    contextBarColor: "bg-indigo-500",
    costColor: "text-zinc-300",
    why: {},
    whenWrong: "For anything that doesn't require maximum reasoning depth — the cost is hard to justify.",
    traits: [
      "Maximum reasoning depth",
      "Thorough exploration of solution space",
      "Highest accuracy on hard problems",
    ],
    bestFor: "The hardest problems where cost is secondary to correctness",
    worstFor: "Any task that doesn't require maximum depth",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },

  // ── Cursor agentic ─────────────────────────────────────────────────────────
  {
    id: "composer-1-5",
    name: "Cursor Composer-1.5",
    provider: "Cursor",
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    tier: "balanced",
    contextWindowTokens: 200_000,
    tagline: "The Agentic One",
    emoji: "🤖",
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-pink-500",
    accentColor: "text-fuchsia-400",
    contextBarColor: "bg-fuchsia-500",
    costColor: "text-fuchsia-400",
    why: {
      autonomous:
        "Composer-1.5 can run terminal commands, read the output, make more edits, and loop until the task is done. It's the closest thing to a developer who can actually execute end-to-end.",
      multifile:
        "It navigates the project, finds the relevant files, and makes coordinated changes across many of them — without you having to specify each one.",
      selfcorrect:
        "It sees the TypeScript error, understands it in context, and fixes it — without you having to copy-paste the error back into a prompt.",
    },
    whenWrong:
      "When you need tight control. Composer-1.5 can go down wrong paths and make a lot of changes before you realize it's off track. Short task scopes and frequent checkpoints are essential.",
    traits: [
      "Runs terminal commands and reads test output",
      "Edits across many files in a single task",
      "Self-corrects — reruns and fixes its own mistakes",
    ],
    bestFor: "Multi-step features, refactors, and autonomous bug fixes",
    worstFor: "Quick one-liner changes where the overhead isn't worth it",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const MODEL_BY_ID: Record<string, ModelSpec> = Object.fromEntries(
  MODEL_REGISTRY.map((m) => [m.id, m])
);

// ---------------------------------------------------------------------------
// Component-specific selectors
// These return exactly the shape each component expects so component internals
// change minimally and the data contract stays stable.
// ---------------------------------------------------------------------------

/** Models shown in ModelMixer — all models with pricing + tier */
export function getMixerModels() {
  return MODEL_REGISTRY.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    tier: m.tier,
    inputPer1M: m.inputPer1M,
    outputPer1M: m.outputPer1M,
  }));
}

/** Models shown in CostCalculator */
export function getCostCalculatorModels() {
  // Only include models that are meaningful for cost comparison in the blog
  const ids = [
    "haiku-4.5",
    "sonnet-4.6",
    "gpt4o-mini",
    "gemini-flash",
    "composer-1",
    "composer-1-5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      name: m.name,
      perM_in: m.inputPer1M,
      perM_out: m.outputPer1M,
      color: m.costColor,
    };
  });
}

/** Models shown in ContextWindowViz */
export function getContextWindowModels() {
  const ids = [
    "sonnet-4.6",
    "gemini-flash",
    "composer-1",
    "composer-1-5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      name: m.name,
      limit: m.contextWindowTokens,
      color: m.contextBarColor,
    };
  });
}

/** Models shown in ModelPicker — personality-focused subset */
export function getPickerModels() {
  const ids = [
    "gemini-flash",
    "sonnet-4.6",
    "opus-4.6",
    "composer-1",
    "composer-1-5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      name: m.name,
      tagline: m.tagline,
      emoji: m.emoji,
      gradientFrom: m.gradientFrom,
      gradientTo: m.gradientTo,
      accentColor: m.accentColor,
      why: m.why,
      whenWrong: m.whenWrong,
    };
  });
}

/** Models shown in ModelTinder — swipe-card subset */
export function getTinderModels() {
  const ids = [
    "gemini-flash",
    "sonnet-4.6",
    "opus-4.6",
    "composer-1",
    "composer-1-5",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      name: m.name,
      tagline: m.tagline,
      emoji: m.emoji,
      gradientFrom: m.gradientFrom,
      gradientTo: m.gradientTo,
      accentColor: m.accentColor,
      traits: m.traits,
      bestFor: m.bestFor,
      worstFor: m.worstFor,
    };
  });
}

/** Benchmark check definitions + per-model results */
export interface BenchmarkCheck {
  check: string;
  /** key into ModelSpec.benchmark */
  key: keyof ModelSpec["benchmark"];
}

export const BENCHMARK_CHECKS: BenchmarkCheck[] = [
  { check: "Correct Next.js server action?", key: "correctServerAction" },
  { check: "Followed constraints without detours?", key: "followedConstraints" },
  { check: "Made up docs or citations?", key: "madeUpDocs" },
  { check: "Introduced hidden bugs in refactor?", key: "hiddenBugsInRefactor" },
];

/** Models shown as columns in DevBenchmark */
export function getDevBenchmarkColumns() {
  const ids = ["sonnet-4.6", "gemini-flash", "haiku-4.5", "composer-1-5"];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      label: m.name.replace("Claude ", "").replace(" 4.6", "").replace(" 4.5", ""),
      color: m.accentColor,
      benchmark: m.benchmark,
    };
  });
}
