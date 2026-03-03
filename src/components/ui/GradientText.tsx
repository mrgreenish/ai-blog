import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  variant?: "default" | "hero" | "blue" | "emerald" | "violet";
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export function GradientText({
  children,
  variant = "default",
  className = "",
  as: Tag = "span",
}: GradientTextProps) {
  const variantClass = {
    default: "gradient-text",
    hero:    "gradient-text-hero",
    blue:    "gradient-text-blue",
    emerald: "gradient-text-emerald",
    violet:  "gradient-text-violet",
  }[variant];

  return (
    <Tag className={`${variantClass} ${className}`}>
      {children}
    </Tag>
  );
}
