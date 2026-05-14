"use client";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <section className="section-shell mb-6 overflow-hidden bg-[linear-gradient(135deg,rgba(3,37,76,0.98),rgba(8,58,103,0.94)_55%,rgba(17,90,152,0.84))] p-4 text-white shadow-[0_22px_60px_-36px_rgba(3,37,76,0.6)] sm:p-5">
        <div className="max-w-3xl space-y-2.5">
          <div className="space-y-2.5">
            <span className="eyebrow border-white/15 bg-white/10 text-white/90">Built for everyday tech</span>
            <div className="space-y-1.5">
              <h1 className="max-w-2xl text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
                Premium electronics with a more considered experience.
              </h1>
              <p className="max-w-2xl text-sm leading-5 text-white/78 sm:text-[0.92rem]">
                Discover laptops, audio gear, phones, and accessories presented like a real modern store, not a generic catalog.
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/65 sm:text-sm sm:tracking-[0.24em]">
              Fast shipping in 2-4 days
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="#products" className="btn-primary bg-white px-4 py-2.5 text-[#03254c] shadow-none hover:bg-slate-100">
                Browse products
              </Link>
              <Link href="#products" className="btn-secondary border-white/20 bg-white/10 px-4 py-2.5 text-white hover:bg-white/15 hover:text-white">
                Explore categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div id="products">
        <ProductGrid />
      </div>
    </div>
  );
}
