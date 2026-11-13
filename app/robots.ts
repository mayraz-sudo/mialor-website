import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/shop";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...(SHOP.enabled ? [] : ["/shop"])] },
    sitemap: "https://mialorshop.com/sitemap.xml",
  };
}
