import { ImageResponse } from "next/og";
import { getNewsEntries, getNewsEntry } from "@/lib/content";

export const alt = "AI Field Notes — news article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getNewsEntries().map((entry) => ({ entrySlug: entry.slug }));
}

export default async function NewsEntryOgImage({
  params,
}: {
  params: Promise<{ entrySlug: string }>;
}) {
  const { entrySlug } = await params;
  const entry = getNewsEntry(entrySlug);

  if (!entry) {
    return new ImageResponse(<div>Not found</div>, { ...size });
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F5F3EC",
        padding: "64px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#244BFF",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#656B60",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ai field notes
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#244BFF",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          What Is Happening — {entry.frontmatter.publishedAt}
        </span>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#20231F",
            lineHeight: 1.06,
            margin: 0,
            maxWidth: "1040px",
          }}
        >
          {entry.frontmatter.title}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #DCDDD3",
          paddingTop: "24px",
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#656B60",
        }}
      >
        <span>Filip van Harreveld</span>
        <span>aifieldnotes.dev</span>
      </div>
    </div>,
    { ...size },
  );
}
