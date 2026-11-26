import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/shop";

/**
 * כל העמודים הציבוריים פתוחים לסריקה – כולל גוגל (Googlebot) והחיפוש של ChatGPT (OAI-SearchBot).
 * חסומים רק אזור הניהול והשרת הפנימי.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/admin", ...(SHOP.enabled ? [] : ["/shop"])];
  return {
    rules: [
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: "https://mialorshop.com/sitemap.xml",
  };
}
