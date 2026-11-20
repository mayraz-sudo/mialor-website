"use client";

import { useState } from "react";
import { DELIVERY, EVENT_TYPES, detailedOrderMessage, discounted, formatAmount, isPromoProduct, whatsappLink, type Product } from "@/lib/site";
import { usePromoActive } from "./Promo";
import { IconWhatsApp } from "./Icons";
import { isValidPhone } from "@/lib/phone";
import { getUtm } from "@/lib/attribution";

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
  const [phone, setPhone] = useState("");
  // שדה מלכודת לבוטים – מוסתר מאנשים
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  // משלוח או איסוף – רק במוצרים פיזיים (לא בעיצוב דיגיטלי)
  const [delivery, setDelivery] = useState<"" | "pickup" | "shipping">("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  // מחשבון: כמות × מחיר ליחידה (אחרי הנחת החודש, אם יש)
  const promo = usePromoActive() && isPromoProduct(product);
  const unitPrice = product.priceFrom === null ? null : promo ? discounted(product.priceFrom) : product.priceFrom;
  const qtyNum = Math.floor(Number(quantity));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < product.minQty) {
      setError(`מחיר הכמות הוא החל מ־${product.minQty} יחידות. לכמות קטנה יותר – כתבו לנו בוואטסאפ`);
      return;
    }
    if (!name.trim()) {
      setError("נשמח לדעת איך קוראים לך");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("נא להזין מספר טלפון תקין");
      return;
    }
    setError("");
    const deliveryText = delivery === "pickup" ? "איסוף עצמי מחולון" : delivery === "shipping" ? "משלוח בתיאום מראש" : "";
    // הפנייה נשמרת גם במערכת הניהול – ברקע, בלי לעכב את המעבר לוואטסאפ
    try {
      fetch("/api/lead", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          name,
          phone,
          quantity: q,
          date,
          eventType,
          notes,
          delivery: deliveryText,
          city: delivery === "shipping" ? city : "",
          website,
          utm: getUtm(),
        }),
      }).catch(() => {});
    } catch {}
    const url = whatsappLink(
      detailedOrderMessage(
        product,
        {
          quantity: String(q),
          date,
          eventType,
          name,
          notes,
          delivery: deliveryText,
          city: delivery === "shipping" ? city : "",
        },
        window.location.href,
      ),
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
            מחיר הכמות – החל מ־{product.minQty} יחידות
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

      {!isDesign && unitPrice !== null && (
        <div className="mt-4 rounded-[2px] border border-line bg-surface px-4 py-3" aria-live="polite">
          <p className="text-[0.85rem] text-muted">מחשבון מחיר</p>
          {Number.isFinite(qtyNum) && qtyNum >= product.minQty ? (
            <p className="mt-0.5 tabular-nums">
              {qtyNum} יחידות × {formatAmount(unitPrice)} ={" "}
              <span className="font-serif text-[1.3rem] font-medium">החל מ־{formatAmount(Math.round(qtyNum * unitPrice * 100) / 100)}</span>
            </p>
          ) : (
            <p className="mt-0.5">מחיר הכמות הוא החל מ־{product.minQty} יחידות. לכמות קטנה יותר – כתבו לנו ונחזור עם מחיר.</p>
          )}
          <p className="mt-1 text-[0.8rem] text-muted">
            {promo ? "כולל הנחת החודש. " : ""}לפני משלוח ותוספות (כמו הטבעה). המחיר הסופי יאושר איתך לפני ההזמנה.
          </p>
        </div>
      )}

      {!isDesign && (
        <fieldset className="mt-4">
          <legend className={label}>משלוח או איסוף</legend>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { id: "pickup", title: "איסוף עצמי", sub: "מחולון, בחינם" },
                { id: "shipping", title: "משלוח", sub: "בתיאום מראש, בעיקר באזור המרכז" },
              ] as const
            ).map((o) => (
              <label
                key={o.id}
                className="flex min-h-14 cursor-pointer flex-col justify-center rounded-[2px] border border-line bg-surface px-3.5 py-2 transition-colors has-[:checked]:border-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-strong"
              >
                <input
                  type="radio"
                  name="order-delivery"
                  value={o.id}
                  checked={delivery === o.id}
                  onChange={() => setDelivery(o.id)}
                  className="sr-only"
                />
                <span className="text-[0.98rem] font-medium">{o.title}</span>
                <span className="text-[0.82rem] text-muted">{o.sub}</span>
              </label>
            ))}
          </div>
          {delivery === "shipping" && (
            <div className="mt-3">
              <label htmlFor="order-city" className={label}>
                עיר למשלוח
              </label>
              <input id="order-city" type="text" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} className={field} />
              <p className="mt-1 text-[0.82rem] text-muted">{DELIVERY.shipping}. עלות המשלוח תימסר לפני אישור ההזמנה.</p>
            </div>
          )}
        </fieldset>
      )}

      <div className="mt-4">
        <label htmlFor="order-name" className={label}>
          שם
        </label>
        <input id="order-name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>

      <div className="mt-4">
        <label htmlFor="order-phone" className={label}>
          טלפון
        </label>
        <input
          id="order-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="050-0000000"
          className={`${field} text-right`}
        />
      </div>

      {/* מלכודת לבוטים: מוסתר מאנשים ומקוראי מסך */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="order-website">Website</label>
        <input id="order-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
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
      <p className="mt-1 text-center text-[0.82rem] text-muted">
        שליחת ההזמנה מהווה הסכמה ל
        <a href="/terms" className="text-ink underline decoration-accent underline-offset-4">
          תקנון
        </a>
        , כולל מדיניות הביטול.
      </p>
    </form>
  );
}
