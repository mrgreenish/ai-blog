import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "blue" | "emerald" | "violet" | "none";
  as?: "div" | "article" | "section";
}

export function GlassCard({
  children,
  className = "",
  hover = false,
  glow = "none",
  as: Tag = "div",
}: GlassCardProps) {
  const glowClass = {
    blue:    "glow-blue",
    emerald: "glow-emerald",
    violet:  "glow-violet",
    none:    "",
  }[glow];

  const hoverGlowClass = {
    blue:    "glow-blue-hover",
    emerald: "glow-emerald-hover",
    violet:  "glow-violet-hover",
    none:    "",
  }[glow];

  return (
    <Tag
      className={`glass-card rounded-2xl ${hover ? `glass-card-hover ${hoverGlowClass}` : ""} ${glowClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
