"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#031b34]/95 text-white shadow-[0_16px_50px_-28px_rgba(3,37,76,0.9)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 py-2">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#03254c] text-lg text-white shadow-lg shadow-[#03254c]/20">⚡</span>
            <span>
              <span className="block text-lg font-semibold tracking-tight text-white">ElectroMart</span>
              <span className="block text-xs uppercase tracking-[0.22em] text-white/60">Premium electronics</span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {session?.user ? (
              <>
                <Link href="/orders" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Orders</Link>
                {session.user.role !== "ADMIN" && (
                  <Link href="/profile" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Profile</Link>
                )}
                {session.user.role !== "ADMIN" && (
                  <Link href="/cart" className="relative rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15 hover:shadow-md">
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1167b1] text-[11px] font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-secondary text-sm">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">Sign in</Link>
                <Link href="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {session?.user && session.user.role !== "ADMIN" && (
              <Link href="/cart" className="relative rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-white/20 hover:bg-white/15">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1167b1] text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#031b34]/98 px-4 py-3 shadow-lg shadow-slate-900/20 md:hidden">
          {session?.user ? (
            <>
              <Link href="/orders" onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                Orders
              </Link>
              {session.user.role !== "ADMIN" && (
                <Link href="/profile" onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  Profile
                </Link>
              )}
              <div className="mt-2 border-t border-white/10 pt-2">
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="block w-full rounded-2xl px-3 py-3 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary w-full text-sm">
                Sign in
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
