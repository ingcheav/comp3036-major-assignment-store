"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Order {
  id: string; total: number; status: string; createdAt: string;
  user: { name: string; email: string };
  orderItems: { id: string; quantity: number; price: number; product: { name: string } }[];
}

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      if (session?.user.role !== "ADMIN") { router.push("/login"); return; }
      fetchOrders();
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [status, session, router, fetchOrders]);

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin text-3xl">⚙️</div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">All Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1">Orders will appear here once customers complete a purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6" data-testid="order-row">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium" data-testid="order-id">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{order.user.name} — {order.user.email}</p>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status] ?? "bg-gray-100"}`} data-testid="order-status">
                    {order.status}
                  </span>
                  <p className="font-bold text-lg mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1" data-testid="order-detail-view">
                {order.orderItems.map((item) => (
                  <p key={item.id} className="text-sm text-gray-600">
                    {item.product.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}