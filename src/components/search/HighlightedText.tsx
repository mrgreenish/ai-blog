"use client";

type RangeTuple = [number, number];

/**
 * Render text with <mark> around matched ranges. Ranges must be sorted and non-overlapping.
 */
export function HighlightedText({
  text,
  indices,
}: {
  text: string;
  indices: ReadonlyArray<RangeTuple>;
}) {
  if (!indices?.length) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const [start, end] of indices) {
    if (start > lastEnd) {
      parts.push(text.slice(lastEnd, start));
    }
    parts.push(
      <mark
        key={`${start}-${end}`}
        className="rounded bg-blue-500/20 text-fg-primary"
      >
        {text.slice(start, end + 1)}
      </mark>
    );
    lastEnd = end + 1;
  }
  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd));
  }

  return <>{parts}</>;
}
