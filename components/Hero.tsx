import Image from "next/image";
import Link from "next/link";
import { HERO } from "@/lib/site";
import PlaceholderTag from "./PlaceholderTag";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-surface">
      <div className="mx-auto grid max-w-[1240px] items-center gap-5 px-5 py-6 md:grid-cols-2 md:gap-14 md:py-14">
        <div className="order-2 text-center md:order-1 md:text-right">
          <h1 id="hero-title" className="text-[2rem] leading-tight font-light text-balance md:text-5xl lg:text-[3.4rem]">
            {HERO.title}
          </h1>
          <p className="mt-3 text-base text-muted md:mt-4 md:text-xl">{HERO.subtitle}</p>
          <Link
            href="#categories"
            className="mt-6 inline-flex h-12 md:mt-8 items-center justify-center rounded-md bg-ink px-8 font-medium text-white transition-colors hover:bg-accent-strong"
          >
            {HERO.cta}
          </Link>
        </div>
        <div className="relative order-1 aspect-[16/9] overflow-hidden rounded-lg bg-bg-alt md:order-2 md:aspect-[5/4]">
          <Image
            src={HERO.image}
            alt={HERO.imageAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[center_60%]"
          />
          <PlaceholderTag show={HERO.placeholder} />
        </div>
      </div>
    </section>
  );
}
