"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/site";
import { ComingSoon } from "./ProductMedia";

type Slide = { kind: "image"; src: string } | { kind: "video"; src: string; poster: string };

/**
 * גלריית מוצר: בנייד החלקה הצידה, במחשב חיצים, ותמונות קטנות מתחת לבחירה מהירה.
 * מוצר בלי תמונות מציג Coming soon.
 */
export default function ProductGallery({ product }: { product: Product }) {
  const slides: Slide[] = product.video
    ? [{ kind: "video", ...product.video }, ...product.images.filter((s) => s !== product.video!.poster).map((src) => ({ kind: "image" as const, src }))]
    : product.images.map((src) => ({ kind: "image" as const, src }));

  const track = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  // מעקב אחרי השקופית שמוצגת
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.intersectionRatio >= 0.6 && setActive(items.indexOf(e.target as HTMLElement))),
      { root: el, threshold: [0.6] },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  // סרטון: בלי קול, ורק אם המשתמש לא ביקש להפחית תנועה
  useEffect(() => {
    const v = videoRef.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const t = Math.max(0, Math.min(slides.length - 1, i));
    const slide = el.children[t] as HTMLElement;
    el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setActive(t);
  };

  if (slides.length === 0) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
        <ComingSoon name={product.name} />
      </div>
    );
  }

  const arrow = "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-ink shadow-sm transition-opacity hover:bg-bg disabled:opacity-0 md:grid";

  return (
    <div>
      <div className="relative">
        <div
          ref={track}
          aria-label={`תמונות של ${product.name}`}
          className="relative flex snap-x snap-mandatory overflow-x-auto rounded-[2px] bg-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s, i) => (
            <div key={i} className="relative aspect-[4/5] w-full shrink-0 snap-center" aria-label={`תמונה ${i + 1} מתוך ${slides.length}`}>
              {s.kind === "video" ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={s.src}
                  poster={s.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={product.name}
                />
              ) : (
                <Image
                  src={s.src}
                  alt={`${product.name} – תמונה ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="לתמונה הקודמת" className={`${arrow} right-3`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label="לתמונה הבאה" className={`${arrow} left-3`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            {/* מונה – בנייד, כדי שיהיה ברור שאפשר להחליק */}
            <span className="absolute bottom-3 left-3 rounded-full bg-bg/90 px-2.5 py-0.5 text-[0.8rem] text-ink tabular-nums md:hidden" aria-hidden>
              {active + 1}/{slides.length}
            </span>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto [scrollbar-width:none] md:mt-4 md:gap-3 [&::-webkit-scrollbar]:hidden">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`הצגת תמונה ${i + 1}`}
              aria-current={i === active}
              className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-[2px] opacity-60 ring-ink transition-opacity aria-[current=true]:opacity-100 aria-[current=true]:ring-1 md:w-20"
            >
              <Image src={s.kind === "video" ? s.poster : s.src} alt="" fill sizes="80px" className="object-cover" />
              {s.kind === "video" && (
                <span className="absolute inset-0 grid place-items-center bg-ink/25 text-bg" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
