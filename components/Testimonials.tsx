import { TESTIMONIALS, testimonialsAreSamples } from "@/lib/site";
import SectionTitle from "./SectionTitle";
import TestimonialsCarousel from "./TestimonialsCarousel";

/**
 * המלצות לדוגמה מוצגות רק בתצוגה מקדימה ובהרצה מקומית, עם הערה שהן זמניות.
 * באתר החי האזור מוסתר עד ש־testimonialsAreSamples משתנה ל־false בקובץ lib/site.ts.
 */
const isPreview = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_PREVIEW === "1";

export default function Testimonials() {
  if (testimonialsAreSamples && !isPreview) return null;

  return (
    <section aria-labelledby="testimonials-title" className="bg-bg-alt py-12 md:py-20">
      <div className="mx-auto max-w-[1180px] md:px-5">
        <div className="px-5 md:px-0">
          <SectionTitle id="testimonials-title" eyebrow="מילים חמות" title="לקוחות מספרות" />
        </div>
        <TestimonialsCarousel items={TESTIMONIALS} />
        {testimonialsAreSamples && (
          <p className="mt-6 px-5 text-center text-[0.85rem] text-muted">
            תצוגה מקדימה: אלה המלצות לדוגמה. באתר שיפורסם האזור מוסתר עד שיוכנסו המלצות אמיתיות.
          </p>
        )}
      </div>
    </section>
  );
}
