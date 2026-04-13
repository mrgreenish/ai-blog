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

        <div className="section-divider mb-16" />

        {/* ASCII brain transition — animated visualization inline in the intro */}
        <section className="relative mb-16 min-h-[520px]">
          <ASCIIBrain className="absolute inset-0 z-0" />
        </section>

        {/* Table of Contents */}
        <TableOfContents />
      </div>
    </div>
  );
}
