"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOGO, NAV, whatsappLink } from "@/lib/site";
import { IconClose, IconMenu, IconSearch, IconWhatsApp } from "./Icons";

function SearchForm({ id }: { id: string }) {
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
        className="h-11 w-full rounded-full border border-line bg-bg pr-11 pl-4 text-[15px] placeholder:text-muted/80 focus:border-accent focus:bg-surface focus:outline-none"
      />
      <IconSearch className="pointer-events-none absolute top-1/2 right-4 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
    </form>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 md:gap-8">
        {/* כפתור תפריט – מובייל */}
        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-label="פתיחת תפריט"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <IconMenu />
        </button>

        <Link href="/" aria-label="MIALOR – לדף הבית" className="justify-self-center lg:justify-self-start">
          <Image src={LOGO.mark.src} width={LOGO.mark.width} height={LOGO.mark.height} alt="MIALOR" priority className="h-12 w-auto md:h-14" />
        </Link>

        {/* ניווט – מחשב */}
        <nav aria-label="ניווט ראשי" className="hidden justify-self-center lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="block rounded-md px-3 py-2 text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-bg hover:text-accent-strong aria-[current=page]:text-accent-strong"
                  aria-current={item.href === "/" ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden w-56 xl:block">
            <SearchForm id="search-desktop" />
          </div>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-whatsapp px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 md:px-4"
          >
            <IconWhatsApp className="h-5 w-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* חיפוש – מובייל וטאבלט */}
      <div className="mx-auto max-w-[1240px] px-5 pb-3 xl:hidden">
        <SearchForm id="search-mobile" />
      </div>

    </header>

      {/* תפריט נפתח – מובייל (מחוץ ל-header כדי שלא ייחתך) */}
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        id="mobile-menu"
        aria-label="תפריט"
        inert={!open}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[min(320px,85vw)] overflow-y-auto bg-surface px-5 py-4 shadow-xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line pb-3">
          <Image src={LOGO.mark.src} width={LOGO.mark.width} height={LOGO.mark.height} alt="MIALOR" className="h-11 w-auto" />
          <button type="button" className="p-2" aria-label="סגירת תפריט" onClick={() => setOpen(false)}>
            <IconClose />
          </button>
        </div>
        <ul className="mt-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-lg font-medium"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 rounded-md bg-whatsapp py-3 font-medium text-white"
        >
          <IconWhatsApp className="h-5 w-5" />
          שליחת הודעה בוואטסאפ
        </a>
      </aside>
    </>
  );
}
