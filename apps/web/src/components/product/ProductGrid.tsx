"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";

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

interface Props {
  initialCategories?: Category[];
}

/**
 * ProductGrid component — interactive product catalogue with filtering and search.
 * Fetches products from /api/products whenever filter state changes.
 * Supports: text search, category filter (pill buttons + dropdown), sort order (6 modes),
 * and min/max price range filtering.
 * Categories can be pre-fetched server-side and passed in via initialCategories
 * to avoid a client-side waterfall on first load.
 * @param initialCategories - Server-prefetched categories (avoids extra client fetch)
 */
export function ProductGrid({ initialCategories = [] }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialCategories.length === 0) {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => setCategories(Array.isArray(data) ? data : []));
    }
  }, [initialCategories.length]);

  useEffect(() => {
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
  }, [search, selectedCategory, sortBy, minPrice, maxPrice]);

  return (
    <section className="section-shell">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <span className="eyebrow">Shop the collection</span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Find the right device without the clutter.</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Filter by category, price, and sort order. The layout stays focused while still feeling like a premium storefront.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-500">
          {loading ? "Loading products…" : `${products.length} item${products.length === 1 ? "" : "s"} available`}
        </p>
      </div>

      <div className="mb-4 grid gap-3 rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm md:grid-cols-[1.5fr_0.8fr_0.8fr]">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          data-testid="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input cursor-pointer bg-white"
          data-testid="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input cursor-pointer bg-white"
          data-testid="sort-filter"
        >
          <option value="" disabled>Sort by</option>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="text-sm font-medium text-slate-600 sm:mr-2">Price Range</span>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input sm:w-40"
          min="0"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input sm:w-40"
          min="0"
        />
        {(minPrice || maxPrice) && (
          <button
            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
            className="self-start text-sm font-medium text-[#1167b1] transition-colors hover:text-[#03254c] hover:underline sm:self-center"
          >
            Clear price
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === "" ? "border-[#03254c] bg-[#03254c] text-white shadow-lg shadow-[#03254c]/15" : "border-slate-200 bg-white/80 text-slate-600 hover:border-[#1167b1]/40 hover:text-[#03254c]"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name === selectedCategory ? "" : c.name)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === c.name ? "border-[#03254c] bg-[#03254c] text-white shadow-lg shadow-[#03254c]/15" : "border-slate-200 bg-white/80 text-slate-600 hover:border-[#1167b1]/40 hover:text-[#03254c]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card h-72 animate-pulse bg-[linear-gradient(90deg,rgba(226,232,240,0.65),rgba(241,245,249,0.95),rgba(226,232,240,0.65))] bg-[length:200%_100%]" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 py-16 text-center text-slate-500">
          <p className="mb-3 text-4xl">🔍</p>
          <p className="font-medium text-slate-700">No products found.</p>
          <p className="mt-1 text-sm text-slate-500">Try a different keyword or clear the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}