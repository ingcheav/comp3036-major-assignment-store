"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats { products: number; orders: number; revenue: number; users: number }

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      if (session?.user.role !== "ADMIN") { router.push("/login"); return; }
      fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    }
  }, [status, session, router]);

  if (!stats) return <div className="flex justify-center py-16"><div className="animate-spin text-3xl">⚙️</div></div>;

  const cards = [
    { label: "Total Products", value: stats.products, icon: "📦", href: "/products" },
    { label: "Total Orders", value: stats.orders, icon: "🛒", href: "/orders" },
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: "💰" },
    { label: "Total Users", value: stats.users, icon: "👤" },
  ];

  const actions = [
    { href: "/products", icon: "📦", title: "Manage Products", description: "Add, edit, or delete products" },
    { href: "/orders", icon: "🛒", title: "View Orders", description: "Browse all customer orders" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 overflow-hidden rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(3,37,76,0.98),rgba(8,58,103,0.94)_55%,rgba(17,90,152,0.84))] p-5 text-white shadow-[0_20px_50px_-36px_rgba(3,37,76,0.6)]">
        <span className="eyebrow border-white/15 bg-white/10 text-white/90">Admin overview</span>
        <h1 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Run the store from one polished control center.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
          Monitor inventory, orders, revenue, and customers with a dashboard that feels closer to a production operations tool.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-6 hover:-translate-y-1">
            <p className="text-3xl mb-3">{card.icon}</p>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            {card.href && (
              <Link href={card.href} className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#1167b1] hover:text-[#03254c]">
                Manage →
              </Link>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-base font-semibold text-slate-700">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}
            className="card group flex items-center gap-4 p-6 hover:-translate-y-1 hover:border-[#1167b1]/30">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03254c]/5 text-3xl">{action.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-[#1167b1]">{action.title}</h3>
              <p className="text-sm text-slate-500">{action.description}</p>
            </div>
            <span className="text-lg text-slate-300 transition-colors group-hover:text-[#1167b1]">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
