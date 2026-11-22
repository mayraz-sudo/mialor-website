import { NextResponse } from "next/server";
import { getVisibleItems } from "@/lib/catalog";
import { isLaunchActive, itemPrice, shopItemHref } from "@/lib/shop";

/**
 * רשימת המוצרים הציבורית – לסל הקניות בדפדפן ולבוט המכירות במערכת הניהול.
 * final_price = המחיר שהלקוחה משלמת היום (אחרי מחירי ההשקה, אם פעילים); url = עמוד המוצר בחנות.
 */
export const dynamic = "force-dynamic";
export async function GET() {
  const launch = isLaunchActive();
  const items = (await getVisibleItems()).map((i) => ({
    ...i,
    final_price: itemPrice(i, launch),
    url: `https://mialorshop.com${shopItemHref(i.id)}`,
  }));
  return NextResponse.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
