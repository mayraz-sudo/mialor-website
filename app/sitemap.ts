import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/site";
import { SHOP, shopItems } from "@/lib/shop";

const BASE = "https://mialorshop.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/products", "/faq", "/terms", "/accessibility", ...(SHOP.enabled ? ["/shop"] : [])];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...PRODUCTS.map((p) => ({ url: `${BASE}/product/${p.id}`, priority: 0.6 })),
    ...(SHOP.enabled ? shopItems().filter((i) => !i.hidden).map((i) => ({ url: `${BASE}/shop/${i.id}`, priority: 0.6 })) : []),
  ];
}
