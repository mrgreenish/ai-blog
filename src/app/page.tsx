import type { Metadata } from "next";
import Link from "next/link";
import { START_TASKS } from "@/lib/discovery";
import { TableOfContents } from "@/components/content/TableOfContents";
import { WorkshopHero } from "@/components/interactive/WorkshopHero";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { getAllChapters, getNewsEntries } from "@/lib/content";
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Working With AI as a Developer",
  description:
    "Field notes on shipping with AI — models, workflows, and tooling. What actually works in production, kept up to date as the space moves.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Working With AI as a Developer | AI Field Notes",
    description:
      "Field notes on shipping with AI — models, workflows, and tooling. What actually works in production, kept up to date as the space moves.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Working With AI as a Developer | AI Field Notes",
    description:
      "Field notes on shipping with AI — models, workflows, and tooling.",
  },
};

export default function Home() {
  const chapters = getAllChapters();
  const news = getNewsEntries().slice(0, 3);
  return (
    <div className="home-page">
      <section className="site-shell hero-section" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Field notes for the AI era
          </p>
          <h1 id="home-title">
            Working
            <br />{" "}
            with <span className="hero-ai">AI</span>
            <span className="hero-title-last"> as a developer.</span>
          </h1>
          <p className="hero-description">
            Field notes on shipping with AI — models, workflows, and tooling.
            What actually works in production, kept up to date as the space
            moves.
          </p>
          <div className="hero-actions">
            <Link className="action-link action-primary" href="/guides">
              Explore the guides <Arrow />
            </Link>
            <Link className="text-link" href="/tools/ai-coding-workflow">
              Find your workflow <Arrow diagonal />
            </Link>
          </div>
          <div className="hero-byline">
            <span className="author-monogram" aria-hidden="true">
              fv.
            </span>
            <p>
              From the desk of <a href={AUTHOR_URL}>{AUTHOR_NAME}</a>
              <span>Built on real projects. Open to new ideas.</span>
            </p>
          </div>
        </div>
        <WorkshopHero />
        <div className="hero-bottom">
          <span>A living reference, not a finished book.</span>
          <a href="#start-task">
            Find your starting point <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="task-section" aria-labelledby="start-task">
        <div className="site-shell">
          <div className="section-heading">
            <p className="eyebrow">01 / Start here</p>
            <h2 id="start-task">What are you working on?</h2>
            <span className="section-aside">A useful place to begin.</span>
          </div>
          <ul className="task-grid">
            {START_TASKS.map((task, index) => (
              <li key={task.slug}>
                <Link className="task-link" href={`/chapters/${task.slug}`}>
                  <div className="task-top">
                    <span className="task-symbol" aria-hidden="true">
                      {["↗", "⌁", "±", "⌘"][index]}
                    </span>
                    <Arrow diagonal />
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span className="task-index">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="site-shell">
        <Reveal>
          <section
            className="featured-workflow"
            aria-labelledby="workflow-title"
          >
            <div className="workflow-intro">
              <p className="eyebrow">From idea to pull request</p>
              <h2 id="workflow-title">
                A better workflow.
                <br />
                <span>Already mapped out.</span>
              </h2>
              <p>
                Choose a task. Get the steps, prompts, and guardrails to take it
                into your own codebase.
              </p>
              <Link
                href="/tools/ai-coding-workflow"
                className="action-link action-primary"
              >
                Find and copy a workflow <Arrow />
              </Link>
              <span className="micro-note">
                Free to use. No account or API key.
              </span>
            </div>
            <div
              className="workflow-diagram"
              aria-label="Workflow: spec, plan, code, review"
            >
              <div className="diagram-topline">
                <span>WORKFLOW / SPEC TO PR</span>
                <span>4 STAGES</span>
              </div>
              {[
                {
                  name: "Define the intent",
                  file: "spec.md",
                  tag: "01 / SPEC",
                },
                {
                  name: "Make a small plan",
                  file: "plan.md",
                  tag: "02 / PLAN",
                },
                {
                  name: "Build with context",
                  file: "feature.tsx",
                  tag: "03 / CODE",
                },
                {
                  name: "Prove it works",
                  file: "feature.test.tsx",
                  tag: "04 / REVIEW",
                },
              ].map((step, i) => (
                <div
                  key={step.tag}
                  className={`diagram-step diagram-step-${i}`}
                >
                  <span className="diagram-node" aria-hidden="true">
                    {i === 3 ? "✓" : ""}
                  </span>
                  <div>
                    <span>{step.tag}</span>
                    <p>{step.name}</p>
                  </div>
                  <code>{step.file}</code>
                </div>
              ))}
              <div className="diagram-bottomline">
                <span className="status-dot" /> Ready for a human review{" "}
                <span>↗</span>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="latest-section" aria-labelledby="latest-title">
            <div className="section-heading">
              <p className="eyebrow">02 / In the field</p>
              <h2 id="latest-title">The latest signals.</h2>
              <Link
                className="text-link section-aside"
                href="/chapters/what-is-happening"
              >
                All updates <Arrow />
              </Link>
            </div>
            <div className="latest-grid">
              {news.map((entry, index) => (
                <Link
                  href={`/chapters/what-is-happening/${entry.slug}`}
                  key={entry.slug}
                  className="latest-entry"
                >
                  <div className="latest-meta">
                    <time dateTime={entry.frontmatter.publishedAt}>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(entry.frontmatter.publishedAt))}
                    </time>
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{entry.frontmatter.title}</h3>
                  <span className="latest-read">
                    Read field note <Arrow diagonal />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        <section className="library-section" aria-labelledby="library-title">
          <div className="section-heading">
            <p className="eyebrow">03 / The reference</p>
            <h2 id="library-title">
              Less guessing.
              <br />
              <span className="serif-italic">More understanding.</span>
            </h2>
            <div className="section-aside">
              <p>
                {chapters.length} chapters. Read in order, or follow your
                curiosity.
              </p>
              <Link className="text-link" href="/guides">
                Browse guides by task <Arrow />
              </Link>
            </div>
          </div>
          <TableOfContents />
        </section>

        <Reveal>
          <section className="author-note" aria-labelledby="author-note-title">
            <p className="eyebrow">A note from Filip</p>
            <div>
              <h2 id="author-note-title">
                The useful stuff deserves
                <br />
                to be written down.
              </h2>
              <p>
                Over the past year I’ve been using AI inside real projects —
                specs, tickets, production code. What started as curiosity
                turned into a set of habits I now run every day.
              </p>
              <p>
                This site is the distilled version of what I’ve learned: which
                models for which tasks, how to build workflows that don’t
                spiral, and how to configure the tooling without fighting it.
              </p>
              <a className="text-link" href={AUTHOR_URL}>
                {AUTHOR_NAME} <Arrow diagonal />
              </a>
            </div>
            <span className="author-signature" aria-hidden="true">
              fv.
            </span>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
