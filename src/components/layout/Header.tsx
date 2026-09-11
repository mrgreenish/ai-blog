"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";

const links = [
  { href: "/guides", label: "Guides" },
  { href: "/tools", label: "Tools" },
  { href: "/chapters/what-is-happening", label: "Updates" },
  { href: "/search", label: "Search" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header
      ref={header}
      className="site-header"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="site-shell header-inner">
        <Link
          href="/"
          className="wordmark"
          onClick={() => setOpen(false)}
          aria-label="AI Field Notes home"
        >
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            AI Field Notes<span className="wordmark-period">.</span>
          </span>
        </Link>
        <span className="header-note">A developer’s working reference</span>
        <button
          ref={button}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`primary-navigation ${open ? "is-open" : ""}`}
        >
          {links.map(({ href, label }) => {
            const active =
              pathname.startsWith(href) ||
              (href === "/guides" &&
                pathname.startsWith("/chapters/") &&
                !pathname.startsWith("/chapters/what-is-happening"));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={label === "Search" ? "nav-search" : ""}
                onClick={() => setOpen(false)}
              >
                {label}
                {label === "Search" ? <Arrow diagonal /> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
