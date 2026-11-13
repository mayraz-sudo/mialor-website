"use client";
import { useEffect } from "react";
import { useCart } from "./CartContext";

/** מרוקן את הסל אחרי תשלום מוצלח */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    try {
      localStorage.removeItem("mialor-cart");
    } catch {}
    clear();
  }, [clear]);
  return null;
}
