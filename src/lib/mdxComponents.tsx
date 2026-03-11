// ---------------------------------------------------------------------------
// Shared MDX component registry — single source of truth for every JSX
// component available inside MDX articles. All three article page routes
// import from here so coverage stays in sync automatically.
//
// When you add a new interactive component:
//   1. Add the import below
//   2. Add it to MDX_COMPONENTS
//   3. Add its slug to InteractiveTool in src/lib/types.ts
//   4. The integrity suite will verify the mapping automatically
// ---------------------------------------------------------------------------

import { ModelPicker } from "@/components/interactive/ModelPicker";
import { ModelTinder } from "@/components/interactive/ModelTinder";
import { ModelMixer } from "@/components/interactive/ModelMixer";
import { ModelCompare } from "@/components/interactive/ModelCompare";
import { WorkflowRecipe } from "@/components/interactive/WorkflowRecipe";
import { ScenarioLab } from "@/components/interactive/ScenarioLab";
import { PromptLab } from "@/components/interactive/PromptLab";
import { FailureGallery } from "@/components/interactive/FailureGallery";
import { DevBenchmark } from "@/components/interactive/DevBenchmark";
import { ConfigGenerator } from "@/components/interactive/ConfigGenerator";
import { CostCalculator } from "@/components/interactive/CostCalculator";
import { MaxModeViz } from "@/components/interactive/MaxModeViz";
import { InfoBlock } from "@/components/content/InfoBlock";
import { PersonalFavorite } from "@/components/content/PersonalFavorite";
import { ModelLabels } from "@/components/content/ModelLabels";

export const MDX_COMPONENTS = {
  // Interactive tools
  ModelPicker,
  ModelTinder,
  ModelMixer,
  ModelCompare,
  WorkflowRecipe,
  ScenarioLab,
  PromptLab,
  FailureGallery,
  DevBenchmark,
  ConfigGenerator,
  CostCalculator,
  MaxModeViz,
  // Content components
  InfoBlock,
  PersonalFavorite,
  ModelLabels,
} as const;

export type MdxComponentName = keyof typeof MDX_COMPONENTS;

/** The set of component names available in MDX — used by the integrity suite. */
export const MDX_COMPONENT_NAMES: ReadonlySet<string> = new Set(
  Object.keys(MDX_COMPONENTS)
);
