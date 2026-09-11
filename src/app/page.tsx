import type { Metadata } from "next";
import Link from "next/link";
import { START_TASKS } from "@/lib/discovery";
import { TableOfContents } from "@/components/content/TableOfContents";
import { Brain3D } from "@/components/interactive/Brain3D";

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
  return (
    <div className="relative">
      {/*
        Hero: a restrained particle animation sits behind the introduction
        as a small visual accent. The chapter list below keeps a clean
        background so it stays easy to read.
      */}
      <Brain3D>
        <div className="mx-auto max-w-4xl px-6 pt-16">
          {/* Title block */}
          <div className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-muted mb-6">
              A developer&apos;s reference
            </p>
            <h1 className="font-sans text-5xl font-semibold tracking-tight text-fg-primary leading-tight mb-6">
              Working With AI
              <br />
              as a Developer
            </h1>
            <p className="editorial-lead max-w-xl">
              Field notes on shipping with AI — models, workflows, and tooling.
              What actually works in production, kept up to date as the space moves.
            </p>
          </div>

          <section aria-labelledby="start-task" className="mb-12">
            <h2 id="start-task" className="font-sans text-2xl font-semibold mb-4">What are you working on?</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {START_TASKS.map((task) => <li key={task.slug}><Link href={`/chapters/${task.slug}`} className="block border border-border-default p-4 hover:border-border-strong"><span className="block font-semibold">{task.title} →</span><span className="block text-sm text-fg-muted mt-2">{task.description}</span></Link></li>)}
            </ul>
            <p className="mt-6 text-sm"><Link className="underline" href="/tools/ai-coding-workflow">Find and copy an AI coding workflow</Link><span aria-hidden="true"> · </span><Link className="underline" href="/guides">Browse guides by task</Link></p>
          </section>
          <div className="section-divider mb-6" />

          <div className="mb-16 max-w-xl">
            <p className="font-sans text-sm leading-relaxed text-fg-muted">
              Over the past year I&apos;ve been using AI inside real projects — specs,
              tickets, production code. What started as curiosity turned into a set
              of habits I now run every day. This site is the distilled version of
              what I&apos;ve learned: which models for which tasks, how to build
              workflows that don&apos;t spiral, and how to configure the tooling
              without fighting it.
            </p>
            <p className="font-sans text-sm leading-relaxed text-fg-muted mt-4">
              It&apos;s not theory. The guides combine project experience with worked examples.
              Use the workflow finder to choose a starting point, then adapt the
              prompts and checks to your own codebase.
            </p>
          </div>

          <div className="section-divider" />

          {/* A compact pause before the chapter list begins. */}
          <div className="brain3d-hero" aria-hidden="true" />
        </div>
      </Brain3D>

      {/* Table of Contents — clean background, no visualization behind it */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <TableOfContents />

      </div>
    </div>
  );
}
