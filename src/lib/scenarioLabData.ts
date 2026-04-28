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

export interface PlanModeData {
  /** Model used for the planning phase */
  planModelId: string;
  /** Model used for the execution phase */
  executeModelId: string;
  /** Plan-mode-specific insight replacing the default insight */
  insight: string;
  recommendationReason: string;
  results: ModelResult[];
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
  /** When present, enables the "With Plan Mode" tab for this scenario */
  planMode?: PlanModeData;
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
        modelId: "opus-4.7",
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
    recommendedModelId: "composer-2",
    recommendationReason:
      "Composer 2 still handles this well when you keep the scope explicit. You get the same IDE context plus the option to self-check the result if the edit turns out to be slightly trickier than expected.",
    results: [
      {
        modelId: "composer-2",
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
        costCommentary: "Fast enough for a focused edit, with extra headroom if verification becomes useful",
      },
      {
        modelId: "gemini-flash",
        verdict: "good",
        summary: "Correct refactor, predictable output",
        outputExcerpt:
          "Refactored to use early returns and extracted the validation into a separate function as requested.",
        strengths: ["Followed instructions precisely", "No scope drift"],
        weaknesses: [
          "Less IDE-native than Composer 2 — requires copy-paste workflow",
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
        costContext: { compareToModelId: "composer-2" },
      },
    ],
    planMode: {
      planModelId: "sonnet-4.6",
      executeModelId: "composer-2",
      insight:
        "Plan mode turns Sonnet's scope drift into a feature. It reasons about the refactor approach — naming, structure, edge cases — but a fast model executes the actual edit. You get Sonnet's judgment without its tendency to touch adjacent code.",
      recommendationReason:
        "Sonnet plans the approach (extract helper, simplify conditionals, preserve API), then Composer 2 executes it with explicit guardrails. The plan constrains scope while still letting the executor verify the result if needed.",
      results: [
        {
          modelId: "sonnet-4.6",
          verdict: "best",
          summary: "Plans the approach without touching code directly",
          outputExcerpt:
            "Plan: Extract validation into `isValidUser()`, convert nested ifs to early returns, keep the function signature unchanged. Don't touch the calling code or add JSDoc — scope is this function only.",
          strengths: [
            "Identified the right refactor strategy",
            "Explicitly scoped what NOT to change",
            "Plan acts as a guardrail for the executor",
          ],
          weaknesses: [],
          costCommentary: "Planning tokens are cheap — the plan is short and focused",
        },
        {
          modelId: "composer-2",
          verdict: "best",
          summary: "Executes the plan precisely, stays in scope",
          outputExcerpt:
            "Following the plan: extracted `isValidUser()`, converted to early returns. No other files touched. Diff is exactly what was planned.",
          strengths: [
            "Followed the plan without deviation",
            "Clean, minimal diff",
            "Fast execution after plan was set",
          ],
          weaknesses: [],
          costCommentary: "Fast executor — combined plan + execute cost stays reasonable while adding verification headroom",
          costContext: { compareToModelId: "sonnet-4.6" },
        },
        {
          modelId: "gemini-flash",
          verdict: "good",
          summary: "Solid executor when given a clear plan",
          outputExcerpt:
            "Applied the planned refactor. Early returns and helper extraction done as specified.",
          strengths: [
            "Followed the plan accurately",
            "Cheapest execution cost",
          ],
          weaknesses: [
            "Less IDE-native — requires copy-paste to apply",
          ],
          costCommentary: "Cheapest combo when paired with a Sonnet plan",
        },
      ],
    },
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
        modelId: "deepseek-v4-flash",
        verdict: "caution",
        summary: "Cheap and capable, but still missed the nastier edge cases",
        outputExcerpt:
          "Covered the happy path and basic validation failures, but skipped the concurrent payment race and idempotency checks that tend to bite in production.",
        strengths: [
          "Very cheap for the amount of code generated",
          "Readable test structure",
          "Reasonable baseline coverage",
        ],
        weaknesses: [
          "Missed the concurrent payment edge case",
          "No idempotency or partial-failure coverage",
          "Still feels more pattern-matched than thought through",
        ],
        costCommentary: "Cheap, but you'll still add the most important edge cases yourself",
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
        modelId: "gpt-5.5",
        verdict: "good",
        summary: "Strong agentic reasoning — catches edge cases and follows through",
        outputExcerpt:
          "Identified the concurrent payment race condition and generated a test using Promise.all. Also covered timeout, partial failure, and idempotency scenarios, then suggested running the suite to verify the behavior.",
        strengths: [
          "Caught the concurrent payment edge case",
          "Stronger follow-through than earlier GPT-5.x models on verification loops",
          "High reasoning effort is available when the test plan gets subtle",
        ],
        weaknesses: [
          "More expensive than Sonnet for high-volume test generation",
          "Can over-invest in verification unless you set scope",
        ],
        costCommentary: "Expensive per token, but one verified pass can beat multiple correction rounds",
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
        modelId: "opus-4.7",
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
    planMode: {
      planModelId: "sonnet-4.6",
      executeModelId: "haiku-4.5",
      insight:
        "The hard part of test generation is knowing what to test — the edge cases, race conditions, failure modes. The easy part is writing the actual test code. Plan mode lets a strong model do the thinking while a fast model does the typing.",
      recommendationReason:
        "Sonnet identifies the edge cases (concurrent payments, timeouts, idempotency) and writes a test plan. Haiku generates the actual test code from that plan. You get Sonnet-quality coverage at a fraction of the cost.",
      results: [
        {
          modelId: "sonnet-4.6",
          verdict: "best",
          summary: "Identifies every edge case worth testing",
          outputExcerpt:
            "Test plan for processPayment:\n1. Happy path — valid payment processes correctly\n2. Concurrent duplicate — two payments for same order, one must be rejected\n3. Network timeout — payment gateway doesn't respond within 5s\n4. Partial failure — charge succeeds but confirmation write fails\n5. Idempotency — retried payment with same key returns original result",
          strengths: [
            "Caught the concurrent payment race condition",
            "Identified the partial failure scenario most devs miss",
            "Plan is specific enough for any model to execute",
          ],
          weaknesses: [],
          costCommentary: "Planning tokens are a fraction of writing the full test suite",
        },
        {
          modelId: "haiku-4.5",
          verdict: "best",
          summary: "Turns the test plan into working code quickly",
          outputExcerpt:
            "// From plan item 2: concurrent duplicate payments\nit('should reject duplicate payment attempts', async () => {\n  const [r1, r2] = await Promise.all([processPayment(order), processPayment(order)])\n  expect([r1.status, r2.status]).toContain('duplicate_rejected')\n})",
          strengths: [
            "Followed the plan faithfully — all 5 scenarios covered",
            "Fast generation, clean test structure",
            "Would have missed these edge cases without the plan",
          ],
          weaknesses: [
            "Test descriptions are more mechanical than hand-written",
          ],
          costCommentary: "Negligible execution cost — the plan did the heavy lifting",
        },
        {
        modelId: "deepseek-v4-flash",
          verdict: "good",
          summary: "Solid executor from a clear plan, but Haiku is still the cleaner fast path",
          outputExcerpt:
            "Implemented all planned test cases with correct structure, but one of the edge-case assertions needed a small cleanup pass.",
          strengths: [
            "Followed the plan accurately",
            "Good test structure",
          ],
          weaknesses: [
            "A little less crisp than Haiku on the final polish",
          ],
          costCommentary: "Works fine, but Haiku is still the better executor here",
        },
        {
          modelId: "opus-4.7",
          verdict: "caution",
          summary: "Overkill as planner — Sonnet catches the same edge cases",
          outputExcerpt:
            "Comprehensive test strategy including property-based testing, mutation testing suggestions, and coverage analysis for the payment module…",
          strengths: [
            "Most thorough test strategy",
            "Suggested advanced testing approaches",
          ],
          weaknesses: [
            "Marginal improvement over Sonnet's plan for 3x the cost",
            "Extra depth (property-based testing) often isn't needed",
          ],
          costCommentary: "Sonnet's plan is good enough — save Opus for architecture",
          costContext: { compareToModelId: "sonnet-4.6" },
        },
      ],
    },
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
    recommendedModelId: "composer-2",
    recommendationReason:
      "Composer 2 navigates the project, finds the relevant files, and makes coordinated changes across all of them — without you having to specify each one. For multi-file work, the agentic overhead pays off.",
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
        modelId: "gpt-5.5",
        verdict: "good",
        summary: "1M context plus stronger tool loops — powerful but less IDE-native",
        outputExcerpt:
          "Read the project structure into context, implemented the feature across all three layers, used native tool search to follow service conventions, then ran verification and corrected one custom error-handling mismatch.",
        strengths: [
          "1M context window — no chunking or summarization needed",
          "Stronger autonomous follow-through than earlier GPT-5.x models",
          "Native tool use found existing patterns without manual guidance",
        ],
        weaknesses: [
          "Less IDE-native than Composer 2 — requires more setup",
          "Higher per-token cost means scope control matters",
        ],
        costCommentary:
          "Higher per-token API cost than Composer 2 — you pay for GPT-5.5's breadth and autonomous verification, not Cursor's native agent loop",
        costContext: { compareToModelId: "composer-2" },
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
        costContext: { compareToModelId: "composer-2" },
      },
      {
        modelId: "composer-2",
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
        costCommentary: "Composer 2's API rates are low — with zero correction rounds, effective cost still wins",
      },
      {
        modelId: "opus-4.7",
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
          "Often hard to justify on pure token cost when Composer 2 ships comparable implementation quality",
        ],
        costCommentary: "Use for architecture review, not feature implementation",
        costContext: { compareToModelId: "composer-2" },
      },
    ],
    planMode: {
      planModelId: "opus-4.7",
      executeModelId: "composer-2",
      insight:
        "Multi-file features fail when the executor doesn't understand the big picture. Plan mode flips the direct approach: Opus maps the architecture and file changes, then a fast model executes each file edit. The plan prevents the cross-file inconsistencies that plague cheap models working alone.",
      recommendationReason:
        "Opus plans the full feature — which files to touch, what patterns to follow, how the layers connect. Composer 2 executes against that plan with less wandering and better verification than working fully autonomously from scratch.",
      results: [
        {
          modelId: "opus-4.7",
          verdict: "best",
          summary: "Maps the architecture before a single line is written",
          outputExcerpt:
            "Plan:\n1. New type `PaymentIntent` in src/types/payment.ts — extends existing `Transaction` type\n2. Service: src/services/payment.ts — follow the existing `OrderService` pattern, inject `db` via constructor\n3. API route: src/app/api/payments/route.ts — POST handler with Zod validation, reuse `withAuth` middleware\n4. UI: src/components/PaymentForm.tsx — use existing `useFormState` pattern from OrderForm\nNote: the current service layer couples data access and business logic. Keep them separate in the new service.",
          strengths: [
            "Identified every file that needs to change",
            "Referenced existing patterns by name",
            "Caught the coupling issue and planned around it",
            "Plan is specific enough for a fast model to execute",
          ],
          weaknesses: [],
          costCommentary: "Planning cost is a fraction of the full implementation — and prevents rework",
        },
        {
          modelId: "composer-2",
          verdict: "best",
          summary: "Executes each planned file change cleanly",
          outputExcerpt:
            "Following the plan: created PaymentIntent type, implemented PaymentService with constructor injection, added POST route with Zod validation and withAuth middleware. All files follow the patterns specified in the plan.",
          strengths: [
            "Followed the plan file-by-file without deviation",
            "Matched existing patterns because the plan told it to",
            "Fast execution — no time spent exploring the codebase",
          ],
          weaknesses: [
            "Won't catch issues the plan missed",
          ],
          costCommentary: "Combined Opus plan + Composer 2 execution trades a little extra cost for cleaner verification and less rework",
        },
        {
          modelId: "sonnet-4.6",
          verdict: "good",
          summary: "Strong planner, but Opus catches more architectural issues",
          outputExcerpt:
            "Plan covers the three layers and references existing patterns. Missed the service layer coupling issue that Opus flagged.",
          strengths: [
            "Good plan structure",
            "Cheaper planning phase than Opus",
          ],
          weaknesses: [
            "Missed the architectural coupling issue",
            "Plan was less specific about which patterns to follow",
          ],
          costCommentary: "Good enough for simpler features — use Opus for complex multi-layer work",
          costContext: { compareToModelId: "opus-4.7" },
        },
        {
          modelId: "gemini-flash",
          verdict: "good",
          summary: "Capable executor when the plan is detailed enough",
          outputExcerpt:
            "Implemented all four files from the plan. Followed the specified patterns. One type import needed manual correction.",
          strengths: [
            "Cheapest execution cost",
            "Followed the plan accurately",
          ],
          weaknesses: [
            "Needed one manual fix — less reliable than Composer 2 for multi-file edits",
            "No IDE integration for applying changes",
          ],
          costCommentary: "Cheapest combo overall, but expect minor manual fixes",
        },
      ],
    },
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
    recommendedModelId: "opus-4.7",
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
        modelId: "gpt-5.5",
        verdict: "good",
        summary: "Strong reasoning with better follow-through — still less review-focused than Opus",
        outputExcerpt:
          "At high reasoning effort: Your write-heavy access pattern makes SWR problematic — stale data will be served immediately after writes. Cache invalidation on write with Redis is the better fit here, despite the operational complexity.",
        strengths: [
          "Caught the same key architectural issue as Opus",
          "Better at turning analysis into an implementation loop than earlier GPT-5.x models",
          "Reasoning effort levels let you right-size latency and cost",
        ],
        weaknesses: [
          "Costs more than earlier GPT-5.x models, so cheap analysis loops add up",
          "Less detailed review-grade reasoning trace than Opus",
        ],
        costCommentary: "Strong value when the decision feeds directly into implementation and verification",
        costContext: { compareToModelId: "opus-4.7" },
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
        costContext: { compareToModelId: "opus-4.7" },
      },
      {
        modelId: "opus-4.7",
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
        modelId: "composer-2",
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
        costContext: { compareToModelId: "opus-4.7" },
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
