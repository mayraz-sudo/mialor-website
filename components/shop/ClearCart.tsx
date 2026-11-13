"use client";
import { useEffect } from "react";

/** מרוקן את הסל אחרי תשלום מוצלח */
export default function ClearCart() {
  useEffect(() => {
    try {
      localStorage.removeItem("mialor-cart");
    } catch {}
  }, []);
  return null;
}
