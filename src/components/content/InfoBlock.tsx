import { Info } from "lucide-react";

export function InfoBlock({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-blue-500/20 bg-blue-950/20 p-4">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
        <div>
          {title && <p className="mb-2 font-semibold text-blue-300">{title}</p>}
          <div className="text-sm leading-relaxed text-zinc-300">{children}</div>
        </div>
      </div>
    </div>
  );
}
