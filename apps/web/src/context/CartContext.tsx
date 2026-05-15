"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext<{
  cartCount: number;
  refreshCart: () => void;
}>({ cartCount: 0, refreshCart: () => {} });

/**
 * CartProvider — React context provider that tracks the number of items in the cart.
 * Fetches the cart count from /api/cart whenever the session changes.
 * Exposes cartCount (total item quantity) and refreshCart (manual refetch trigger)
 * to any descendant component via the useCart() hook.
 * Admin users always get a count of 0 as they cannot shop from the storefront.
 * @param children - The component subtree that needs access to cart state
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();

  const refreshCart = useCallback(() => {
    if (!session?.user || session.user.role === "ADMIN") {
      setCartCount(0);
      return;
    }
    fetch("/api/cart")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then(({ items }: { items: { quantity: number }[] }) => {
        setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
      })
      .catch(() => setCartCount(0));
  }, [session]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart hook — provides access to CartContext from any client component.
 * @returns { cartCount, refreshCart } — current cart item count and a refetch function
 */
export const useCart = () => useContext(CartContext);