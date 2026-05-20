import type { Metadata } from "next";
import Link from "next/link";
import { SITE_LOCALE, SITE_NAME } from "@/lib/siteConfig";
import { GuidelinesDocument } from "./_components/GuidelinesDocument";
import { GUIDELINES_INTRO } from "./guidelinesContent";

const pageTitle = "AI Model Guidelines";
const pageDescription =
  "Opinionated guidelines for picking the right AI model, reasoning effort, and mode for different software tasks.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/ai-model-guidelines",
  },
  openGraph: {
    type: "article",
    siteName: SITE_NAME,
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
    url: "/ai-model-guidelines",
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${SITE_NAME}`,
    description: pageDescription,
  },
};

export default function AiModelGuidelinesPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder mb-4">
          Working note
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-fg-primary leading-tight mb-4">
          {pageTitle}
        </h1>
        <p className="editorial-lead max-w-xl">{GUIDELINES_INTRO.title}</p>
        <p className="mt-4 text-sm text-fg-muted">
          <Link href="/ai-model-guidelines/export" className="underline">
            Copy HTML for SharePoint
          </Link>
          {" · "}
          Prices and model names from{" "}
          <code className="text-xs">modelSpecs.ts</code>
        </p>
      </header>

      <div className="section-divider mb-12" />

      <GuidelinesDocument variant="blog" />
    </article>
  );
}
