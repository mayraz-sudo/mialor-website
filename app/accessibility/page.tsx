import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { ACCESSIBILITY, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "הצהרת נגישות | MIALOR",
  description: "הצהרת הנגישות של אתר MIALOR – מה הותאם באתר ואיך פונים אלינו בנושא נגישות.",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 font-serif text-[1.45rem] leading-snug text-ink first:mt-0 md:text-[1.6rem]">{children}</h2>
);

/**
 * הצהרת נגישות.
 * מתארת רק התאמות שקיימות בפועל באתר (נבדקו בבדיקה אוטומטית ובבדיקה ידנית בסיסית).
 * מומלץ שמורשה/ית נגישות יעבור על האתר ועל הנוסח.
 */
export default function AccessibilityPage() {
  return (
    <>
      <PageHeader eyebrow="נגישות" title="הצהרת נגישות" />
      <section className="bg-bg">
        <div className="mx-auto max-w-[760px] px-5 py-10 text-[1.02rem] leading-[1.9] text-muted md:py-16 [&_li]:ms-5 [&_li]:list-disc [&_li]:ps-1 [&_p]:mt-3 [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:space-y-1.5">
          <H2>מחויבות לנגישות</H2>
          <p>
            ב־MIALOR אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הלקוחות, ופועלים כדי שהאתר יהיה נוח ונגיש גם לאנשים עם
            מוגבלות. האתר נבנה מתוך מטרה לעמוד בהנחיות התקן הישראלי ת"י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA.
          </p>

          <H2>מה הותאם באתר</H2>
          <ul>
            <li>האתר כתוב בעברית ומוצג מימין לשמאל, עם מבנה כותרות מסודר.</li>
            <li>ניתן לנווט באתר באמצעות המקלדת, ורכיב שנמצא בפוקוס מסומן במסגרת ברורה.</li>
            <li>בראש כל עמוד יש קישור &quot;דילוג לתוכן&quot; למעבר ישיר לתוכן המרכזי.</li>
            <li>לתמונות יש טקסט חלופי שמתאר את תוכנן.</li>
            <li>הניגודיות בין הטקסט לרקע נבדקה כדי שהטקסט יהיה קריא.</li>
            <li>לשדות בטופס ההזמנה יש תוויות ברורות, והודעות שגיאה מוקראות לקוראי מסך.</li>
            <li>גלריות התמונות ניתנות להפעלה גם במקלדת (חיצים), ולכפתורים יש תיאור לקוראי מסך.</li>
            <li>האתר מותאם לצפייה בטלפון ובמחשב, ומאפשר הגדלת טקסט בדפדפן.</li>
            <li>למשתמשים שהגדירו &quot;הפחתת תנועה&quot; במכשיר – האנימציות והסרטונים לא מופעלים אוטומטית.</li>
          </ul>

          <H2>הסדרי נגישות בשירות</H2>
          <p>
            ההזמנות מתבצעות דרך וואטסאפ. אם נתקלתם בקושי, אפשר לפנות אלינו גם בטלפון או במייל, ונשמח לעזור ולהשלים את
            ההזמנה יחד איתכם.
          </p>

          <H2>מגבלות ידועות</H2>
          <p>
            למרות מאמצינו, ייתכן שחלקים מסוימים באתר עדיין אינם נגישים במלואם, למשל תוכן שמגיע מצד שלישי (כמו וואטסאפ)
            או טקסט שמופיע בתוך תמונות של מוצרים. אנו ממשיכים לשפר את הנגישות באתר.
          </p>

          <H2>פנייה בנושא נגישות</H2>
          <p>אם נתקלתם בבעיית נגישות באתר, נשמח שתעדכנו אותנו כדי שנוכל לתקן:</p>
          <ul>
            {ACCESSIBILITY.coordinatorName && (
              <li>
                <strong>רכזת הנגישות:</strong> {ACCESSIBILITY.coordinatorName}
              </li>
            )}
            <li>
              <strong>טלפון / וואטסאפ:</strong> <span dir="ltr">{SITE.whatsappDisplay}</span>
            </li>
            <li>
              <strong>מייל:</strong>{" "}
              <a href={`mailto:${SITE.email}`} className="text-ink underline decoration-accent underline-offset-4">
                <span dir="ltr">{SITE.email}</span>
              </a>
            </li>
          </ul>
          <p>כדי שנוכל לטפל בפנייה, נשמח לפרטים: באיזה עמוד הייתה הבעיה, מה ניסיתם לעשות, ובאיזה מכשיר ודפדפן השתמשתם.</p>

          <p className="mt-10 text-[0.92rem]">ההצהרה עודכנה בתאריך {ACCESSIBILITY.updated}.</p>
        </div>
      </section>
    </>
  );
}
