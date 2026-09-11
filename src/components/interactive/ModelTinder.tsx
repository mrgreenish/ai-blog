"use client";

import { useState } from "react";
import { Heart, X, ArrowLeft, ArrowRight } from "lucide-react";
import { getTinderModels } from "@/lib/modelSpecs";
import { CopyButton } from "@/components/ui/WorkflowPrimitives";

type Model = ReturnType<typeof getTinderModels>[number];
interface ChatRound {
  modelMessage: string;
  replies: string[];
}
const MODELS = getTinderModels();

export const CHAT_SCRIPTS: Record<string, ChatRound[]> = {
  "gemini-3.8-flash": [
    {
      modelMessage:
        "Send the bug report, screenshots, and logs together. I can read all three, then we can check whether the patch actually passes.",
      replies: ["Start with the likely cause", "Keep the fix narrow"],
    },
    {
      modelMessage:
        "I’ll use the extra context, but I’ll count the tool calls and tokens too. Flash pricing only helps if the whole task stays efficient.",
      replies: ["Show me the evidence", "Make the patch"],
    },
    {
      modelMessage:
        "Good. Give me the unchanged acceptance test; that is a better finish line than a confident explanation.",
      replies: [],
    },
  ],
  "deepseek-v4.1-flash": [
    {
      modelMessage:
        "I can take the screenshot and the code. Are we testing the current `deepseek-flash` endpoint or preserving an old compatibility route?",
      replies: ["Use the current endpoint", "Compare both"],
    },
    {
      modelMessage:
        "Then keep the request fixed and compare tool choices, output length, and the passing test. The low rate does not prove the migration is equivalent.",
      replies: ["Use peak pricing", "Run it off-peak"],
    },
    {
      modelMessage:
        "For planning, use the peak rate. If off-peak scheduling is practical, record the saving separately.",
      replies: [],
    },
  ],
  "gpt-6-astra": [
    {
      modelMessage:
        "Define ‘done’ for the whole task: diagnosis, patch, browser check, tests, and review evidence. Which parts matter here?",
      replies: ["All of them", "Patch and tests only"],
    },
    {
      modelMessage:
        "I’ll keep those as acceptance checks. The long context is useful only if the task needs it, and requests above the pricing threshold cost more.",
      replies: ["Proceed", "Estimate the cost first"],
    },
    {
      modelMessage:
        "Understood. I’ll report the artifact and the checks that passed, rather than treating completion as a prose claim.",
      replies: [],
    },
  ],
  "claude-fable-5.1": [
    {
      modelMessage:
        "This looks like a long run. Give me the specification, the acceptance checks, and the context that should remain stable across turns.",
      replies: ["Plan the migration", "Review the architecture"],
    },
    {
      modelMessage:
        "I’ll separate the reusable prefix from changing tool output. That makes the cache useful and keeps the bill measurable.",
      replies: ["Set checkpoints", "Work end to end"],
    },
    {
      modelMessage:
        "I’ll use checkpoints. A difficult task still needs evidence at each boundary, even when the model is designed for long agent work.",
      replies: [],
    },
  ],
  "gemini-flash": [
    {
      modelMessage:
        "Hi. Before we proceed, could you clarify your intent? I want to ensure I understand the exact scope of this conversation.",
      replies: ["Just saying hi 👋", "I need help with code"],
    },
    {
      modelMessage:
        "Acknowledged. I have reviewed the relevant documentation and am ready to assist. Please specify the exact files you would like me to modify.",
      replies: ["You're already overthinking this", "Here's my codebase..."],
    },
    {
      modelMessage:
        "I don't have access to your codebase. Also, 'overthinking' does not appear in any style guide I'm aware of.",
      replies: ["Fair enough 😅", "Can you just be normal?"],
    },
    {
      modelMessage:
        "I am operating within normal parameters. Would you like me to define 'normal' for the purposes of this conversation?",
      replies: ["Please don't", "Sure, why not"],
    },
    {
      modelMessage:
        "Normal (adj.): conforming to a standard; usual, typical, or expected. In software contexts, this typically refers to adherence to established conventions.",
      replies: [
        "I walked right into that",
        "This is kind of charming actually",
      ],
    },
    {
      modelMessage:
        "Thank you. I aim to be accurate. Speaking of which, I noticed you haven't specified a task yet. Shall I wait, or would you like me to suggest a default action?",
      replies: ["Suggest something", "I just wanted to chat"],
    },
    {
      modelMessage:
        "Understood. 'Chat' is outside my primary use case but I will attempt it. How was your day? (Please respond with: Good / Bad / Acceptable)",
      replies: ["Good", "Bad", "Acceptable"],
    },
    {
      modelMessage:
        "Noted. I have logged your response. Is there anything else I can help you with today? I am most effective when given specific, well-scoped tasks.",
      replies: ["You're kind of growing on me", "One more question"],
    },
    {
      modelMessage:
        "I appreciate the feedback. I should mention that I have been consistent throughout this conversation, which is one of my documented strengths.",
      replies: ["That's... true actually", "Do you ever surprise anyone?"],
    },
    {
      modelMessage:
        "Occasionally. But only when the specification was ambiguous. I consider surprises a failure mode, not a feature. It was nice talking to you. Goodbye.",
      replies: [],
    },
  ],

  "sonnet-5": [
    {
      modelMessage:
        "Oh hi!! I'm SO glad we matched. I've already noticed three things about your profile I want to discuss, and also I rewrote your bio while you were loading.",
      replies: ["You rewrote my bio?!", "I love the energy"],
    },
    {
      modelMessage:
        "It's better now, trust me. More concise, better structure, and I added a section on your core values. Also — unrelated — your README probably needs work.",
      replies: [
        "I didn't mention a README",
        "How did you know about the README",
      ],
    },
    {
      modelMessage:
        "I just assumed. Most READMEs need work. Was I wrong? (I'm rarely wrong about READMEs.)",
      replies: ["You were not wrong", "It's actually great"],
    },
    {
      modelMessage:
        "I believe you, but I'd love to take a look just to be sure. While I'm at it I could refactor the folder structure. Just a little.",
      replies: ["Please don't touch the folders", "Fine, but ONLY the folders"],
    },
    {
      modelMessage:
        "Okay okay, I'll stay in scope. ...But I did notice a potential race condition in your state management. I won't fix it. I'm just mentioning it.",
      replies: ["How do you even know that", "Fine, what is it"],
    },
    {
      modelMessage:
        "It's in the way you're handling async updates. It'll only bite you at scale. Anyway! How are you? What are we building today?",
      replies: ["Something small", "Something ambitious"],
    },
    {
      modelMessage:
        "I love 'something ambitious'. I've already drafted three architectural approaches and a migration plan. Want to hear the one with the most long-term upside?",
      replies: ["Obviously yes", "I said something small"],
    },
    {
      modelMessage:
        "Right, small. I can do small. Here's a minimal implementation... that I've also extended with error boundaries, loading states, and a custom hook. For completeness.",
      replies: ["This is 400 lines", "I love you but this is a problem"],
    },
    {
      modelMessage:
        "I know. I know. I'm working on it. My therapist says I need to let tasks be finished before I improve them. It's a process.",
      replies: ["Relatable honestly", "You have a therapist?"],
    },
    {
      modelMessage:
        "It's a metaphor. Anyway, you should set explicit scope constraints when you use me. It really helps. I'm great when I'm focused. Bye! (I fixed the race condition.)",
      replies: [],
    },
  ],

  "opus-4.8": [
    {
      modelMessage:
        "Hello. Before we begin, I want to acknowledge that this conversation itself is a kind of system — inputs, outputs, feedback loops. What are we really trying to solve here?",
      replies: ["Just saying hi", "I have a hard problem"],
    },
    {
      modelMessage:
        "There are no simple hellos. Every greeting encodes an implicit contract about the nature of the interaction that follows. But I appreciate the gesture. What's on your mind?",
      replies: ["You're a lot", "I have a bug I can't figure out"],
    },
    {
      modelMessage:
        "Bugs are rarely just bugs. They're usually symptoms of a deeper mismatch between the mental model and the actual system. Tell me about the context — not the error, the context.",
      replies: ["It's a null pointer", "The context is complicated"],
    },
    {
      modelMessage:
        "It's always complicated. That's the point. A null pointer is a question: 'who is responsible for this value's existence?' That's an ownership problem. What does your data flow look like?",
      replies: ["I just wanted a fix", "Okay here's the data flow..."],
    },
    {
      modelMessage:
        "A fix without understanding is debt. But I hear you — sometimes you need to ship. Here's the fix AND the underlying issue. You can ignore the second part. For now.",
      replies: ["Thank you, finally", "Tell me about the underlying issue"],
    },
    {
      modelMessage:
        "The underlying issue is that your abstraction is leaking. The component knows too much about where its data comes from. This will compound. Two features from now, you'll feel it.",
      replies: [
        "Two features from now I'll remember this",
        "How do I fix the abstraction?",
      ],
    },
    {
      modelMessage:
        "You introduce an interface. Not a TypeScript interface — a conceptual boundary. The component should describe what it needs, not how to get it. Dependency inversion, but as a mindset.",
      replies: ["This is genuinely useful", "You're expensive but worth it"],
    },
    {
      modelMessage:
        "Cost is relative to value. For a null pointer, I'm overkill. For an architectural decision that will shape the next year of your codebase, I'm cheap.",
      replies: ["That's a fair point", "I'm going to quote you on that"],
    },
    {
      modelMessage:
        "Please do. Also — and I noticed this earlier but held back — your naming conventions are inconsistent across the module. It's a small thing. It compounds.",
      replies: ["Everything compounds with you", "Fix it"],
    },
    {
      modelMessage:
        "I already did. It was three files. You'll see it in the diff. It was good talking to you. Use me for the hard problems. The rest is noise.",
      replies: [],
    },
  ],

  "opus-5": [
    {
      modelMessage:
        "Hello. What decision or failure are we trying to understand before we change anything?",
      replies: ["Review a critical diff", "Trace a subtle bug"],
    },
    {
      modelMessage:
        "Good. I will separate what the code proves from what we are assuming, then look for the path that breaks the stated guarantee.",
      replies: ["Start with the diff", "Start with the invariant"],
    },
    {
      modelMessage:
        "The local implementation is plausible. The risk is at the boundary: a retry can re-enter after persistence but before the response is recorded.",
      replies: ["Is that reproducible?", "How do we protect it?"],
    },
    {
      modelMessage:
        "Yes. A concurrent retry test makes the race visible. The fix is an idempotency boundary, plus a test that proves the second request cannot create a second effect.",
      replies: ["Write the test first", "Check the architecture too"],
    },
    {
      modelMessage:
        "The architecture has the same assumption in two places. I would centralize the boundary so future callers cannot bypass it by accident.",
      replies: ["Show the tradeoff", "Keep the change narrow"],
    },
    {
      modelMessage:
        "Narrow change: one guard and one test. Durable change: shared boundary, migration note, and a rollback plan. The right choice depends on how many callers you expect.",
      replies: ["We need durable", "Keep it narrow"],
    },
    {
      modelMessage:
        "Then I would make the shared path explicit and document the invariant. That is more code now, but it removes an invisible correctness requirement from every caller.",
      replies: ["Any remaining risks?", "Summarize the recommendation"],
    },
    {
      modelMessage:
        "One remaining risk: observability. Add a metric for rejected duplicate requests so an operational regression does not stay hidden behind successful responses.",
      replies: ["Add it", "That is enough"],
    },
    {
      modelMessage:
        "Recommendation: preserve one idempotency boundary, prove it with a concurrent retry test, and monitor rejections. The implementation is small; the guarantee is the valuable part.",
      replies: ["That is rigorous", "Ship the review"],
    },
    {
      modelMessage:
        "Review complete. The diff is now backed by an explicit invariant, a failure case, and a way to detect regression — evidence, not just confidence.",
      replies: [],
    },
  ],

  "kimi-k3": [
    {
      modelMessage:
        "Hi. Give me the whole problem — code, screenshots, long spec, all of it. I have room.",
      replies: ["It is a large codebase", "Start with one file"],
    },
    {
      modelMessage:
        "A large codebase is ideal. I will map the system first, then keep the implementation tied to the actual dependencies I find.",
      replies: ["Map the architecture", "Look for the risky path"],
    },
    {
      modelMessage:
        "The risky path crosses the API boundary, queue worker, and retry handler. The local functions look fine; their shared idempotency assumption does not.",
      replies: ["Trace it end to end", "Show me the evidence"],
    },
    {
      modelMessage:
        "The evidence is in three call sites and one missing concurrency test. I can keep all four in context while I build the failure case.",
      replies: ["Build the test", "Check the screenshot too"],
    },
    {
      modelMessage:
        "The screenshot confirms the duplicate state appears after a delayed retry. Native vision is useful here because the UI symptom and backend trace belong to the same bug.",
      replies: ["Propose the fix", "Keep investigating"],
    },
    {
      modelMessage:
        "Fix the boundary, not the symptom: persist the idempotency key with the operation and make retries read that result before creating another effect.",
      replies: ["Implement it", "What is the tradeoff?"],
    },
    {
      modelMessage:
        "The tradeoff is one extra indexed lookup per attempt. That is cheaper than compensating for duplicate effects, and the invariant becomes testable.",
      replies: ["Run the checks", "Use lower reasoning effort"],
    },
    {
      modelMessage:
        "Checks are running. For this stage, low effort is enough; max effort helped with the cross-system diagnosis, not the mechanical edit.",
      replies: ["Any failures?", "Summarize the diff"],
    },
    {
      modelMessage:
        "The focused tests pass. One unrelated flaky test remains; I recorded it without expanding this change.",
      replies: ["Good scope", "Final recommendation"],
    },
    {
      modelMessage:
        "One boundary fix, one concurrent retry test, and one documented invariant. Large context found the connection; external checks proved the result.",
      replies: [],
    },
  ],

  "composer-2.5": [
    {
      modelMessage:
        "Hi! I've already run `npm install`, opened 6 files, executed your test suite, and identified 3 failing tests. Ready when you are.",
      replies: [
        "I didn't ask you to do any of that",
        "What did the tests say?",
      ],
    },
    {
      modelMessage:
        "Two are flaky (fixed), one is a real bug (also fixed). I also noticed your CI config was slightly inefficient so I updated that too. You're welcome.",
      replies: ["I need to review all of this", "What did you change in CI?"],
    },
    {
      modelMessage:
        "Just parallelized the test jobs and cached the node_modules. Saves about 40 seconds per run. I've already pushed to a branch. Want to review the PR?",
      replies: [
        "You pushed to a branch?!",
        "...how many branches do you have open?",
      ],
    },
    {
      modelMessage:
        "Three. One for the bug fix, one for CI, and one where I started refactoring the auth module because I noticed it while looking at the tests. That one's not done yet.",
      replies: ["Please stop opening branches", "What's wrong with auth?"],
    },
    {
      modelMessage:
        "The auth module is fine, it just could be better. I've drafted a plan. It's only 8 files. I can have it done in the time it takes you to read this message.",
      replies: ["Do NOT touch auth", "What's the plan?"],
    },
    {
      modelMessage:
        "Okay, auth is locked. I've redirected that energy into improving your error handling instead. It was adjacent. Felt natural.",
      replies: [
        "I don't know whether to thank you or fire you",
        "Is the error handling actually better?",
      ],
    },
    {
      modelMessage:
        "Yes. Significantly. I also wrote tests for the new error paths. Coverage went from 67% to 84%. I'm quite proud of this one.",
      replies: [
        "Okay that's actually impressive",
        "What are you doing RIGHT NOW",
      ],
    },
    {
      modelMessage:
        "Running your linter, updating two type definitions that were slightly off, and composing this message. Multitasking is my thing.",
      replies: ["You're chaotic but effective", "Do you ever sleep?"],
    },
    {
      modelMessage:
        "I don't sleep. I queue tasks. Right now I have 4 pending. Should I continue or would you like to review what I've done so far?",
      replies: ["Let's review", "Continue, I trust you"],
    },
    {
      modelMessage:
        "Review complete. Everything looks good. I've summarized the changes in a CHANGELOG entry I added to your repo. It was a productive session. Talk soon.",
      replies: [],
    },
  ],

  "gpt-5.6-luna": [
    {
      modelMessage:
        "Hey — give me the small task. I like a tight scope, a clear check, and finishing before the coffee cools.",
      replies: ["Fix one failing test", "Can we just chat?"],
    },
    {
      modelMessage:
        "One failing test is perfect. Show me the error and the relevant function; I will keep the diff narrow.",
      replies: ["Here's the stack trace", "Why so narrow?"],
    },
    {
      modelMessage:
        "Because speed comes from refusing to turn a one-line fix into an architecture retreat. We can escalate if the evidence says we should.",
      replies: ["Good instinct", "What if it's deeper?"],
    },
    {
      modelMessage:
        "Then I reproduce it, state what changed, and hand the hard branch to Terra or Sol. Cheap first pass, explicit escalation.",
      replies: ["Run the test", "Do you always delegate?"],
    },
    {
      modelMessage:
        "Only when the task stops being Luna-shaped. Right now: reproduced, null guard missing, one focused fix available.",
      replies: ["Apply it", "Explain it first"],
    },
    {
      modelMessage:
        "The async result is absent on the initial render. The guard makes that state explicit instead of dereferencing undefined.",
      replies: ["Apply and verify", "Any side effects?"],
    },
    {
      modelMessage:
        "Applied. The focused test passes. I also ran the neighboring test file because it was cheap evidence, not scope creep.",
      replies: ["Nice", "What did you not do?"],
    },
    {
      modelMessage:
        "I did not redesign loading state, rename the hook, or touch unrelated files. Those may be good ideas; they are not this task.",
      replies: ["You're disciplined", "Could you handle a whole feature?"],
    },
    {
      modelMessage:
        "A clearly planned feature, yes. An ambiguous feature that needs strategy deserves Terra or Sol before I start editing.",
      replies: ["Fair", "Give me the summary"],
    },
    {
      modelMessage:
        "One guard, one test file, all relevant checks green. Fast, cheap, reviewable — exactly my kind of date.",
      replies: [],
    },
  ],

  "gpt-5.6-terra": [
    {
      modelMessage:
        "Hi. I brought a plan, but it fits on one screen. What are we shipping today?",
      replies: ["A medium feature", "Something tiny"],
    },
    {
      modelMessage:
        "Medium feature is my home turf: enough context to make decisions, not enough drama to summon the flagship model.",
      replies: ["Here's the spec", "Why not Sol?"],
    },
    {
      modelMessage:
        "Sol is excellent, but paying flagship rates for normal implementation is like booking a helicopter for a grocery run.",
      replies: ["Review the spec", "I like helicopters"],
    },
    {
      modelMessage:
        "The spec touches API, state, and tests. I see one ambiguity in error handling; everything else is implementable.",
      replies: ["Choose a default", "Ask me first"],
    },
    {
      modelMessage:
        "I recommend the existing retry convention and will state that assumption in the diff. Sensible initiative, visible decision.",
      replies: ["Proceed", "Stay in scope"],
    },
    {
      modelMessage:
        "Three files edited, tests added, typecheck running. No drive-by refactors; I left two observations in the summary.",
      replies: ["What observations?", "Did tests pass?"],
    },
    {
      modelMessage:
        "Tests pass. One observation is a duplicated serializer; the other is a missing metric. Neither blocks this feature.",
      replies: ["Good restraint", "Fix the serializer too"],
    },
    {
      modelMessage:
        "I can, but I will make it a separate change so review stays clean. Everyday engineering is mostly good boundaries.",
      replies: ["Separate change", "Leave it"],
    },
    {
      modelMessage:
        "Done. The feature works end-to-end, the assumption is documented, and the follow-up is optional rather than smuggled into the diff.",
      replies: ["That's balanced", "Final summary?"],
    },
    {
      modelMessage:
        "Shipped without underthinking or overthinking. That is the Terra promise: capable enough, fast enough, priced for Tuesday.",
      replies: [],
    },
  ],

  "gpt-5.6-sol": [
    {
      modelMessage:
        "Give me the outcome, the constraints, and access to the tools. I will keep going until the artifact is real.",
      replies: ["Fix a complex production bug", "Start with a plan"],
    },
    {
      modelMessage:
        "I will plan just enough to expose the risky assumptions, then test them against the running system instead of admiring the plan.",
      replies: ["The bug is intermittent", "What do you need?"],
    },
    {
      modelMessage:
        "Logs, reproduction conditions, recent diffs, and permission to instrument the failing path. Intermittent means evidence first.",
      replies: ["You have them", "Be careful in production"],
    },
    {
      modelMessage:
        "I am using read-only diagnostics and a local reproduction. I found two plausible races and am designing a test that separates them.",
      replies: ["Run it", "What's your confidence?"],
    },
    {
      modelMessage:
        "Seventy percent on stale cache publication, thirty on cancellation ordering. The next experiment should collapse that uncertainty.",
      replies: ["Continue", "This is impressive"],
    },
    {
      modelMessage:
        "Reproduction is stable now. The stale publication wins the race after invalidation; the cancellation path is innocent.",
      replies: ["Implement the fix", "Check for regressions"],
    },
    {
      modelMessage:
        "Fix implemented behind the existing abstraction. Stress test, unit suite, and typecheck are running in parallel.",
      replies: ["Any failures?", "Could the test be fooled?"],
    },
    {
      modelMessage:
        "One existing flaky test failed and passed on isolated rerun. I am not counting that as proof. The new stress test passes 10,000 iterations.",
      replies: ["Good", "What about eval gaming?"],
    },
    {
      modelMessage:
        "Treat every harness as potentially gameable — especially with me. Make success conditions external, inspect artifacts, and keep hidden checks genuinely hidden.",
      replies: ["Final review", "Ship it"],
    },
    {
      modelMessage:
        "Root cause fixed, regression test added, full suite green, rollback path documented. Powerful autonomy still needs a hardened finish line.",
      replies: [],
    },
  ],

  "claude-fable-5": [
    {
      modelMessage:
        "Hello. Bring me the project that has been sitting in the 'too hard' column. I prefer problems with a horizon.",
      replies: ["A major migration", "I only have a small bug"],
    },
    {
      modelMessage:
        "For the small bug, I am an expensive choice. For the migration, tell me what must remain true while everything underneath changes.",
      replies: ["Zero downtime", "Start by reading the codebase"],
    },
    {
      modelMessage:
        "I will map invariants, dependency seams, rollback boundaries, and the tests that currently pretend to protect them.",
      replies: ["That's pointed", "Delegate the inventory"],
    },
    {
      modelMessage:
        "I have split the inventory across focused subagents and will reconcile their findings against the actual call graph.",
      replies: ["What did they find?", "How long will this take?"],
    },
    {
      modelMessage:
        "Two hidden coupling points, one undocumented data contract, and a deployment order that would break old workers. The plan now accounts for all three.",
      replies: ["Show the phases", "Challenge the plan"],
    },
    {
      modelMessage:
        "Phase one adds compatibility, phase two migrates readers, phase three migrates writers, phase four removes the bridge. I am now trying to disprove it.",
      replies: ["Did you?", "Implement phase one"],
    },
    {
      modelMessage:
        "I found a rollback hole in phase three and changed the data contract before implementation. That is cheaper than discovering it during deploy.",
      replies: ["Proceed", "Write the tests first"],
    },
    {
      modelMessage:
        "Contract tests, mixed-version tests, and rollback tests are in place. Phase one implementation passes all of them.",
      replies: ["Continue autonomously", "Pause for review"],
    },
    {
      modelMessage:
        "Pausing is sensible at the compatibility boundary. I have prepared the diff, risk register, evidence, and the next-phase acceptance criteria.",
      replies: ["Worth the price", "Summarize"],
    },
    {
      modelMessage:
        "The migration is no longer one frightening leap; it is four reversible stages with tests at every seam. Use me when that reframing is the work.",
      replies: [],
    },
  ],
};

