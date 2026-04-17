import { ImageResponse } from "next/og";
import { getAllChapters, getChapter } from "@/lib/content";
import { PART_META } from "@/lib/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  const title = chapter?.frontmatter.title ?? "AI Field Notes";
  return [
    {
      contentType: "image/png",
      size,
      alt: `${title} — AI Field Notes`,
    },
  ];
}

export default async function ChapterOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) {
    return new ImageResponse(<div>Not found</div>, { ...size });
  }

  const { title, subtitle, chapter: chapterNumber, part } = chapter.frontmatter;
  const partMeta = PART_META[part];
  const chapterLabel = `Chapter ${String(chapterNumber).padStart(2, "0")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          padding: "64px",
        }}
      >
        {/* Top: site brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#60a5fa",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "18px",
              color: "#71717a",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ai field notes
          </span>
        </div>

        {/* Middle: chapter title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#60a5fa",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {chapterLabel} — {partMeta?.label ?? ""}
          </span>
          <h1
            style={{
              fontSize: "68px",
              fontWeight: 700,
              color: "#f4f4f5",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "20px",
              maxWidth: "1000px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#a1a1aa",
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Bottom: byline + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #27272a",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#71717a",
            }}
          >
            Filip van Harreveld
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#71717a",
            }}
          >
            aifieldnotes.dev
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
