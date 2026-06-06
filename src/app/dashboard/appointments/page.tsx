"use client";

import { useEffect, useState } from "react";
import { getAppointments, updateAppointmentStatus, Appointment, AppointmentStatus } from "@/lib/firestore";

const statusOptions: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

const badgeClass: Record<AppointmentStatus, string> = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filterStatus === "all") {
      setFiltered(appointments);
    } else {
      setFiltered(appointments.filter((a) => a.status === filterStatus));
    }
  }, [filterStatus, appointments]);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: AppointmentStatus, notes?: string) {
    setUpdating(id);
    try {
      await updateAppointmentStatus(id, status, notes);
      await fetchData();
      setExpandedId(null);
      setNoteInput("");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">{appointments.length} total appointment requests</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-sm text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-primary-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-primary-300"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({appointments.filter((a) => a.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <p className="text-sm">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <div key={appt.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-medium text-slate-900">{appt.patientName}</h3>
                    <span className={badgeClass[appt.status]}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>Phone: {appt.phone}</span>
                    <span>Age: {appt.age}</span>
                    <span>Date: {appt.preferredDate}</span>
                    <span>Time: {appt.preferredTime}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">
                    <span className="font-medium">Complaint:</span> {appt.problem}
                  </p>
                  {appt.notes && (
                    <p className="mt-1.5 text-sm text-slate-500 italic">Note: {appt.notes}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {statusOptions
                    .filter((s) => s !== appt.status)
                    .map((s) => (
                      <button
                        key={s}
                        disabled={updating === appt.id}
                        onClick={() => {
                          if (s === "completed") {
                            setExpandedId(appt.id === expandedId ? null : appt.id!);
                          } else {
                            handleStatusChange(appt.id!, s);
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded-sm border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700 transition-colors disabled:opacity-50"
                      >
                        {updating === appt.id ? "..." : `Mark ${s}`}
                      </button>
                    ))}
                </div>
              </div>

              {/* Complete with note */}
              {expandedId === appt.id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="label">Completion Note (Optional)</label>
                  <textarea
                    className="input-field h-20 resize-none"
                    placeholder="Add any notes about the completed session..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => handleStatusChange(appt.id!, "completed", noteInput)}
                      className="btn-primary text-xs px-4 py-2"
                      disabled={updating === appt.id}
                    >
                      Confirm Completed
                    </button>
                    <button
                      onClick={() => { setExpandedId(null); setNoteInput(""); }}
                      className="btn-ghost text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
