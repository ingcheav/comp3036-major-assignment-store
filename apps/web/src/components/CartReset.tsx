"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/**
 * CartReset component — side-effect-only component that refreshes the cart count on mount.
 * Used on the checkout success page to reset the cart badge in the navbar
 * after a successful payment clears the user's cart server-side.
 * Renders nothing to the DOM.
 */
export function CartReset() {
  const { refreshCart } = useCart();
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);
  return null;
}
