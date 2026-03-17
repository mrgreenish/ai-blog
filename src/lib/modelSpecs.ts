// ---------------------------------------------------------------------------
// Central model registry — single source of truth for all model-specific data
// used across interactive components and blog content.
//
// To update a model's pricing, name, or personality: edit here only.
// ---------------------------------------------------------------------------

export type Tier = "fast" | "balanced" | "reasoning";
export type Provider = "Anthropic" | "OpenAI" | "Google" | "DeepSeek" | "Cursor";
/** Rough latency band for a typical developer task */
export type LatencyBand = "instant" | "fast" | "moderate" | "slow";
/** How aggressively the model expands scope beyond what was asked */
export type InitiativeStyle = "minimal" | "measured" | "proactive" | "autonomous";
/** How well the model respects explicit scope constraints */
export type ScopeDiscipline = "strict" | "good" | "drifts" | "unpredictable";

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

  // Qualitative signals — used by ModelPicker 2.0 and ScenarioLab
  /** Typical response latency for a developer-sized task */
  latencyBand: LatencyBand;
  /** How much initiative the model takes beyond the literal request */
  initiativeStyle: InitiativeStyle;
  /** How reliably the model stays inside explicit scope constraints */
  scopeDiscipline: ScopeDiscipline;
  /** One-line "reach for this when…" guidance */
  pickWhen: string;
  /** One-line "avoid this when…" guidance */
  avoidWhen: string;

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
    name: "Gemini 2.5 Flash",
    provider: "Google",
    inputPer1M: 0.30,
    outputPer1M: 2.50,
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
    latencyBand: "fast",
    initiativeStyle: "minimal",
    scopeDiscipline: "strict",
    pickWhen: "You need predictable, constraint-respecting output with no surprises",
    avoidWhen: "You want the model to push back, suggest alternatives, or notice problems you didn't mention",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek-V3.2",
    provider: "DeepSeek",
    inputPer1M: 0.28,
    outputPer1M: 0.42,
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
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "Cost is a primary constraint and you want inspectable, self-hostable weights",
    avoidWhen: "You need the latest frontier capabilities or enterprise-grade support",
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
    latencyBand: "instant",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You're running many quick structured tasks and latency or cost compounds",
    avoidWhen: "The task requires architectural judgment, deep reasoning, or multi-step planning",
    benchmark: {
      correctServerAction: false,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: true,
    },
  },

  // ── Balanced tier ──────────────────────────────────────────────────────────
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "OpenAI",
    inputPer1M: 2.50,
    outputPer1M: 15.00,
    tier: "balanced",
    contextWindowTokens: 1_000_000,
    tagline: "The Agentic Frontier",
    emoji: "🚀",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-green-500",
    accentColor: "text-emerald-400",
    contextBarColor: "bg-emerald-500",
    costColor: "text-emerald-300",
    why: {
      coding:
        "GPT-5.4 reasons through code with high token efficiency — it uses fewer reasoning tokens than earlier models to reach the same answer, which means faster and cheaper results on hard problems.",
      autonomous:
        "Built-in computer-use and native tool support make GPT-5.4 the strongest OpenAI model for agentic workflows that need to operate UIs, run code, and verify results end-to-end.",
      architecture:
        "The 1M token context window lets GPT-5.4 hold an entire large codebase in context while reasoning about architectural decisions — without chunking or summarization.",
      hard:
        "Reasoning effort levels (low → xhigh) let you dial in exactly how much thinking the model does. For genuinely hard problems, xhigh effort catches what other models miss.",
      multifile:
        "With a 1M context window and strong tool use, GPT-5.4 can coordinate changes across a large codebase in a single pass.",
    },
    whenWrong:
      "When you need predictable, scope-respecting output. GPT-5.4's agentic instincts mean it can go deep on a problem — sometimes deeper than you wanted. Set explicit constraints or use a lighter model for simple tasks.",
    traits: [
      "1M token context — holds entire large codebases",
      "Reasoning effort levels: none → low → medium → high → xhigh",
      "Native computer-use and tool search built in",
    ],
    bestFor: "Complex agentic tasks, hard reasoning, and large-context work",
    worstFor: "Simple tasks where the cost and latency aren't justified",
    latencyBand: "moderate",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "You need frontier reasoning with large context or native computer-use for agentic workflows",
    avoidWhen: "The task is simple — use a fast model like Gemini Flash or Haiku instead",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false,
    },
  },
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
    latencyBand: "instant",
    initiativeStyle: "minimal",
    scopeDiscipline: "strict",
    pickWhen: "You're in the editor making a targeted change and want the fastest possible round-trip",
    avoidWhen: "The task spans multiple files, needs tool use, or requires the model to verify its own output",
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
    latencyBand: "moderate",
    initiativeStyle: "proactive",
    scopeDiscipline: "drifts",
    pickWhen: "You want a thought partner that notices things, suggests better approaches, and handles multi-file work",
    avoidWhen: "Scope drift is expensive — add explicit constraints or use a more focused model",
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
    latencyBand: "slow",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "Correctness is non-negotiable — hard bugs, architecture decisions, or critical system design",
    avoidWhen: "The task is routine — scaffolding, boilerplate, or simple refactors don't justify the cost",
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
    name: "Composer 1.5",
    provider: "Cursor",
    inputPer1M: 3.50,
    outputPer1M: 17.50,
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
        "Composer 1.5 runs terminal commands, reads the output, makes more edits, and loops until the task is done. It's the closest thing to a developer who can actually execute end-to-end.",
      multifile:
        "It navigates the project, finds the relevant files, and makes coordinated changes across many of them — without you having to specify each one.",
      selfcorrect:
        "It sees the TypeScript error, understands it in context, and fixes it — without you having to copy-paste the error back into a prompt.",
      hardproblems:
        "Composer 1.5 is a thinking model — it reasons deeply on hard problems and adapts how much thinking it does based on difficulty. On easy tasks it's fast; on hard ones it works until it finds a satisfying answer.",
    },
    whenWrong:
      "When you need tight control. Composer 1.5 can go down wrong paths and make a lot of changes before you realize it's off track. Short task scopes and frequent checkpoints are essential.",
    traits: [
      "Thinking model — reasons deeply on hard problems, fast on easy ones",
      "Self-summarizes to continue when context overflows",
      "Edits across many files with tool use and self-correction",
    ],
    bestFor: "Multi-step features, refactors, and autonomous bug fixes",
    worstFor: "Quick one-liner changes where the overhead isn't worth it",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "unpredictable",
    pickWhen: "You want the model to run a multi-step task end-to-end with tool use and self-correction",
    avoidWhen: "You need tight control — it can go deep down wrong paths before you notice",
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

