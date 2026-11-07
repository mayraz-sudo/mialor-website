"use client";

import { useEffect, useState } from "react";
import { PROMO, discounted, formatAmount, isPromoActive, type Product } from "@/lib/site";

/**
 * האם המבצע פעיל עכשיו.
 * בטעינה הראשונה משתמשים בתאריך הבנייה (כמו בשרת), ומיד אחר כך בודקים לפי התאריך האמיתי במכשיר –
 * כך המבצע נעלם לבד כשהחודש נגמר, גם בלי לבנות את האתר מחדש.
 */
export function usePromoActive() {
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE) : new Date();
  const [active, setActive] = useState(() => isPromoActive(buildDate));
  useEffect(() => setActive(isPromoActive(new Date())), []);
  return active;
}

/** פס מבצע בראש האתר */
export function PromoBar() {
  const active = usePromoActive();
  if (!active) return null;
  return (
    <div className="bg-ink px-5 py-2 text-center text-[0.88rem] leading-snug text-bg">
      <span className="font-serif text-[1rem]">{PROMO.name}</span>
      <span aria-hidden className="mx-2 text-[#d4c0a1]">·</span>
      <span className="sm:hidden">{PROMO.barShort}</span>
      <span className="hidden sm:inline">{PROMO.bar.replace(`${PROMO.name}: `, "")}</span>
    </div>
  );
}

/** תגית על תמונת המוצר */
export function PromoBadge({ product }: { product: Product }) {
  const active = usePromoActive();
  if (!active || product.priceFrom === null) return null;
  return (
    <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-ink px-2.5 py-1 text-[0.78rem] leading-none font-medium text-bg md:top-3 md:right-3">
      {PROMO.badge}
    </span>
  );
}

/** מחיר: במבצע – המחיר אחרי הנחה ולידו המחיר המקורי מחוק */
export function PromoPrice({ product, large = false }: { product: Product; large?: boolean }) {
  const active = usePromoActive();
  if (product.priceFrom === null) return <span className="font-medium">מחיר לפי הזמנה</span>;
  const unit = <span className="text-muted">{product.unit}</span>;
  if (!active) {
    return (
      <>
        <span className="font-medium">החל מ־{formatAmount(product.priceFrom)}</span> {unit}
      </>
    );
  }
  return (
    <>
      <span className="font-medium">החל מ־{formatAmount(discounted(product.priceFrom))}</span>{" "}
      <s className={`text-muted ${large ? "text-[0.95rem]" : "text-[0.85rem]"}`}>
        <span className="sr-only">במקום </span>
        {formatAmount(product.priceFrom)}
      </s>{" "}
      {unit}
    </>
  );
}

/** הערה קטנה בעמוד המוצר */
export function PromoNote() {
  const active = usePromoActive();
  if (!active) return null;
  return (
    <p className="mt-2 text-[0.92rem] text-accent-strong">
      {PROMO.name}: {PROMO.percent}% הנחה על הזמנות שנשלחות בחודש נובמבר. ההנחה כבר מחושבת במחיר.
    </p>
  );
}
