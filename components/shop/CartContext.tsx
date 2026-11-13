"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { shopItems, type CartLine } from "@/lib/shop";
import CartDrawer from "./CartDrawer";

const KEY = "mialor-cart";

type CartState = {
  cart: CartLine[];
  count: number;
  qtyOf: (id: string) => number;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const Ctx = createContext<CartState | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

/** סל קניות משותף לכל האתר: אייקון בכותרת, ומגירה עם הסל והתשלום */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);

  // הסל נשמר במכשיר
  useEffect(() => {
    try {
      const valid = new Set(shopItems().filter((i) => !i.hidden).map((i) => i.id));
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved.filter((l) => valid.has(l?.id) && Number.isFinite(l?.qty) && l.qty > 0));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, loaded]);

  const setQty = useCallback(
    (id: string, qty: number) =>
      setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty } : l)) : [...c, { id, qty }])),
    [],
  );

  const clear = useCallback(() => setCart([]), []);

  const value = useMemo<CartState>(
    () => ({
      cart,
      count: cart.reduce((a, l) => a + l.qty, 0),
      qtyOf: (id) => cart.find((l) => l.id === id)?.qty ?? 0,
      setQty,
      clear,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    }),
    [cart, isOpen, setQty, clear],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}
