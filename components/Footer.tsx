import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, LOGO, SITE, categoryHref, whatsappLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src={LOGO.full.src} width={LOGO.full.width} height={LOGO.full.height} alt="MIALOR" className="h-auto w-36" />
        </div>
        <nav aria-label="קטגוריות">
          <h2 className="mb-3 font-medium">קטגוריות</h2>
          <ul className="space-y-2 text-[15px] text-muted">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} prefetch={false} className="hover:text-ink">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="מידע">
          <h2 className="mb-3 font-medium">מידע</h2>
          <ul className="space-y-2 text-[15px] text-muted">
            <li>
              <Link href="/#about" className="hover:text-ink">
                אודות
              </Link>
            </li>
            <li>
              <Link href="/faq" prefetch={false} className="hover:text-ink">
                שאלות נפוצות
              </Link>
            </li>
            <li>
              <Link href="/terms" prefetch={false} className="hover:text-ink">
                תקנון ומדיניות פרטיות
              </Link>
            </li>
            <li>
              <Link href="/accessibility" prefetch={false} className="hover:text-ink">
                הצהרת נגישות
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 font-medium">צור קשר</h2>
          <ul className="space-y-2 text-[15px] text-muted">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                WhatsApp: <span dir="ltr">{SITE.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              Instagram: <span dir="ltr">{SITE.instagram}</span>
            </li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1240px] px-5 py-4 text-sm text-muted">
          © {new Date().getFullYear()} MIALOR · כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
}
