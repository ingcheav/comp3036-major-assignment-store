"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; description: string; price: number;
  stock: number; imageUrl: string | null; category: Category;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest-Oldest" },
  { value: "oldest", label: "Oldest-Newest" },
  { value: "name_asc", label: "Title: A–Z" },
  { value: "name_desc", label: "Title: Z–A" },
  { value: "price_asc", label: "Price: Low–High" },
  { value: "price_desc", label: "Price: High–Low" },
];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700 font-medium">Out of Stock</span>;
  if (stock <= 5)
    return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-50 text-yellow-700 font-medium">Low Stock</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 font-medium">In Stock</span>;
}

export default function AdminPreviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session?.user.role !== "ADMIN") { router.push("/login"); return; }
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy) params.set("sortBy", sortBy);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  }, [status, search, selectedCategory, sortBy, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="section-shell mb-6 overflow-hidden bg-[linear-gradient(135deg,rgba(3,37,76,0.98),rgba(8,58,103,0.94)_55%,rgba(17,90,152,0.84))] text-white shadow-[0_22px_60px_-36px_rgba(3,37,76,0.6)]">
        <div className="grid gap-4 lg:items-center">
          <div className="space-y-2">
            <span className="eyebrow border-white/15 bg-white/10 text-white/90">Store preview</span>
            <h1 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">Store Preview</h1>
            <p className="max-w-2xl text-sm leading-6 text-white/78">Read-only view of the customer-facing store. Click Edit to manage a product.</p>
          </div>
        </div>
      </section>

      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input sm:w-52 cursor-pointer bg-white"
        >
          <option value="" disabled>Sort by</option>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Price filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <label className="text-sm font-medium text-gray-700">Price Range:</label>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input sm:w-36"
          min="0"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input sm:w-36"
          min="0"
        />
        {(minPrice || maxPrice) && (
          <button
            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
            className="text-sm text-gray-500 hover:text-gray-700 underline self-center"
          >
            Clear price
          </button>
        )}
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === ""
                ? "bg-[#03254c] text-white border-[#03254c]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1167b1] hover:text-[#1167b1]"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name === selectedCategory ? "" : c.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === c.name
                  ? "bg-[#03254c] text-white border-[#03254c]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1167b1] hover:text-[#1167b1]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="card flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="max-h-40 max-w-full object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">📦</div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-[#1167b1] font-medium mb-1">{p.category.name}</span>
                <h3 className="font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{p.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-gray-900">${p.price.toFixed(2)}</span>
                  <StockBadge stock={p.stock} />
                </div>

                <Link
                  href={`/products?edit=${p.id}`}
                  className="mt-3 btn-secondary text-sm text-center"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
