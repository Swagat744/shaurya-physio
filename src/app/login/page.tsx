"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setError("");
    setSigningIn(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (e) {
      setError("Sign-in failed. Please try again.");
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-800 flex-col justify-between p-12">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">
            Shaurya Physiotherapy Clinic
          </h1>
          <p className="text-primary-200 text-xs mt-1 font-sans tracking-wide">
            Clinic Management System
          </p>
        </div>
        <div>
          <blockquote className="font-display text-3xl font-light text-white leading-relaxed italic">
            &ldquo;Healing begins with the right care, delivered at the right time.&rdquo;
          </blockquote>
          <p className="mt-4 text-primary-300 text-sm font-sans">
            Dr. Nivedita Shashikant Pingale (PT)
          </p>
        </div>
        <div className="text-primary-400 text-xs font-sans">
          Secure staff access only. Unauthorized access is prohibited.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-display text-2xl font-semibold text-white">
              Shaurya Physiotherapy Clinic
            </h1>
            <p className="text-slate-400 text-xs mt-1">Clinic Management System</p>
          </div>

          <div className="bg-white rounded-sm p-8 shadow-xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Staff Login</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Sign in with your authorised Google account to access the clinic dashboard.
            </p>

            <div className="mt-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-sm px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {signingIn ? (
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {signingIn ? "Signing in..." : "Continue with Google"}
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-sm p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Access is restricted to authorised clinic staff only.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
