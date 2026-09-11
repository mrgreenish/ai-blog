import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-default">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="font-mono text-xs text-fg-muted tracking-wide">
          AI Field Notes · <a className="underline" href={AUTHOR_URL}>{AUTHOR_NAME}</a> · {new Date().getFullYear()}
          <a className="block mt-3 underline" href="/feed.xml">Subscribe via RSS</a>
        </p>
      </div>
    </footer>
  );
}
