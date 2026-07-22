import Link from "next/link";
import type { NewsEntry } from "@/lib/types";

export function NewsFeedList({ entries }: { entries: NewsEntry[] }) {
  return (
    <section className="not-prose mt-12" aria-labelledby="news-feed-heading">
      <div className="section-divider mb-8" />
      <h2
        id="news-feed-heading"
        className="font-sans text-2xl font-semibold tracking-tight text-fg-primary mb-6"
      >
        Dated entries
      </h2>
      <div className="divide-y divide-border-default border-y border-border-default">
        {entries.map((entry) => (
          <article key={entry.slug} className="py-6">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder mb-2">
              {entry.frontmatter.publishedAt}
            </p>
            <Link
              href={`/chapters/what-is-happening/${entry.slug}`}
              className="group block"
            >
              <h3 className="font-sans text-lg font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
                {entry.frontmatter.title}
              </h3>
            </Link>
            <p className="font-sans text-xs text-fg-muted mt-2">
              Last verified {entry.frontmatter.lastVerifiedAt}
              {" · "}
              <a
                href={entry.frontmatter.primarySourceUrl}
                className="underline underline-offset-2 hover:text-fg-primary"
              >
                Primary source
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
