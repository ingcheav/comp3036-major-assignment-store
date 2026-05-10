"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
      ]).then(([prof, orders]) => {
        setProfile(prof);
        setOrderCount(Array.isArray(orders) ? orders.length : 0);
        setLoading(false);
      });
    }
  }, [status, router]);

  if (loading || status === "loading") {
    return <div className="flex justify-center py-16"><div className="animate-spin text-3xl">⚙️</div></div>;
  }
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#03254c] mb-8">My Profile</h1>

      <div className="card p-8 mb-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#03254c] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {profile.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-[#03254c]">{orderCount ?? 0}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Member Since</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/orders" className="btn-secondary flex-1 text-center py-2.5">
          View Orders
        </Link>
        <button className="btn-primary flex-1 py-2.5 opacity-50 cursor-not-allowed" disabled>
          Edit Profile
        </button>
      </div>
    </div>
  );
}
