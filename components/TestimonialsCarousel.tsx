"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/site";

/**
 * בנייד: כרטיס אחד בכל פעם, החלקה הצידה, חיצים ונקודות שמראים שיש עוד המלצות.
 * במחשב: שלוש עמודות, בלי חיצים ונקודות.
 */
export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // מעקב אחרי הכרטיס שמוצג כרגע
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) setActive(cards.indexOf(e.target as HTMLElement));
        });
      },
      { root: el, threshold: [0.6] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(items.length - 1, i));
    const card = el.children[target] as HTMLElement;
    // גלילה אופקית בתוך האזור בלבד (בלי להזיז את הדף)
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={track}
        aria-label="המלצות לקוחות"
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:gap-7 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <li
            key={i}
            className="w-full shrink-0 snap-center md:w-auto"
            aria-label={`המלצה ${i + 1} מתוך ${items.length}`}
          >
            <figure className="flex h-full flex-col items-center rounded-[2px] bg-surface px-7 py-9 text-center md:px-9 md:py-11">
              <blockquote className="font-serif text-[1.2rem] leading-[1.7] md:text-[1.25rem]">{t.quote}</blockquote>
              <span aria-hidden className="mt-6 block h-px w-8 bg-line" />
              <figcaption className="mt-4 text-[0.95rem]">
                <span className="font-medium">{t.name}</span>
                <span className="mx-2 text-accent">·</span>
                <span className="text-muted">{t.event}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {/* ניווט – נייד בלבד */}
      <div className="mt-5 flex items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="להמלצה הקודמת"
          className="grid h-11 w-11 place-items-center rounded-full border border-accent text-ink transition-opacity disabled:opacity-30"
        >
          {/* חץ ימינה = הקודם בכיוון עברית */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <div className="flex items-center gap-2" aria-hidden>
          {items.map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-ink" : "w-1.5 bg-accent/50"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === items.length - 1}
          aria-label="להמלצה הבאה"
          className="grid h-11 w-11 place-items-center rounded-full border border-accent text-ink transition-opacity disabled:opacity-30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        המלצה {active + 1} מתוך {items.length}
      </p>
    </div>
  );
}
