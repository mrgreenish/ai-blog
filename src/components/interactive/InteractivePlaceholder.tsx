import { type LucideIcon, FlaskConical } from "lucide-react";

interface InteractivePlaceholderProps {
  icon?: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  preview: React.ReactNode;
  accentColor?: string;
  borderColor?: string;
}

export function InteractivePlaceholder({
  icon: Icon = FlaskConical,
  title,
  tagline,
  description,
  preview,
  accentColor = "text-blue-400",
  borderColor = "border-blue-400/30",
}: InteractivePlaceholderProps) {
  return (
    <div
      className={`my-8 rounded-xl border ${borderColor} bg-zinc-900/60 overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg bg-zinc-800 p-2 ${accentColor}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-mono text-sm font-semibold ${accentColor}`}>
                {title}
              </h3>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-500">
                coming soon
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">{tagline}</p>
          </div>
        </div>
      </div>

      {/* Static preview mockup */}
      <div className="px-5 py-4">
        <p className="mb-4 text-sm text-zinc-400">{description}</p>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 opacity-60 pointer-events-none select-none">
          {preview}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-800 bg-zinc-900/40 px-5 py-3">
        <p className="text-xs text-zinc-600">
          This tool is being built based on real usage patterns.{" "}
          <span className={`${accentColor} font-medium`}>
            Check back as the blog evolves.
          </span>
        </p>
      </div>
    </div>
  );
}
