import Link from "next/link";
import { getChapter } from "@/lib/content";
import { GUIDE_GROUPS, discoveryMetadata } from "@/lib/discovery";
import { Arrow } from "@/components/ui/Arrow";

export const metadata = discoveryMetadata("/guides");
export default function GuidesPage() {
  return (
    <div className="site-shell discovery-page">
      <header className="page-heading">
        <p className="eyebrow">
          <span className="status-dot" />
          The working reference
        </p>
        <h1>AI Coding Guides</h1>
        <p className="editorial-lead">
          Start with the job in front of you. Each guide gives you a workflow
          you can apply to your own codebase.
        </p>
        <p className="page-support">
          Prefer a reading sequence?{" "}
          <Link href="/#contents">Browse all chapters in order</Link>. For
          recent developments, read{" "}
          <Link href="/chapters/what-is-happening">Updates</Link>.
        </p>
        <nav className="page-tabs" aria-label="Guide categories">
          {GUIDE_GROUPS.map((group, index) => (
            <a href={`#guide-group-${index}`} key={group.title}>
              {group.title} ↘
            </a>
          ))}
        </nav>
      </header>
      {GUIDE_GROUPS.map((group, index) => (
        <section
          id={`guide-group-${index}`}
          className="guide-group"
          key={group.title}
        >
          <div className="guide-group-heading">
            <p className="eyebrow">
              0{index + 1} / {group.slugs.length} guides
            </p>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
          </div>
          <ul className="guide-group-list">
            {group.slugs.map((slug) => {
              const chapter = getChapter(slug)!;
              return (
                <li key={slug}>
                  <Link className="directory-entry" href={`/chapters/${slug}`}>
                    <span className="entry-number">
                      {String(chapter.frontmatter.chapter).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-medium">
                        {chapter.frontmatter.title}
                      </h3>
                      <p>{chapter.frontmatter.subtitle}</p>
                    </div>
                    <Arrow diagonal />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <Link
        className="action-link action-primary"
        href="/tools/ai-coding-workflow"
      >
        Need help choosing? Try the workflow finder <Arrow />
      </Link>
    </div>
  );
}
