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
      className={`not-prose my-8 rounded-xl border ${borderColor} overflow-hidden bg-bg-surface`}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border-default"
        
      >
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg p-2 ${accentColor} bg-bg-elevated`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-mono text-sm font-semibold ${accentColor}`}>
                {title}
              </h3>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-xs text-fg-muted bg-bg-elevated"
                
              >
                coming soon
              </span>
            </div>
            <p className="mt-0.5 text-xs text-fg-muted">{tagline}</p>
          </div>
        </div>
      </div>

      {/* Static preview mockup */}
      <div className="px-5 py-4">
        <p className="mb-4 text-sm text-fg-secondary">{description}</p>
        <div
          className="rounded-lg p-4 opacity-60 pointer-events-none select-none bg-bg-elevated border border-border-default"
          
        >
          {preview}
        </div>
      </div>

      {/* CTA */}
      <div
        className="px-5 py-3 bg-bg-surface border-t border-border-default"
        
      >
        <p className="text-xs text-fg-muted">
          This tool is being built based on real usage patterns.{" "}
          <span className={`${accentColor} font-medium`}>
            Check back as the blog evolves.
          </span>
        </p>
      </div>
    </div>
  );
}
