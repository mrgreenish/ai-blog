// ---------------------------------------------------------------------------
// Shared MDX component registry — single source of truth for every JSX
// component available inside MDX articles.
// ---------------------------------------------------------------------------

import { ToolFrame } from "@/components/ui/ToolFrame";
import type { ComponentProps } from "react";
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
import { UpdateBlock } from "@/components/content/UpdateBlock";
import { IllustrationPlaceholder } from "@/components/content/IllustrationPlaceholder";

export const MDX_COMPONENTS = {
  // Interactive tools
  ModelPicker: () => (
    <ToolFrame id="model-picker">
      <ModelPicker />
    </ToolFrame>
  ),
  ModelTinder: () => (
    <ToolFrame id="model-tinder">
      <ModelTinder />
    </ToolFrame>
  ),
  ModelMixer: (props: ComponentProps<typeof ModelMixer>) => (
    <ToolFrame id="model-mixer">
      <ModelMixer {...props} />
    </ToolFrame>
  ),
  ModelCompare: () => (
    <ToolFrame id="model-compare">
      <ModelCompare />
    </ToolFrame>
  ),
  WorkflowRecipe: (props: ComponentProps<typeof WorkflowRecipe>) => (
    <ToolFrame
      id={
        props.initialMode === "choose" ? "workflow-finder" : "workflow-recipe"
      }
    >
      <WorkflowRecipe {...props} />
    </ToolFrame>
  ),
  ScenarioLab: () => (
    <ToolFrame id="scenario-lab">
      <ScenarioLab />
    </ToolFrame>
  ),
  PromptLab: () => (
    <ToolFrame id="prompt-lab">
      <PromptLab />
    </ToolFrame>
  ),
  FailureGallery: () => (
    <ToolFrame id="failure-gallery">
      <FailureGallery />
    </ToolFrame>
  ),
  DevBenchmark: () => (
    <ToolFrame id="dev-benchmark">
      <DevBenchmark />
    </ToolFrame>
  ),
  ConfigGenerator: () => (
    <ToolFrame id="config-generator">
      <ConfigGenerator />
    </ToolFrame>
  ),
  CostCalculator: () => (
    <ToolFrame id="cost-calculator">
      <CostCalculator />
    </ToolFrame>
  ),
  MaxModeViz: () => (
    <ToolFrame id="max-mode-viz">
      <MaxModeViz />
    </ToolFrame>
  ),
  // Content components
  InfoBlock,
  UpdateBlock,
  IllustrationPlaceholder,
} as const;

export type MdxComponentName = keyof typeof MDX_COMPONENTS;

/** The set of component names available in MDX — used by the integrity suite. */
export const MDX_COMPONENT_NAMES: ReadonlySet<string> = new Set(
  Object.keys(MDX_COMPONENTS),
);
