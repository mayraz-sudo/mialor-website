import { SHOP, isLaunchActive, itemPrice, shopItemImages, shopItems } from "@/lib/shop";

/**
 * קובץ מוצרים לקטלוג של Meta (פייסבוק ואינסטגרם): https://mialorshop.com/meta-feed.csv
 * נבנה אוטומטית מרשימת המוצרים ב-lib/shop.ts – מוצר חדש או שינוי מחיר מתעדכנים כאן לבד.
 * ה-id של כל מוצר הוא אותו id שהפיקסל שולח (content_ids) – אסור לשנות אותו.
 */
export const dynamic = "force-dynamic";

const BASE = "https://mialorshop.com";
const EXCLUDED = new Set(["test-item"]);
const HEADER = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "additional_image_link", "brand"];

/** תא CSV: עוטפים במירכאות ומכפילים מירכאות פנימיות */
const cell = (v: string) => {
  const s = v.replace(/\r?\n/g, " ").trim();
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function GET() {
  const launch = isLaunchActive();
  const rows = shopItems()
    .filter((i) => !i.hidden && !EXCLUDED.has(i.id) && i.image)
    .map((i) => {
      const [main, ...extra] = shopItemImages(i);
      return [
        i.id,
        i.name,
        `${i.description} ${SHOP.material}`,
        "in stock",
        "new",
        `${itemPrice(i, launch).toFixed(2)} ILS`,
        `${BASE}/shop/${i.id}`,
        `${BASE}${main}`,
        extra.map((e) => `${BASE}${e}`).join(","),
        "MIALOR",
      ]
        .map(cell)
        .join(",");
    });
  const csv = [HEADER.join(","), ...rows].join("\n") + "\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
