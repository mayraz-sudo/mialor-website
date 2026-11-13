import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/site";
import { SHOP } from "@/lib/shop";
import { getVisibleItems } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const BASE = "https://mialorshop.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shop = SHOP.enabled ? await getVisibleItems() : [];
  const pages = ["", "/products", "/faq", "/terms", "/accessibility", ...(SHOP.enabled ? ["/shop"] : [])];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...PRODUCTS.map((p) => ({ url: `${BASE}/product/${p.id}`, priority: 0.6 })),
    ...shop.map((i) => ({ url: `${BASE}/shop/${i.id}`, priority: 0.6 })),
  ];
}
