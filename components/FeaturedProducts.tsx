import Image from "next/image";
import Link from "next/link";
import { FEATURED, categoryBySlug, productHref } from "@/lib/site";
import PlaceholderTag from "./PlaceholderTag";
import SectionTitle from "./SectionTitle";

const formatPrice = (price: number | null) =>
  price === null ? "לקבלת הצעת מחיר" : `₪${price.toLocaleString("he-IL")}`;

export default function FeaturedProducts() {
  return (
    <section aria-labelledby="featured-title" className="bg-bg-alt py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionTitle id="featured-title" title="מוצרים נבחרים" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
          {FEATURED.map((p) => (
            <li key={p.id} className="flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
                <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                <PlaceholderTag show={p.placeholder} label="נתון זמני" />
              </div>
              <p className="mt-3 text-xs font-medium text-accent-strong">{categoryBySlug(p.category).title}</p>
              <h3 className="mt-0.5 text-base font-medium md:text-lg">{p.name}</h3>
              <p className="mt-0.5 text-sm text-muted">{formatPrice(p.price)}</p>
              <Link
                href={productHref(p.id)}
                prefetch={false}
                aria-label={`לפרטים על ${p.name}`}
                className="mt-3 inline-flex h-10 items-center justify-center rounded-md border border-ink text-sm font-medium transition-colors hover:bg-ink hover:text-white"
              >
                לפרטים
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
