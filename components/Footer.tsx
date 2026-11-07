import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, LOGO, SITE, categoryHref, whatsappLink } from "@/lib/site";

const INFO_LINKS = [
  { label: "אודות", href: "/#about" },
  { label: "שאלות נפוצות", href: "/faq" },
  { label: "תקנון ומדיניות פרטיות", href: "/terms" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

const linkClass = "inline-block py-1 transition-colors hover:text-ink";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg pb-20 md:pb-0">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:py-16">
        <div className="col-span-2 flex flex-col items-center text-center md:col-span-1 md:items-start md:text-right">
          <Image src={LOGO.full.src} width={LOGO.full.width} height={LOGO.full.height} alt="MIALOR" className="h-auto w-36 md:w-40" />
        </div>

        <nav aria-label="קטגוריות">
          <h2 className="t-h3 mb-3">קטגוריות</h2>
          <ul className="space-y-1 text-[0.95rem] text-muted">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <a href={categoryHref(c.slug)} className={linkClass}>
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="מידע">
          <h2 className="t-h3 mb-3">מידע</h2>
          <ul className="space-y-1 text-[0.95rem] text-muted">
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 border-t border-line pt-8 text-center md:col-span-1 md:border-0 md:pt-0 md:text-right">
          <h2 className="t-h3 mb-3">צור קשר</h2>
          <ul className="space-y-1 text-[0.95rem] text-muted">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                וואטסאפ <span dir="ltr">{SITE.whatsappDisplay}</span>
              </a>
            </li>
            <li className="py-1">
              אינסטגרם <span dir="ltr">{SITE.instagram}</span>
            </li>
            <li className="py-1">{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1180px] px-5 py-5 text-center text-[0.85rem] text-muted md:text-right">
          © {new Date().getFullYear()} MIALOR · כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
}
