"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col justify-center px-6 pb-16 pt-8">
      {/* Radial glow behind hero */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl bg-ambient-blue" />
        <div className="absolute right-0 top-1/4 h-[300px] w-[400px] rounded-full blur-3xl bg-ambient-violet" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-bg-surface border border-border-default"
          
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-blue" />
          <span className="section-label">developer field notes</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl text-fg-primary"
        >
          Working With AI
          <br />
          <span className="gradient-text-hero">as a Developer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-fg-secondary"
        >
          Real notes from shipping with AI — not theory. What I&apos;ve learned
          about picking models, building workflows, and configuring tooling —
          kept up to date as things change.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/models"
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-400 hover:shadow-blue-400/30 active:scale-[0.98]"
          >
            Start reading
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#navigate"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] text-fg-secondary bg-bg-surface border border-border-default"

          >
            Browse topics
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-5 w-5 animate-scroll-bounce text-fg-muted" />
      </motion.div>
    </section>
  );
}
