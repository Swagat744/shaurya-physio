"use client";

import { useClinicTimings } from "@/lib/useClinicTimings";

const DAYS = [
  { key: "monday"    as const, label: "Monday" },
  { key: "tuesday"   as const, label: "Tuesday" },
  { key: "wednesday" as const, label: "Wednesday" },
  { key: "thursday"  as const, label: "Thursday" },
  { key: "friday"    as const, label: "Friday" },
  { key: "saturday"  as const, label: "Saturday" },
  { key: "sunday"    as const, label: "Sunday" },
];

export default function ClinicTimingsDisplay({ className }: { className?: string }) {
  const { timings, loading } = useClinicTimings();

  if (loading) {
    return (
      <div className={className}>
        <div className="animate-pulse space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 rounded w-3/4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {DAYS.map(({ key, label }) => (
        <div key={key} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className={`text-sm ${timings[key] === "Closed" ? "text-red-500 font-medium" : "text-slate-600"}`}>
            {timings[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