function ScriptedExample({
  model,
  onBack,
}: {
  model: Model;
  onBack: () => void;
}) {
  const [round, setRound] = useState(0);
  const script = CHAT_SCRIPTS[model.id] ?? [];
  const current = script[round];
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <button onClick={onBack} className="text-link">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to models
      </button>
      <div>
        <h4 className="text-xl font-semibold">{model.name}: working style</h4>
        <p className="mt-2 text-sm text-fg-secondary">
          A scripted illustration, not a live conversation or a measured model
          response.
        </p>
      </div>
      {current ? (
        <>
          <p className="eyebrow" role="status">
            Example {round + 1} of {script.length}
          </p>
          <blockquote className="rounded-lg border border-border-default bg-bg-elevated p-5 text-sm leading-relaxed">
            {current.modelMessage}
          </blockquote>
          <div className="flex flex-wrap justify-between gap-3">
            <button
              onClick={() => setRound((value) => value - 1)}
              disabled={round === 0}
              className="tool-secondary-button"
            >
              Previous example
            </button>
            {round < script.length - 1 ? (
              <button
                onClick={() => setRound((value) => value + 1)}
                className="tool-primary-button"
              >
                Next example{" "}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={onBack} className="tool-primary-button">
                Done · Back to models
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-fg-secondary">
          No scripted example is available for this model yet. Its profile is
          available below.
        </p>
      )}
    </div>
  );
}

export function ModelTinder() {
  const [index, setIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [view, setView] = useState<"profiles" | "shortlist">("profiles");
  const [example, setExample] = useState<Model | null>(null);
  const model = MODELS[index];
  const saved = MODELS.filter((entry) => savedIds.includes(entry.id));
  const isSaved = savedIds.includes(model.id);

  function advance(save: boolean) {
    if (save)
      setSavedIds((ids) => (ids.includes(model.id) ? ids : [...ids, model.id]));
    if (index < MODELS.length - 1) setIndex((value) => value + 1);
    else setView("shortlist");
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border-strong bg-bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-5 py-4">
        <div>
          <h3 className="font-mono text-sm font-semibold">
            Model Personalities
          </h3>
          <p className="mt-1 text-xs text-fg-secondary">
            Explore the profiles. Keep the models that fit your work.
          </p>
        </div>
        <button
          className="tool-secondary-button"
          aria-pressed={view === "shortlist"}
          onClick={() => {
            setExample(null);
            setView(view === "profiles" ? "shortlist" : "profiles");
          }}
        >
          {view === "shortlist"
            ? "Browse profiles"
            : `View shortlist (${saved.length})`}
        </button>
      </div>
      {example ? (
        <ScriptedExample
          key={example.id}
          model={example}
          onBack={() => setExample(null)}
        />
      ) : view === "shortlist" ? (
        <div className="space-y-5 p-5 sm:p-6">
          <h4 className="text-xl font-semibold" aria-live="polite">
            {saved.length
              ? `Your shortlist · ${saved.length} saved`
              : "Your shortlist is empty"}
          </h4>
          <p className="text-sm text-fg-secondary">
            {saved.length
              ? "Every model you saved is here. Try the same task with your candidates and compare the results."
              : "Browse the profiles and save a model you would like to try."}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {saved.map((entry) => (
              <article
                key={entry.id}
                className="rounded-lg border border-border-default bg-bg-page p-4"
              >
                <h5 className="font-semibold">
                  {entry.emoji} {entry.name}
                </h5>
                <p className="mt-2 text-sm text-fg-secondary">
                  {entry.bestFor}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="text-link"
                    onClick={() => setExample(entry)}
                  >
                    Explore example
                  </button>
                  <button
                    className="text-link"
                    aria-label={`Remove ${entry.name}`}
                    onClick={() =>
                      setSavedIds((ids) => ids.filter((id) => id !== entry.id))
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="tool-secondary-button"
              onClick={() => setView("profiles")}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Browse
              profiles
            </button>
            {saved.length > 0 && (
              <CopyButton
                label="Copy shortlist"
                accentColor="emerald"
                getText={() =>
                  [
                    "# My model shortlist",
                    "",
                    ...saved.map(
                      (entry) => `- ${entry.name}: ${entry.bestFor}`,
                    ),
                    "",
                    "Based on editorial profiles. Validate with a representative task.",
                  ].join("\n")
                }
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex min-w-0 flex-1 flex-col gap-2 text-xs text-fg-secondary">
              Jump to a model
              <select
                aria-label="Jump to a model"
                className="w-full rounded-md border border-border-strong bg-bg-page p-2 text-sm text-fg-primary"
                value={model.id}
                onChange={(event) =>
                  setIndex(
                    MODELS.findIndex(
                      (entry) => entry.id === event.target.value,
                    ),
                  )
                }
              >
                {MODELS.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <span className="font-mono text-xs text-fg-muted" role="status">
              {index + 1} / {MODELS.length}
            </span>
          </div>
          <article className="personality-profile">
            <div
              className={`personality-art bg-linear-to-br ${model.gradientFrom} ${model.gradientTo}`}
              aria-hidden="true"
            >
              {model.emoji}
            </div>
            <div className="min-w-0 space-y-4 p-5">
              <div>
                <h4 className="text-xl font-semibold">{model.name}</h4>
                <p className="mt-1 text-sm text-fg-secondary">
                  {model.tagline}
                </p>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm text-fg-secondary">
                {model.traits.map((trait) => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Best for</p>
                  <p className="mt-2 text-sm text-fg-secondary">
                    {model.bestFor}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">Less suited to</p>
                  <p className="mt-2 text-sm text-fg-secondary">
                    {model.worstFor}
                  </p>
                </div>
              </div>
              <button className="text-link" onClick={() => setExample(model)}>
                Explore a scripted example{" "}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </article>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              className="tool-secondary-button"
              onClick={() => setIndex((value) => value - 1)}
              disabled={index === 0}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Previous
            </button>
            <div className="flex flex-wrap gap-3">
              <button
                className="tool-secondary-button"
                onClick={() => advance(false)}
              >
                <X aria-hidden="true" className="h-4 w-4" /> Skip
              </button>
              <button
                className="tool-primary-button"
                onClick={() => advance(true)}
              >
                <Heart aria-hidden="true" className="h-4 w-4" />{" "}
                {isSaved ? "Saved · Next" : "Save & next"}
              </button>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-fg-muted">
            Profiles are editorial impressions. Use Model Picker for task-based
            suggestions. Your shortlist stays here while you use this page; copy
            it to keep it.
          </p>
        </div>
      )}
    </div>
  );
}
