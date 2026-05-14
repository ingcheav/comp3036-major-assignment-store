"use client";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <section className="section-shell mb-6 overflow-hidden bg-[linear-gradient(135deg,rgba(3,37,76,0.98),rgba(8,58,103,0.94)_55%,rgba(17,90,152,0.84))] text-white shadow-[0_22px_60px_-36px_rgba(3,37,76,0.6)]">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-3">
            <span className="eyebrow border-white/15 bg-white/10 text-white/90">Built for everyday tech</span>
            <div className="space-y-2">
              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                Premium electronics with a more considered experience.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/78 sm:text-[0.95rem]">
                Discover laptops, audio gear, phones, and accessories presented like a real modern store, not a generic catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="#products" className="btn-primary bg-white px-5 py-3 text-[#03254c] shadow-none hover:bg-slate-100">
                Browse products
              </Link>
              <Link href="#products" className="btn-secondary border-white/20 bg-white/10 px-5 py-3 text-white hover:bg-white/15 hover:text-white">
                Explore categories
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur">
              <p className="text-sm text-white/70">Fast shipping</p>
              <p className="mt-1 text-lg font-semibold">2-4 days</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur">
              <p className="text-sm text-white/70">Curated selection</p>
              <p className="mt-1 text-lg font-semibold">Daily essentials</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur">
              <p className="text-sm text-white/70">Support</p>
              <p className="mt-1 text-lg font-semibold">Human-first service</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { title: "Designed for real life", text: "Clear product details, fast scanning, and a premium shopping flow." },
          { title: "Trusted by shoppers", text: "A clean storefront that feels closer to a polished retail brand." },
          { title: "Built to explore", text: "Browse, filter, compare, and buy without the page feeling crowded." },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1167b1]">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>

      <div id="products">
        <ProductGrid />
      </div>
    </div>
  );
}
