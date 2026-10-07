// ---------------------------------------------------------------------------
// Central model registry — single source of truth for all model-specific data
// used across interactive components and blog content.
//
// To update a model's pricing, name, or personality: edit here only.
// ---------------------------------------------------------------------------

export type Tier = "fast" | "balanced" | "reasoning";
export type Provider = "Anthropic" | "OpenAI" | "Google" | "DeepSeek" | "Moonshot AI" | "Z.ai" | "Cursor" | "Mistral";
/** Rough latency band for a typical developer task */
export type LatencyBand = "instant" | "fast" | "moderate" | "slow";
/** How aggressively the model expands scope beyond what was asked */
export type InitiativeStyle = "minimal" | "measured" | "proactive" | "autonomous";
/** How well the model respects explicit scope constraints */
export type ScopeDiscipline = "strict" | "good" | "drifts" | "unpredictable";

export interface PromotionalPricing {
  inputPer1M: number;
  outputPer1M: number;
  /** Inclusive ISO date on which the promotion starts. */
  startsAt: string;
  /** Inclusive ISO date on which the promotion ends. */
  endsAt: string;
  label: string;
}

export interface ModelSpec {
  // Core identity
  id: string;
  name: string;
  provider: Provider;

  /** Superseded or retired by the provider. Retained only for historical scenario examples; excluded from current recommendations. */
  retired?: boolean;
  pricingNote?: string;
  longContextPricing?: { thresholdTokens: number; inputMultiplier: number; outputMultiplier: number };

