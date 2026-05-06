# Chapter authoring notes

## `18-what-is-happening.mdx` — newest-first ordering

When adding a new entry to `18-what-is-happening.mdx`, insert it as the **first `##` section after the intro paragraphs**. Do not append to the bottom and do not sort by topic or alphabetically. The chapter is read as a feed: most recently added on top.

The intent is preserved with a comment at the top of the file:

```mdx
{/* New entries go at the TOP. Sections are ordered newest-added → oldest-added so recent items surface first. Do not insert in topical or alphabetical order. */}
```

Also bump `updatedAt` in the frontmatter to today's date when you add a section.
