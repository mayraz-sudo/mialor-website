import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, categoryHref } from "@/lib/site";
import PlaceholderTag from "./PlaceholderTag";
import SectionTitle from "./SectionTitle";

export default function CategoryGrid() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionTitle id="categories-title" title="הקטגוריות שלנו" />
        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={categoryHref(cat.slug)}
                prefetch={false}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(52,39,31,0.45)]"
              >
                <div className="relative aspect-[4/5] bg-bg-alt">
                  <Image
                    src={cat.image}
                    alt={cat.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                  <PlaceholderTag show={cat.placeholder} />
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <h3 className="text-lg font-medium md:text-xl">{cat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted md:text-[15px]">{cat.description}</p>
                  <span className="mt-auto pt-4 text-sm font-medium text-accent-strong group-hover:underline">
                    לכל המוצרים ←
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
