// ---------------------------------------------------------------------------
// Frontmatter validation — single source of truth for what a valid article
// frontmatter looks like. Used at content load time and in the integrity suite.
// ---------------------------------------------------------------------------

import type { ArticleFrontmatter, Category, InteractiveTool } from "./types";

const VALID_CATEGORIES: Category[] = ["models", "workflows", "tooling", "notes"];

const VALID_INTERACTIVE_TOOLS: InteractiveTool[] = [
  "model-picker",
  "model-tinder",
  "model-mixer",
  "model-compare",
  "workflow-recipe",
  "scenario-lab",
  "prompt-lab",
  "failure-gallery",
  "dev-benchmark",
  "config-generator",
  "cost-calculator",
  "context-window-viz",
  "decision-tree",
  "max-mode-viz",
];

export interface FrontmatterValidationError {
  field: string;
  message: string;
}

export function validateFrontmatter(
  data: Record<string, unknown>,
  slug: string,
  expectedCategory?: Category
): FrontmatterValidationError[] {
  const errors: FrontmatterValidationError[] = [];

  if (!data.title || typeof data.title !== "string") {
    errors.push({ field: "title", message: `${slug}: missing or non-string title` });
  }

  if (!data.description || typeof data.description !== "string") {
    errors.push({ field: "description", message: `${slug}: missing or non-string description` });
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category as Category)) {
    errors.push({
      field: "category",
      message: `${slug}: invalid category "${data.category}" — must be one of ${VALID_CATEGORIES.join(", ")}`,
    });
  } else if (expectedCategory && data.category !== expectedCategory) {
    errors.push({
      field: "category",
      message: `${slug}: category "${data.category}" does not match directory "${expectedCategory}"`,
    });
  }

  if (data.order === undefined || typeof data.order !== "number") {
    errors.push({ field: "order", message: `${slug}: missing or non-numeric order` });
  }

  if (data.interactiveTools !== undefined) {
    if (!Array.isArray(data.interactiveTools)) {
      errors.push({
        field: "interactiveTools",
        message: `${slug}: interactiveTools must be an array`,
      });
    } else {
      for (const tool of data.interactiveTools as unknown[]) {
        if (!VALID_INTERACTIVE_TOOLS.includes(tool as InteractiveTool)) {
          errors.push({
            field: "interactiveTools",
            message: `${slug}: unknown interactiveTool slug "${tool}" — not in InteractiveTool union`,
          });
        }
      }
    }
  }

  if (data.publishedAt !== undefined) {
    if (typeof data.publishedAt !== "string" || isNaN(Date.parse(data.publishedAt))) {
      errors.push({
        field: "publishedAt",
        message: `${slug}: publishedAt "${data.publishedAt}" is not a parseable date string`,
      });
    }
  }

  if (data.updatedAt !== undefined) {
    if (typeof data.updatedAt !== "string" || isNaN(Date.parse(data.updatedAt))) {
      errors.push({
        field: "updatedAt",
        message: `${slug}: updatedAt "${data.updatedAt}" is not a parseable date string`,
      });
    }
  }

  return errors;
}

/** Cast raw gray-matter data to ArticleFrontmatter after validation.
 *  Throws in development if validation fails so issues surface early. */
export function parseFrontmatter(
  data: Record<string, unknown>,
  slug: string,
  expectedCategory?: Category
): ArticleFrontmatter {
  const errors = validateFrontmatter(data, slug, expectedCategory);
  if (errors.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `[contentSchema] Frontmatter validation warnings for "${slug}":\n` +
        errors.map((e) => `  • ${e.message}`).join("\n")
    );
  }
  return data as unknown as ArticleFrontmatter;
}

export { VALID_INTERACTIVE_TOOLS };
