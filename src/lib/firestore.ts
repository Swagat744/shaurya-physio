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

// ── POSTS (Doctor Updates) ────────────────────────────────

export type PostType = "blog" | "note" | "quote" | "exercise" | "banner" | "camp";

export interface Post {
  id?: string;
  title: string;
  content: string;
  type: PostType;
  imageUrl?: string;
  authorName: string;
  createdAt?: Timestamp;
}

export async function createPost(data: Omit<Post, "id" | "createdAt">) {
  // Strip undefined fields — Firestore does not accept undefined values
  const clean: Record<string, unknown> = { createdAt: serverTimestamp() };
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) clean[k] = v;
  }
  return addDoc(collection(db, "posts"), clean);
}

export async function getPosts(): Promise<Post[]> {
  const snap = await getDocs(collection(db, "posts"));
  const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
  // Sort client-side to avoid needing a Firestore index
  return posts.sort((a, b) => {
    const aTime = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0;
    const bTime = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0;
    return bTime - aTime;
  });
}

export async function deletePost(id: string) {
  const { deleteDoc } = await import("firebase/firestore");
  return deleteDoc(doc(db, "posts", id));
}

export async function updatePost(id: string, data: Partial<Omit<Post, "id" | "createdAt">>) {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) clean[k] = v;
  }
  return updateDoc(doc(db, "posts", id), clean);
}

// ── NOTIFICATIONS ─────────────────────────────────────────

export interface Notification {
  id?: string;
  userId: string;
  postId: string;
  postTitle: string;
  postType: PostType;
  read: boolean;
  createdAt?: Timestamp;
}

export async function createNotificationsForAllUsers(postId: string, postTitle: string, postType: PostType) {
  try {
    const snap = await getDocs(collection(db, "userProfiles"));
    const batch: Promise<unknown>[] = [];
    snap.docs.forEach((d) => {
      batch.push(
        addDoc(collection(db, "notifications"), {
          userId: d.id,
          postId,
          postTitle,
          postType,
          read: false,
          createdAt: serverTimestamp(),
        })
      );
    });
    await Promise.all(batch);
  } catch {
    // Non-blocking — post is published even if notifications fail
    console.warn("Notifications skipped: no viewers registered yet or permission denied.");
  }
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  const snap = await getDocs(
    query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
}

export async function markNotificationRead(id: string) {
  return updateDoc(doc(db, "notifications", id), { read: true });
}

export async function markAllNotificationsRead(userId: string) {
  const snap = await getDocs(
    query(collection(db, "notifications"), where("userId", "==", userId), where("read", "==", false))
  );
  await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { read: true })));
}

// ── USER PROFILES ─────────────────────────────────────────

export interface UserProfile {
  id?: string;
  email: string;
  displayName: string;
  createdAt?: Timestamp;
}

export async function upsertUserProfile(uid: string, data: Omit<UserProfile, "id" | "createdAt">) {
  const ref = doc(db, "userProfiles", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await addDoc(collection(db, "userProfiles"), { ...data, createdAt: serverTimestamp() });
    // Re-set with uid as doc id
    const { setDoc } = await import("firebase/firestore");
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  }
}

// ── CLINIC SETTINGS ───────────────────────────────────────

export interface ClinicTimings {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ClinicSettings {
  timings: ClinicTimings;
}

export async function getClinicSettings(): Promise<ClinicSettings | null> {
  try {
    const snap = await getDoc(doc(db, "clinicSettings", "main"));
    if (snap.exists()) return snap.data() as ClinicSettings;
    return null;
  } catch {
    return null;
  }
}

export async function saveClinicSettings(timings: ClinicTimings) {
  const { setDoc } = await import("firebase/firestore");
  return setDoc(doc(db, "clinicSettings", "main"), { timings });
}