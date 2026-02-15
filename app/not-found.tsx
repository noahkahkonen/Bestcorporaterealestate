import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-[var(--charcoal)]">Page not found</h1>
      <p className="mt-2 text-[var(--charcoal-light)]">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
