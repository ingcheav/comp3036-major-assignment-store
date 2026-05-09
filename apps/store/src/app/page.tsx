"use client";
// src/app/page.tsx
import { ProductGrid } from "@/components/product/ProductGrid";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-[#03254c] rounded-2xl p-8 mb-10 text-white">
        <h1 className="text-3xl font-bold mb-2">Premium Electronics</h1>
        <p className="text-gray-300 text-lg">Laptops, phones, audio and more — shipped fast.</p>
      </div>

        <ProductGrid />

    </div>
  );
}
