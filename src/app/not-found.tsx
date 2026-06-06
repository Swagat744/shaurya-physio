import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold text-primary-600 tracking-[0.2em] uppercase mb-4">
        404 — Page Not Found
      </p>
      <h1 className="font-display text-5xl font-semibold text-slate-900 mb-4">
        This page does not exist.
      </h1>
      <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-8">
        The page you are looking for may have been moved or the link may be incorrect.
        Return to the homepage to continue.
      </p>
      <Link href="/" className="btn-primary">
        Return to Homepage
      </Link>
    </div>
  );
}
