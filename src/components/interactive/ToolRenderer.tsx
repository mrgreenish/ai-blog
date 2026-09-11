"use client";

import dynamic from "next/dynamic";
import type { ToolId } from "@/lib/toolCatalog";

const loading = () => (
  <p role="status" className="tool-loading">
    Loading tool…
  </p>
);
// Keep useId-based controls in a single client render tree across lazy boundaries.
// Page titles, instructions, and companion links are still rendered on the server.
const components = {
  "model-picker": dynamic(
    () => import("./ModelPicker").then((m) => m.ModelPicker),
    { loading, ssr: false },
  ),
  "model-tinder": dynamic(
    () => import("./ModelTinder").then((m) => m.ModelTinder),
    { loading, ssr: false },
  ),
  "model-compare": dynamic(
    () => import("./ModelCompare").then((m) => m.ModelCompare),
    { loading, ssr: false },
  ),
  "cost-calculator": dynamic(
    () => import("./CostCalculator").then((m) => m.CostCalculator),
    { loading, ssr: false },
  ),
  "model-mixer": dynamic(
    () => import("./ModelMixer").then((m) => m.ModelMixer),
    { loading, ssr: false },
  ),
  "max-mode-viz": dynamic(
    () => import("./MaxModeViz").then((m) => m.MaxModeViz),
    { loading, ssr: false },
  ),
  "scenario-lab": dynamic(
    () => import("./ScenarioLab").then((m) => m.ScenarioLab),
    { loading, ssr: false },
  ),
  "failure-gallery": dynamic(
    () => import("./FailureGallery").then((m) => m.FailureGallery),
    { loading, ssr: false },
  ),
  "config-generator": dynamic(
    () => import("./ConfigGenerator").then((m) => m.ConfigGenerator),
    { loading, ssr: false },
  ),
};

export function ToolRenderer({ id }: { id: ToolId }) {
  const Component = components[id];
  return <Component />;
}
