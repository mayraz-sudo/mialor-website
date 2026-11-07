import Link from "next/link";
import { ALL_PRODUCTS_HREF, homeFeatured } from "@/lib/site";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";

export default function FeaturedProducts() {
  const products = homeFeatured();
  return (
    <section aria-labelledby="featured-title" className="bg-bg-alt py-12 md:py-20">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-5">
        <SectionTitle id="featured-title" eyebrow="נבחרו במיוחד" title="מוצרים מובילים" />
        <ul className="grid grid-cols-2 gap-x-3.5 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} sizes="(min-width: 1024px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center md:mt-14">
          <Link href={ALL_PRODUCTS_HREF} className="btn btn-primary min-w-[220px]">
            לכל המוצרים
          </Link>
        </div>
      </div>
    </section>
  );
}
