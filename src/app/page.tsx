import type { Metadata } from "next";
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
        Hero: the top-of-page visual is a particle animation that assembles
        into a thinking brain and, as you scroll, morphs into a diagram of
        how an LLM works (a transformer forward pass). It's pinned behind
        the title and intro only — the chapter list below has a clean
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
              It&apos;s not theory. Every pattern here has been tested inside a real
              codebase, on real tickets, under real deadlines. Each chapter includes
              an interactive tool so you can apply it immediately.
            </p>
          </div>

          <div className="section-divider" />

          {/* Scroll room for the brain to morph into the forward-pass diagram */}
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
