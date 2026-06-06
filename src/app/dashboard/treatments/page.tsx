"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  getAllTreatments,
  addTreatmentRecord,
  getPatients,
  TreatmentRecord,
  Exercise,
  Patient,
} from "@/lib/firestore";
import { format } from "date-fns";

interface TreatmentForm {
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  doctorNotes: string;
  exercises: Exercise[];
  precautions: string;
  nextVisit?: string;
}

export default function TreatmentsPage() {
  const [records, setRecords] = useState<TreatmentRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors }, reset } =
    useForm<TreatmentForm>({
      defaultValues: {
        date: new Date().toISOString().split("T")[0],
        exercises: [],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "exercises" });

  const selectedPatientId = watch("patientId");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      const p = patients.find((pt) => pt.id === selectedPatientId);
      if (p) setValue("patientName", p.name);
    }
  }, [selectedPatientId, patients, setValue]);

  async function fetchData() {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([getAllTreatments(), getPatients()]);
      setRecords(t);
      setPatients(p);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: TreatmentForm) => {
    setSaving(true);
    try {
      await addTreatmentRecord(data);
      reset({ date: new Date().toISOString().split("T")[0], exercises: [] });
      setShowForm(false);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Treatment Records</h1>
          <p className="text-slate-500 text-sm mt-1">{records.length} records</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Add Record"}
        </button>
      </div>

      {/* Treatment Form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
            New Treatment Record
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Patient</label>
                <select className="input-field"
                  {...register("patientId", { required: "Select a patient" })}>
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.phone}</option>
                  ))}
                </select>
                {errors.patientId && <p className="mt-1 text-xs text-red-600">{errors.patientId.message}</p>}
                <input type="hidden" {...register("patientName")} />
              </div>
              <div>
                <label className="label">Visit Date</label>
                <input type="date" className="input-field" {...register("date", { required: true })} />
              </div>
            </div>

            <div>
              <label className="label">Diagnosis</label>
              <input className="input-field" placeholder="Clinical diagnosis"
                {...register("diagnosis", { required: "Diagnosis is required" })} />
              {errors.diagnosis && <p className="mt-1 text-xs text-red-600">{errors.diagnosis.message}</p>}
            </div>

            <div>
              <label className="label">Doctor Notes</label>
              <textarea className="input-field h-24 resize-none"
                placeholder="Clinical observations, treatment administered, patient response..."
                {...register("doctorNotes", { required: "Notes are required" })} />
              {errors.doctorNotes && <p className="mt-1 text-xs text-red-600">{errors.doctorNotes.message}</p>}
            </div>

            {/* Exercise Plan */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label mb-0">Exercise Plan</label>
                <button
                  type="button"
                  onClick={() => append({ name: "", sets: "", reps: "", duration: "", instructions: "" })}
                  className="text-xs text-primary-700 hover:text-primary-800 font-medium"
                >
                  + Add Exercise
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-sm py-6 text-center text-slate-400 text-sm">
                  No exercises added. Click &quot;Add Exercise&quot; to build the plan.
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="bg-slate-50 border border-slate-200 rounded-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Exercise {index + 1}
                        </span>
                        <button type="button" onClick={() => remove(index)}
                          className="text-xs text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <input className="input-field" placeholder="Exercise name (e.g. Straight Leg Raise)"
                            {...register(`exercises.${index}.name`, { required: true })} />
                        </div>
                        <input className="input-field" placeholder="Sets (e.g. 3 sets)"
                          {...register(`exercises.${index}.sets`)} />
                        <input className="input-field" placeholder="Reps (e.g. 10 reps)"
                          {...register(`exercises.${index}.reps`)} />
                        <input className="input-field" placeholder="Duration (e.g. 30 seconds)"
                          {...register(`exercises.${index}.duration`)} />
                        <input className="input-field" placeholder="Instructions / notes"
                          {...register(`exercises.${index}.instructions`)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label">Precautions</label>
              <textarea className="input-field h-16 resize-none"
                placeholder="Activities to avoid, precautions for the patient..."
                {...register("precautions")} />
            </div>

            <div>
              <label className="label">Next Visit (Optional)</label>
              <input type="date" className="input-field max-w-xs"
                min={new Date().toISOString().split("T")[0]}
                {...register("nextVisit")} />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Treatment Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : records.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <p className="text-sm">No treatment records yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div key={rec.id} className="card">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id!)}
              >
                <div>
                  <h3 className="font-medium text-slate-900">{rec.patientName}</h3>
                  <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{rec.date}</span>
                    <span className="font-medium text-slate-700">{rec.diagnosis}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {rec.exercises?.length > 0 && (
                    <span className="text-xs bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full">
                      {rec.exercises.length} exercise{rec.exercises.length > 1 ? "s" : ""}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === rec.id ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedId === rec.id && (
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Doctor Notes</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{rec.doctorNotes}</p>
                  </div>

                  {rec.exercises?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Exercise Plan</p>
                      <div className="space-y-2">
                        {rec.exercises.map((ex, i) => (
                          <div key={i} className="bg-slate-50 rounded-sm px-4 py-3 text-sm">
                            <p className="font-medium text-slate-900">{ex.name}</p>
                            <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-slate-500">
                              {ex.sets && <span>Sets: {ex.sets}</span>}
                              {ex.reps && <span>Reps: {ex.reps}</span>}
                              {ex.duration && <span>Duration: {ex.duration}</span>}
                              {ex.instructions && <span className="text-slate-600">{ex.instructions}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rec.precautions && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Precautions</p>
                      <p className="text-sm text-slate-700">{rec.precautions}</p>
                    </div>
                  )}

                  {rec.nextVisit && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Next Visit</p>
                      <p className="text-sm text-primary-700 font-medium">{rec.nextVisit}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
