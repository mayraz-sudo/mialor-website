import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, categoryHref } from "@/lib/site";
import { IconArrow } from "./Icons";
import SectionTitle from "./SectionTitle";

export default function CategoryGrid() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="bg-surface py-12 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
        <SectionTitle id="categories-title" eyebrow="מה אנחנו יוצרים" title="הקטגוריות שלנו" />
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-7">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link href={categoryHref(cat.slug)} prefetch={false} className="group flex h-full flex-col text-center">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-bg-alt md:aspect-[4/5]">
                  <Image
                    src={cat.image}
                    alt={cat.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="t-h3 mt-3.5 md:mt-5">{cat.title}</h3>
                <p className="t-small mx-auto mt-1 md:hidden">{cat.shortDescription}</p>
                <p className="t-small mx-auto mt-2 hidden max-w-[28ch] md:line-clamp-2">{cat.description}</p>
                <span className="mt-auto inline-flex items-center justify-center gap-1.5 pt-2.5 text-[0.9rem] font-medium text-accent-strong transition-colors group-hover:text-ink md:pt-4">
                  <span className="border-b border-accent pb-0.5 group-hover:border-ink">לכל המוצרים</span>
                  <IconArrow className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
