"use client";
// src/app/checkout/success/page.tsx
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card p-12 text-center max-w-md">
        <p className="text-6xl mb-4">✅</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order confirmed!</h1>
        <p className="text-gray-500 mb-8">Thanks for your purchase. You&apos;ll receive a confirmation shortly.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/orders" className="btn-secondary">View orders</Link>
          <Link href="/" className="btn-primary">Keep shopping</Link>
        </div>
      </div>
    </div>
  );
}
