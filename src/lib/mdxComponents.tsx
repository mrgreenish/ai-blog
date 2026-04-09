// ---------------------------------------------------------------------------
// Shared MDX component registry — single source of truth for every JSX
// component available inside MDX articles.
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
import { IllustrationPlaceholder } from "@/components/content/IllustrationPlaceholder";

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
  IllustrationPlaceholder,
} as const;

export type MdxComponentName = keyof typeof MDX_COMPONENTS;

/** The set of component names available in MDX — used by the integrity suite. */
export const MDX_COMPONENT_NAMES: ReadonlySet<string> = new Set(
  Object.keys(MDX_COMPONENTS)
);
