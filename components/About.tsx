import Image from "next/image";
import { ABOUT, whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./Icons";

export default function About() {
  const hasImage = Boolean(ABOUT.image);
  return (
    <section id="about" aria-labelledby="about-title" className="bg-surface py-12 md:py-20">
      <div
        className={`mx-auto grid max-w-[1080px] items-center gap-8 px-5 md:gap-16 ${hasImage ? "md:grid-cols-[5fr_6fr]" : "max-w-[640px]"}`}
      >
        {hasImage && (
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[480px] overflow-hidden rounded-[2px] bg-bg-alt md:aspect-[4/5] md:max-w-none">
            <Image src={ABOUT.image!} alt={ABOUT.imageAlt} fill sizes="(min-width: 768px) 42vw, 92vw" className="object-cover" />
          </div>
        )}
        <div className={`text-center ${hasImage ? "md:text-right" : ""}`}>
          <p className="eyebrow">{ABOUT.eyebrow}</p>
          <h2 id="about-title" className="t-h2 mt-2.5">
            {ABOUT.title}
          </h2>
          <span aria-hidden className={`rule mt-4 ${hasImage ? "mx-auto md:mx-0" : "mx-auto"}`} />
          <div className="mx-auto mt-6 max-w-[34rem] space-y-4 text-[1.05rem] leading-[1.85] text-muted md:mx-0 md:text-[1.1rem]">
            {ABOUT.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <p className="mt-7 font-serif text-[1.45rem] text-ink">{ABOUT.signature}</p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet mt-4 text-accent-strong"
          >
            <IconWhatsApp className="h-4 w-4" />
            <span>{ABOUT.cta}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