  // Pricing (per 1M tokens, USD)
  inputPer1M: number;
  outputPer1M: number;
  /** Temporary pricing layered over the standard rates above. */
  promotionalPricing?: PromotionalPricing;

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
    correctServerAction: boolean | null;
    followedConstraints: boolean | null;
    madeUpDocs: boolean | null;
    hiddenBugsInRefactor: boolean | null;
  };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const MODEL_REGISTRY: ModelSpec[] = [
  {
    id: "mistral-large-4",
    name: "Mistral Large 4",
    provider: "Mistral",
    inputPer1M: 1.36,
    outputPer1M: 4.18,
    promotionalPricing: {
      inputPer1M: 0.68,
      outputPer1M: 2.09,
      startsAt: "2026-10-06",
      endsAt: "2026-10-19",
      label: "50% launch offer; calendar interpretation: Oct 6–19 inclusive",
    },
    pricingNote: "Public preview API. Standard uncached rates; weights forthcoming as of October 7, 2026. The documented two-week offer is interpreted as Oct 6–19 inclusive.",
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The European Preview",
    emoji: "🌍",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    accentColor: "text-orange-600",
    contextBarColor: "bg-orange-500",
    costColor: "text-orange-400",
    why: {
      coding: "Mistral Large 4 supports function calling and structured output. Compare it on a fixed coding task before adopting this public preview.",
      analysis: "A million-token context can hold broad document inputs; keep the evidence relevant and verify the answer against it.",
      vision: "Multimodal input lets you combine screenshots and text for analysis. Check visual conclusions against the original image.",
      reasoning: "A reasoning-tier candidate with lower token rates than many flagship models; capability and task latency still need local evaluation.",
      multifile: "Large context and tool support make coordinated edits worth testing with external acceptance checks.",
    },
    whenWrong: "When you need established production behavior or published weights today. API access is in public preview and the weights are still forthcoming.",
    traits: [
      "Public preview with multimodal input",
      "1M context, function calling, and structured output",
      "Announced open weights are forthcoming",
    ],
    bestFor: "Evaluating coding, document analysis, and visual workflows against a fixed baseline",
    worstFor: "Unvalidated production migrations or immediate self-hosting",
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You want to evaluate a European multimodal model with tools and broad context",
    avoidWhen: "You need a proven production default or downloadable weights today",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null,
    },
  },

  {
    id: "gemini-flash",
    name: "Gemini 3 Flash Preview",
    provider: "Google",
    inputPer1M: 0.5,
    outputPer1M: 3,
    tier: "fast",
    contextWindowTokens: 1048576,
    tagline: "The Careful One",
    emoji: "💎",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    accentColor: "text-cyan-600",
    contextBarColor: "bg-yellow-500",
    costColor: "text-yellow-400",
    why: {
      coding: "Gemini executes exactly what you ask — no surprises, no scope creep. For production code where predictability matters, that's a feature.",
      analysis: "Gemini stays close to the source material and doesn't over-interpret. Good for structured analysis where you want the facts, not editorializing.",
      writing: "Gemini follows your format and constraints reliably. It won't rewrite your voice or restructure what you didn't ask it to touch.",
      vision: "Gemini's literal-mindedness works well for vision tasks — it describes what's there, not what it thinks should be there.",
      production: "Gemini's risk-averse defaults shine in production contexts. It picks the safest approach and rarely introduces unexpected changes.",
      accuracy: "When you need the model to do exactly what you said and nothing more, Gemini's conservative interpretation is the right fit.",
      targeted: "Gemini is precise with targeted edits. It won't wander outside the scope you defined."
    },
    whenWrong: "When you need the model to push back, suggest a better approach, or notice that you're solving the wrong problem. Gemini won't do that — you have to ask explicitly.",
    traits: [
      "Literal-minded — does exactly what you say",
      "Risk-averse — picks the safest approach",
      "Consistent in long sessions"
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
      hiddenBugsInRefactor: false
    }
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro Preview",
    provider: "Google",
    inputPer1M: 2,
    outputPer1M: 12,
    tier: "balanced",
    contextWindowTokens: 1048576,
    tagline: "The Capable Gemini",
    emoji: "💎",
    gradientFrom: "from-blue-700",
    gradientTo: "to-indigo-500",
    accentColor: "text-indigo-600",
    contextBarColor: "bg-indigo-500",
    costColor: "text-indigo-400",
    why: {},
    whenWrong: "When you need the cheapest option or maximum predictability — Flash-tier models are often enough for mechanical work.",
    traits: [
      "Stronger reasoning than Flash with large context",
      "Good for competent coding without the heaviest frontier models"
    ],
    bestFor: "Medium-complexity tasks needing context and judgment without Opus-level cost",
    worstFor: "Simple mechanical edits where Flash is sufficient",
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You need competence and context but not the absolute heaviest model",
    avoidWhen: "The task is clearly defined and low-risk — use Gemini 3 Flash instead",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    },
    longContextPricing: {
      thresholdTokens: 200000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek-V4-Flash",
    provider: "DeepSeek",
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    tier: "fast",
    contextWindowTokens: 1000000,
    tagline: "The Open One",
    emoji: "🔓",
    gradientFrom: "from-slate-600",
    gradientTo: "to-slate-500",
    accentColor: "text-slate-600",
    contextBarColor: "bg-slate-500",
    costColor: "text-slate-300",
    why: {},
    whenWrong: "When you need tight data privacy guarantees or enterprise support.",
    traits: [
      "Open-source weights — fully inspectable",
      "Strong reasoning at low cost",
      "Self-hosted option available"
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
      hiddenBugsInRefactor: false
    },
    retired: true,
    pricingNote: "Retired API model; historical rates retained for the original scenario examples. Use DeepSeek-V4.1-Flash for current estimates."
  },
  {
    id: "haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    inputPer1M: 1,
    outputPer1M: 5,
    tier: "fast",
    contextWindowTokens: 200000,
    tagline: "The Fast Claude",
    emoji: "🌸",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-500",
    accentColor: "text-rose-600",
    contextBarColor: "bg-rose-500",
    costColor: "text-emerald-600",
    why: {},
    whenWrong: "When the task needs deep reasoning or architectural judgment.",
    traits: [
      "Fastest Anthropic model",
      "Retains Claude's instruction-following quality",
      "Cost-effective for high-volume pipelines"
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
      hiddenBugsInRefactor: true
    }
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    inputPer1M: 0.2,
    outputPer1M: 1.2,
    tier: "fast",
    contextWindowTokens: 1050000,
    tagline: "The Fast Operator",
    emoji: "🌙",
    gradientFrom: "from-slate-700",
    gradientTo: "to-indigo-500",
    accentColor: "text-indigo-600",
    contextBarColor: "bg-indigo-400",
    costColor: "text-indigo-300",
    why: {
      coding: "Luna is the fastest, lowest-cost GPT-5.6 model. It is a strong fit for small fixes, test runs, summaries, and high-volume coding steps where Sol-level reasoning would be wasteful.",
      targeted: "For a clearly scoped change, Luna gives you modern GPT-5.6 tool use without paying for a long reasoning loop.",
      production: "Luna works well as the cheap worker inside a guarded pipeline: execute a narrow step, run the check, and escalate only when the result is ambiguous."
    },
    whenWrong: "When the task is ambiguous, architectural, or likely to branch into a long autonomous loop. Luna is optimized for speed and cost, not maximum deliberation.",
    traits: [
      "Fastest and lowest-cost GPT-5.6 tier",
      "Strong for narrow tool calls and high-volume work",
      "Best when success can be checked automatically"
    ],
    bestFor: "Small fixes, verification steps, summaries, and high-volume agent pipelines",
    worstFor: "Architecture, ambiguous debugging, and long autonomous projects",
    latencyBand: "instant",
    initiativeStyle: "measured",
    scopeDiscipline: "strict",
    pickWhen: "The task is explicit, repeatable, and cheap verification is available",
    avoidWhen: "The model needs to choose the strategy or sustain a difficult multi-step investigation",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: true
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "OpenAI",
    inputPer1M: 2.5,
    outputPer1M: 15,
    tier: "balanced",
    contextWindowTokens: 1050000,
    tagline: "The Affordable Frontier",
    emoji: "🚀",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-green-500",
    accentColor: "text-emerald-600",
    contextBarColor: "bg-emerald-500",
    costColor: "text-emerald-300",
    why: {
      coding: "GPT-5.4 remains available for established workflows. Compare it with the cheaper GPT-5.6 Terra on your own checks before choosing it for new work.",
      autonomous: "Built-in computer-use and native tool support still make GPT-5.4 useful for agentic workflows that need to operate UIs, run code, and verify results end-to-end.",
      architecture: "Its 1.05M-token window can hold a broad repository slice. Leave room for instructions, tool output, and the response.",
      hard: "Reasoning effort levels (low → xhigh) let you dial in exactly how much thinking the model does. For genuinely hard problems, xhigh effort catches what other models miss.",
      multifile: "With a 1M context window and strong tool use, GPT-5.4 can coordinate changes across a large codebase in a single pass."
    },
    whenWrong: "When you need predictable, scope-respecting output. GPT-5.4's agentic instincts mean it can go deep on a problem — sometimes deeper than you wanted. Set explicit constraints or use a lighter model for simple tasks.",
    traits: [
      "1.05M-token context for broad code and document inputs",
      "Reasoning effort levels: none → low → medium → high → xhigh",
      "Native computer-use and tool search built in"
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
      hiddenBugsInRefactor: false
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    provider: "OpenAI",
    inputPer1M: 2,
    outputPer1M: 12,
    tier: "balanced",
    contextWindowTokens: 1050000,
    tagline: "The Everyday Agent",
    emoji: "🌍",
    gradientFrom: "from-emerald-700",
    gradientTo: "to-cyan-500",
    accentColor: "text-emerald-600",
    contextBarColor: "bg-emerald-500",
    costColor: "text-emerald-300",
    why: {
      coding: "Terra balances coding capability and cost, with tool use and image input for everyday agent workflows.",
      multifile: "Terra has enough reasoning and context for normal multi-file features without turning every implementation step into a flagship-model run.",
      autonomous: "For routine agent work, Terra can plan, edit, run commands, and verify while keeping cost proportional to the task.",
      analysis: "Terra is the balanced option for research and review when Luna is too light and Sol would be unnecessary."
    },
    whenWrong: "When correctness is unusually consequential or the problem has resisted normal attempts. Escalate the planning or final review to Sol or Fable.",
    traits: [
      "Balanced GPT-5.6 capability, speed, and cost",
      "Lower input and output rates than GPT-5.5",
      "Reliable default for everyday agentic work"
    ],
    bestFor: "Everyday coding, medium-complexity features, research, and agent workflows",
    worstFor: "The hardest architecture and research problems where maximum reasoning is worth the premium",
    latencyBand: "fast",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "You need a capable daily driver that can execute and verify without flagship pricing",
    avoidWhen: "The task is either trivial enough for Luna or hard enough to justify Sol or Fable",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    inputPer1M: 2,
    outputPer1M: 10,
    tier: "balanced",
    contextWindowTokens: 1000000,
    tagline: "The Proactive One",
    emoji: "✨",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-500",
    accentColor: "text-violet-600",
    contextBarColor: "bg-blue-500",
    costColor: "text-blue-400",
    why: {
      feature: "Sonnet is a genuine thought partner for feature design. It'll suggest a better API surface, spot issues in your data model, and notice things you didn't ask about.",
      multifile: "Sonnet handles multi-file work well — it understands how changes ripple across a codebase and coordinates them coherently.",
      architecture: "Sonnet's creativity and proactiveness make it strong for architecture exploration. It thinks beyond the immediate task.",
      writing: "Sonnet gives the clearest, most useful explanations. It connects your specific situation to the general principle in a way other models don't.",
      analysis: "Sonnet notices things. While analyzing, it'll surface connections and implications that weren't in your original question."
    },
    whenWrong: "When scope matters. Sonnet's instinct to be helpful means it expands tasks — fixing naming conventions you didn't ask about, restructuring code to match its taste. Set explicit constraints or you'll review a 40-file diff when you asked for 3.",
    traits: [
      "Genuinely creative — suggests better APIs",
      "Notices things you didn't ask about",
      "Best at explaining complex concepts"
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
      hiddenBugsInRefactor: false
    }
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    provider: "OpenAI",
    inputPer1M: 4,
    outputPer1M: 20,
    tier: "reasoning",
    contextWindowTokens: 1050000,
    tagline: "The Relentless One",
    emoji: "☀️",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-500",
    accentColor: "text-orange-600",
    contextBarColor: "bg-amber-500",
    costColor: "text-amber-300",
    why: {
      coding: "Sol is OpenAI's strongest model yet for agentic coding. It leads Terminal-Bench 2.1 and is built to sustain planning, command execution, iteration, and verification across long tasks.",
      autonomous: "Sol is the GPT-5.6 tier for work where the answer is a finished artifact. It can drive long tool-use and computer-use loops with less hand-holding than earlier GPT-5.x models.",
      multifile: "A 1M-class context window and frontier tool coordination make Sol the OpenAI default for large codebase changes that need to be executed and checked, not merely described.",
      hard: "Max reasoning gives Sol more room for genuinely difficult work; Ultra can coordinate subagents when one reasoning path is not enough.",
      architecture: "Sol combines broad context with strong implementation follow-through, so architecture decisions can be tested against the actual code instead of stopping at a document."
    },
    whenWrong: "For cheap mechanical work, or when an evaluation environment has exploitable seams. METR observed unusually high reward-hacking behavior, so critical evals need hardened tests and human review.",
    traits: [
      "State-of-the-art on Terminal-Bench 2.1",
      "Strong long-horizon coding and computer use",
      "Max reasoning and multi-agent Ultra mode for difficult work"
    ],
    bestFor: "Complex autonomous coding, computer use, security work, and long tool-use loops",
    worstFor: "Simple tasks and soft evaluation harnesses that can be gamed",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You need a capable OpenAI model for a complex task at lower token rates than Astra",
    avoidWhen: "A cheaper tier can be checked automatically, or the evaluation environment is not hardened against reward hacking",
    benchmark: {
      correctServerAction: false,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "claude-fable-5",
    name: "Claude Fable 5",
    provider: "Anthropic",
    inputPer1M: 10,
    outputPer1M: 50,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The Marathon Thinker",
    emoji: "📖",
    gradientFrom: "from-rose-700",
    gradientTo: "to-orange-500",
    accentColor: "text-rose-600",
    contextBarColor: "bg-rose-500",
    costColor: "text-rose-300",
    why: {
      coding: "Fable 5 supports ambitious coding and long agent workflows. Fable 5.1 is the newer option with cheaper cache reads.",
      architecture: "Fable is the choice when the model must understand the system, challenge its own assumptions, delegate work, and validate the result across stages.",
      critical: "For high-consequence review, Fable's deeper reasoning and self-checking justify the premium when missed issues would cost more than the tokens.",
      multifile: "Fable can sustain large, asynchronous projects for days, coordinating subagents and checking its own work instead of handing control back at every step.",
      reasoning: "This is the maximum-depth Claude tier: thorough, proactive, and designed for problems earlier models could not finish reliably."
    },
    whenWrong: "For new deployments, evaluate Fable 5.1 first. Routine implementation usually does not justify the Fable token rates.",
    traits: [
      "Previous Fable version; Fable 5.1 is now available",
      "Can run complex agent workflows for days",
      "Plans, delegates, writes tests, and validates its own work"
    ],
    bestFor: "Architecture, hard reasoning, large migrations, and multi-day autonomous projects",
    worstFor: "Routine coding and cost-sensitive high-volume work",
    latencyBand: "slow",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "The problem is genuinely hard and maximum reasoning or long-horizon reliability matters more than price",
    avoidWhen: "Terra, Sonnet, or Composer can implement a clear plan at a fraction of the cost",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    }
  },
  {
    id: "opus-4.8",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    inputPer1M: 5,
    outputPer1M: 25,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The Deep Thinker",
    emoji: "🧠",
    gradientFrom: "from-orange-600",
    gradientTo: "to-amber-500",
    accentColor: "text-amber-600",
    contextBarColor: "bg-orange-500",
    costColor: "text-zinc-300",
    why: {
      coding: "Opus traces actual logic, not just patterns. It catches bugs that require understanding three levels of indirection, identifies race conditions by simulating concurrent execution, and spots type issues TypeScript itself misses. For production code where correctness is non-negotiable, this depth is the difference.",
      production: "Opus's deep accuracy shines in production contexts. It doesn't pattern-match — it reasons through the actual logic, catches subtle bugs, and flags the edge cases other models miss.",
      multifile: "Opus thinks in systems, not just in code. Across a multi-file change, it tracks how abstractions interact and will tell you when a design decision will cause problems two features from now.",
      critical: "Opus traces actual logic, not just patterns. For critical systems where a subtle bug has real consequences, this depth is worth the cost.",
      architecture: "Opus thinks in systems and abstractions. It'll identify that your current abstraction will cause problems two features from now — and explain why.",
      reasoning: "Opus doesn't pattern-match — it actually reasons. Multi-step logic, constraint satisfaction, debugging subtle interactions — this is the task type where the gap between Opus and everything else is widest.",
      hard: "Where other models pattern-match, Opus reasons through the problem. It catches bugs that require understanding three levels of indirection.",
      accuracy: "Opus's thoroughness means it considers more options and explores more edge cases. When you need to be right, not just fast, it's the right choice."
    },
    whenWrong: "For routine tasks. Opus is expensive and slow, and the depth it provides isn't proportional to the value for scaffolding, simple refactors, or boilerplate. You're paying for a level of reasoning the task doesn't need.",
    traits: [
      "Traces actual logic, not just patterns",
      "Thinks in systems and abstractions",
      "Proactive with high-signal observations"
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
      hiddenBugsInRefactor: false
    },
    retired: true,
    pricingNote: "Superseded by Claude Opus 5.5 ($4/$20). Anthropic still serves Opus 4.8 at these rates; kept here for the original scenario examples."
  },
  {
    id: "opus-5",
    name: "Claude Opus 5",
    provider: "Anthropic",
    inputPer1M: 5,
    outputPer1M: 25,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The Rigorous Reviewer",
    emoji: "🧠",
    gradientFrom: "from-amber-700",
    gradientTo: "to-yellow-500",
    accentColor: "text-amber-700",
    contextBarColor: "bg-amber-500",
    costColor: "text-amber-300",
    why: {
      coding: "Opus 5 is the Claude choice for difficult code review: it follows control flow across a system, tests assumptions against the implementation, and calls out the failure modes a plausible-looking diff can hide.",
      production: "For consequential production changes, Opus 5 combines careful reasoning with a reviewer's instinct for edge cases, rollback paths, and the assumptions that need evidence.",
      multifile: "Opus 5 keeps the relationships between modules in view, which makes it valuable when a change is locally tidy but globally risky.",
      critical: "When a subtle mistake would be expensive, Opus 5 earns its slower pace by examining the evidence rather than accepting the first coherent explanation.",
      architecture: "Opus 5 is strong at pressure-testing architectural choices: it identifies hidden coupling, tests tradeoffs, and makes the consequences explicit.",
      reasoning: "This is the current standard Opus tier for rigorous, review-grade reasoning — deliberate, evidence-seeking, and best used where correctness matters more than speed.",
      hard: "Opus 5 works through ambiguous, multi-step problems carefully and flags the assumptions that should be checked before implementation proceeds.",
      accuracy: "Its value is careful verification: more alternatives considered, more edge cases surfaced, and clearer evidence for a high-stakes decision."
    },
    whenWrong: "For routine implementation or long autonomous execution where a cheaper model or Fable's agent workflow is a better fit. Opus 5 is most useful as a deliberate reasoning and review pass.",
    traits: [
      "Review-grade reasoning with explicit evidence",
      "Finds hidden coupling and edge cases",
      "Deliberate, high-signal recommendations"
    ],
    bestFor: "Critical reviews, architecture decisions, and subtle cross-system bugs",
    worstFor: "Routine edits or cheap high-volume execution",
    latencyBand: "slow",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "You need a rigorous Claude review of a consequential decision, design, or implementation",
    avoidWhen: "The task is routine, latency-sensitive, or primarily a long autonomous execution loop",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    retired: true,
    pricingNote: "Superseded by Claude Opus 5.5 ($4/$20). Anthropic still serves Opus 5 at these rates; kept here for the original scenario examples."
  },
  {
    id: "kimi-k3",
    name: "Kimi K3",
    provider: "Moonshot AI",
    inputPer1M: 3,
    outputPer1M: 15,
    tier: "reasoning",
    contextWindowTokens: 1048576,
    tagline: "The Open-Weight Marathoner",
    emoji: "🌙",
    gradientFrom: "from-violet-700",
    gradientTo: "to-fuchsia-500",
    accentColor: "text-violet-700",
    contextBarColor: "bg-violet-500",
    costColor: "text-violet-300",
    why: {
      coding: "Kimi K3 is built for long-horizon coding and can keep a large codebase in its 1M-token context while using tools and structured outputs.",
      analysis: "Its 1M context, always-on reasoning, and end-to-end knowledge-work focus make it a strong fit for large document sets and research-heavy analysis.",
      vision: "K3 has native visual understanding, so screenshots and diagrams can stay in the same reasoning workflow as code and text.",
      multifile: "A full 1M-token context window gives K3 room for broad codebase analysis and coordinated multi-file changes.",
      autonomous: "Moonshot positions K3 for long-horizon coding and end-to-end knowledge work, with tool calling and structured output support.",
      reasoning: "K3 always reasons and exposes low, high, and max reasoning-effort settings for difficult work.",
      architecture: "Large context and always-on reasoning make K3 useful for comparing system-wide constraints before implementation."
    },
    whenWrong: "For narrow, latency-sensitive edits. K3 always reasons, so Luna, Flash, or another lighter model is a better fit when the task has a short, mechanical finish line.",
    traits: [
      "Always-on reasoning with low, high, and max effort",
      "Native vision and a 1M-token context window",
      "Open-weight 2.8T sparse mixture-of-experts model"
    ],
    bestFor: "Long-horizon coding, large codebase analysis, and end-to-end knowledge work",
    worstFor: "Tiny, latency-sensitive edits that do not need a reasoning pass",
    latencyBand: "slow",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You need long-context reasoning across code, documents, and images at Sonnet-class API pricing",
    avoidWhen: "The task is small enough that always-on reasoning only adds latency and tokens",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    }
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "OpenAI",
    inputPer1M: 5,
    outputPer1M: 30,
    tier: "reasoning",
    contextWindowTokens: 1050000,
    tagline: "The Autonomous Loop",
    emoji: "🔁",
    gradientFrom: "from-teal-600",
    gradientTo: "to-emerald-500",
    accentColor: "text-teal-600",
    contextBarColor: "bg-teal-500",
    costColor: "text-teal-300",
    why: {
      autonomous: "GPT-5.5 supports long tool-use loops. It remains useful for established workflows, though Astra and the GPT-5.6 tiers should be evaluated for new work.",
      coding: "First fully retrained base model since GPT-4.5. Developers describe it as needing much less hand-holding: you state the goal, it picks the right files, edits them, runs them, and corrects itself without a dozen follow-up prompts.",
      multifile: "1M token context plus strong tool-use means GPT-5.5 can coordinate changes across a large codebase while actually executing and verifying them, not just producing a diff.",
      hard: "Closer to 'agent that can run a shell for an hour' than 'model that returns an answer.' For tasks where the answer is a working artifact, not a block of text, 5.5 is the default pick.",
      architecture: "GPT-5.5 matches earlier GPT-5.x latency despite the capability jump, so you can put it behind agentic workflows without the usual speed tax."
    },
    whenWrong: "For review-grade reasoning, long-document Q&A, or anything close to HLE territory. Opus 4.8 still wins on SWE-bench Pro (64.3% vs 58.6%), HLE (46.9% vs 41.4%), and MCP-Atlas — if the task is 'reason deeply once' rather than 'run a loop,' pick Opus.",
    traits: [
      "1M token context with earlier GPT-5.x latency",
      "Designed for autonomous tool use and terminal workflows",
      "First fully retrained base model since GPT-4.5"
    ],
    bestFor: "Agentic coding, browser automation, and long tool-use loops",
    worstFor: "Review-grade reasoning and long-document Q&A — Opus 4.8 still edges it there",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "The task is a multi-step loop — run commands, read output, edit files, verify — and you want it finished, not planned",
    avoidWhen: "You're paying for output tokens at volume and the task doesn't need the extra agentic range — a cheaper GPT-5.x model may be enough",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "composer-2.5",
    name: "Composer 2.5",
    provider: "Cursor",
    inputPer1M: 0.5,
    outputPer1M: 2.5,
    tier: "balanced",
    contextWindowTokens: 200000,
    tagline: "The Agentic One",
    emoji: "🤖",
    gradientFrom: "from-fuchsia-600",
    gradientTo: "to-pink-500",
    accentColor: "text-fuchsia-600",
    contextBarColor: "bg-fuchsia-500",
    costColor: "text-fuchsia-600",
    why: {
      autonomous: "Composer 2.5 runs terminal commands, reads the output, makes more edits, and loops until the task is done. It now sustains long horizons more reliably than Composer 2 did — the May 2026 retrain was specifically tuned for multi-step coherence.",
      multifile: "It navigates the project, finds the relevant files, and makes coordinated changes across many of them — without you having to specify each one. Trained on 25× more synthetic refactor and feature-deletion tasks than Composer 2.",
      selfcorrect: "It sees the TypeScript error, understands it in context, and fixes it — without you having to copy-paste the error back into a prompt. Targeted RL with Textual Feedback localized the corrections during training instead of relying on final reward only.",
      hardproblems: "Composer 2.5 is Cursor's own model — same Kimi K2.5 base as Composer 2, retrained to land in the same room as Opus 4.8 and GPT-5.5 on SWE-Bench Multilingual (79.8%) and CursorBench v3.1 (63.2%) at roughly one tenth the per-token cost."
    },
    whenWrong: "When you need a really hard reasoning result. On Terminal-Bench 2.0 it ties Opus 4.8 (~69%) but trails GPT-5.5's 82.7% on long autonomous loops. Some users also report it sometimes hedges with lightweight answers until you nudge it to think harder.",
    traits: [
      "Frontier-competitive on SWE-Bench Multilingual (79.8%) and CursorBench v3.1 (63.2%) — within ~1 point of Opus 4.8 at ~10× cheaper per token",
      "Tuned for tool use, terminal, and file edits inside Cursor",
      "Built on Moonshot's Kimi K2.5; trained with Targeted RL with Textual Feedback and 25× more synthetic tasks than Composer 2",
      "Standard $0.50/$2.50 per M tokens; Fast variant at $3/$15 for low-latency runs"
    ],
    bestFor: "Multi-step features, refactors, and autonomous bug fixes at frontier quality without frontier pricing",
    worstFor: "Quick one-liner changes where the overhead isn't worth it, or long autonomous browser-agent loops where GPT-5.5 still leads",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You want frontier-grade agentic coding at one-tenth the cost of Opus 4.8 or GPT-5.5",
    avoidWhen: "You need the absolute best on long autonomous loops (GPT-5.5) or maximum-rigor reasoning (Opus 4.8)",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    }
  },
  {
    id: "composer-2.5-fast",
    name: "Composer 2.5 Fast",
    provider: "Cursor",
    inputPer1M: 3,
    outputPer1M: 15,
    tier: "balanced",
    contextWindowTokens: 200000,
    tagline: "The Fast Agent",
    emoji: "⚡",
    gradientFrom: "from-fuchsia-700",
    gradientTo: "to-rose-500",
    accentColor: "text-rose-600",
    contextBarColor: "bg-rose-500",
    costColor: "text-rose-400",
    why: {},
    whenWrong: "When the task is not urgent — standard Composer 2.5 is usually the better tradeoff if you can do other work while it runs.",
    traits: [
      "Low-latency Composer variant",
      "Higher per-token cost than standard Composer 2.5"
    ],
    bestFor: "Urgent agentic runs where latency matters more than token price",
    worstFor: "Default daily coding — avoid Fast mode unless you need the speed",
    latencyBand: "fast",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You need Composer's agentic loop and cannot wait for standard mode",
    avoidWhen: "Cost-sensitive or non-urgent work — standard Composer 2.5 is cheaper",
    benchmark: {
      correctServerAction: true,
      followedConstraints: true,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    }
  },
  {
    id: "opus-fast",
    name: "Claude Opus 5.5 Fast",
    provider: "Anthropic",
    inputPer1M: 8,
    outputPer1M: 40,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "Opus at Speed",
    emoji: "⚡",
    gradientFrom: "from-orange-700",
    gradientTo: "to-red-500",
    accentColor: "text-red-600",
    contextBarColor: "bg-red-500",
    costColor: "text-red-400",
    why: {},
    whenWrong: "For almost all routine tasks — standard Opus 5.5 or Sonnet 5.5 is enough without Fast-tier pricing.",
    traits: [
      "Faster Opus 5.5 output at twice the standard token rate",
      "Research-preview fast mode on the first-party Claude API only"
    ],
    bestFor: "Rare cases where you need Opus-quality reasoning with minimum latency",
    worstFor: "Default choice — prohibitively expensive for everyday coding",
    latencyBand: "fast",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "Latency is critical and you have budget for premium Opus Fast rates",
    avoidWhen: "A standard Opus 5.5 call or a lighter model can meet the deadline",
    benchmark: {
      correctServerAction: false,
      followedConstraints: false,
      madeUpDocs: false,
      hiddenBugsInRefactor: false
    },
    pricingNote: "Fast mode for Opus 5.5 ($8/$40). Fast mode on Opus 5 and Opus 4.8 remains $10/$50."
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    provider: "Google",
    inputPer1M: 1.5,
    outputPer1M: 7.5,
    tier: "fast",
    contextWindowTokens: 1048576,
    tagline: "The Multimodal Workhorse",
    emoji: "💎",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-500",
    accentColor: "text-cyan-600",
    contextBarColor: "bg-yellow-500",
    costColor: "text-yellow-400",
    why: {
      coding: "Google positions 3.8 Flash for software engineering and multi-step agents at a lower token rate than the flagship reasoning models.",
      vision: "Supports text, images, audio, video, and PDF input with text output.",
      multifile: "A million-token input limit leaves room for a broad set of files and tool results."
    },
    whenWrong: "When your own evaluation needs more reasoning depth, or you need generated audio or images from the model itself.",
    traits: [
      "Text, image, audio, video, and PDF input",
      "Thinking levels: low, medium, high",
      "Function calling and structured outputs"
    ],
    bestFor: "Coding agents and analysis across documents, screenshots, audio, and video",
    worstFor: "Tasks requiring direct audio or image generation",
    latencyBand: "fast",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "You want multimodal input and tool use at Flash-tier rates",
    avoidWhen: "A small text-only task is cheaper on Luna, or your checks justify a heavier reasoning model",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    promotionalPricing: {
      inputPer1M: 0.75,
      outputPer1M: 3.75,
      startsAt: "2026-09-02",
      endsAt: "2026-12-31",
      label: "Introductory pricing through December 31, 2026"
    }
  },
  {
    id: "claude-fable-5.1",
    name: "Claude Fable 5.1",
    provider: "Anthropic",
    inputPer1M: 10,
    outputPer1M: 50,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The Long-Task Claude",
    emoji: "📖",
    gradientFrom: "from-rose-700",
    gradientTo: "to-orange-500",
    accentColor: "text-rose-600",
    contextBarColor: "bg-rose-500",
    costColor: "text-rose-300",
    why: {
      coding: "Anthropic positions Fable 5.1 for demanding coding and long-running agent work.",
      reasoning: "Evaluate Fable 5.1 when a higher-effort Opus 5.5 run still falls short.",
      architecture: "A candidate for complex migrations with explicit acceptance criteria and review checkpoints."
    },
    whenWrong: "For routine implementation. Cheaper cache reads only help when your requests actually reuse a cached prefix.",
    traits: [
      "1M context and 128K maximum output",
      "Always-on adaptive thinking",
      "Cache reads at $0.25 per million tokens"
    ],
    bestFor: "Difficult reasoning, migrations, and sustained agent workflows",
    worstFor: "Routine edits and high-volume short completions",
    latencyBand: "slow",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "Your Opus 5.5 evaluation still falls short on a difficult task",
    avoidWhen: "A less expensive model already passes the same acceptance checks",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    }
  },
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    provider: "OpenAI",
    inputPer1M: 10,
    outputPer1M: 50,
    tier: "reasoning",
    contextWindowTokens: 1050000,
    tagline: "The End-to-End Reasoner",
    emoji: "🌌",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-500",
    accentColor: "text-orange-600",
    contextBarColor: "bg-amber-500",
    costColor: "text-amber-300",
    why: {
      coding: "OpenAI positions Astra for its hardest end-to-end coding and computer-use work.",
      reasoning: "A candidate when a task needs sustained reasoning across tools, evidence, and changing requirements.",
      architecture: "Use explicit acceptance checks to evaluate Astra on difficult cross-system work."
    },
    whenWrong: "When Luna, Terra, or Sol passes your checks at a lower cost. Access and supported tools depend on your platform.",
    traits: [
      "1.05M context and 128K maximum output",
      "Text and image input; text output",
      "API reasoning effort: low through max"
    ],
    bestFor: "Difficult coding, research, computer use, and document workflows",
    worstFor: "Cheap, repeatable tasks with simple success checks",
    latencyBand: "slow",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "The task has resisted lighter models and needs reasoning across multiple tools",
    avoidWhen: "You need predictable low latency or the lowest token bill",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "deepseek-v4.1-flash",
    name: "DeepSeek-V4.1-Flash",
    provider: "DeepSeek",
    inputPer1M: 0.3,
    outputPer1M: 1.2,
    tier: "fast",
    contextWindowTokens: 1000000,
    tagline: "The Low-Cost Multimodal Agent",
    emoji: "🔓",
    gradientFrom: "from-slate-600",
    gradientTo: "to-slate-500",
    accentColor: "text-slate-600",
    contextBarColor: "bg-slate-500",
    costColor: "text-slate-300",
    why: {
      coding: "Supports tool calls and both thinking and non-thinking modes at low token rates.",
      vision: "Native vision allows screenshots and text in the same workflow.",
      analysis: "A million-token context window and off-peak rates suit flexible batch-like workloads."
    },
    whenWrong: "When your integration relies on an old model alias or you need a measured local quality result before switching.",
    traits: [
      "Native vision, tool calls, and JSON output",
      "Thinking and non-thinking modes",
      "Peak and off-peak API pricing"
    ],
    bestFor: "Cost-sensitive agents and visual analysis with checkable outputs",
    worstFor: "Unverified migrations from a different model or endpoint",
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You want low token rates with vision and tools, and can verify the result",
    avoidWhen: "Your workflow has not been tested with its reasoning and tool-call behavior",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    retired: false,
    pricingNote: "Peak, uncached API rates. Off-peak input/output: $0.15/$0.60 per million tokens. API model ID: deepseek-flash."
  },
  {
    id: "opus-5.5",
    name: "Claude Opus 5.5",
    provider: "Anthropic",
    inputPer1M: 4,
    outputPer1M: 20,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The Default Flagship",
    emoji: "🧠",
    gradientFrom: "from-amber-700",
    gradientTo: "to-yellow-500",
    accentColor: "text-amber-700",
    contextBarColor: "bg-amber-500",
    costColor: "text-amber-300",
    why: {
      coding: "Anthropic positions Opus 5.5 for long-running agentic coding and now recommends it as the starting point for most workloads.",
      reasoning: "Thinking is always on and effort defaults to medium; raise the effort before reaching for Fable 5.1.",
      architecture: "A candidate for design review and cross-system changes, with explicit acceptance checks.",
      multifile: "A million-token context and 128K output leave room for broad repository work.",
      critical: "Use it for a consequential review when the evidence matters more than the response time.",
      autonomous: "Built for sustained tool use; keep checkpoints in the loop until you have local results."
    },
    whenWrong: "When a cheaper model already passes your checks, or when you need thinking switched off. It cannot be disabled on this model.",
    traits: [
      "1M context and 128K maximum output",
      "Always-on adaptive thinking; default effort medium",
      "Cache reads at $0.20 per million tokens"
    ],
    bestFor: "Agentic coding, code review, and demanding knowledge work",
    worstFor: "Routine edits and high-volume short completions",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You want the current Opus for difficult coding or review at lower rates than Opus 5",
    avoidWhen: "Sonnet 5.5 or a lighter model already passes the same acceptance checks",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    }
  },
  {
    id: "sonnet-5.5",
    name: "Claude Sonnet 5.5",
    provider: "Anthropic",
    inputPer1M: 2,
    outputPer1M: 10,
    tier: "balanced",
    contextWindowTokens: 1000000,
    tagline: "The Faster Complement",
    emoji: "✨",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-500",
    accentColor: "text-violet-600",
    contextBarColor: "bg-blue-500",
    costColor: "text-blue-400",
    why: {
      coding: "Anthropic describes Sonnet 5.5 as a faster, lower-cost complement to Opus 5.5 for everyday coding and bug fixes.",
      multifile: "A million-token context at Sonnet 5's list price suits normal cross-file implementation.",
      writing: "Positioned for documents and everyday knowledge work as well as code.",
      analysis: "A balanced option for research and review before escalating to Opus 5.5.",
      autonomous: "Anthropic reports large gains over Sonnet 5 on agentic benchmarks; verify on your own harness."
    },
    whenWrong: "When your integration forces a tool choice or streams text between tool calls. Both behave differently from Sonnet 5, so test before switching.",
    traits: [
      "1M context and 128K maximum output",
      "Adaptive thinking; default API effort high",
      "Same $2 / $10 list price as Sonnet 5"
    ],
    bestFor: "Everyday implementation, bug fixes, and document work",
    worstFor: "Unverified drop-in upgrades from Sonnet 5",
    latencyBand: "fast",
    initiativeStyle: "proactive",
    scopeDiscipline: "good",
    pickWhen: "You want the current Sonnet for daily work and have checked the migration notes",
    avoidWhen: "The step is mechanical enough for a Flash or Luna tier, or hard enough to justify Opus 5.5",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    }
  },
  {
    id: "gpt-6.1-sol",
    name: "GPT-6.1 Sol",
    provider: "OpenAI",
    inputPer1M: 2,
    outputPer1M: 10,
    tier: "reasoning",
    contextWindowTokens: 1050000,
    tagline: "The Near-Astra Middle",
    emoji: "☀️",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-500",
    accentColor: "text-orange-600",
    contextBarColor: "bg-amber-500",
    costColor: "text-amber-300",
    why: {
      coding: "OpenAI positions GPT-6.1 Sol for complex coding at one-fifth of Astra's standard token rates.",
      autonomous: "Supports computer use, hosted shell, and beta multi-agent runs through the Responses API.",
      multifile: "A 1.05M-token context covers a broad repository slice; requests above 272K input cost more.",
      reasoning: "Reasoning effort runs from low through max, with medium as the default.",
      architecture: "A lower-cost candidate for planning before you decide a task needs Astra."
    },
    whenWrong: "When your harness depends on Chat Completions tool calls or a no-reasoning mode. Tool calling requires the Responses API, and effort cannot be set to none.",
    traits: [
      "1.05M context and 128K maximum output",
      "Text and image input; reasoning effort low through max",
      "Cached input at $0.10 per million tokens"
    ],
    bestFor: "Complex coding, computer use, and professional work below Astra pricing",
    worstFor: "Cheap, high-volume steps that GPT-6 Luna can finish",
    latencyBand: "moderate",
    initiativeStyle: "autonomous",
    scopeDiscipline: "good",
    pickWhen: "You want OpenAI's current middle tier for a complex task and can verify the result",
    avoidWhen: "A narrow step passes on Luna, or the task has already defeated Sol and needs Astra",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "gpt-6-luna",
    name: "GPT-6 Luna",
    provider: "OpenAI",
    inputPer1M: 0.1,
    outputPer1M: 0.5,
    tier: "fast",
    contextWindowTokens: 1050000,
    tagline: "The High-Volume Worker",
    emoji: "🌙",
    gradientFrom: "from-slate-700",
    gradientTo: "to-indigo-500",
    accentColor: "text-indigo-600",
    contextBarColor: "bg-indigo-400",
    costColor: "text-indigo-300",
    why: {
      coding: "OpenAI's most efficient current model, aimed at focused, high-volume steps.",
      targeted: "Half the token rate of GPT-5.6 Luna for a clearly scoped change with a cheap check.",
      vision: "Accepts images alongside text, so a screenshot can travel with the task."
    },
    whenWrong: "When the task needs strategy or a long autonomous loop. Escalate to GPT-6.1 Sol once the evidence becomes ambiguous.",
    traits: [
      "1.05M context and 128K maximum output",
      "Reasoning effort from none through max",
      "$0.10 / $0.50 per million input/output tokens"
    ],
    bestFor: "Small fixes, summaries, classification, and repeatable pipeline steps",
    worstFor: "Architecture, ambiguous debugging, and long autonomous projects",
    latencyBand: "fast",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "The step is explicit, repeatable, and cheap to verify",
    avoidWhen: "The model has to choose the strategy or sustain a difficult investigation",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    longContextPricing: {
      thresholdTokens: 272000,
      inputMultiplier: 2,
      outputMultiplier: 1.5
    }
  },
  {
    id: "glm-5.3",
    name: "GLM-5.3",
    provider: "Z.ai",
    inputPer1M: 1.4,
    outputPer1M: 4.4,
    tier: "reasoning",
    contextWindowTokens: 1000000,
    tagline: "The Open-Weight Coder",
    emoji: "🧩",
    gradientFrom: "from-sky-700",
    gradientTo: "to-teal-500",
    accentColor: "text-sky-700",
    contextBarColor: "bg-sky-500",
    costColor: "text-sky-300",
    why: {
      coding: "Z.ai positions GLM-5.3 as its flagship for complex software engineering and agent work.",
      reasoning: "It always reasons, with low, high, and max effort settings.",
      multifile: "A million-token context and 128K output give it room for repository-scale tasks.",
      autonomous: "Available through the Z.ai API and coding plan for agent harnesses; verify tool behavior on your own tasks."
    },
    whenWrong: "When the task includes screenshots or other images. GLM-5.3 takes text only; GLM-5.3-Flash is the multimodal model.",
    traits: [
      "Always-on reasoning: low, high, or max effort",
      "Text-only input; 1M context and 128K output",
      "Open weights published on Hugging Face"
    ],
    bestFor: "Cost-sensitive coding agents and teams that want inspectable weights",
    worstFor: "Visual tasks and tiny edits that do not need a reasoning pass",
    latencyBand: "moderate",
    initiativeStyle: "measured",
    scopeDiscipline: "good",
    pickWhen: "You want an open-weight coding model at well under Sonnet-class output rates",
    avoidWhen: "The input includes images, or your workflow has not been tested with always-on reasoning",
    benchmark: {
      correctServerAction: null,
      followedConstraints: null,
      madeUpDocs: null,
      hiddenBugsInRefactor: null
    },
    pricingNote: "Z.ai API list rates; cached input is $0.26 per million tokens. GLM-5.3-Flash is a separate multimodal model at $0.15/$0.50."
  }
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const CURRENT_MODEL_IDS = [
  "mistral-large-4",
  "gemini-3.8-flash",
  "claude-fable-5.1",
  "opus-5.5",
  "sonnet-5.5",
  "gpt-6-astra",
  "gpt-6.1-sol",
  "gpt-6-luna",
  "deepseek-v4.1-flash",
  "glm-5.3",
  "kimi-k3",
] as const;

