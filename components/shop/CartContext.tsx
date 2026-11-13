"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SHOP_ITEMS, type CartLine, type ShopItem } from "@/lib/shop";
import CartDrawer from "./CartDrawer";

const KEY = "mialor-cart";

type CartState = {
  /** רשימת המוצרים העדכנית (נטענת מהשרת) */
  items: ShopItem[];
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

  const [items, setItems] = useState<ShopItem[]>(SHOP_ITEMS);

  // הסל נשמר במכשיר; רשימת המוצרים העדכנית נטענת מהשרת
  useEffect(() => {
    let saved: CartLine[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) saved = raw.filter((l) => typeof l?.id === "string" && Number.isFinite(l?.qty) && l.qty > 0);
    } catch {}
    setCart(saved);
    setLoaded(true);
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { items?: ShopItem[] } | null) => {
        if (!d?.items) return;
        setItems(d.items);
        const valid = new Set(d.items.map((i) => i.id));
        setCart((c) => c.filter((l) => valid.has(l.id)));
      })
      .catch(() => {});
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
      items,
      cart,
      count: cart.reduce((a, l) => a + l.qty, 0),
      qtyOf: (id) => cart.find((l) => l.id === id)?.qty ?? 0,
      setQty,
      clear,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    }),
    [items, cart, isOpen, setQty, clear],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}
