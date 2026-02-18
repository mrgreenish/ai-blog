import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 text-center">
      <p className="font-mono text-sm text-zinc-500">404</p>
      <h1 className="mt-4 text-3xl font-bold text-zinc-50">Page not found</h1>
      <p className="mt-4 text-zinc-400">
        The article or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
