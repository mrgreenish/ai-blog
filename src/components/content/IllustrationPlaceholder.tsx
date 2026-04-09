interface IllustrationPlaceholderProps {
  description: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "3:2";
  caption?: string;
  type?: "diagram" | "infographic" | "screenshot" | "sequence";
}

const ASPECT_CLASSES: Record<string, string> = {
  "16:9": "aspect-video",
  "4:3":  "aspect-[4/3]",
  "1:1":  "aspect-square",
  "3:2":  "aspect-[3/2]",
};

export function IllustrationPlaceholder({
  description,
  aspectRatio = "16:9",
  caption,
  type = "diagram",
}: IllustrationPlaceholderProps) {
  return (
    <figure className="my-10 not-prose">
      <div
        className={`${ASPECT_CLASSES[aspectRatio]} w-full border border-dashed border-border-strong rounded-sm flex flex-col items-center justify-center gap-3 bg-bg-surface`}
      >
        {/* Image icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-fg-placeholder"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div className="px-8 text-center max-w-md">
          <p className="font-mono text-xs text-fg-placeholder uppercase tracking-widest mb-2">
            {type}
          </p>
          <p className="font-sans text-sm text-fg-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="figure-caption mt-3">{caption}</figcaption>
      )}
    </figure>
  );
}
