// ---------------------------------------------------------------------------
// Curated scenario data for ScenarioLab.
// Each scenario has a task description, token assumptions, and per-model
// result cards with annotated output excerpts, failure notes, and a verdict.
// ---------------------------------------------------------------------------

export type Verdict = "best" | "good" | "caution" | "avoid";

export interface ModelResult {
  modelId: string;
  verdict: Verdict;
  /** One-line summary of how this model handled the scenario */
  summary: string;
  /** Annotated output excerpt — what the model actually produced */
  outputExcerpt: string;
  /** What went right */
  strengths: string[];
  /** What went wrong or what to watch for */
  weaknesses: string[];
  /**
   * Qualitative cost judgment — no dollar amounts (those are derived from
   * modelSpecs.ts at runtime). Explains whether the cost is justified, what
   * the effective cost is after correction rounds, etc.
   */
  costCommentary: string;
  /**
   * Optional structured context for derived cost display in ScenarioLab.
   * compareToModelId: show a live "Nx more expensive than <model>" ratio.
   * effectiveRuns: multiply the token cost by this factor to show effective
   *   cost (e.g. 3 correction rounds = effectiveRuns: 3).
   */
  costContext?: {
    compareToModelId?: string;
    effectiveRuns?: number;
  };
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  /** Realistic token assumptions for this task */
  inputTokens: number;
  outputTokens: number;
  /** Which dimension this scenario primarily tests */
  primarySignal: "speed" | "accuracy" | "scope" | "autonomy" | "cost";
  /** The key insight a reader should take away */
  insight: string;
  results: ModelResult[];
  /** Which model id is the recommended pick for this scenario */
  recommendedModelId: string;
  /** Why the recommended model wins for this scenario */
  recommendationReason: string;
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

export const SCENARIOS: Scenario[] = [
  {
    id: "explain-error",
    label: "Explain an error",
    description:
      "Paste a stack trace and get a plain-English explanation with a fix suggestion.",
    inputTokens: 800,
    outputTokens: 500,
    primarySignal: "speed",
    insight:
      "Fast models handle this as well as expensive ones. The answer is either right or obviously wrong — no back-and-forth needed.",
    recommendedModelId: "haiku-4.5",
    recommendationReason:
      "Haiku is fast, cheap, and more than capable for error explanation. Paying for Sonnet or Opus here is waste.",
    results: [
      {
        modelId: "haiku-4.5",
        verdict: "best",
        summary: "Fast, correct, no fluff",
        outputExcerpt:
          "The error occurs because `user` can be `undefined` when the component first renders. Add a null check: `if (!user) return null;` before accessing `user.name`.",
        strengths: [
          "Identified root cause immediately",
          "Gave a one-line fix",
          "No unnecessary explanation",
        ],
        weaknesses: [],
        costCommentary: "Negligible at any volume",
      },
      {
        modelId: "gemini-flash",
        verdict: "good",
        summary: "Correct but slightly verbose",
        outputExcerpt:
          "This TypeError occurs when attempting to access a property on an undefined value. In your case, `user` is undefined at the time the component renders. To fix this, you should add a conditional check…",
        strengths: ["Correct diagnosis", "Safe fix suggestion"],
        weaknesses: ["More verbose than necessary for a simple error"],
        costCommentary: "Cheapest option",
      },
      {
        modelId: "sonnet-4.6",
        verdict: "caution",
        summary: "Correct, but added unrequested refactor suggestions",
        outputExcerpt:
          "The immediate fix is a null check, but I also noticed your component doesn't handle the loading state. I'd suggest restructuring to use a loading skeleton pattern…",
        strengths: ["Correct fix", "Noticed a real adjacent issue"],
        weaknesses: [
          "Expanded scope beyond what was asked",
          "Overkill for a simple error explanation",
        ],
        costCommentary: "More expensive than Haiku for the same core answer",
        costContext: { compareToModelId: "haiku-4.5" },
      },
      {
        modelId: "opus-4.6",
        verdict: "avoid",
        summary: "Thorough but massively over-engineered for this task",
        outputExcerpt:
          "Let me trace through the execution path. The component lifecycle begins with the initial render where React evaluates the JSX tree. At this point, `user` is undefined because the async data fetch hasn't resolved…",
        strengths: ["Extremely thorough explanation"],
        weaknesses: [
          "40-second response for a 5-second answer",
          "Depth isn't proportional to the task",
        ],
        costCommentary: "Much more expensive than Haiku for no better result",
        costContext: { compareToModelId: "haiku-4.5" },
      },
    ],
  },
  {
    id: "targeted-refactor",
    label: "Targeted refactor",
    description:
      "Refactor a single function to improve readability without changing its public API.",
    inputTokens: 2000,
    outputTokens: 2000,
    primarySignal: "scope",
    insight:
      "Scope discipline matters here. A model that drifts will touch things you didn't ask about. A model that's too literal might miss the spirit of the refactor.",
    recommendedModelId: "composer-1",
    recommendationReason:
      "Composer-1 executes exactly what you point at. It won't restructure adjacent code or suggest a different pattern — it just does the refactor cleanly.",
    results: [
      {
        modelId: "composer-1",
        verdict: "best",
        summary: "Clean refactor, stayed in scope",
        outputExcerpt:
          "Extracted the validation logic into a named helper `isValidUser()` and simplified the conditional chain. No other files touched.",
        strengths: [
          "Stayed strictly within the function scope",
          "Improved readability as asked",
          "No surprises in the diff",
        ],
        weaknesses: [],
        costCommentary: "Fast and focused — cost matches the task",
      },
      {
        modelId: "gemini-flash",
        verdict: "good",
        summary: "Correct refactor, predictable output",
        outputExcerpt:
          "Refactored to use early returns and extracted the validation into a separate function as requested.",
        strengths: ["Followed instructions precisely", "No scope drift"],
        weaknesses: [
          "Less IDE-native than Composer-1 — requires copy-paste workflow",
        ],
        costCommentary: "Very cheap",
      },
      {
        modelId: "sonnet-4.6",
        verdict: "caution",
        summary: "Good refactor, but touched adjacent code",
        outputExcerpt:
          "Refactored the function as requested. I also cleaned up the naming in the calling code and added a JSDoc comment since the function lacked documentation…",
        strengths: [
          "High-quality refactor",
          "Noticed real improvements in adjacent code",
        ],
        weaknesses: [
          "Modified files outside the stated scope",
          "Requires careful diff review to avoid unintended changes",
        ],
        costCommentary: "Fine if you review the diff, risky if you don't",
        costContext: { compareToModelId: "composer-1" },
      },
      {
        modelId: "composer-1-5",
        verdict: "caution",
        summary: "Over-engineered the task",
        outputExcerpt:
          "Refactored the function and ran the test suite to verify. Also updated the related utility functions for consistency. Tests pass.",
        strengths: ["Self-verified the output", "Consistent across related code"],
        weaknesses: [
          "Autonomous scope expansion for a simple targeted task",
          "Overhead not justified for a single-function refactor",
        ],
        costCommentary: "Agentic overhead for a task that didn't need it",
        costContext: { compareToModelId: "composer-1" },
      },
    ],
  },
  {
    id: "generate-tests",
    label: "Generate unit tests",
    description:
      "Send a module and get a full test suite covering edge cases and failure modes.",
    inputTokens: 3000,
    outputTokens: 4000,
    primarySignal: "accuracy",
    insight:
      "Fast models produce boilerplate tests quickly. A stronger model reasons about edge cases and failure modes — one good suite beats three mediocre ones you have to fix.",
    recommendedModelId: "sonnet-4.6",
    recommendationReason:
      "Sonnet notices edge cases you didn't think to mention. For test generation, that proactiveness is a feature — you want the model to think about failure modes.",
    results: [
      {
        modelId: "gpt4o-mini",
        verdict: "caution",
        summary: "Boilerplate tests, missed edge cases",
        outputExcerpt:
          "describe('processPayment', () => {\n  it('should process a valid payment', () => { ... })\n  it('should handle invalid amount', () => { ... })\n})",
        strengths: ["Fast", "Correct for the happy path", "Clean test structure"],
        weaknesses: [
          "Missed concurrent payment edge case",
          "No test for network timeout scenario",
          "Tests feel like they were generated, not thought through",
        ],
        costCommentary: "Cheap, but you'll need to add edge cases manually",
      },
      {
        modelId: "haiku-4.5",
        verdict: "caution",
        summary: "Similar to GPT-4o mini — fast but shallow",
        outputExcerpt:
          "Generated happy-path and basic error tests. Coverage looks good at a glance but misses the subtle failure modes.",
        strengths: ["Very fast", "Good structure"],
        weaknesses: [
          "Shallow edge case coverage",
          "Likely to miss the bugs that matter",
        ],
        costCommentary: "Fast but shallow — budget option for basic coverage",
      },
      {
        modelId: "gpt-5.4",
        verdict: "good",
        summary: "Strong reasoning — catches edge cases when effort is dialed up",
        outputExcerpt:
          "At high reasoning effort: identified the concurrent payment race condition and generated a test using Promise.all. Also covered timeout, partial failure, and idempotency scenarios.",
        strengths: [
          "Reasoning effort levels let you dial thoroughness vs speed",
          "At high effort, caught the concurrent payment edge case",
          "Token-efficient — uses fewer reasoning tokens than earlier models",
        ],
        weaknesses: [
          "At default effort, coverage is shallower than Sonnet",
          "Needs explicit effort configuration for best results",
        ],
        costCommentary: "Comparable to Sonnet, but effort levels let you trade cost for speed",
        costContext: { compareToModelId: "sonnet-4.6" },
      },
      {
        modelId: "sonnet-4.6",
        verdict: "best",
        summary: "Thoughtful tests with real edge cases",
        outputExcerpt:
          "// Edge case: concurrent payments for the same order\nit('should handle duplicate payment attempts', async () => {\n  const [result1, result2] = await Promise.all([processPayment(order), processPayment(order)])\n  expect([result1.status, result2.status]).toContain('duplicate_rejected')\n})",
        strengths: [
          "Identified the concurrent payment race condition",
          "Tests the failure modes, not just the happy path",
          "Output reads like a developer wrote it",
        ],
        weaknesses: [
          "Occasionally adds tests for things you didn't ask about",
          "Review the suite before committing",
        ],
        costCommentary: "Worth it if the suite catches real bugs in CI",
      },
      {
        modelId: "opus-4.6",
        verdict: "good",
        summary: "Excellent coverage, but slower and more expensive than Sonnet",
        outputExcerpt:
          "Generated comprehensive test suite including boundary conditions, concurrent access patterns, and failure recovery scenarios. Added property-based test suggestions for the validation logic.",
        strengths: [
          "Most thorough coverage",
          "Suggested property-based testing approach",
        ],
        weaknesses: [
          "40+ second response time",
          "Marginal improvement over Sonnet for most test suites",
        ],
        costCommentary: "Reserve for critical payment/auth modules where thoroughness matters",
        costContext: { compareToModelId: "sonnet-4.6" },
      },
    ],
  },
  {
    id: "multi-file-feature",
    label: "Multi-file feature",
    description:
      "Implement a new feature that touches multiple files — API route, service layer, and UI component.",
    inputTokens: 8000,
    outputTokens: 12000,
    primarySignal: "autonomy",
    insight:
      "This is where raw cost comparisons mislead. A model that ships working code in one shot is often cheaper in practice than a cheap model that needs five rounds of corrections.",
    recommendedModelId: "composer-1-5",
    recommendationReason:
      "Composer 1.5 navigates the project, finds the relevant files, and makes coordinated changes across all of them — without you having to specify each one. For multi-file work, the agentic overhead pays off.",
    results: [
      {
        modelId: "gemini-flash",
        verdict: "avoid",
        summary: "Implemented the happy path, missed cross-file consistency",
        outputExcerpt:
          "Created the API route and component. Note: I've implemented the service layer based on the pattern I inferred from your description.",
        strengths: ["Fast", "Cheap per token"],
        weaknesses: [
          "Didn't read the existing service layer — invented its own pattern",
          "Type mismatches between the new route and existing types",
          "Required 3 correction rounds to get consistent",
        ],
        costCommentary: "Cheap per token, but 3 correction rounds triple the effective cost",
        costContext: { effectiveRuns: 3 },
      },
      {
        modelId: "gpt-5.4",
        verdict: "good",
        summary: "1M context holds the whole project — strong but less IDE-native",
        outputExcerpt:
          "Read the entire project structure into context. Implemented the feature across all three layers following existing patterns. Used native tool search to find the service layer conventions. One manual adjustment needed for the project's custom error handling.",
        strengths: [
          "1M context window — no chunking or summarization needed",
          "Native tool use found existing patterns without manual guidance",
          "Cheaper than Composer 1.5 per run at similar quality",
        ],
        weaknesses: [
          "Less IDE-native than Composer 1.5 — requires more setup",
          "Missed a project-specific convention that Composer 1.5 picked up from editor context",
        ],
        costCommentary: "Cheaper than Composer 1.5 with comparable output quality",
        costContext: { compareToModelId: "composer-1-5" },
      },
      {
        modelId: "sonnet-4.6",
        verdict: "good",
        summary: "Strong implementation, but required scope guardrails",
        outputExcerpt:
          "Implemented the feature across all three layers. I also noticed your error handling pattern was inconsistent across the existing routes, so I standardized it while I was in there…",
        strengths: [
          "Understood the codebase structure",
          "Consistent with existing patterns",
          "High-quality implementation",
        ],
        weaknesses: [
          "Touched files outside the stated scope",
          "Requires explicit constraints to prevent drift",
        ],
        costCommentary: "Good value if you set scope constraints upfront",
        costContext: { compareToModelId: "composer-1-5" },
      },
      {
        modelId: "composer-1-5",
        verdict: "best",
        summary: "Navigated the codebase, implemented end-to-end, self-verified",
        outputExcerpt:
          "Found the existing service layer pattern in `src/services/`. Implemented the new feature following the same pattern. Ran TypeScript compiler — 0 errors. Tests pass.",
        strengths: [
          "Read the actual codebase before writing code",
          "Matched existing patterns without being told",
          "Self-verified with TypeScript and tests",
          "No correction rounds needed",
        ],
        weaknesses: [
          "Can go down wrong paths on ambiguous specs",
          "Needs clear success criteria upfront",
        ],
        costCommentary: "Higher token cost, but zero correction rounds = best effective cost",
      },
      {
        modelId: "opus-4.6",
        verdict: "caution",
        summary: "Excellent quality but slow — better for design than implementation",
        outputExcerpt:
          "Before implementing, let me reason through the design. Your current service layer has an implicit coupling between the data access and business logic layers that will complicate this feature…",
        strengths: [
          "Identified a real architectural issue",
          "Highest quality output",
        ],
        weaknesses: [
          "Slow for implementation work",
          "Better suited to the design/review phase than the build phase",
          "Cost doesn't justify it when Composer 1.5 ships the same feature",
        ],
        costCommentary: "Use for architecture review, not feature implementation",
        costContext: { compareToModelId: "composer-1-5" },
      },
    ],
  },
  {
    id: "architecture-decision",
    label: "Architecture decision",
    description:
      "Evaluate three caching strategies for a Next.js app and recommend the right one given specific access patterns.",
    inputTokens: 3000,
    outputTokens: 2000,
    primarySignal: "accuracy",
    insight:
      "This is where Opus earns its cost. Architecture decisions have long-term consequences — a model that pattern-matches to the most common answer can lead you to the wrong choice.",
    recommendedModelId: "opus-4.6",
    recommendationReason:
      "Opus traces actual logic, not patterns. It identified that the 'common' caching strategy was wrong for the specific access pattern described — something Sonnet missed.",
    results: [
      {
        modelId: "gemini-flash",
        verdict: "avoid",
        summary: "Picked the most common option without reasoning through the tradeoffs",
        outputExcerpt:
          "For a Next.js app, I recommend React Query with stale-while-revalidate. It's the most widely used pattern and has good community support.",
        strengths: ["Fast answer", "Technically valid recommendation"],
        weaknesses: [
          "Didn't analyze the specific access pattern described",
          "Recommended the popular choice, not the right choice",
          "No reasoning about the tradeoffs for this use case",
        ],
        costCommentary: "Cheap, but the wrong answer is expensive",
      },
      {
        modelId: "gpt-5.4",
        verdict: "good",
        summary: "Strong reasoning at xhigh effort — cheaper than Opus but less depth",
        outputExcerpt:
          "At xhigh reasoning effort: Your write-heavy access pattern makes SWR problematic — stale data will be served immediately after writes. Cache invalidation on write with Redis is the better fit here, despite the operational complexity.",
        strengths: [
          "At xhigh effort, caught the same key insight as Opus",
          "Cheaper than Opus for similar analysis quality",
          "Reasoning effort levels let you right-size the cost",
        ],
        weaknesses: [
          "Needs explicit xhigh effort — at default, it recommended SWR",
          "Less detailed reasoning trace than Opus",
        ],
        costCommentary: "Strong value when you configure reasoning effort correctly",
        costContext: { compareToModelId: "opus-4.6" },
      },
      {
        modelId: "sonnet-4.6",
        verdict: "good",
        summary: "Solid analysis, but missed the key access pattern implication",
        outputExcerpt:
          "Here are the three strategies with their tradeoffs: React Query works well for most cases. Redis adds complexity but scales better. In-memory caching is simplest but doesn't work across instances…",
        strengths: [
          "Clear tradeoff analysis",
          "Considered the deployment context",
        ],
        weaknesses: [
          "Recommended React Query without fully analyzing the write-heavy access pattern",
          "Missed that write-heavy patterns make SWR a poor fit",
        ],
        costCommentary: "Good analysis, but missed the key insight",
        costContext: { compareToModelId: "opus-4.6" },
      },
      {
        modelId: "opus-4.6",
        verdict: "best",
        summary: "Identified that the common recommendation was wrong for this case",
        outputExcerpt:
          "Your access pattern is write-heavy with reads that need to reflect recent writes immediately. SWR's stale-while-revalidate model is a poor fit here — it will serve stale data after writes. For this pattern, you want cache invalidation on write, not time-based revalidation. Redis with explicit invalidation is the right choice, despite the added complexity.",
        strengths: [
          "Analyzed the specific access pattern, not the general case",
          "Identified why the popular recommendation was wrong",
          "Explained the reasoning clearly",
          "Long-term implication: avoided a cache consistency bug in production",
        ],
        weaknesses: [
          "40-second response",
          "Overkill for straightforward architecture questions",
        ],
        costCommentary: "Worth it when the wrong answer has production consequences",
      },
      {
        modelId: "composer-1-5",
        verdict: "caution",
        summary: "Implemented a solution before fully reasoning through the design",
        outputExcerpt:
          "I've set up React Query with the SWR pattern. Here's the implementation…",
        strengths: ["Fast to working code"],
        weaknesses: [
          "Jumped to implementation without sufficient design reasoning",
          "Picked the common pattern without analyzing the access pattern",
          "Architecture decisions need reasoning, not implementation speed",
        ],
        costCommentary: "Wrong tool for a design question",
        costContext: { compareToModelId: "opus-4.6" },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function calcScenarioCost(
  inputPer1M: number,
  outputPer1M: number,
  scenario: Scenario
): number {
  return (
    (scenario.inputTokens / 1_000_000) * inputPer1M +
    (scenario.outputTokens / 1_000_000) * outputPer1M
  );
}

export function formatCost(n: number): string {
  if (n === 0) return "$0.00";
  if (n < 0.0001) return "<$0.0001";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

export const VERDICT_META: Record<
  Verdict,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  best: {
    label: "Best pick",
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-400/10",
    borderClass: "border-emerald-400/30",
  },
  good: {
    label: "Good fit",
    textClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
    borderClass: "border-blue-400/30",
  },
  caution: {
    label: "Use with care",
    textClass: "text-amber-400",
    bgClass: "bg-amber-400/10",
    borderClass: "border-amber-400/30",
  },
  avoid: {
    label: "Avoid",
    textClass: "text-red-400",
    bgClass: "bg-red-400/10",
    borderClass: "border-red-400/30",
  },
};
