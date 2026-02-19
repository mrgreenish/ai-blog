"use client";

import { Heart } from "lucide-react";

export function ScrollToMatchButton() {
  const handleClick = () => {
    document.getElementById("model-match")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handleClick}
      className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-0.5 font-mono text-xs text-pink-400 transition-colors hover:border-pink-500/60 hover:bg-pink-500/20"
    >
      <Heart className="h-3 w-3 fill-pink-400" />
      find your match
    </button>
  );
}
