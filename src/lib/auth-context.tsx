"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/firestore";

export type UserRole = "doctor" | "viewer" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
});

async function resolveRole(firebaseUser: User): Promise<UserRole> {
  try {
    const snap = await getDoc(doc(db, "allowedDoctors", firebaseUser.uid));
    if (snap.exists()) return "doctor";
    const emailSnap = await getDoc(doc(db, "allowedDoctors", firebaseUser.email ?? ""));
    if (emailSnap.exists()) return "doctor";
  } catch {
    // Safe to ignore during SSR
  }
  return "viewer";
}

async function saveProfile(firebaseUser: User) {
  try {
    await upsertUserProfile(firebaseUser.uid, {
      email: firebaseUser.email ?? "",
      displayName: firebaseUser.displayName ?? firebaseUser.email ?? "User",
    });
  } catch {
    // Non-blocking
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    import("firebase/auth").then(({ onAuthStateChanged }) => {
      import("@/lib/firebase").then(({ auth }) => {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const r = await resolveRole(firebaseUser);
            await saveProfile(firebaseUser);
            setUser(firebaseUser);
            setRole(r);
          } else {
            setUser(null);
            setRole(null);
          }
          setLoading(false);
        });
      });
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const signInWithGoogle = async () => {
    const { signInWithPopup } = await import("firebase/auth");
    const { auth, googleProvider } = await import("@/lib/firebase");
    const result = await signInWithPopup(auth, googleProvider);
    const r = await resolveRole(result.user);
    await saveProfile(result.user);
    setRole(r);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    const result = await signInWithEmailAndPassword(auth, email, password);
    const r = await resolveRole(result.user);
    await saveProfile(result.user);
    setRole(r);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const r = await resolveRole(result.user);
    await saveProfile(result.user);
    setRole(r);
  };

  const logout = async () => {
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("@/lib/firebase");
    await signOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
