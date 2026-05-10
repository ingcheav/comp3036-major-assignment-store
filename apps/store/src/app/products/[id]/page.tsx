"use client";
// src/app/products/[id]/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";

interface Product {
  id: string; name: string; description: string; price: number;
  stock: number; imageUrl: string | null; category: { name: string };
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`).then((r) => r.json()).then(setProduct);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    fetch(`/api/products?category=${encodeURIComponent(product.category.name)}`)
      .then((r) => r.json())
      .then((data: Product[]) => setRelated(data.filter((p) => p.id !== id).slice(0, 4)));
  }, [product, id]);

  async function addToCart() {
    if (!session) { router.push("/login"); return; }
    setAdding(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    setAdding(false);
    setAdded(true);
  }

  if (!product) return <div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin text-3xl">⚙️</div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-[#1167b1] hover:underline mb-6 inline-block">← Back to shop</Link>

      <div className="card overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-72 md:h-96 bg-gray-50 flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain p-6" />
            ) : (
              <div className="text-6xl">📦</div>
            )}
          </div>

          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#1167b1] mb-2">{product.category.name}</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.stock === 0 ? (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-200">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  Low Stock ({product.stock} left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  In Stock
                </span>
              )}
            </div>

            {session?.user?.role !== "ADMIN" && (
              <>
                <button
                  onClick={addToCart}
                  disabled={adding || product.stock === 0 || added}
                  className="btn-primary w-full py-3 text-base"
                >
                  {adding ? "Adding…" : added ? "✓ Added to cart" : "Add to cart"}
                </button>

                {added && (
                  <Link href="/cart" className="block text-center text-sm text-[#1167b1] hover:underline mt-3">
                    View cart →
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
