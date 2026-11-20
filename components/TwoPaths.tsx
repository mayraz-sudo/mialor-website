import Image from "next/image";
import Link from "next/link";
import { PATHS } from "@/lib/site";
import { IconArrow } from "./Icons";

/** שתי "דלתות" בראש דף הבית: מתנות לאירוע (בכמויות) או קנייה אישית (פריט בודד) */
export default function TwoPaths() {
  const paths = [PATHS.events, PATHS.shop];
  return (
    <section aria-labelledby="paths-title" className="bg-bg py-10 md:py-16">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-5">
        <h2 id="paths-title" className="t-h2 text-center">מה מחפשים היום?</h2>
        <span aria-hidden className="rule mx-auto mt-4" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:gap-6">
          {paths.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-surface transition-colors hover:border-accent"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-bg-alt">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1 text-[0.82rem] font-medium text-bg">{p.note}</span>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="t-h3">{p.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-[0.97rem] text-muted">
                    {p.points.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span aria-hidden className="text-accent-strong">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5 md:pt-6">
                    <span className="btn btn-primary w-full gap-2">
                      {p.cta}
                      <IconArrow className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
