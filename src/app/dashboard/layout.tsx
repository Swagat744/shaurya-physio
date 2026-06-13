"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "doctor") {
        router.push("/");
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || role !== "doctor") return null;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto
        pt-[57px] pb-[64px] lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  );
}