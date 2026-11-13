"use client";

import Image from "next/image";
import Link from "next/link";
import { perLabel, shopItemHref, type ShopItem } from "@/lib/shop";
import { ComingSoon } from "../ProductMedia";
import { useCart } from "./CartContext";
import { productParams, track } from "@/lib/pixel";
import { Stepper, money } from "./CartDrawer";

export default function ShopClient({ items }: { items: ShopItem[] }) {
  const { qtyOf, setQty, count, cart, openCart } = useCart();
  const visible = items.filter((i) => !i.hidden);
  const subtotal = cart.reduce((a, l) => a + (items.find((i) => i.id === l.id)?.price ?? 0) * l.qty, 0);

  const add = (id: string) => {
    setQty(id, 1);
    const item = items.find((i) => i.id === id);
    if (item) track("AddToCart", { ...productParams(item), num_items: 1 });
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-5 md:py-16">
      <ul className="grid grid-cols-2 gap-x-3.5 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((item) => {
          const q = qtyOf(item.id);
          return (
            <li key={item.id} className="flex flex-col">
              <Link href={shopItemHref(item.id)} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-[2px] bg-surface">
                  {item.image ? <ItemPhotos item={item} /> : <ComingSoon name={item.name} />}
                </div>
                <h2 className="t-h3 mt-3.5 text-[1.1rem] leading-snug group-hover:text-accent-strong md:text-[1.25rem]">{item.name}</h2>
                <p className="mt-1 text-[0.92rem] leading-relaxed text-muted">{item.description}</p>
              </Link>
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

/** תמונת פריט בכרטיס; אם יש תמונה שנייה – מתחלפת במעבר עכבר (את כל התמונות רואים בעמוד המוצר) */
function ItemPhotos({ item }: { item: ShopItem }) {
  const sizes = "(min-width: 1024px) 25vw, 50vw";
  return (
    <>
      <Image src={item.image!} alt={item.name} fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      {item.image2 && (
        <>
          <Image src={item.image2} alt="" fill sizes={sizes} className="object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100" />
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/85 px-2 py-0.5 text-[0.75rem] text-ink">2 תמונות</span>
        </>
      )}
    </>
  );
}
