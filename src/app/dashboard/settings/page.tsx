"use client";

import { useEffect, useState } from "react";
import {
  getClinicSettings,
  saveClinicSettings,
  ClinicTimings,
} from "@/lib/firestore";

const DAYS: { key: keyof ClinicTimings; label: string }[] = [
  { key: "monday",    label: "Monday" },
  { key: "tuesday",   label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday",  label: "Thursday" },
  { key: "friday",    label: "Friday" },
  { key: "saturday",  label: "Saturday" },
  { key: "sunday",    label: "Sunday" },
];

const DEFAULT_TIMINGS: ClinicTimings = {
  monday:    "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  tuesday:   "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  wednesday: "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  thursday:  "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  friday:    "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  saturday:  "9:00 AM – 2:00 PM",
  sunday:    "Closed",
};

export default function SettingsPage() {
  const [timings, setTimings] = useState<ClinicTimings>(DEFAULT_TIMINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [applyDay, setApplyDay] = useState<keyof ClinicTimings>("monday");

  useEffect(() => {
    getClinicSettings().then((s) => {
      if (s?.timings) setTimings(s.timings);
    }).finally(() => setLoading(false));
  }, []);

  function handleChange(day: keyof ClinicTimings, value: string) {
    setTimings((prev) => ({ ...prev, [day]: value }));
  }

  function handleApplyToAll() {
    const value = timings[applyDay];
    const updated = {} as ClinicTimings;
    DAYS.forEach(({ key }) => { updated[key] = value; });
    setTimings((prev) => ({ ...prev, ...updated }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await saveClinicSettings(timings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Clinic Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update clinic timings here — changes reflect instantly across the entire website.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card space-y-4">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">
            Clinic Timings
          </h2>
          <p className="text-xs text-slate-400">
            Format example: <span className="font-mono bg-slate-100 px-1 rounded">9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM</span> or <span className="font-mono bg-slate-100 px-1 rounded">Closed</span>
          </p>

          {/* Single Apply to all button on top */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <select
              value={applyDay}
              onChange={(e) => setApplyDay(e.target.value as keyof ClinicTimings)}
              className="border border-slate-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {DAYS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleApplyToAll}
              className="text-xs text-primary-600 hover:text-primary-800 px-3 py-1.5 border border-primary-200 rounded-sm hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              Apply to all
            </button>
          </div>

          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium text-slate-700 flex-shrink-0">
                {label}
              </label>
              <input
                type="text"
                value={timings[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="flex-1 border border-slate-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 9:00 AM – 1:00 PM or Closed"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-sm p-3 text-sm text-green-700">
              ✓ Clinic timings saved successfully! All pages updated.
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-sm px-6 py-2 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Timings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}