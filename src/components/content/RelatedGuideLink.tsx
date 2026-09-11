"use client";
import Link from "next/link";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

export function RelatedGuideLink({ sourceSlug, targetSlug, children }: { sourceSlug: string; targetSlug: string; children: React.ReactNode }) {
  return <Link className="underline underline-offset-4" href={`/chapters/${targetSlug}`} onClick={() => trackGrowthEvent("related_guide_click", { source: sourceSlug, target: targetSlug })}>{children}</Link>;
}
