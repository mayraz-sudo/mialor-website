import Image from "next/image";
import { ATMOSPHERE, PROMISES } from "@/lib/site";

/** אזור "החתימה של MIALOR" – תמונת אווירה וארבע עובדות מתוך הקובץ של העסק */
export default function BrandBand() {
  return (
    <section aria-labelledby="brand-title" className="bg-surface">
      <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-12 md:grid-cols-[5fr_6fr] md:gap-16 md:py-20 lg:gap-24">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[400px] overflow-hidden rounded-[2px] bg-bg-alt md:max-w-[460px]">
          <Image
            src={ATMOSPHERE.calla.src}
            alt={ATMOSPHERE.calla.alt}
            fill
            sizes="(min-width: 768px) 42vw, 92vw"
            className="object-cover"
          />
        </div>
        <div className="text-center md:text-right">
          <p className="eyebrow">
            <span lang="en">The MIALOR touch</span>
          </p>
          <h2 id="brand-title" className="t-h2 mt-2.5">
            כל פרט, בעיצוב אישי
          </h2>
          <span aria-hidden className="rule mx-auto mt-4 md:mx-0" />
          <ul className="mt-8 grid gap-x-10 gap-y-7 text-right sm:grid-cols-2 md:mt-10">
            {PROMISES.map((p) => (
              <li key={p.title} className="border-t border-line pt-4">
                <h3 className="font-serif text-[1.25rem] leading-snug md:text-[1.35rem]">{p.title}</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
