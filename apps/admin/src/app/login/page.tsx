"use client";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();
    if (sessionData?.user?.role !== "ADMIN") {
      await signOut({ redirect: false });
      window.location.href = "http://localhost:3001/login";
      return;
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-[1.75rem] border border-white/55 bg-white/60 p-7 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.42)] backdrop-blur-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03254c] text-2xl text-white shadow-lg shadow-[#03254c]/20">⚡</div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">ElectroMart Admin</h1>
        </div>

        <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">Restricted to administrators only</p>
        </div>

        {error && (
          <div data-testid="error-message" className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input data-testid="email-input" type="email" required className="input" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input data-testid="password-input" type="password" required className="input" value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button data-testid="login-btn" type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}