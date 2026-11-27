import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | MIALOR מיאלור",
  description: "מדיניות הפרטיות של מיאלור: אילו פרטים אנו אוספים בטפסים (כולל טפסים בפייסבוק ובאינסטגרם), איך אנו משתמשים בהם ואיך מבקשים הסרה או מחיקה.",
  alternates: { canonical: "/privacy" },
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 font-serif text-[1.45rem] leading-snug text-ink first:mt-0 md:text-[1.6rem]">{children}</h2>
);

/** מדיניות פרטיות – בנוסח שמאי מסרה (משמש גם כקישור בטופס הלידים בפייסבוק) */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="מיאלור" title="מדיניות פרטיות" />
      <section className="bg-bg">
        <div className="mx-auto max-w-[760px] px-5 py-10 text-[1.02rem] leading-[1.9] text-muted md:py-16 [&_li]:ms-5 [&_li]:list-disc [&_li]:ps-1 [&_p]:mt-3 [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:space-y-1.5">
          <p className="!mt-0 text-ink">
            מיאלור (&quot;אנחנו&quot;) מכבדת את פרטיותך. מדיניות זו מסבירה אילו פרטים אנו אוספים וכיצד אנו משתמשים בהם.
          </p>

          <H2>איזה מידע אנו אוספים</H2>
          <p>
            כאשר את/ה ממלא/ת טופס שלנו (כולל טפסים בפייסבוק ובאינסטגרם), אנו עשויים לאסוף: שם מלא, מספר טלפון, ותשובות
            שמסרת בטופס.
          </p>

          <H2>כיצד אנו משתמשים במידע</H2>
          <ul>
            <li>כדי לצרף אותך לקבוצת המתחתנים VIP או לשלוח לך קישור להצטרפות.</li>
            <li>כדי ליצור איתך קשר בנוגע להטבות, מבצעים ומוצרים של מיאלור ושל שותפינו לקבוצה.</li>
            <li>לא נמכור את פרטיך לצד שלישי.</li>
          </ul>

          <H2>שיתוף מידע</H2>
          <p>
            המידע נשמר אצל מיאלור ובכלים שבהם אנו משתמשים לניהול פניות (כגון WhatsApp ו־Meta). לא נעביר את פרטיך לגורם אחר,
            אלא אם נדרש לפי חוק.
          </p>

          <H2>הסרה מרשימת התפוצה ומחיקת מידע</H2>
          <p>
            ניתן בכל עת לבקש להפסיק לקבל מאיתנו הודעות, לעיין במידע שנשמר עלייך או לבקש למחוק אותו. יש לפנות אלינו בוואטסאפ{" "}
            <a href={`https://wa.me/${SITE.whatsappNumber}`} className="text-ink underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {SITE.whatsappDisplay}
            </a>{" "}
            או במייל{" "}
            <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-4" dir="ltr">
              {SITE.email}
            </a>
            .
          </p>

          <H2>שינויים במדיניות</H2>
          <p>אנו עשויים לעדכן מדיניות זו מעת לעת. הגרסה העדכנית תפורסם תמיד בדף זה.</p>

          <p className="!mt-10 text-[0.95rem]">עדכון אחרון: נובמבר 2026</p>

          <p className="text-[0.92rem]">
            לקנייה באתר (הזמנות, תשלום ועוגיות) ראו גם את{" "}
            <Link href="/terms#privacy" className="text-ink underline underline-offset-4">
              התקנון
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