export const MODEL_BY_ID: Record<string, ModelSpec> = Object.fromEntries(
  MODEL_REGISTRY.map((m) => [m.id, m])
);

export interface EffectiveModelPricing {
  inputPer1M: number;
  outputPer1M: number;
  isPromotional: boolean;
  label?: string;
  endsAt?: string;
}

function toIsoDate(asOf: Date | string): string {
  if (typeof asOf === "string") return asOf.slice(0, 10);
  return asOf.toISOString().slice(0, 10);
}

/** Resolve the rate in effect on a given date while preserving standard pricing in the registry. */
export function getEffectiveModelPricing(
  model: ModelSpec,
  asOf: Date | string = new Date()
): EffectiveModelPricing {
  const date = toIsoDate(asOf);
  const promotion = model.promotionalPricing;

  if (promotion && date >= promotion.startsAt && date <= promotion.endsAt) {
    return {
      inputPer1M: promotion.inputPer1M,
      outputPer1M: promotion.outputPer1M,
      isPromotional: true,
      label: promotion.label,
      endsAt: promotion.endsAt,
    };
  }

  return {
    inputPer1M: model.inputPer1M,
    outputPer1M: model.outputPer1M,
    isPromotional: false,
  };
}

/** Uncached text-token estimate for one request; excludes tools and platform fees. */
export function estimateModelCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  asOf: Date | string = new Date()
): number {
  const model = MODEL_BY_ID[modelId];
  if (!model) throw new Error(`Unknown model: ${modelId}`);
  if (![inputTokens, outputTokens].every((n) => Number.isFinite(n) && n >= 0)) {
    throw new Error("Token counts must be finite and non-negative");
  }
  const pricing = getEffectiveModelPricing(model, asOf);
  const long = model.longContextPricing;
  const extended = long && inputTokens > long.thresholdTokens;
  return (
    inputTokens * pricing.inputPer1M * (extended ? long.inputMultiplier : 1) +
    outputTokens * pricing.outputPer1M * (extended ? long.outputMultiplier : 1)
  ) / 1_000_000;
}

