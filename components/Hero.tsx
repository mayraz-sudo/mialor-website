import Image from "next/image";
import Link from "next/link";
import { HERO, whatsappLink } from "@/lib/site";

/**
 * פתיחה בסגנון מגזין: הטקסט מיושר לקצה התוכן מימין, והתמונה נמשכת עד קצה המסך משמאל (במחשב).
 * בנייד: תמונה עם שוליים ומתחתיה הטקסט.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-bg">
      <div className="flex flex-col md:grid md:min-h-[min(80vh,700px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="order-2 flex flex-col justify-center px-5 pt-6 pb-11 text-center md:order-1 md:py-16 md:ps-[max(1.25rem,calc((100vw-1240px)/2+1.25rem))] md:pe-12 md:text-right lg:pe-20">
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
          <span aria-hidden className="rule mx-auto mt-5 md:mx-0 md:mt-7" />
          <p className="t-lead mt-4 md:mt-6">{HERO.subtitle}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center md:mt-9 md:justify-start md:gap-4">
            <Link href="#categories" className="btn btn-primary">
              {HERO.cta}
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              {HERO.secondaryCta}
            </a>
          </div>
        </div>
        <div className="order-1 px-5 pt-4 md:order-2 md:p-0">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2px] bg-bg-alt md:aspect-auto md:h-full md:rounded-none">
            <Image
              src={HERO.image}
              alt={HERO.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover object-[center_55%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