// ---------------------------------------------------------------------------
// Pricing metadata — single source of truth for data attribution
// Prices verified against official API pricing pages on 2026-02-19
// ---------------------------------------------------------------------------

export const PRICING_META = {
  verifiedDate: "2026-03-12", // re-verified: Gemini 2.0 Flash → 2.5 Flash (deprecated Jun 2026); GPT-5.4 context window corrected to 1M
  source: "Official API pricing pages",
  urls: {
    Anthropic: "https://docs.anthropic.com/en/docs/about-claude/pricing",
    OpenAI: "https://openai.com/api/pricing",
    Google: "https://ai.google.dev/gemini-api/docs/pricing",
    DeepSeek: "https://api-docs.deepseek.com/quick_start/pricing",
    Cursor: "https://cursor.com/docs/models-and-pricing",
  },
} as const;

/** Models shown in CostCalculator */
export function getCostCalculatorModels() {
  // Only include models that are meaningful for cost comparison in the blog
  const ids = [
    "gemini-flash",
    "deepseek-v3",
    "haiku-4.5",
    "composer-1",
    "gpt-5.4",
    "sonnet-4.6",
    "composer-1-5",
    "opus-4.6",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      perM_in: m.inputPer1M,
      perM_out: m.outputPer1M,
      color: m.costColor,
    };
  });
}

/** Models shown in ContextWindowViz */
export function getContextWindowModels() {
  const ids = [
    "gpt-5.4",
    "gemini-flash",
    "sonnet-4.6",
    "composer-1-5",
    "composer-1",
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

/** Full model set for ModelPicker 2.0 — includes all models that can surface as recommendations */
export function getPickerModelsV2() {
  // All models are candidates; scoring determines which surface in top-3
  return MODEL_REGISTRY.map((m) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    tagline: m.tagline,
    emoji: m.emoji,
    gradientFrom: m.gradientFrom,
    gradientTo: m.gradientTo,
    accentColor: m.accentColor,
    tier: m.tier,
    inputPer1M: m.inputPer1M,
    outputPer1M: m.outputPer1M,
    latencyBand: m.latencyBand,
    initiativeStyle: m.initiativeStyle,
    scopeDiscipline: m.scopeDiscipline,
    why: m.why,
    whenWrong: m.whenWrong,
    pickWhen: m.pickWhen,
    avoidWhen: m.avoidWhen,
    traits: m.traits,
    bestFor: m.bestFor,
    worstFor: m.worstFor,
  }));
}

/** Models available in ScenarioLab comparisons */
export function getScenarioLabModels() {
  const ids = [
    "gemini-flash",
    "haiku-4.5",
    "composer-1",
    "gpt-5.4",
    "sonnet-4.6",
    "composer-1-5",
    "opus-4.6",
  ];
  return ids.map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tagline: m.tagline,
      emoji: m.emoji,
      accentColor: m.accentColor,
      tier: m.tier,
      inputPer1M: m.inputPer1M,
      outputPer1M: m.outputPer1M,
      latencyBand: m.latencyBand,
      initiativeStyle: m.initiativeStyle,
      scopeDiscipline: m.scopeDiscipline,
      pickWhen: m.pickWhen,
      avoidWhen: m.avoidWhen,
    };
  });
}

/** Models shown in FailureGallery — susceptibility indicators */
export function getFailureGalleryModels() {
  return MODEL_REGISTRY.map((m) => ({
    id: m.id,
    name: m.name,
    emoji: m.emoji,
    accentColor: m.accentColor,
    initiativeStyle: m.initiativeStyle,
    scopeDiscipline: m.scopeDiscipline,
    latencyBand: m.latencyBand,
    tier: m.tier,
  }));
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
