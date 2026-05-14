"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext<{
  cartCount: number;
  refreshCart: () => void;
}>({ cartCount: 0, refreshCart: () => {} });

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

export const useCart = () => useContext(CartContext);
