import Link from "next/link";
import { getChapter } from "@/lib/content";
import { GUIDE_GROUPS, discoveryMetadata } from "@/lib/discovery";

export const metadata = discoveryMetadata("/guides");

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-6">AI Coding Guides</h1>
      <p className="editorial-lead mb-8">Start with the job in front of you. Each guide gives you a workflow you can apply to your own codebase.</p>
      <p className="text-sm text-fg-muted mb-12">Prefer a reading sequence? <Link className="underline" href="/#contents">Browse all chapters in order</Link>. For recent developments, read <Link className="underline" href="/chapters/what-is-happening">Updates</Link>.</p>
      {GUIDE_GROUPS.map((group) => (
        <section key={group.title} className="mb-12">
          <h2 className="font-sans text-2xl font-semibold mb-2">{group.title}</h2>
          <p className="text-sm text-fg-muted mb-4">{group.description}</p>
          <ul>
            {group.slugs.map((slug) => {
              const chapter = getChapter(slug)!;
              return <li key={slug}><Link className="group block py-4 border-b border-border-default" href={`/chapters/${slug}`}><span className="block font-medium group-hover:underline">{chapter.frontmatter.title}</span><span className="block text-sm text-fg-muted mt-1">{chapter.frontmatter.subtitle}</span></Link></li>;
            })}
          </ul>
        </section>
      ))}
      <Link className="underline" href="/tools/ai-coding-workflow">Need help choosing? Try the workflow finder →</Link>
    </div>
  );
}
