"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const { user, role, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // Doctors go to dashboard, viewers go back to main site
      router.push(role === "doctor" ? "/dashboard" : "/");
    }
  }, [user, role, loading, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Invalid email or password.");
      } else if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("weak-password")) {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in failed. Please try again.");
      setBusy(false);
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
          Sign in to access your profile or the clinic dashboard.
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
            <h2 className="font-display text-3xl font-semibold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {mode === "signin"
                ? "Sign in to your account. Doctors will be redirected to the dashboard automatically."
                : "Create an account to manage your appointments and stay updated."}
            </p>

            {/* Email/password form */}
            <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-sm px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium py-2.5 rounded-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === "signin" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  mode === "signin" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={busy}
              className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-sm px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-sm p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Toggle signin/signup */}
            <div className="mt-5 text-center">
              {mode === "signin" ? (
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button onClick={() => { setMode("signup"); setError(""); }} className="text-primary-700 font-medium hover:underline">
                    Create one
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <button onClick={() => { setMode("signin"); setError(""); }} className="text-primary-700 font-medium hover:underline">
                    Sign in
                  </button>
                </p>
              )}
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
