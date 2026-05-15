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

/**
 * ProductCard component — displays a single product in the catalogue grid.
 * Shows the product image, category badge, name, description, and price.
 * Includes an "Add to cart" button for logged-in non-admin users.
 * Redirects unauthenticated users to /login when they attempt to add to cart.
 * @param product - The product data to display
 */
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
      <Link href={`/products/${product.id}`} className="block">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-[linear-gradient(160deg,rgba(248,250,252,0.98),rgba(226,232,240,0.72))]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-[1.04]" />
          ) : (
            <div className="text-6xl">📦</div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/products/${product.id}`} className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1167b1]">{product.category.name}</span>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-[#1167b1] line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
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
