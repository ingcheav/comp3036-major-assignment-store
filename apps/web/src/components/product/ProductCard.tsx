"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string; name: string; description: string; price: number;
  stock: number; imageUrl: string | null; category: { name: string };
}

export function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { refreshCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function addToCart() {
    if (!session) { router.push("/login"); return; }
    setAdding(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    setAdding(false);
    setAdded(true);
    refreshCart();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.45)]" data-testid="product-card">
      <div className="p-4 sm:p-5">
        <Link href={`/products/${product.id}`} className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200/70 bg-[linear-gradient(160deg,rgba(248,250,252,0.98),rgba(226,232,240,0.72))] shadow-sm sm:h-28 sm:w-28">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]" />
            ) : (
              <div className="text-4xl">📦</div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1167b1]">{product.category.name}</span>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-[#1167b1] line-clamp-2">
              {product.name}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{product.description}</p>
          </div>
        </Link>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
          <span data-testid="product-price" className="text-xl font-semibold tracking-tight text-slate-900">${product.price.toFixed(2)}</span>
          {session?.user?.role !== "ADMIN" && (
            product.stock === 0 ? (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600">Out of stock</span>
            ) : (
              <button onClick={addToCart} disabled={adding || product.stock === 0}
                className="btn-primary text-sm" data-testid="add-to-cart-btn">
                {adding ? "Adding…" : added ? "✓ Added" : "Add to cart"}
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
}
