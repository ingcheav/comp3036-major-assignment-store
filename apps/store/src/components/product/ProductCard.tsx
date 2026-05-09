"use client";
// src/components/product/ProductCard.tsx
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  id: string; name: string; description: string; price: number;
  stock: number; imageUrl: string | null; category: { name: string };
}

export function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
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
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-md transition-shadow" data-testid="product-card">
      <Link href={`/products/${product.id}`}>
        <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-40 max-w-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">📦</div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-[#1167b1] font-medium mb-1">{product.category.name}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-[#1167b1] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {session?.user?.role !== "ADMIN" && (
            product.stock === 0 ? (
              <span className="text-sm text-red-500 font-medium">Out of stock</span>
            ) : (
              <button
                onClick={addToCart}
                disabled={adding || product.stock === 0}
                className="btn-primary text-sm"
                data-testid="add-to-cart-btn"
              >
                {adding ? "Adding…" : added ? "✓ Added" : "Add to cart"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
