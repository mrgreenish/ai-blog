export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-default">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="font-mono text-xs text-fg-muted tracking-wide">
          AI Field Notes · Filip van Harreveld · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
