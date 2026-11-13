"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

/**
 * Purchase – בעמוד התודה, רק להזמנה ששולמה, ופעם אחת בלבד לכל הזמנה (גם אחרי רענון).
 */
export default function TrackPurchase() {
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("o");
    if (!id || !/^M\d{6}-[A-F0-9]{4}$/.test(id)) return;
    const key = `mialor-px-purchase-${id}`;
    try {
      if (localStorage.getItem(key)) return;
    } catch {}
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/order-summary?o=${id}`, { cache: "no-store" }).catch(() => null);
      if (!res?.ok || cancelled) return;
      const o = (await res.json()) as { paid: boolean; total: number; ids: string[]; items: number };
      if (!o.paid) return;
      // מחכים שהפיקסל ייטען
      for (let i = 0; i < 20 && !(window as unknown as { fbq?: unknown }).fbq; i++) await new Promise((r) => setTimeout(r, 250));
      track("Purchase", { value: o.total, content_ids: o.ids, content_type: "product", num_items: o.items }, id);
      try {
        localStorage.setItem(key, "1");
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
