"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.user && session.user.role !== "ADMIN") {
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => setCartCount(data.items?.length ?? 0))
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [session]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#03254c]">⚡ ElectroMart</span>
          </Link>

          {/* Center nav — desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#1167b1] transition-colors">Shop</Link>
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="hover:text-[#1167b1] transition-colors">Admin</Link>
            )}
          </div>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                {/* Guest: Sign in + Register */}
                <Link href="/orders" className="text-sm text-gray-600 hover:text-[#1167b1]">Orders</Link>
                {session.user.role !== "ADMIN" && (
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-[#1167b1]">Profile</Link>
                )}
                {session.user.role !== "ADMIN" && (
                  <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="text-lg">🛒</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#03254c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">Sign in</Link>
                <Link href="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile right: cart icon + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            {session?.user && session.user.role !== "ADMIN" && (
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#03254c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1167b1] transition-colors"
          >
            Shop
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1167b1] transition-colors"
              >
                Orders
              </Link>
              {session.user.role !== "ADMIN" && (
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1167b1] transition-colors"
                >
                  Profile
                </Link>
              )}
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1167b1] transition-colors"
                >
                  Admin
                </Link>
              )}
              <div className="pt-2 mt-1 border-t border-gray-100">
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1167b1] transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 pt-2 mt-1 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-secondary text-sm flex-1 text-center"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-sm flex-1 text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
