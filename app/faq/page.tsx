import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import PageHeader from "@/components/PageHeader";
import { FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "שאלות נפוצות | MIALOR",
  description: "איך מזמינים, כמות מינימלית, זמני הכנה, התאמה אישית ומחירים – תשובות לשאלות הנפוצות על המארזים, ההזמנות והברכונים של MIALOR.",
};

export default function FaqPage() {
  const items = FAQ.filter((f): f is { q: string; a: string } => Boolean(f.a));

  // נתונים מובנים לגוגל (FAQ rich results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <PageHeader eyebrow="יש שאלה?" title="שאלות נפוצות" intro="ריכזנו כאן את מה שהכי שואלים אותנו. לא מצאתם תשובה? כתבו לנו בוואטסאפ." />
      <section className="bg-bg">
        <div className="mx-auto max-w-[760px] px-5 py-10 md:py-16">
          <ul className="border-t border-line">
            {items.map((f) => (
              <li key={f.q} className="border-b border-line">
                <details className="group">
                  <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-[1.2rem] leading-snug md:text-[1.35rem] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent-strong transition-transform duration-300 group-open:rotate-45"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 text-[1.02rem] leading-[1.85] text-muted md:pe-12">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
