"use client";

import { useEffect } from "react";
import { productParams, track } from "@/lib/pixel";

/** ViewContent – כשנכנסים לעמוד מוצר */
export default function TrackViewContent({ item }: { item: { id: string; name: string; price: number } }) {
  useEffect(() => {
    // מחכים רגע שהפיקסל ייטען
    const t = setTimeout(() => track("ViewContent", productParams(item)), 600);
    return () => clearTimeout(t);
  }, [item]);
  return null;
}
