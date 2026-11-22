"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, PACKAGE_EVENTS, PACKAGE_KINDS, PACKAGE_TAGS, PRODUCTS, type CategorySlug, type PackageEvent, type PackageKind } from "@/lib/site";
import ProductCard from "./ProductCard";

type Filter = CategorySlug | "all";
const isFilter = (v: string): v is Filter => v === "all" || CATEGORIES.some((c) => c.slug === v);
const isKind = (v: string | null): v is PackageKind => PACKAGE_KINDS.some((k) => k.slug === v);
const isEvent = (v: string | null): v is PackageEvent => PACKAGE_EVENTS.some((e) => e.slug === v);

type State = { filter: Filter; kind: PackageKind | null; event: PackageEvent | null };

/** הכתובת: #packages, #packages&kind=gypsum, #packages&event=henna – כדי שאפשר לקשר לכל סינון */
function readHash(): State {
  const [head, ...rest] = decodeURIComponent(window.location.hash.slice(1)).split("&");
  const params = new URLSearchParams(rest.join("&"));
  // ברכונים אוחדו עם המארזים – קישורים ישנים ל־#prints מובילים לברכונים
  if (head === "prints") return { filter: "packages", kind: "booklets", event: null };
  const filter = isFilter(head) ? head : "all";
  const kind = params.get("kind");
  const event = params.get("event");
  return filter === "packages"
    ? { filter, kind: isKind(kind) ? kind : null, event: isEvent(event) ? event : null }
    : { filter, kind: null, event: null };
}

const chip =
  "min-h-10 shrink-0 rounded-full border border-line px-4 text-[0.9rem] whitespace-nowrap transition-colors hover:border-accent aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg";

/** כל המוצרים עם סינון לפי קטגוריה, ובמארזים – גם לפי סוג ולפי אירוע. */
export default function ProductsBrowser() {
  const [state, setState] = useState<State>({ filter: "all", kind: null, event: null });
  const { filter, kind, event } = state;

  useEffect(() => {
    const read = () => setState(readHash());
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const apply = (next: State) => {
    setState(next);
    const extra = [next.kind && `kind=${next.kind}`, next.event && `event=${next.event}`].filter(Boolean).join("&");
    const hash = next.filter === "all" ? "" : `#${next.filter}${extra ? `&${extra}` : ""}`;
    history.replaceState(null, "", hash || window.location.pathname);
  };
  const choose = (f: Filter) => apply({ filter: f, kind: null, event: null });

  const items = useMemo(() => {
    let list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.categories.includes(filter));
    if (kind) list = list.filter((p) => PACKAGE_TAGS[p.id]?.kind === kind);
    if (event) list = list.filter((p) => PACKAGE_TAGS[p.id]?.events.includes(event));
    return list;
  }, [filter, kind, event]);
  const active = CATEGORIES.find((c) => c.slug === filter);
  const kindLabel = PACKAGE_KINDS.find((k) => k.slug === kind)?.label;
  const eventLabel = PACKAGE_EVENTS.find((e) => e.slug === event)?.label;
  const title = eventLabel ? `${kindLabel ?? "מארזים"} ל${eventLabel}` : kindLabel ?? (active ? active.title : "כל המוצרים");
  const tabs: { id: Filter; label: string }[] = [{ id: "all", label: "הכול" }, ...CATEGORIES.map((c) => ({ id: c.slug, label: c.title }))];

  return (
    <>
      <section className="border-b border-line bg-bg">
        <div className="mx-auto max-w-[1240px] px-5 pt-10 pb-6 text-center md:pt-16 md:pb-8">
          <p className="eyebrow">לאירועים · הזמנה בכמויות</p>
          <h1 className="t-h2 mt-2.5">{title}</h1>
          <span aria-hidden className="rule mx-auto mt-4" />
          <p className="t-lead mx-auto mt-4 max-w-xl">
            {active ? active.description : "מארזים, הזמנות, עיצוב גרפי וברכונים – כל המוצרים של MIALOR במקום אחד."}
          </p>
          <p className="mx-auto mt-5 max-w-xl rounded-[2px] border border-line bg-surface px-4 py-3 text-[0.95rem] leading-relaxed">
            <span className="font-medium">המחירים כאן הם מחירי כמות לאירוע, ליחידה:</span>{" "}
            <span className="text-muted">מארזים מ־20 יחידות, ברכונים מ־10, סידורים וספרים מ־30. יש גם מחיר לכמות קטנה, מ־10 יחידות. עיצוב גרפי – מחיר לעיצוב.</span>{" "}
            <Link href="/shop" className="font-medium whitespace-nowrap text-accent-strong underline underline-offset-4 hover:text-ink">
              רוצה פחות? לקנייה בבודדים ←
            </Link>
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
          {filter === "packages" && (
            <div className="space-y-3 px-5 pb-6 md:pb-8">
              <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden" role="group" aria-label="סוג המארז">
                <span className="shrink-0 text-[0.85rem] text-muted">לפי סוג:</span>
                {PACKAGE_KINDS.map((k) => (
                  <button key={k.slug} type="button" aria-pressed={kind === k.slug} onClick={() => apply({ ...state, kind: kind === k.slug ? null : k.slug })} className={chip}>
                    {k.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden" role="group" aria-label="סוג האירוע">
                <span className="shrink-0 text-[0.85rem] text-muted">לפי אירוע:</span>
                {PACKAGE_EVENTS.map((e) => (
                  <button key={e.slug} type="button" aria-pressed={event === e.slug} onClick={() => apply({ ...state, event: event === e.slug ? null : e.slug })} className={chip}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          )}
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
            <p className="py-16 text-center text-muted">{kind || event ? "אין מארזים שמתאימים לשני הסינונים יחד – אפשר להסיר אחד מהם." : "מוצרים בקטגוריה הזו יעלו בקרוב."}</p>
          )}
        </div>
      </section>
    </>
  );
}
