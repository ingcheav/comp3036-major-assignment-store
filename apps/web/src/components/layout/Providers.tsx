"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

/**
 * Providers component — wraps the application with required React context providers.
 * Nests SessionProvider (NextAuth) and CartProvider so that authentication state
 * and cart count are available throughout the entire component tree.
 * @param children - The application subtree to wrap
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}