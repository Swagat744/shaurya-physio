import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── PATIENTS ──────────────────────────────────────────────

export interface Patient {
  id?: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  address?: string;
  medicalHistory?: string;
  createdAt?: Timestamp;
}

export async function addPatient(data: Omit<Patient, "id" | "createdAt">) {
  return addDoc(collection(db, "patients"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getPatients(): Promise<Patient[]> {
  const snap = await getDocs(
    query(collection(db, "patients"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Patient));
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const snap = await getDoc(doc(db, "patients", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Patient;
}

export async function searchPatients(field: "phone" | "name", value: string): Promise<Patient[]> {
  const snap = await getDocs(
    query(collection(db, "patients"), where(field, ">=", value), where(field, "<=", value + "\uf8ff"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Patient));
}

// ── APPOINTMENTS ──────────────────────────────────────────

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id?: string;
  patientName: string;
  phone: string;
  age: number;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  status: AppointmentStatus;
  patientId?: string;
  notes?: string;
  createdAt?: Timestamp;
}

export async function bookAppointment(data: Omit<Appointment, "id" | "createdAt" | "status">) {
  return addDoc(collection(db, "appointments"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getAppointments(): Promise<Appointment[]> {
  const snap = await getDocs(
    query(collection(db, "appointments"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
}

export async function getTodayAppointments(): Promise<Appointment[]> {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const snap = await getDocs(
    query(collection(db, "appointments"), where("preferredDate", "==", dateStr))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string) {
  const ref = doc(db, "appointments", id);
  const update: Record<string, unknown> = { status };
  if (notes !== undefined) update.notes = notes;
  return updateDoc(ref, update);
}

// ── TREATMENTS ────────────────────────────────────────────

export interface TreatmentRecord {
  id?: string;
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  doctorNotes: string;
  exercises: Exercise[];
  precautions: string;
  nextVisit?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  instructions?: string;
}

export async function addTreatmentRecord(data: Omit<TreatmentRecord, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, "treatments"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getTreatmentsByPatient(patientId: string): Promise<TreatmentRecord[]> {
  const snap = await getDocs(
    query(
      collection(db, "treatments"),
      where("patientId", "==", patientId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TreatmentRecord));
}

export async function getAllTreatments(): Promise<TreatmentRecord[]> {
  const snap = await getDocs(
    query(collection(db, "treatments"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TreatmentRecord));
}

export async function updateTreatmentRecord(id: string, data: Partial<TreatmentRecord>) {
  return updateDoc(doc(db, "treatments", id), { ...data, updatedAt: serverTimestamp() });
}