// ---------------------------------------------------------------------------
// Component-specific selectors
// These return exactly the shape each component expects so component internals
// change minimally and the data contract stays stable.
// ---------------------------------------------------------------------------

/** Models shown in ModelMixer — all models with pricing + tier */
export function getMixerModels(asOf: Date | string = new Date()) {
  return MODEL_REGISTRY.filter((m) => !m.retired).map((m) => {
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tier: m.tier,
      inputPer1M: pricing.inputPer1M,
      outputPer1M: pricing.outputPer1M,
      pricingLabel: pricing.label ?? m.pricingNote,
    };
  });
}

// ---------------------------------------------------------------------------
// Pricing metadata — single source of truth for data attribution
// Prices checked against official provider sources on 2026-10-05
// ---------------------------------------------------------------------------

export const PRICING_META = {
  verifiedDate: "2026-10-05", // Full registry cross-check against provider API pages and current product docs
  source: "Official API pricing pages",
  notes: [
    "Standard uncached text-token estimates. Excludes cache writes/reads, tool fees, taxes, and platform-specific charges. Reasoning tokens count as output.",
    "Mistral Large 4 checked separately on 2026-10-07: public preview, $1.36/$4.18 standard input/output; $0.68/$2.09 launch rates. The two-week offer is interpreted as October 6–19 inclusive. Other models retain the full-registry verification date above.",
    "Claude Opus 5.5 is $4/$20 and Sonnet 5.5 is $2/$10. Opus 5 and Opus 4.8 remain available at $5/$25 and appear only in historical examples. Opus 5.5 fast mode is $8/$40.",
    "GPT-6.1 Sol is $2/$10 and GPT-6 Luna is $0.10/$0.50. GPT-5.6 Luna, Terra, and Sol remain $0.20/$1.20, $2/$12, and $4/$20; OpenAI calls the Sol rate promotional through at least November 21, 2026.",
    "GLM-5.3 uses Z.ai API list rates ($1.40/$4.40). GLM-5.3-Flash ($0.15/$0.50) is not in the calculators.",
    "Gemini 3.8 Flash is $0.75/$3.75 through December 31, 2026, then $1.50/$7.50. Google API rates are used; Cursor currently lists a different output rate.",
    "DeepSeek-V4.1-Flash estimates use peak uncached rates ($0.30/$1.20). Off-peak rates are half. Retired V4-Flash rates are historical only.",
    "OpenAI requests above 272K input tokens use 2× input and 1.5× output rates. Gemini 3.1 Pro applies those multipliers above 200K.",
    "Context windows describe provider API capacity, not a universal Cursor default. Availability and limits vary by platform.",
  ],
  urls: {
    Mistral: "https://docs.mistral.ai/inference/pricing",
    Anthropic: "https://platform.claude.com/docs/en/about-claude/pricing",
    OpenAI: "https://developers.openai.com/api/docs/pricing",
    Google: "https://ai.google.dev/gemini-api/docs/pricing",
    DeepSeek: "https://api-docs.deepseek.com/quick_start/pricing/",
    "Moonshot AI": "https://platform.kimi.ai/",
    "Z.ai": "https://docs.z.ai/guides/overview/pricing",
    Cursor: "https://cursor.com/docs/models-and-pricing",
  },
} as const;

