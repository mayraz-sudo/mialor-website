"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SHOP, cartTotals, type CartLine, type Delivery, type ShopItem, perLabel } from "@/lib/shop";
import { ComingSoon } from "../ProductMedia";

const KEY = "mialor-cart";
const money = (n: number) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const field =
  "h-12 w-full rounded-[2px] border border-line bg-surface px-3.5 text-[1rem] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-[0.92rem] font-medium";

function Stepper({ value, onChange, max = 99, name }: { value: number; onChange: (n: number) => void; max?: number; name: string }) {
  return (
    <div className="flex h-11 items-center rounded-[2px] border border-line bg-surface" role="group" aria-label={`כמות – ${name}`}>
      <button type="button" className="grid h-full w-11 place-items-center text-lg" aria-label="הוספה" onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
      <span className="min-w-8 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className="grid h-full w-11 place-items-center text-lg" aria-label="הפחתה" onClick={() => onChange(Math.max(0, value - 1))}>
        −
      </button>
    </div>
  );
}

export default function ShopClient({ items }: { items: ShopItem[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", zip: "", notes: "" });
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "error"; msg?: string }>({ kind: "idle" });
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // סל נשמר במכשיר
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setCart(saved.filter((l) => items.some((i) => i.id === l.id)));
    } catch {}
  }, [items]);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const qtyOf = (id: string) => cart.find((l) => l.id === id)?.qty ?? 0;
  const setQty = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty } : l)) : [...c, { id, qty }]));

  const totals = useMemo(() => cartTotals(cart, delivery), [cart, delivery]);
  const count = totals.rows.reduce((a, r) => a + r.qty, 0);
  const postReady = SHOP.postPrice !== null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!count) return setStatus({ kind: "error", msg: "הסל ריק. בחרו לפחות פריט אחד." });
    if (!form.name.trim() || !/^0\d{8,9}$/.test(form.phone.replace(/[-\s]/g, ""))) return setStatus({ kind: "error", msg: "נא למלא שם וטלפון תקין." });
    if (delivery === "post" && (!form.address.trim() || !form.city.trim())) return setStatus({ kind: "error", msg: "נא למלא כתובת ועיר למשלוח." });
    if (!agree) return setStatus({ kind: "error", msg: "נא לאשר את התקנון ומדיניות הביטול." });
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cart, delivery, customer: form }),
      });
      const data = await res.json();
      if (!res.ok || !data.paymentUrl) throw new Error(data.error || "לא הצלחנו לפתוח את דף התשלום. נסו שוב או כתבו לנו בוואטסאפ.");
      setPaymentUrl(data.paymentUrl);
      setStatus({ kind: "idle" });
    } catch (err) {
      setStatus({ kind: "error", msg: err instanceof Error ? err.message : "שגיאה. נסו שוב." });
    }
  };

  return (
    <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-10 sm:px-5 md:py-16 lg:grid-cols-[1fr_380px] lg:gap-12">
      {/* פריטים */}
      <section aria-label="פריטים">
        <ul className="grid grid-cols-2 gap-x-3.5 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const q = qtyOf(item.id);
            return (
              <li key={item.id} className="flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-surface">
                  {item.image ? (
                    <ItemPhotos item={item} />
                  ) : (
                    <ComingSoon name={item.name} />
                  )}
                </div>
                <h3 className="t-h3 mt-3.5 text-[1.15rem] leading-snug md:text-[1.3rem]">{item.name}</h3>
                <p className="mt-1 line-clamp-2 text-[0.92rem] leading-relaxed text-muted">{item.description}</p>
                <p className="mt-2 font-medium tabular-nums">
                  {money(item.price)}
                  {item.per && <span className="ms-1.5 text-[0.88rem] font-normal text-muted">{perLabel(item)}</span>}
                </p>
                <div className="mt-auto pt-3">
                  {q === 0 ? (
                    <button type="button" onClick={() => setQty(item.id, 1)} className="btn btn-primary btn-sm w-full">
                      הוספה לסל
                    </button>
                  ) : (
                    <Stepper value={q} onChange={(n) => setQty(item.id, n)} max={item.maxQty} name={item.name} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* סל ותשלום */}
      <aside aria-labelledby="cart-title" className="lg:sticky lg:top-28 lg:self-start">
        <form onSubmit={submit} noValidate className="rounded-[2px] bg-bg-alt p-5 md:p-6">
          <h2 id="cart-title" className="font-serif text-[1.45rem]">
            הסל שלי {count > 0 && <span className="text-[1rem] text-muted">({count})</span>}
          </h2>

          {totals.rows.length === 0 ? (
            <p className="mt-3 text-[0.95rem] text-muted">הסל ריק. בחרו פריטים מהרשימה.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {totals.rows.map(({ item, qty, sum }) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-[0.95rem]">
                  <span className="min-w-0">
                    <span className="block truncate">{item.name}</span>
                    <span className="text-muted tabular-nums">
                      {qty} × {money(item.price)}{item.per ? ` ${perLabel(item)}` : ""}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">{money(sum)}</span>
                    <button type="button" onClick={() => setQty(item.id, 0)} aria-label={`הסרת ${item.name} מהסל`} className="grid h-9 w-9 place-items-center text-muted hover:text-ink">
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <fieldset className="mt-5">
            <legend className={label}>משלוח או איסוף</legend>
            <div className="grid gap-2">
              {(
                [
                  { id: "pickup", title: "איסוף עצמי מחולון", sub: "בחינם, בתיאום מראש" },
                  { id: "post", title: "משלוח בדואר ישראל", sub: postReady ? `לכל הארץ – ${money(SHOP.postPrice!)}` : "לכל הארץ – המחיר יעודכן בקרוב" },
                ] as const
              ).map((o) => (
                <label
                  key={o.id}
                  className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-[2px] border border-line bg-surface px-3.5 py-2 has-[:checked]:border-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-strong"
                >
                  <span>
                    <span className="block font-medium">{o.title}</span>
                    <span className="text-[0.85rem] text-muted">{o.sub}</span>
                  </span>
                  <input type="radio" name="delivery" value={o.id} checked={delivery === o.id} onChange={() => setDelivery(o.id)} className="h-4 w-4 accent-[var(--color-text)]" />
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-3.5">
            <div>
              <label htmlFor="c-name" className={label}>שם מלא</label>
              <input id="c-name" autoComplete="name" value={form.name} onChange={set("name")} className={field} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="c-phone" className={label}>טלפון</label>
                <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={form.phone} onChange={set("phone")} className={`${field} text-right`} />
              </div>
              <div>
                <label htmlFor="c-email" className={label}>מייל (לקבלה)</label>
                <input id="c-email" type="email" autoComplete="email" dir="ltr" value={form.email} onChange={set("email")} className={`${field} text-right`} />
              </div>
            </div>
            {delivery === "post" && (
              <>
                <div>
                  <label htmlFor="c-address" className={label}>רחוב ומספר</label>
                  <input id="c-address" autoComplete="street-address" value={form.address} onChange={set("address")} className={field} />
                </div>
                <div className="grid grid-cols-[1fr_7rem] gap-3">
                  <div>
                    <label htmlFor="c-city" className={label}>עיר</label>
                    <input id="c-city" autoComplete="address-level2" value={form.city} onChange={set("city")} className={field} />
                  </div>
                  <div>
                    <label htmlFor="c-zip" className={label}>מיקוד</label>
                    <input id="c-zip" inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={set("zip")} className={field} />
                  </div>
                </div>
              </>
            )}
            <div>
              <label htmlFor="c-notes" className={label}>הערות (לא חובה)</label>
              <textarea id="c-notes" rows={2} value={form.notes} onChange={set("notes")} className={`${field} h-auto py-3`} />
            </div>
          </div>

          <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-[0.97rem] tabular-nums">
            <div className="flex justify-between">
              <dt>סכום פריטים</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{delivery === "post" ? "משלוח בדואר ישראל" : "איסוף עצמי"}</dt>
              <dd>{totals.shipping === null ? "יעודכן" : totals.shipping === 0 ? "חינם" : money(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-[1.1rem] font-medium">
              <dt>סה״כ לתשלום</dt>
              <dd>{totals.total === null ? "—" : money(totals.total)}</dd>
            </div>
          </dl>

          <label className="mt-4 flex items-start gap-2.5 text-[0.9rem] leading-relaxed">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-text)]" />
            <span>
              קראתי ואני מסכים/ה ל
              <a href="/terms" className="underline decoration-accent underline-offset-4">תקנון ולמדיניות הביטול</a>
            </span>
          </label>

          {status.kind === "error" && (
            <p role="alert" className="mt-3 text-[0.95rem] font-medium text-[#9b3b2a]">
              {status.msg}
            </p>
          )}

          <button type="submit" disabled={status.kind === "sending" || (delivery === "post" && !postReady)} className="btn btn-primary mt-4 w-full disabled:opacity-50">
            {status.kind === "sending" ? "פותח דף תשלום…" : "מעבר לתשלום מאובטח"}
          </button>
          <p className="mt-2 text-center text-[0.82rem] text-muted">התשלום מתבצע בדף המאובטח של טרנזילה. פרטי האשראי לא נשמרים באתר.</p>
        </form>
      </aside>

      {/* דף התשלום של טרנזילה */}
      {paymentUrl && (
        <div role="dialog" aria-modal="true" aria-label="תשלום מאובטח" className="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-3">
          <div className="relative h-[min(720px,92vh)] w-full max-w-[520px] overflow-hidden rounded-[2px] bg-surface">
            <button type="button" onClick={() => setPaymentUrl(null)} aria-label="סגירת דף התשלום" className="absolute top-2 left-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-bg">
              ×
            </button>
            <iframe src={paymentUrl} title="דף תשלום מאובטח – טרנזילה" className="h-full w-full border-0" allow="payment" />
          </div>
        </div>
      )}
    </div>
  );
}

/** תמונת פריט; אם יש תמונה שנייה – מתחלפת במעבר עכבר, ובנייד בלחיצה על הכפתור */
function ItemPhotos({ item }: { item: ShopItem }) {
  const [second, setSecond] = useState(false);
  const sizes = "(min-width: 1024px) 25vw, 50vw";
  if (!item.image2) return <Image src={item.image!} alt={item.name} fill sizes={sizes} className="object-cover" />;
  return (
    <div className="group absolute inset-0">
      <Image src={item.image!} alt={item.name} fill sizes={sizes} className="object-cover" />
      <Image
        src={item.image2}
        alt={`${item.name} – תמונה נוספת`}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-500 ${second ? "opacity-100" : "opacity-0 [@media(hover:hover)]:group-hover:opacity-100"}`}
      />
      <button
        type="button"
        onClick={() => setSecond((s) => !s)}
        aria-pressed={second}
        aria-label={second ? "הצגת התמונה הראשית" : "הצגת תמונה נוספת"}
        className="absolute bottom-2.5 left-2.5 flex gap-1.5 rounded-full bg-white/85 px-2.5 py-2"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${second ? "bg-ink/30" : "bg-ink"}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${second ? "bg-ink" : "bg-ink/30"}`} />
      </button>
    </div>
  );
}
