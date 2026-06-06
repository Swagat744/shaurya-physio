"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getPatients, addPatient, Patient } from "@/lib/firestore";

interface PatientForm {
  name: string;
  phone: string;
  age: number;
  gender: string;
  address?: string;
  medicalHistory?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientForm>();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(patients);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        patients.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.phone.includes(q)
        )
      );
    }
  }, [search, patients]);

  async function fetchPatients() {
    setLoading(true);
    try {
      const p = await getPatients();
      setPatients(p);
      setFiltered(p);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: PatientForm) => {
    setSaving(true);
    try {
      await addPatient({ ...data, age: Number(data.age) });
      reset();
      setShowForm(false);
      fetchPatients();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Patients</h1>
          <p className="text-slate-500 text-sm mt-1">{patients.length} registered patients</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSelected(null); }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Add Patient"}
        </button>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
            New Patient Registration
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" placeholder="Patient full name"
                {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input-field" placeholder="10-digit mobile number"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^[6-9]\d{9}$/, message: "Invalid phone number" },
                })} />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label">Age</label>
              <input className="input-field" type="number" placeholder="Age in years"
                {...register("age", { required: "Age is required", min: 1 })} />
              {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>}
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input-field"
                {...register("gender", { required: "Gender is required" })}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address (Optional)</label>
              <input className="input-field" placeholder="Patient address"
                {...register("address")} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Medical History (Optional)</label>
              <textarea className="input-field h-20 resize-none"
                placeholder="Relevant medical history, allergies, or conditions"
                {...register("medicalHistory")} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); reset(); }}
                className="btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Register Patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          className="input-field max-w-sm"
          placeholder="Search by name or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patient list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <p className="text-sm">{search ? "No patients match your search." : "No patients registered yet."}</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Name", "Phone", "Age", "Gender", "Medical History"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.phone}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.age}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.gender}</td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {p.medicalHistory || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected patient detail */}
      {selected && (
        <div className="card mt-6 border-primary-200 bg-primary-50">
          <h3 className="font-display text-xl font-semibold text-slate-900 mb-4">
            Patient Details — {selected.name}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{selected.phone}</span></div>
            <div><span className="text-slate-500">Age:</span> <span className="font-medium">{selected.age} years</span></div>
            <div><span className="text-slate-500">Gender:</span> <span className="font-medium">{selected.gender}</span></div>
            <div><span className="text-slate-500">Address:</span> <span className="font-medium">{selected.address || "Not provided"}</span></div>
            {selected.medicalHistory && (
              <div className="sm:col-span-2">
                <span className="text-slate-500">Medical History:</span>
                <p className="mt-1 text-slate-800 leading-relaxed">{selected.medicalHistory}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
