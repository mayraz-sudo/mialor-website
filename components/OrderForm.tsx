"use client";

import { useState } from "react";
import { EVENT_TYPES, detailedOrderMessage, whatsappLink, type Product } from "@/lib/site";
import { IconWhatsApp } from "./Icons";

const field =
  "h-12 w-full rounded-[2px] border border-line bg-surface px-3.5 text-[1rem] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-[0.92rem] font-medium";

/** טופס הזמנה: הלקוחה ממלאת כמות, תאריך ופרטים, וההודעה נשלחת לוואטסאפ מוכנה – בלי צורך לשאול שוב */
export default function OrderForm({ product }: { product: Product }) {
  const isDesign = product.minQty <= 1;
  const [quantity, setQuantity] = useState(String(product.minQty));
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < product.minQty) {
      setError(`הכמות המינימלית להזמנה היא ${product.minQty}`);
      return;
    }
    setError("");
    const url = whatsappLink(
      detailedOrderMessage(product, { quantity: String(q), date, eventType, name, notes }, window.location.href),
    );
    // פתיחה בחלון חדש; אם הדפדפן חוסם – מעבר ישיר
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.href = url;
  };

  return (
    <form onSubmit={submit} className="rounded-[2px] bg-bg-alt p-5 md:p-7" noValidate>
      <h2 className="font-serif text-[1.45rem] leading-tight">פרטי ההזמנה</h2>
      <p className="mt-1 text-[0.95rem] text-muted">ממלאים כאן, וההודעה נשלחת אלינו בוואטסאפ עם כל הפרטים.</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="order-qty" className={label}>
            {isDesign ? "כמות עיצובים" : "כמות"}
          </label>
          <input
            id="order-qty"
            type="number"
            inputMode="numeric"
            min={product.minQty}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            aria-describedby="order-qty-hint"
            aria-invalid={Boolean(error)}
            className={`${field} tabular-nums`}
          />
          <p id="order-qty-hint" className="mt-1 text-[0.82rem] text-muted">
            מינימום {product.minQty}
          </p>
        </div>
        <div>
          <label htmlFor="order-date" className={label}>
            תאריך האירוע
          </label>
          <input id="order-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="order-event" className={label}>
          סוג האירוע
        </label>
        <select id="order-event" value={eventType} onChange={(e) => setEventType(e.target.value)} className={field}>
          <option value="">בחירה…</option>
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="order-name" className={label}>
          שם
        </label>
        <input id="order-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>

      <div className="mt-4">
        <label htmlFor="order-notes" className={label}>
          {product.customization ? "הקדשה, שמות או הערות" : "פרטים להזמנה"}
        </label>
        <textarea
          id="order-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={product.customization ? "למשל: שמות לתווית, נוסח ההקדשה, צבע סרט" : "למשל: שמות, סגנון, צבעים"}
          className={`${field} h-auto py-3 leading-relaxed`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[0.95rem] font-medium text-[#9b3b2a]">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary mt-5 w-full">
        <IconWhatsApp className="h-[18px] w-[18px]" />
        שליחת ההזמנה בוואטסאפ
      </button>
      <p className="mt-3 text-center text-[0.85rem] text-muted">אין תשלום באתר. נחזור אליכם עם אישור ופרטים.</p>
    </form>
  );
}
