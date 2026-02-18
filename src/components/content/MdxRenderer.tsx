"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { ModelPicker } from "@/components/interactive/ModelPicker";
import { ModelMixer } from "@/components/interactive/ModelMixer";
import { WorkflowRecipe } from "@/components/interactive/WorkflowRecipe";
import { PromptLab } from "@/components/interactive/PromptLab";
import { FailureGallery } from "@/components/interactive/FailureGallery";
import { DevBenchmark } from "@/components/interactive/DevBenchmark";
import { ConfigGenerator } from "@/components/interactive/ConfigGenerator";
import { CostCalculator } from "@/components/interactive/CostCalculator";
import { DiffViewer } from "@/components/interactive/DiffViewer";
import { ContextWindowViz } from "@/components/interactive/ContextWindowViz";

const COMPONENTS = {
  ModelPicker,
  ModelMixer,
  WorkflowRecipe,
  PromptLab,
  FailureGallery,
  DevBenchmark,
  ConfigGenerator,
  CostCalculator,
  DiffViewer,
  ContextWindowViz,
};

interface MdxRendererProps {
  source: MDXRemoteSerializeResult;
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="prose prose-zinc max-w-none">
      <MDXRemote {...source} components={COMPONENTS} />
    </div>
  );
}
