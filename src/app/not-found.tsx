import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 text-center">
      <p className="font-mono text-sm text-fg-muted">404</p>
      <h1 className="mt-4 text-3xl font-bold text-fg-primary">Page not found</h1>
      <p className="mt-4 text-fg-secondary">
        The article or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors text-fg-secondary bg-bg-surface border border-border-default"
        
      >
        Back to home
      </Link>
    </div>
  );
}
