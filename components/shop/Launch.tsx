"use client";

import { useEffect, useState } from "react";
import { LAUNCH, isLaunchActive, itemPrice, perLabel, type ShopItem } from "@/lib/shop";

const money = (n: number) => `₪${n.toLocaleString("he-IL")}`;

/** האם מחירי ההשקה פעילים – מתחיל מתאריך הבנייה ובודק את התאריך האמיתי בדפדפן */
export function useLaunchActive() {
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE) : new Date();
  const [active, setActive] = useState(() => isLaunchActive(buildDate));
  useEffect(() => setActive(isLaunchActive(new Date())), []);
  return active;
}

/** מחיר פריט: בהשקה – המחיר החדש ולידו המחיר המקורי מחוק */
export function LaunchPrice({ item, large = false }: { item: ShopItem; large?: boolean }) {
  const active = useLaunchActive();
  const price = itemPrice(item, active);
  return (
    <span className="tabular-nums">
      <span className={large ? "text-[1.35rem]" : "font-medium"}>{money(price)}</span>
      {active && (
        <>
          <span className="sr-only"> במקום </span>
          <s className={`ms-2 text-muted ${large ? "text-[1.05rem]" : "text-[0.88rem] font-normal"}`}>{money(item.price)}</s>
        </>
      )}
      {item.per && <span className={`ms-1.5 font-normal text-muted ${large ? "text-[1rem]" : "text-[0.88rem]"}`}>{perLabel(item)}</span>}
    </span>
  );
}

/** תגית על תמונת המוצר */
export function LaunchBadge() {
  const active = useLaunchActive();
  if (!active) return null;
  return (
    <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-ink px-2.5 py-1 text-[0.78rem] leading-none font-medium text-bg">
      {LAUNCH.badge}
    </span>
  );
}

/** פס הודעה בראש החנות */
export function LaunchStrip() {
  const active = useLaunchActive();
  if (!active) return null;
  return (
    <p className="bg-ink px-5 py-2.5 text-center text-[0.92rem] text-bg">
      <span className="font-serif text-[1.05rem]">{LAUNCH.name}</span>
      <span aria-hidden className="mx-2 text-[#d4c0a1]">·</span>
      15% הנחה על כל מוצרי החנות, עד סוף נובמבר
    </p>
  );
}

export function LaunchNote() {
  const active = useLaunchActive();
  if (!active) return null;
  return <p className="mt-1.5 text-[0.9rem] text-accent-strong">{LAUNCH.name}: {LAUNCH.percent}% הנחה עד סוף נובמבר</p>;
}
