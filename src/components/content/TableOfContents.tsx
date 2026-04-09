import Link from "next/link";
import { getAllChapters } from "@/lib/content";
import { PART_META, type Part } from "@/lib/types";

function toRoman(n: number): string {
  return (["I", "II", "III", "IV", "V"] as const)[n - 1] ?? String(n);
}

export function TableOfContents() {
  const chapters = getAllChapters();
  const parts = (Object.keys(PART_META) as Part[]).sort(
    (a, b) => PART_META[a].number - PART_META[b].number
  );

  return (
    <div id="contents">
      {parts.map((partSlug) => {
        const part = PART_META[partSlug];
        const partChapters = chapters
          .filter((c) => c.frontmatter.part === partSlug)
          .sort((a, b) => a.frontmatter.chapter - b.frontmatter.chapter);

        if (partChapters.length === 0) return null;

        return (
          <div key={partSlug} className="mb-14">
            {/* Part header */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-xs text-fg-placeholder uppercase tracking-widest shrink-0">
                Part {toRoman(part.number)}
              </span>
              <h2 className="font-sans text-base font-semibold text-fg-primary">
                {part.label}
              </h2>
            </div>

            {/* Chapter list */}
            <div>
              {partChapters.map((chapter) => (
                <Link
                  key={chapter.slug}
                  href={`/chapters/${chapter.slug}`}
                  className="toc-entry group"
                >
                  <span className="font-mono text-sm text-fg-placeholder w-8 shrink-0">
                    {String(chapter.frontmatter.chapter).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-base font-medium text-fg-secondary group-hover:text-fg-primary transition-colors">
                      {chapter.frontmatter.title}
                    </span>
                    {chapter.frontmatter.subtitle && (
                      <span className="block font-sans text-sm text-fg-muted mt-0.5">
                        {chapter.frontmatter.subtitle}
                      </span>
                    )}
                  </div>
                  {chapter.frontmatter.interactiveTools?.length ? (
                    <span className="font-mono text-xs text-fg-placeholder shrink-0 hidden sm:block">
                      {chapter.frontmatter.interactiveTools.length} tool
                      {chapter.frontmatter.interactiveTools.length > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