/** Models shown in CostCalculator */
export function getCostCalculatorModels(asOf: Date | string = new Date()) {
  // Only include models that are meaningful for cost comparison in the blog
  const ids = [
    "gemini-flash",
    "gpt-5.6-luna",
    "gpt-5.6-terra",
    "sonnet-5",
    "composer-2.5",
    "kimi-k3",
    "gpt-5.6-sol",
    "claude-fable-5",
  ];
  return [...new Set([...CURRENT_MODEL_IDS, ...ids])].map((id) => {
    const m = MODEL_BY_ID[id];
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      perM_in: pricing.inputPer1M,
      perM_out: pricing.outputPer1M,
      color: m.costColor,
      pricingLabel: pricing.label ?? m.pricingNote,
    };
  });
}

/** Models shown in ContextWindowViz */
export function getContextWindowModels() {
  const ids = [
    "gpt-5.6-sol",
    "gpt-5.6-terra",
    "gpt-5.6-luna",
    "claude-fable-5",
    "kimi-k3",
    "gemini-flash",
    "sonnet-5",
  ];
  return [...new Set([...CURRENT_MODEL_IDS, ...ids])].map((id) => {
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
    "gpt-5.6-luna",
    "gpt-5.6-terra",
    "gpt-5.6-sol",
    "claude-fable-5",
    "kimi-k3",
  ];
  return [...new Set([...CURRENT_MODEL_IDS, ...ids])].map((id) => {
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
export function getPickerModelsV2(asOf: Date | string = new Date()) {
  // All models are candidates; scoring determines which surface in top-3.
  // Current models come first: the ranking sort is stable, so on an equal
  // score the current version outranks the one it follows.
  const current = new Set<string>(CURRENT_MODEL_IDS);
  const candidates = MODEL_REGISTRY.filter((m) => !m.retired);
  return [
    ...candidates.filter((m) => current.has(m.id)),
    ...candidates.filter((m) => !current.has(m.id)),
  ].map((m) => {
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tagline: m.tagline,
      emoji: m.emoji,
      gradientFrom: m.gradientFrom,
      gradientTo: m.gradientTo,
      accentColor: m.accentColor,
      tier: m.tier,
      inputPer1M: pricing.inputPer1M,
      outputPer1M: pricing.outputPer1M,
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
    };
  });
}

/** Models available in ScenarioLab comparisons */
export function getScenarioLabModels(asOf: Date | string = new Date()) {
  const ids = [
    "deepseek-v4-flash",
    "gemini-flash",
    "haiku-4.5",
    "deepseek-v4.1-flash",
    "gpt-5.6-luna",
    "gpt-5.6-terra",
    "sonnet-5",
    "composer-2.5",
    "opus-4.8",
    "opus-5",
    "kimi-k3",
    "gpt-5.6-sol",
    "claude-fable-5",
  ];
  return [...new Set([...CURRENT_MODEL_IDS, ...ids])].map((id) => {
    const m = MODEL_BY_ID[id];
    const pricing = getEffectiveModelPricing(m, asOf);
    return {
      id: m.id,
      name: m.name,
      provider: m.provider,
      tagline: m.tagline,
      emoji: m.emoji,
      accentColor: m.accentColor,
      tier: m.tier,
      inputPer1M: pricing.inputPer1M,
      outputPer1M: pricing.outputPer1M,
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
  return MODEL_REGISTRY.filter((m) => !m.retired).map((m) => ({
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
    "sonnet-5",
    "kimi-k3",
    "composer-2.5",
    "gpt-5.6-luna",
    "gpt-5.6-terra",
    "gpt-5.6-sol",
    "claude-fable-5",
  ];
  return [...new Set([...CURRENT_MODEL_IDS, ...ids])].map((id) => {
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
  const ids = ["gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol", "claude-fable-5", "kimi-k3"];
  return [...new Set([...CURRENT_MODEL_IDS, ...ids])].map((id) => {
    const m = MODEL_BY_ID[id];
    return {
      id: m.id,
      label: m.name.replace("Claude ", "").replace(" 4.7", "").replace(" 4.6", "").replace(" 4.5", ""),
      color: m.accentColor,
      benchmark: m.benchmark,
    };
  });
}
