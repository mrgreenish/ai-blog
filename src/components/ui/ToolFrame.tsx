"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function ToolFrame({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div id={`tool-${id}`} className="tool-anchor">
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </div>
  );
}
