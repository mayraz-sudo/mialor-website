"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtm, productIdFromPath, sendSiteEvent } from "@/lib/attribution";

/**
 * מדידה למערכת הניהול: שומר מאיזה קמפיין הגיעה הלקוחה, סופר צפיות בעמודי
 * מארזים (/product/…) ולחיצות על קישורי וואטסאפ. בלי השפעה על הפיקסל.
 */
export default function SystemTracking() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtm();
  }, []);

  // עמודי /shop/… כבר נמדדים דרך הפיקסל (ViewContent); כאן רק עמודי /product/…
  useEffect(() => {
    if (!pathname.startsWith("/product/")) return;
    const id = productIdFromPath(pathname);
    const t = setTimeout(() => sendSiteEvent("product_view", id), 600);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='wa.me']");
      if (a) sendSiteEvent("whatsapp_click", productIdFromPath(window.location.pathname));
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
