import { track } from "@vercel/analytics";

type GrowthEvents = {
  workflow_completed: { result: string };
  recipe_copied: { recipe: string };
  related_guide_click: { source: string; target: string };
};

// Optional: enable after confirming custom-event support in Vercel Analytics.
// Callers pass only curated content IDs, never prompts or query strings.
export function trackGrowthEvent<K extends keyof GrowthEvents>(name: K, properties: GrowthEvents[K]) {
  if (process.env.NEXT_PUBLIC_GROWTH_EVENTS_ENABLED !== "true") return;
  try { track(name, properties); } catch { /* Analytics must not interrupt the workflow. */ }
}
