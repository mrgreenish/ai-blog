import Link from "next/link";
import { ArrowRight, Compass, Calculator, Beaker, Terminal } from "lucide-react";
import { CATEGORY_META } from "@/lib/types";

const SECTION_ARTICLES = {
  models: 4,
  workflows: 8,
  tooling: 7,
};

const JOURNEY = [
  {
    step: 1,
    cat: "models" as const,
    tagline: "Which model for what? I tested them so you don't have to.",
  },
  {
    step: 2,
    cat: "workflows" as const,
    tagline: "From spec to PR, avoiding doom spirals — flows that actually work.",
  },
  {
    step: 3,
    cat: "tooling" as const,
    tagline: "Cursor, Claude Code, MCP — how to configure everything.",
  },
];

const FEATURED_TOOLS = [
  { icon: Compass, name: "Model Picker" },
  { icon: Calculator, name: "Cost Calculator" },
  { icon: Beaker, name: "Prompt Lab" },
  { icon: Terminal, name: "Config Generator" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">

      {/* Intro */}
      <section className="mb-20 max-w-3xl">
        <div className="mb-4 font-mono text-sm text-zinc-500">
          developer field notes
        </div>
        <h1 className="text-4xl font-bold leading-tight text-zinc-50 sm:text-5xl">
          Working With AI as a Developer
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-zinc-400">
          <p>
            Over the past year I&apos;ve been using AI inside real projects — not as a
            toy, but inside specs, tickets and production code.
          </p>
          <p>
            I started experimenting out of curiosity. Very quickly it turned into
            testing what actually works, what doesn&apos;t, and what fails in subtle
            ways you only notice later.
          </p>
          <p className="text-zinc-300">
            This isn&apos;t theory. It&apos;s just what I&apos;ve learned while building.
          </p>
        </div>

        <h2 className="mt-12 text-lg font-semibold text-zinc-200">
          The vibe
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-400">
          <p>
            If you squint, this whole era feels like the early internet — the
            1980s kind. Everyone experimenting. Nothing standardised. Half the
            tools built in a weekend. That same sense that the ground is shifting
            and anyone paying attention could end up ahead.
          </p>
          <p>
            But faster. Wildly faster. And with a frequency the early internet
            never had — a low, persistent hum
            of <span className="italic text-zinc-300">are we building something
            we don&apos;t fully control?</span>
          </p>
          <p>
            Excitement and unease in the same breath. That&apos;s the backdrop.
            And honestly, it makes the work more interesting, not less.
          </p>
        </div>

        <h2 className="mt-12 text-lg font-semibold text-zinc-200">
          The main question
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-400">
          <p className="text-zinc-300 italic">
            Which model should I use for this task?
          </p>
          <p>
            That question matters more than most people think.
          </p>
          <p>
            Models behave differently. Some are structured but stiff. Some are
            creative but drift. Some reason deeply. Others are fast but shallow.
          </p>
          <p>
            Picking the right one changes the whole workflow.
          </p>
        </div>

        <h2 className="mt-12 text-lg font-semibold text-zinc-200">
          And it keeps changing
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-400">
          <p>
            The tricky part is that everything moves fast.
          </p>
          <p>
            New versions drop. Context windows grow. Behaviour shifts. Guardrails
            change. What worked a few months ago can feel different today.
          </p>
          <p>
            So model choice isn&apos;t a one-time decision. It&apos;s constant
            recalibration.
          </p>
        </div>

        <h2 className="mt-12 text-lg font-semibold text-zinc-200">
          Staying in control
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-400">
          <p>
            When models drift away from the original plan or start inventing
            structure, you need ways to pull them back.
          </p>
          <p>
            Reviewing and steering output is part of the job.
          </p>
        </div>

        <h2 className="mt-12 text-lg font-semibold text-zinc-200">
          From experiments to workflows
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-400">
          <p>
            I&apos;ve been building small repeatable workflows — from spec to
            implementation — so AI supports focus instead of creating noise.
          </p>
          <p className="text-zinc-300">
            That&apos;s what this is about.
          </p>
        </div>
      </section>

      {/* Journey */}
      <section className="mb-20">
        <p className="mb-8 text-sm text-zinc-500">
          Here&apos;s how most people move through it:
        </p>

        <div className="flex flex-col gap-0">
          {JOURNEY.map(({ step, cat, tagline }, i) => {
            const meta = CATEGORY_META[cat];
            const count = SECTION_ARTICLES[cat];
            const isLast = i === JOURNEY.length - 1;

            return (
              <div key={cat} className="flex gap-5">
                {/* Step indicator + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-mono font-bold ${meta.accentBg} ${meta.accent}`}
                  >
                    {step}
                  </div>
                  {!isLast && (
                    <div className="mt-1 w-px flex-1 bg-zinc-800" style={{ minHeight: "2rem" }} />
                  )}
                </div>

                {/* Card */}
                <div className={`${isLast ? "mb-0" : "mb-4"} flex-1`}>
                  <Link
                    href={`/${cat}`}
                    className="group flex items-start justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
                  >
                    <div>
                      <h2 className={`font-mono text-base font-bold ${meta.accent}`}>
                        {meta.label}
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                        {tagline}
                      </p>
                      <p className="mt-3 font-mono text-xs text-zinc-600">
                        {count} articles
                      </p>
                    </div>
                    <ArrowRight className="ml-4 mt-0.5 h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive tools callout */}
      <section className="mb-20 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-sm font-semibold text-zinc-300">
          Every article ships with at least one interactive tool.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
          Model pickers, cost calculators, prompt labs, workflow recipes — built to stay
          useful as things change, not just read once and forget.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FEATURED_TOOLS.map(({ icon: Icon, name }) => (
            <span
              key={name}
              className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
            >
              <Icon className="h-3 w-3" />
              {name}
            </span>
          ))}
          <span className="flex items-center rounded-md border border-zinc-800 px-2.5 py-1 text-xs text-zinc-600">
            +6 more
          </span>
        </div>
      </section>

      {/* CTA */}
      <section>
        <Link
          href="/models"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition-colors"
        >
          Start with Models
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs text-zinc-600">
          Or jump straight to{" "}
          <Link href="/workflows" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">
            Workflows
          </Link>{" "}
          or{" "}
          <Link href="/tooling" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">
            Tooling
          </Link>
          .
        </p>
      </section>

    </div>
  );
}
