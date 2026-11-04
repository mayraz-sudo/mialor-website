import { SITE, whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./Icons";

export default function ContactCTA() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="px-5 pb-14 md:pb-20">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 rounded-xl bg-ink px-6 py-10 text-center text-white md:flex-row md:justify-between md:px-14 md:py-12 md:text-right">
        <div>
          <h2 id="contact-title" className="text-2xl font-light md:text-3xl">
            רוצים לשמוע פרטים או לקבל הצעת מחיר?
          </h2>
          <p className="mt-2 text-white/75">שלחו לנו הודעה בוואטסאפ ונחזור אליכם בהקדם.</p>
        </div>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-md bg-whatsapp px-7 font-medium text-white transition-opacity hover:opacity-90"
        >
          <IconWhatsApp className="h-5 w-5" />
          שליחת הודעה בוואטסאפ
        </a>
      </div>
      {SITE.dataIsPlaceholder && (
        <p className="mt-3 text-center text-xs text-muted">מספר הוואטסאפ באתר הוא זמני</p>
      )}
    </section>
  );
}
