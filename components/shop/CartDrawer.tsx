"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SHOP, cartTotals, perLabel, type Delivery } from "@/lib/shop";
import { IconClose } from "../Icons";
import { useCart } from "./CartContext";

export const money = (n: number) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const field =
  "h-12 w-full rounded-[2px] border border-line bg-surface px-3.5 text-[1rem] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-[0.92rem] font-medium";

export function Stepper({ value, onChange, max = 99, name, small = false }: { value: number; onChange: (n: number) => void; max?: number; name: string; small?: boolean }) {
  const h = small ? "h-9" : "h-11";
  const w = small ? "w-9" : "w-11";
  return (
    <div className={`flex ${h} items-center rounded-[2px] border border-line bg-surface`} role="group" aria-label={`כמות – ${name}`}>
      <button type="button" className={`grid h-full ${w} place-items-center text-lg`} aria-label="הוספה" onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
      <span className="min-w-7 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={`grid h-full ${w} place-items-center text-lg`} aria-label="הפחתה" onClick={() => onChange(Math.max(0, value - 1))}>
        −
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, count, setQty, isOpen, closeCart } = useCart();
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", zip: "", notes: "" });
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "error"; msg?: string }>({ kind: "idle" });
  const [payment, setPayment] = useState<{ action: string; fields: Record<string, string> } | null>(null);
  const payForm = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // פתיחת דף התשלום: שליחת הפרטים (POST) לתוך ה־iframe של טרנזילה
  useEffect(() => {
    if (payment) payForm.current?.submit();
  }, [payment]);

  // נעילת גלילה, Escape ומיקוד
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !payment && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart, payment]);

  const totals = useMemo(() => cartTotals(cart, delivery), [cart, delivery]);
  const postReady = SHOP.postPrice !== null;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!count) return setStatus({ kind: "error", msg: "הסל ריק. בחרו לפחות פריט אחד." });
    if (!form.name.trim() || !/^0\d{8,9}$/.test(form.phone.replace(/[-\s]/g, ""))) return setStatus({ kind: "error", msg: "נא למלא שם וטלפון תקין." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setStatus({ kind: "error", msg: "נא למלא כתובת מייל תקינה (לאישור ההזמנה)." });
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
      if (!res.ok || !data.action || !data.fields) throw new Error(data.error || "לא הצלחנו לפתוח את דף התשלום. נסו שוב או כתבו לנו בוואטסאפ.");
      setPayment({ action: data.action, fields: data.fields });
      setStatus({ kind: "idle" });
    } catch (err) {
      setStatus({ kind: "error", msg: err instanceof Error ? err.message : "שגיאה. נסו שוב." });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-ink/35 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeCart}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        inert={!isOpen}
        className={`fixed inset-y-0 left-0 z-[85] flex w-[min(440px,100vw)] flex-col bg-bg shadow-[0_0_40px_rgba(58,42,32,0.18)] transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="font-serif text-[1.5rem]">
            הסל שלי {count > 0 && <span className="text-[1rem] text-muted">({count})</span>}
          </h2>
          <button ref={closeBtn} type="button" onClick={closeCart} aria-label="סגירת הסל" className="-ml-2 grid h-11 w-11 place-items-center">
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {totals.rows.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-muted">הסל ריק.</p>
              <Link href="/shop" onClick={closeCart} className="btn btn-primary mt-5">
                לחנות המוצרים
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="px-5 pt-2 pb-6">
              <ul className="divide-y divide-line border-b border-line">
                {totals.rows.map(({ item, qty, sum }) => (
                  <li key={item.id} className="flex gap-3 py-3.5">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[2px] bg-surface">
                      {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="leading-snug">{item.name}</span>
                        <button type="button" onClick={() => setQty(item.id, 0)} aria-label={`הסרת ${item.name} מהסל`} className="-mt-1.5 -ml-2 grid h-9 w-9 shrink-0 place-items-center text-muted hover:text-ink">
                          ×
                        </button>
                      </div>
                      <span className="text-[0.88rem] text-muted tabular-nums">
                        {money(item.price)}
                        {item.per ? ` ${perLabel(item)}` : ""}
                      </span>
                      <div className="mt-auto flex items-center justify-between pt-1.5">
                        <Stepper small value={qty} onChange={(n) => setQty(item.id, n)} max={item.maxQty} name={item.name} />
                        <span className="font-medium tabular-nums">{money(sum)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

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
                <div>
                  <label htmlFor="c-phone" className={label}>טלפון</label>
                  <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={form.phone} onChange={set("phone")} className={`${field} text-right`} />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>מייל (לאישור ההזמנה)</label>
                  <input id="c-email" type="email" required autoComplete="email" dir="ltr" value={form.email} onChange={set("email")} className={`${field} text-right`} />
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
          )}
        </div>
      </aside>

      {/* דף התשלום של טרנזילה */}
      {payment && (
        <div role="dialog" aria-modal="true" aria-label="תשלום מאובטח" className="fixed inset-0 z-[95] grid place-items-center bg-ink/40 p-3">
          <div className="relative h-[min(720px,92vh)] w-full max-w-[520px] overflow-hidden rounded-[2px] bg-surface">
            <button type="button" onClick={() => setPayment(null)} aria-label="סגירת דף התשלום" className="absolute top-2 left-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-bg">
              ×
            </button>
            <iframe name="tranzila-pay" title="דף תשלום מאובטח – טרנזילה" className="h-full w-full border-0" allow="payment" />
            <form ref={payForm} action={payment.action} method="POST" target="tranzila-pay" hidden>
              {Object.entries(payment.fields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
