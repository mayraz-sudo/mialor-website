"use client";

import { useEffect } from "react";
import { productParams, track } from "@/lib/pixel";
import { isLaunchActive, itemPrice } from "@/lib/shop";

/** ViewContent – כשנכנסים לעמוד מוצר */
export default function TrackViewContent({ item }: { item: { id: string; name: string; price: number } }) {
  useEffect(() => {
    // מחכים רגע שהפיקסל ייטען
    const t = setTimeout(() => track("ViewContent", productParams({ ...item, price: itemPrice(item, isLaunchActive()) })), 600);
    return () => clearTimeout(t);
  }, [item]);
  return null;
}
