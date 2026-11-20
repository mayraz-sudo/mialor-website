import Link from "next/link";
import { IconWhatsApp } from "@/components/Icons";
import { whatsappLink } from "@/lib/site";

/**
 * "חוגגת אירוע?" – למי שנמצאת בחנות (קנייה בודדת) ורוצה כמות גדולה.
 * אם יש למוצר גרסה לאירועים – מובילים לשם; אחרת לוואטסאפ עם הודעה מוכנה.
 */
export default function BulkCta({ itemName, eventHref }: { itemName?: string; eventHref?: string }) {
  const text = itemName
    ? `היי מיאלור, אני חוגגת אירוע ומעוניינת ב"${itemName}" בכמות. אשמח לקבל מחיר`
    : "היי מיאלור, אני חוגגת אירוע ומעוניינת במוצרים בכמות. אשמח לקבל מחיר";
  const cls = "btn btn-secondary btn-sm mt-3 w-full gap-2 sm:w-auto";
  return (
    <div className="rounded-[2px] border border-accent bg-bg-alt px-4 py-4 text-center sm:text-right">
      <p className="font-serif text-[1.2rem] leading-snug">חוגגת אירוע? מעוניינת בכמות?</p>
      <p className="mt-1 text-[0.95rem] text-muted">מחירים מיוחדים להזמנה בכמות, עם מיתוג והקדשה אישית לאירוע.</p>
      {eventHref ? (
        <Link href={eventHref} className={cls}>
          לחצי כאן לקבלת מחיר לכמות ←
        </Link>
      ) : (
        <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className={cls}>
          <IconWhatsApp className="h-[17px] w-[17px]" />
          לחצי כאן לקבלת מחיר לכמות
        </a>
      )}
    </div>
  );
}
