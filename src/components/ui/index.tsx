import { cn } from "@/lib/utils";

// ── LoadingSpinner ────────────────────────────────────────
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card text-center py-16 text-slate-400">
      <svg
        className="w-10 h-10 mx-auto mb-3 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ── PageHeader ───────────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── StatusBadge ──────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    pending: "badge-pending",
    confirmed: "badge-confirmed",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
  };
  return (
    <span className={classes[status] ?? "badge-pending"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── FormError ────────────────────────────────────────────
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

// ── AlertBox ─────────────────────────────────────────────
export function AlertBox({
  type = "error",
  message,
}: {
  type?: "error" | "success" | "info";
  message: string;
}) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-primary-50 border-primary-200 text-primary-800",
  };
  return (
    <div className={cn("border rounded-sm p-4", styles[type])}>
      <p className="text-sm">{message}</p>
    </div>
  );
}
