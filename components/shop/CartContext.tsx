"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SHOP_ITEMS, lineKey, type CartLine, type ShopItem } from "@/lib/shop";
import CartDrawer from "./CartDrawer";

const KEY = "mialor-cart";

type CartState = {
  /** רשימת המוצרים העדכנית (נטענת מהשרת) */
  items: ShopItem[];
  cart: CartLine[];
  count: number;
  /** כמה יחידות של מוצר יש בסל (בכל הצבעים) */
  qtyOf: (id: string) => number;
  /** קביעת כמות לשורה בסל לפי המפתח שלה (מוצר בלי אפשרויות: המפתח הוא id||) */
  setQty: (key: string, qty: number) => void;
  /** הוספה לסל – אם כבר יש שורה זהה (אותו צבע והטבעה), הכמות מתווספת */
  add: (line: CartLine) => void;
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
    (key: string, qty: number) =>
      setCart((c) => {
        const k = key.includes("|") ? key : lineKey({ id: key });
        if (qty <= 0) return c.filter((l) => lineKey(l) !== k);
        if (c.some((l) => lineKey(l) === k)) return c.map((l) => (lineKey(l) === k ? { ...l, qty } : l));
        const [id, color, engrave] = k.split("|");
        return [...c, { id, qty, ...(color ? { color } : {}), ...(engrave ? { engrave } : {}) }];
      }),
    [],
  );
  const add = useCallback(
    (line: CartLine) =>
      setCart((c) => {
        const k = lineKey(line);
        return c.some((l) => lineKey(l) === k) ? c.map((l) => (lineKey(l) === k ? { ...l, qty: l.qty + line.qty } : l)) : [...c, line];
      }),
    [],
  );

  const clear = useCallback(() => setCart([]), []);

  const value = useMemo<CartState>(
    () => ({
      items,
      cart,
      count: cart.reduce((a, l) => a + l.qty, 0),
      qtyOf: (id) => cart.filter((l) => l.id === id).reduce((a, l) => a + l.qty, 0),
      setQty,
      add,
      clear,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    }),
    [items, cart, isOpen, setQty, add, clear],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}
