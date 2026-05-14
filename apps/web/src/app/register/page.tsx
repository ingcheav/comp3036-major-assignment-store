"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/85 p-8 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-[#03254c]">ElectroMart</Link>
          <p className="mt-2 text-sm text-slate-500">Create an account to get started.</p>
        </div>

        <div className="card p-7 shadow-none">
          <span className="eyebrow">Get started</span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Already have an account? <Link href="/login" className="font-medium text-[#1167b1] hover:text-[#03254c]">Sign in</Link>
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" data-testid="register-form">
            {(["name", "email", "password"] as const).map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium capitalize text-slate-700">{field}</label>
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
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
