# Chapter authoring notes

## `18-what-is-happening.mdx` — feed landing page

Do not add news sections directly to `18-what-is-happening.mdx`. It is the stable landing page for the feed. Individual dated entries live in `content/news/*.mdx`, appear on the landing page, and render at `/chapters/what-is-happening/<entry-slug>`.

Each entry must include:

- `title`
- `publishedAt`
- `lastVerifiedAt`
- `primarySourceUrl`

Entries are sorted by `publishedAt` descending, then by filename for same-day ties. The entry route renders the title and verification line from frontmatter, so do not repeat them in the MDX body. Also bump the landing chapter's `updatedAt` when adding or materially updating an entry.
