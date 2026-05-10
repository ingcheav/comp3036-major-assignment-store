"use client";
// src/app/cart/page.tsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: string; quantity: number;
  product: { id: string; name: string; price: number; imageUrl: string | null; stock: number };
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") { router.push("/admin"); return; }
      fetch("/api/cart").then((r) => r.json()).then((d) => { setItems(d.items); setLoading(false); });
    }
  }, [status, session, router]);

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return removeItem(id);
    await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  async function removeItem(id: string) {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const text = await res.text();
      if (!text) {
        console.error("Empty response from checkout API");
        setCheckingOut(false);
        return;
      }
      const data = JSON.parse(text);
      if (!res.ok) {
        console.error("Checkout error:", data.error);
        setCheckingOut(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckingOut(false);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      setCheckingOut(false);
    }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const uniqueProducts = items.length;

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin text-3xl">⚙️</div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Link href="/" className="text-sm text-[#1167b1] hover:underline">← Continue Shopping</Link>
      </div>

      {items.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link href="/" className="btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4" data-testid="cart-item">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product.imageUrl
                      ? <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full max-w-full object-contain p-1" />
                      : <div className="text-2xl">📦</div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + subtotal */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                      </div>
                      <p className="font-semibold text-gray-900 flex-shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Qty controls + remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-sm">−</button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => { if (item.quantity >= item.product.stock) return; updateQuantity(item.id, item.quantity + 1); }}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit bg-gray-50 border-gray-100">
            <h2 className="font-semibold text-lg mb-4 text-gray-900">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} disabled={checkingOut} className="btn-primary w-full py-3" data-testid="checkout-btn">
              {checkingOut ? "Redirecting…" : "Proceed to Checkout"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">Secure checkout powered by Stripe</p>
          </div>
        </div>
      )}
    </div>
  );
}
