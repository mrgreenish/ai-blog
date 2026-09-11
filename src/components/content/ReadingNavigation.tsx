"use client";
import { useEffect, useRef, useState } from "react";
import type { ArticleHeading } from "@/lib/articleHeadings";

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const article = document.getElementById("article-body");
    if (!article) return;
    let frame = 0;
    const update = () => {
      const bounds = article.getBoundingClientRect();
      const available = bounds.height - window.innerHeight + 110;
      const progress =
        available <= 0
          ? bounds.top < 110
            ? 1
            : 0
          : Math.max(0, Math.min(1, (110 - bounds.top) / available));
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={bar} className="reading-progress" aria-hidden="true" />;
}

export function ReadingNavigation({
  headings,
  mobile = false,
}: {
  headings: ArticleHeading[];
  mobile?: boolean;
}) {
  const [active, setActive] = useState("");
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);
  if (!headings.length) return null;
  const list = (
    <nav aria-label="On this page">
      <ol>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={h.level === 3 ? "index-subheading" : undefined}
              aria-current={active === h.id ? "location" : undefined}
              onClick={() => {
                if (details.current) details.current.open = false;
                const target = document.getElementById(h.id);
                if (target) {
                  target.tabIndex = -1;
                  target.focus({ preventScroll: true });
                }
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
  return mobile ? (
    <details ref={details} className="mobile-reading-index">
      <summary>
        On this page <span aria-hidden="true">↓</span>
      </summary>
      {list}
    </details>
  ) : (
    <aside className="reading-index">
      <p className="eyebrow">In this field note</p>
      {list}
    </aside>
  );
}
