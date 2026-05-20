import Image from "next/image";
import { REASONING_EFFORT_CAPTION } from "../guidelinesContent";

export function ReasoningEffortFigure() {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-lg border border-border-default bg-bg-surface">
        <Image
          src="/images/cursor-reasoning-effort.png"
          alt="Cursor model menu showing reasoning effort options: None, Low, Medium, High, and Extra High."
          width={631}
          height={481}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="figure-caption text-left">
        {REASONING_EFFORT_CAPTION}
      </figcaption>
    </figure>
  );
}
