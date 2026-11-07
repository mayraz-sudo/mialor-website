import { whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./Icons";

/** כפתור וואטסאפ צף – בנייד בלבד, בפינה השמאלית התחתונה */
export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שליחת הודעה בוואטסאפ"
      className="fixed bottom-[max(0.875rem,env(safe-area-inset-bottom))] left-3.5 z-40 grid h-11 w-11 place-items-center rounded-full bg-ink text-bg shadow-[0_6px_18px_-6px_rgba(58,42,32,0.5)] ring-1 ring-bg/40 transition-colors hover:bg-ink-hover md:hidden"
    >
      <IconWhatsApp className="h-[19px] w-[19px]" />
    </a>
  );
}
