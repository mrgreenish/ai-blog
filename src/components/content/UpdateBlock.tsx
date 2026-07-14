import { AlertTriangle } from "lucide-react";

export function UpdateBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-red-400/40 bg-red-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
        <div className="text-sm leading-relaxed text-red-950">{children}</div>
      </div>
    </div>
  );
}
