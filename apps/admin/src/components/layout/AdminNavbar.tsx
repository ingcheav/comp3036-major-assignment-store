"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  }

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/products", label: "Products" },
    { href: "/orders", label: "Orders" },
    { href: "/preview", label: "Preview Store" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#031b34]/92 text-white shadow-[0_16px_50px_-28px_rgba(3,37,76,0.9)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">⚡</span>
              <span>
                <span className="block">ElectroMart Admin</span>
                <span className="block text-xs uppercase tracking-[0.22em] text-white/50">Operations console</span>
              </span>
            </Link>
            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-white text-[#03254c] shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {session?.user && (
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 sm:block">{session.user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
