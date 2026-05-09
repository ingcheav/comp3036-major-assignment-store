"use client";
// src/app/admin/page.tsx
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
      if (session?.user.role !== "ADMIN") { router.push("/"); return; }
      fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    }
  }, [status, session, router]);

  if (!stats) return <div className="flex justify-center py-16"><div className="animate-spin text-3xl">⚙️</div></div>;

  const cards = [
    { label: "Total Products", value: stats.products, icon: "📦", href: "/admin/products" },
    { label: "Total Orders", value: stats.orders, icon: "🛒", href: "/admin/orders" },
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: "💰" },
    { label: "Total Users", value: stats.users, icon: "👤" },
  ];

  const actions = [
    { href: "/admin/products", icon: "📦", title: "Manage Products", description: "Add, edit, or delete products" },
    { href: "/admin/orders", icon: "🛒", title: "View Orders", description: "Browse all customer orders" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <p className="text-3xl mb-3">{card.icon}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            {card.href && (
              <Link href={card.href} className="text-xs text-[#1167b1] hover:underline mt-2 inline-block">
                Manage →
              </Link>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-base font-semibold text-gray-700 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="card p-6 flex items-center gap-4 hover:shadow-md hover:border-[#1167b1] transition-all group"
          >
            <span className="text-3xl">{action.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#1167b1] transition-colors">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
            <span className="text-gray-300 group-hover:text-[#1167b1] transition-colors text-lg">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
