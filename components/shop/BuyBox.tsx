"use client";

import { useState } from "react";
import type { ShopItem } from "@/lib/shop";
import { useCart } from "./CartContext";
import { Stepper } from "./CartDrawer";
import { productParams, track } from "@/lib/pixel";

/** בחירת כמות והוספה לסל, בעמוד המוצר */
export default function BuyBox({ item }: { item: ShopItem }) {
  const { qtyOf, setQty, openCart } = useCart();
  const [qty, setLocalQty] = useState(1);
  const inCart = qtyOf(item.id);
  const max = item.maxQty ?? 99;

  const add = () => {
    setQty(item.id, Math.min(max, inCart + qty));
    track("AddToCart", { ...productParams(item), value: item.price * qty, num_items: qty });
    openCart();
  };

  return (
    <div>
      <div className="flex items-stretch gap-3">
        <Stepper value={qty} onChange={(n) => setLocalQty(Math.max(1, n))} max={max} name={item.name} />
        <button type="button" onClick={add} className="btn btn-primary flex-1">
          הוספה לסל
        </button>
      </div>
      <p className="mt-2 min-h-5 text-[0.88rem] text-muted" aria-live="polite">
        {inCart > 0 && (
          <>
            בסל: {inCart} ·{" "}
            <button type="button" onClick={openCart} className="underline decoration-accent underline-offset-4">
              לצפייה בסל ולתשלום
            </button>
          </>
        )}
      </p>
    </div>
  );
}
