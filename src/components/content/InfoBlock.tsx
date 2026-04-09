import { Info } from "lucide-react";

export function InfoBlock({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border-default bg-bg-surface p-4">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-fg-muted" />
        <div>
          {title && <p className="mb-2 font-semibold text-fg-primary">{title}</p>}
          <div className="text-sm leading-relaxed text-fg-secondary">{children}</div>
        </div>
      </div>
    </div>
  );
}
