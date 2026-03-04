"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreeDeciduous,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  resolveTreePath,
  formatResultAsMarkdown,
  type TreeResult,
  type TreeNode,
} from "@/lib/decisionTreeData";

// --- Sub-components ---

function Breadcrumbs({
  crumbs,
  onNavigate,
}: {
  crumbs: { optionId: string; label: string }[];
  onNavigate: (index: number) => void;
}) {
  if (crumbs.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <button
        onClick={() => onNavigate(-1)}
        className="text-zinc-500 transition-colors hover:text-teal-400"
      >
        Start
      </button>
      {crumbs.map((crumb, i) => (
        <span key={crumb.optionId} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          {i < crumbs.length - 1 ? (
            <button
              onClick={() => onNavigate(i)}
              className="text-zinc-500 transition-colors hover:text-teal-400"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-teal-400">{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function QuestionStep({
  node,
  onAnswer,
}: {
  node: TreeNode;
  onAnswer: (optionId: string) => void;
}) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <p className="text-base font-semibold text-zinc-100">{node.question}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {node.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt.id)}
            className="group flex flex-col items-start rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition-all hover:border-teal-500/50 hover:bg-teal-500/5 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
              {opt.label}
            </span>
            <span className="mt-0.5 text-xs text-zinc-500 group-hover:text-zinc-400">
              {opt.description}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function CopyResultButton({ result }: { result: TreeResult }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = formatResultAsMarkdown(result);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
        copied
          ? "border-teal-400/50 bg-teal-400/10 text-teal-300"
          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-teal-400/50 hover:text-teal-300"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy workflow
        </>
      )}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-teal-400/70">
      {children}
    </p>
  );
}

function StepFlow({ steps }: { steps: { label: string; description: string }[] }) {
  return (
    <div className="relative ml-2.5 border-l border-teal-400/20 pl-5">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          className={`relative ${i < steps.length - 1 ? "pb-3" : ""}`}
        >
          <div className="absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-teal-400/30 bg-zinc-900 font-mono text-[10px] font-medium text-teal-400">
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{step.label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ResultCard({
  result,
  onRestart,
}: {
  result: TreeResult;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
    >
      {/* Header card */}
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
        <div className="flex h-24 items-center justify-center bg-linear-to-br from-teal-500/20 to-cyan-500/20">
          <span className="text-5xl">{result.emoji}</span>
        </div>
        <div className="p-4">
          <div className="mb-1 flex flex-wrap items-baseline gap-2">
            <h3 className="text-lg font-bold text-white">{result.title}</h3>
            <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium text-teal-400">
              {result.model}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            {result.description}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div>
        <FieldLabel>Steps</FieldLabel>
        <StepFlow steps={result.steps} />
      </div>

      {/* Tools */}
      <div>
        <FieldLabel>Tools</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {result.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Guardrails */}
      <div>
        <FieldLabel>Guardrails</FieldLabel>
        <ul className="space-y-1.5">
          {result.guardrails.map((g) => (
            <li
              key={g}
              className="flex items-start gap-2 text-xs leading-relaxed text-zinc-400"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400/40" />
              {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Expected output */}
      <div>
        <FieldLabel>Expected output</FieldLabel>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-zinc-300">
            {result.output}
          </p>
        </div>
      </div>

      {/* Article link */}
      <Link
        href={result.articleLink.href}
        className="flex items-center justify-between rounded-lg border border-teal-400/30 bg-teal-400/5 px-4 py-3 transition-colors hover:border-teal-400/50 hover:bg-teal-400/10"
      >
        <div>
          <p className="text-xs text-zinc-500">Read the full guide</p>
          <p className="text-sm font-medium text-teal-300">
            {result.articleLink.label}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-teal-400" />
      </Link>

      {/* Related links */}
      {result.relatedLinks && result.relatedLinks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-zinc-500">Also relevant</p>
          {result.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <span className="min-w-0 flex-1 text-sm text-zinc-400">
                {link.label}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
        <CopyResultButton result={result} />
      </div>
    </motion.div>
  );
}

// --- Main component ---

export function DecisionTree() {
  const [path, setPath] = useState<string[]>([]);

  const { node, result, breadcrumbs } = resolveTreePath(path);

  const handleAnswer = (optionId: string) => {
    setPath((prev) => [...prev, optionId]);
  };

  const handleBack = () => {
    if (path.length === 0) return;
    setPath((prev) => prev.slice(0, -1));
  };

  const handleRestart = () => {
    setPath([]);
  };

  const handleNavigate = (index: number) => {
    if (index < 0) {
      setPath([]);
    } else {
      setPath((prev) => prev.slice(0, index + 1));
    }
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-teal-400/30 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2 text-teal-400">
            <TreeDeciduous className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-teal-400">
              Workflow Finder
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              Find the right AI workflow in a few clicks
            </p>
          </div>
        </div>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs crumbs={breadcrumbs} onNavigate={handleNavigate} />
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          {result ? (
            <ResultCard
              key="result"
              result={result}
              onRestart={handleRestart}
            />
          ) : node ? (
            <QuestionStep
              key={node.id}
              node={node}
              onAnswer={handleAnswer}
            />
          ) : null}
        </AnimatePresence>
      </div>

      {/* Back / footer */}
      {!result && path.length > 0 && (
        <div className="border-t border-zinc-800 px-5 py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      )}
    </div>
  );
}
