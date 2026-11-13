import { NextResponse } from "next/server";
import { getVisibleItems } from "@/lib/catalog";

/** רשימת המוצרים הציבורית – לסל הקניות בדפדפן */
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ items: await getVisibleItems() }, { headers: { "Cache-Control": "no-store" } });
}
