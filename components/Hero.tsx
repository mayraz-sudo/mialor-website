import Link from "next/link";
import { HERO, whatsappLink } from "@/lib/site";

/** פתיחה נקייה: כותרת, משפט וכפתורים – בלי תמונה (לפי המלצת היועץ העסקי) */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-bg">
      <div className="mx-auto flex max-w-[820px] flex-col items-center px-5 pt-10 pb-12 text-center md:pt-20 md:pb-20">
        <p className="eyebrow">
          <span lang="en">MIALOR</span>
          <span aria-hidden className="mx-2.5 text-accent">
            |
          </span>
          {HERO.eyebrow}
        </p>
        <h1 id="hero-title" className="t-display mt-3 md:mt-5">
          {HERO.title}
        </h1>
        <span aria-hidden className="rule mx-auto mt-5 md:mt-7" />
        <p className="t-lead mt-4 md:mt-6">{HERO.subtitle}</p>
        <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 md:mt-9 md:flex md:max-w-none md:justify-center md:gap-4">
          <Link href="#categories" className="btn btn-primary">
            {HERO.cta}
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {HERO.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
