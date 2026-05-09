"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

// Client component: sends the entered password to the auth API route.
export function LoginScreen() {
  const router = useRouter();

  // On success, the API sets the cookie and refresh shows the protected page.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <section 
      aria-label="Login screen" 
      className="bg-white p-5 rounded-xl shadow-sm w-full max-w-sm border border-gray-200">
        <p className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sign in to your account
        </p>

        {/* login form - login form must submit password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label 
          htmlFor="password" 
          className="block text-gray-700 mb-1">
            Password
          </label>

          <input 
          id="password" 
          name="password" 
          type="password" 
          className="w-full border border-gray-300 rounded-md px-3 py-2 
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 
          caret-black text-black appearance-none"/>
          
          <button 
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 w-full transition cursor-pointer">
            Sign In
          </button>
          
        </form>
      </section>
    </main>
  );
}
