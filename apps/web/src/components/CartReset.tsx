"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export function CartReset() {
  const { refreshCart } = useCart();
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);
  return null;
}
