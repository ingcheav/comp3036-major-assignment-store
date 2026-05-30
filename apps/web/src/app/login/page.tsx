"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
    setLoading(false);

    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-[1.75rem] border border-white/70 bg-white/88 p-8 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03254c] text-2xl text-white shadow-lg shadow-[#03254c]/20">⚡</div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">ElectroMart</h1>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input id="email" type="email" required className="input" value={email}
              onChange={(e) => setEmail(e.target.value)} data-testid="email-input" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" type="password" required className="input" value={password}
              onChange={(e) => setPassword(e.target.value)} data-testid="password-input" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3" data-testid="login-btn">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
