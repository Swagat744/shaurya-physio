"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPatients, getAppointments, getTodayAppointments, Appointment, Patient } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [p, a, t] = await Promise.all([
          getPatients(),
          getAppointments(),
          getTodayAppointments(),
        ]);
        setPatients(p);
        setAppointments(a);
        setTodayAppts(t);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const today = format(new Date(), "EEEE, dd MMMM yyyy");

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1 font-sans">
          {today} &nbsp;·&nbsp; Welcome, {user?.displayName?.split(" ")[0] || "Admin"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Patients", value: patients.length, color: "border-t-primary-500" },
          { label: "Total Appointments", value: appointments.length, color: "border-t-primary-400" },
          { label: "Today's Appointments", value: todayAppts.length, color: "border-t-blue-500" },
          { label: "Pending Appointments", value: pendingCount, color: "border-t-amber-500" },
        ].map((stat) => (
          <div key={stat.label} className={`card border-t-4 ${stat.color}`}>
            <p className="font-display text-4xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-sans">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/dashboard/patients"
          className="card hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
              <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900">Add Patient</p>
              <p className="text-xs text-slate-500 mt-0.5">Register a new patient</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/appointments"
          className="card hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
              <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900">Appointments</p>
              <p className="text-xs text-slate-500 mt-0.5">View and manage appointments</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/treatments"
          className="card hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
              <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900">Treatment Records</p>
              <p className="text-xs text-slate-500 mt-0.5">Add and view treatment notes</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Today's appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Today&apos;s Appointments
          </h2>
          <Link href="/dashboard/appointments" className="text-xs text-primary-700 hover:text-primary-800 font-medium">
            View all
          </Link>
        </div>

        {todayAppts.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                  <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayAppts.map((appt) => (
                  <tr key={appt.id}>
                    <td className="py-3 pr-4 font-medium text-slate-900">{appt.patientName}</td>
                    <td className="py-3 pr-4 text-slate-600">{appt.phone}</td>
                    <td className="py-3 pr-4 text-slate-600">{appt.preferredTime}</td>
                    <td className="py-3">
                      <span className={`badge-${appt.status}`}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
