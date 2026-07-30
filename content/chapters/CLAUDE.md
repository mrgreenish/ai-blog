# Chapter authoring notes

## `18-what-is-happening.mdx` — feed landing page

Do not add news sections directly to `18-what-is-happening.mdx`. It is the stable landing page for the feed. Individual dated entries live in `content/news/*.mdx`, appear on the landing page, and render at `/chapters/what-is-happening/<entry-slug>`.

Each entry must include:

- `title`
- `publishedAt`
- `lastVerifiedAt`
- `primarySourceUrl`
- `indexable`

Entries are sorted by `publishedAt` descending, then by filename for same-day ties. The entry route renders the title and verification line from frontmatter, so do not repeat them in the MDX body. Also bump the landing chapter's `updatedAt` when adding or materially updating an entry.

Set `indexable: true` only for self-contained, primary-source-backed original
analysis that serves durable search intent. Brief reports remain public and in
RSS with `indexable: false`; the page uses `noindex,follow` and stays out of the
sitemap.
