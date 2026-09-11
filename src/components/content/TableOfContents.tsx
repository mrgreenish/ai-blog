import Link from "next/link";
import { getAllChapters } from "@/lib/content";
import { PART_META, type Part } from "@/lib/types";
import { Arrow } from "@/components/ui/Arrow";

export function TableOfContents() {
  const chapters = getAllChapters();
  const parts = (Object.keys(PART_META) as Part[]).sort(
    (a, b) => PART_META[a].number - PART_META[b].number,
  );
  return (
    <div id="contents" className="chapter-directory">
      {parts.map((partSlug) => {
        const part = PART_META[partSlug];
        const entries = chapters
          .filter((c) => c.frontmatter.part === partSlug)
          .sort((a, b) => a.frontmatter.chapter - b.frontmatter.chapter);
        if (!entries.length) return null;
        return (
          <section className="directory-group" key={partSlug}>
            <div className="directory-label">
              <span className="eyebrow">
                Part {String(part.number).padStart(2, "0")}
              </span>
              <h3>{part.label}</h3>
              <p>{part.description}</p>
            </div>
            <ul className="directory-entries">
              {entries.map((chapter) => (
                <li key={chapter.slug}>
                  <Link
                    href={`/chapters/${chapter.slug}`}
                    className="directory-entry"
                  >
                    <span className="entry-number">
                      {String(chapter.frontmatter.chapter).padStart(2, "0")}
                    </span>
                    <div>
                      <h4>{chapter.frontmatter.title}</h4>
                      <p>{chapter.frontmatter.subtitle}</p>
                    </div>
                    {chapter.frontmatter.interactiveTools?.length ? (
                      <span className="entry-tool-count">
                        {chapter.frontmatter.interactiveTools.length} tool
                        {chapter.frontmatter.interactiveTools.length > 1
                          ? "s"
                          : ""}
                      </span>
                    ) : null}
                    <Arrow diagonal />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
