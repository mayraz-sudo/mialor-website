"use client";

import Image from "next/image";
import { useState } from "react";
import { perLabel, type ShopItem } from "@/lib/shop";
import { ComingSoon } from "../ProductMedia";
import { useCart } from "./CartContext";
import { Stepper, money } from "./CartDrawer";

export default function ShopClient({ items }: { items: ShopItem[] }) {
  const { qtyOf, setQty, count, cart, openCart } = useCart();
  const visible = items.filter((i) => !i.hidden);
  const subtotal = cart.reduce((a, l) => a + (items.find((i) => i.id === l.id)?.price ?? 0) * l.qty, 0);

  const add = (id: string) => {
    setQty(id, 1);
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-5 md:py-16">
      <ul className="grid grid-cols-2 gap-x-3.5 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((item) => {
          const q = qtyOf(item.id);
          return (
            <li key={item.id} className="flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-surface">
                {item.image ? <ItemPhotos item={item} /> : <ComingSoon name={item.name} />}
              </div>
              <h3 className="t-h3 mt-3.5 text-[1.15rem] leading-snug md:text-[1.3rem]">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-[0.92rem] leading-relaxed text-muted">{item.description}</p>
              <p className="mt-2 font-medium tabular-nums">
                {money(item.price)}
                {item.per && <span className="ms-1.5 text-[0.88rem] font-normal text-muted">{perLabel(item)}</span>}
              </p>
              <div className="mt-auto pt-3">
                {q === 0 ? (
                  <button type="button" onClick={() => add(item.id)} className="btn btn-primary btn-sm w-full">
                    הוספה לסל
                  </button>
                ) : (
                  <Stepper value={q} onChange={(n) => setQty(item.id, n)} max={item.maxQty} name={item.name} />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* פס סל בתחתית המסך – מופיע כשיש פריטים בסל */}
      {count > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-[76px] pb-4 sm:px-24 sm:pb-5">
          <button
            type="button"
            onClick={openCart}
            className="pointer-events-auto mx-auto flex h-14 w-full max-w-[460px] items-center justify-between gap-2 rounded-[2px] bg-ink px-4 text-[0.95rem] text-bg shadow-[0_8px_30px_rgba(58,42,32,0.25)] sm:px-5"
          >
            <span className="font-medium">לתשלום</span>
            <span className="tabular-nums">
              {count} · {money(subtotal)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/** תמונת פריט; אם יש תמונה שנייה – מתחלפת במעבר עכבר, ובנייד בלחיצה על הכפתור */
function ItemPhotos({ item }: { item: ShopItem }) {
  const [second, setSecond] = useState(false);
  const sizes = "(min-width: 1024px) 25vw, 50vw";
  if (!item.image2) return <Image src={item.image!} alt={item.name} fill sizes={sizes} className="object-cover" />;
  return (
    <div className="group absolute inset-0">
      <Image src={item.image!} alt={item.name} fill sizes={sizes} className="object-cover" />
      <Image
        src={item.image2}
        alt={`${item.name} – תמונה נוספת`}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-500 ${second ? "opacity-100" : "opacity-0 [@media(hover:hover)]:group-hover:opacity-100"}`}
      />
      <button
        type="button"
        onClick={() => setSecond((s) => !s)}
        aria-pressed={second}
        aria-label={second ? "הצגת התמונה הראשית" : "הצגת תמונה נוספת"}
        className="absolute bottom-2.5 left-2.5 flex gap-1.5 rounded-full bg-white/85 px-2.5 py-2"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${second ? "bg-ink/30" : "bg-ink"}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${second ? "bg-ink" : "bg-ink/30"}`} />
      </button>
    </div>
  );
}
