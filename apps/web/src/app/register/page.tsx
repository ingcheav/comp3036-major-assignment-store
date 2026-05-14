"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/55 bg-white/60 p-7 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.42)] backdrop-blur-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03254c] text-2xl text-white shadow-lg shadow-[#03254c]/20">⚡</div>
          <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-900">ElectroMart</Link>
          <p className="mt-2 text-sm text-slate-500">Create an account to get started.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" data-testid="register-form">
          {(["name", "email", "password"] as const).map((field) => (
            <div key={field}>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 capitalize">{field}</label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                required
                className="input"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                data-testid={`${field}-input`}
              />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              required
              className="input"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              data-testid="confirm-password-input"
            />
          </div>
          <p className="pt-1 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="font-medium text-[#1167b1] hover:text-[#03254c]">Sign in</Link>
          </p>
          <button type="submit" data-testid="register-btn" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
