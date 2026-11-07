"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type CategorySlug } from "@/lib/site";
import ProductCard from "./ProductCard";

type Filter = CategorySlug | "all";
const isFilter = (v: string): v is Filter => v === "all" || CATEGORIES.some((c) => c.slug === v);

/** כל המוצרים עם סינון לפי קטגוריה. הקטגוריה נשמרת בכתובת (#packages וכו') כדי שאפשר לקשר אליה. */
export default function ProductsBrowser() {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      setFilter(isFilter(h) ? h : "all");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    history.replaceState(null, "", f === "all" ? window.location.pathname : `#${f}`);
  };

  const items = useMemo(
    () => (filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.categories.includes(filter))),
    [filter],
  );
  const active = CATEGORIES.find((c) => c.slug === filter);
  const tabs: { id: Filter; label: string }[] = [{ id: "all", label: "הכול" }, ...CATEGORIES.map((c) => ({ id: c.slug, label: c.title }))];

  return (
    <>
      <section className="border-b border-line bg-bg">
        <div className="mx-auto max-w-[1240px] px-5 pt-10 pb-6 text-center md:pt-16 md:pb-8">
          <p className="eyebrow">{active ? "קטגוריה" : "הקולקציה"}</p>
          <h1 className="t-h2 mt-2.5">{active ? active.title : "כל המוצרים"}</h1>
          <span aria-hidden className="rule mx-auto mt-4" />
          <p className="t-lead mx-auto mt-4 max-w-xl">
            {active ? active.description : "מארזים, הזמנות, עיצוב גרפי וברכונים – כל המוצרים של MIALOR במקום אחד."}
          </p>
        </div>
        {/* סינון: בנייד גלילה צדדית בתוך השורה בלבד */}
        <div className="mx-auto max-w-[1240px]">
          <div
            role="tablist"
            aria-label="סינון לפי קטגוריה"
            className="flex gap-2 overflow-x-auto px-5 pb-5 [scrollbar-width:none] md:justify-center md:pb-8 [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={filter === t.id}
                onClick={() => choose(t.id)}
                className="min-h-11 shrink-0 rounded-full border border-line px-5 text-[0.95rem] whitespace-nowrap transition-colors hover:border-accent aria-selected:border-ink aria-selected:bg-ink aria-selected:text-bg"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="מוצרים" className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <p className="mb-6 text-[0.92rem] text-muted md:mb-8" aria-live="polite">
            {items.length} מוצרים
          </p>
          {items.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-3.5 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14 xl:grid-cols-4">
              {items.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-16 text-center text-muted">מוצרים בקטגוריה הזו יעלו בקרוב.</p>
          )}
        </div>
      </section>
    </>
  );
}
