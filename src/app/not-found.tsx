import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-shell utility-page">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl font-bold text-fg-primary">
        Page not found
      </h1>
      <p className="mt-4 text-fg-secondary">
        The article or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="action-link action-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
