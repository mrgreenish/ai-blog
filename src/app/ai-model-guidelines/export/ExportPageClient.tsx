"use client";

import { useRef, useState } from "react";
import { SharePointHtmlDocument } from "../_components/GuidelinesDocument";

export function ExportPageClient() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    const html = previewRef.current?.innerHTML ?? "";
    if (!html) {
      setStatus("error");
      return;
    }
    try {
      await navigator.clipboard.writeText(html);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder mb-4">
          SharePoint export
        </p>
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-fg-primary mb-4">
          Copy HTML for SharePoint
        </h1>
        <p className="text-sm leading-relaxed text-fg-muted max-w-2xl mb-6">
          This page renders the same guidelines as{" "}
          <a href="/ai-model-guidelines" className="underline">
            /ai-model-guidelines
          </a>
          , with inline styles for SharePoint. Model names and prices come from{" "}
          <code className="text-xs">src/lib/modelSpecs.ts</code>. Paste into
          SharePoint using the HTML / source editor — do not treat SharePoint as
          the source of truth for pricing.
        </p>
        <ul className="text-sm text-fg-muted list-disc pl-5 mb-6 space-y-1">
          <li>
            <strong>Structure:</strong> sync section order from Confluence →{" "}
            <code className="text-xs">guidelinesContent.ts</code>
          </li>
          <li>
            <strong>Data:</strong> run validate-model-specs when prices change
          </li>
          <li>
            <strong>Image:</strong> upload{" "}
            <code className="text-xs">/images/cursor-reasoning-effort.png</code>{" "}
            to SharePoint or fix the img URL after paste
          </li>
        </ul>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-border-default bg-bg-surface px-4 py-2 text-sm font-medium text-fg-primary hover:bg-bg-elevated"
        >
          {status === "copied"
            ? "Copied HTML"
            : status === "error"
              ? "Copy failed — select manually"
              : "Copy HTML for SharePoint"}
        </button>
      </header>

      <div className="section-divider mb-8" />

      <div className="rounded-lg border border-border-default bg-bg-surface p-6 overflow-x-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-placeholder mb-4">
          Preview
        </p>
        <div ref={previewRef}>
          <SharePointHtmlDocument />
        </div>
      </div>
    </div>
  );
}
