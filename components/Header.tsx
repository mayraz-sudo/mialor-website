"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOGO, NAV, SITE, whatsappLink } from "@/lib/site";
import { IconBag, IconClose, IconInstagram, IconMenu, IconSearch, IconWhatsApp } from "./Icons";
import { SHOP } from "@/lib/shop";
import { useCart } from "./shop/CartContext";

function SearchForm({ id, compact = false }: { id: string; compact?: boolean }) {
  return (
    <form role="search" action="/search" className="relative w-full" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        חיפוש מוצרים
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="חיפוש מוצר…"
        className={`w-full rounded-full border border-line bg-surface pr-10 pl-4 text-[15px] placeholder:text-muted/75 focus:border-accent focus:outline-none ${compact ? "h-10" : "h-11"}`}
      />
      <IconSearch className="pointer-events-none absolute top-1/2 right-3.5 h-[17px] w-[17px] -translate-y-1/2 text-muted" />
    </form>
  );
}

type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** "/" = ניווט מהיר של Next; קישורים עם # = קישור רגיל */
function NavLink({ href, ...rest }: NavLinkProps) {
  return href.includes("#") ? <a href={href} {...rest} /> : <Link href={href} {...rest} />;
}

/** אייקון הסל בכותרת, עם מספר הפריטים */
function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count ? `הסל שלי, ${count} פריטים` : "הסל שלי (ריק)"}
      className="relative grid h-10 w-10 place-items-center rounded-[2px] border border-line bg-surface text-ink transition-colors hover:border-accent lg:h-11 lg:w-11"
    >
      <IconBag className="h-[21px] w-[21px]" />
      {count > 0 && (
        <span aria-hidden className="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-medium text-bg tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // קישור עם # (קטגוריה/אזור בדף) – קישור רגיל, כדי שהסינון יתעדכן גם כשכבר נמצאים בעמוד
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : href.startsWith("/") && !href.includes("#") && pathname.startsWith(href));
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // נעילת גלילה, סגירה ב־Escape, והעברת מיקוד לתפריט ובחזרה
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    menuButton.current?.focus();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto grid h-[76px] max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 lg:h-[92px] lg:grid-cols-[auto_1fr_auto] lg:gap-10">
          {/* כפתור תפריט – מובייל */}
          <button
            ref={menuButton}
            type="button"
            className="-mr-2 grid h-11 w-11 place-items-center justify-self-start lg:hidden"
            aria-label="פתיחת תפריט"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <IconMenu />
          </button>

          <Link href="/" aria-label="MIALOR – לדף הבית" className="justify-self-center lg:justify-self-start">
            <Image
              src={LOGO.mark.src}
              width={LOGO.mark.width}
              height={LOGO.mark.height}
              alt="MIALOR"
              priority
              className="h-[58px] w-auto max-w-none lg:h-[76px]"
            />
          </Link>

          {/* ניווט – מחשב */}
          <nav aria-label="ניווט ראשי" className="hidden justify-self-center lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="relative block px-3 py-2 text-[15px] whitespace-nowrap transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-accent after:transition-transform hover:text-accent-strong hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-2 lg:gap-3">
            <div className="hidden w-52 xl:block">
              <SearchForm id="search-desktop" compact />
            </div>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MIALOR באינסטגרם (נפתח בחלון חדש)"
              className="btn btn-secondary btn-sm !min-h-10 !px-3 lg:!px-4"
            >
              <IconInstagram className="h-[18px] w-[18px]" />
              <span className="hidden lg:inline">Instagram</span>
            </a>
            {SHOP.enabled && <CartButton />}
          </div>
        </div>

        {/* חיפוש – מובייל וטאבלט */}
        <div className="mx-auto max-w-[1240px] px-5 pb-3 xl:hidden">
          <SearchForm id="search-mobile" compact />
        </div>
      </header>

      {/* תפריט נפתח – מובייל */}
      <div
        className={`fixed inset-0 z-[60] bg-ink/35 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
        aria-hidden
      />
      <aside
        id="mobile-menu"
        aria-label="תפריט"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(340px,86vw)] flex-col bg-bg shadow-[0_0_40px_rgba(58,42,32,0.18)] transition-transform duration-300 ease-out lg:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-line px-5">
          <Image src={LOGO.mark.src} width={LOGO.mark.width} height={LOGO.mark.height} alt="MIALOR" className="h-[52px] w-auto" />
          <button
            ref={closeButton}
            type="button"
            className="-ml-2 grid h-11 w-11 place-items-center"
            aria-label="סגירת תפריט"
            onClick={close}
          >
            <IconClose />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-5 py-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[56px] items-center border-b border-line font-serif text-[1.3rem]"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="border-t border-line p-5">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
          >
            <IconWhatsApp className="h-[18px] w-[18px]" />
            שליחת הודעה בוואטסאפ
          </a>
        </div>
      </aside>
    </>
  );
}
