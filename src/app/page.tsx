import type { Metadata } from "next";
import { TableOfContents } from "@/components/content/TableOfContents";
import { DotField } from "@/components/interactive/DotField";
import { ASCIIBrain } from "@/components/interactive/ASCIIBrain";

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
      <DotField className="absolute inset-x-0 top-0 h-[600px] z-0" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <header className="relative mb-16 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.75fr)] lg:gap-12">
          <div className="relative z-10">
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

          <section
            aria-hidden="true"
            className="hero-brain pointer-events-none relative z-0 h-44 overflow-visible border-y border-border-subtle opacity-60 sm:h-56 lg:h-72 lg:translate-y-14"
          >
            <ASCIIBrain className="absolute inset-0 pointer-events-none" />
          </section>
        </header>

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

        {/* Table of Contents */}
        <TableOfContents />

      </div>
    </div>
  );
}
