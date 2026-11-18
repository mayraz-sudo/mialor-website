"use client";

import { useState } from "react";
import { cleanEngrave, itemPrice, type ShopItem } from "@/lib/shop";
import { productParams, track } from "@/lib/pixel";
import { useCart } from "./CartContext";
import { Stepper, money } from "./CartDrawer";
import { useLaunchActive } from "./Launch";

/** צבע לדוגמה ליד שם הצבע (רק לתצוגה) */
const SWATCH: Record<string, string> = {
  ורוד: "#d9918c",
  "בז׳": "#cbb89b",
  "בז'": "#cbb89b",
  בז: "#cbb89b",
  תכלת: "#8fb4cf",
  כתום: "#d2692a",
  חום: "#8a5a3b",
  "כחול כהה": "#25344f",
  כחול: "#3f5d8a",
  אפור: "#8f8a80",
  ירוק: "#5f8a78",
  לבן: "#f6f2ea",
  שחור: "#2b2522",
};

/** בחירת צבע, הטבעה וכמות, והוספה לסל – בעמוד המוצר */
export default function BuyBox({ item }: { item: ShopItem }) {
  const { qtyOf, add: addToCart, openCart } = useCart();
  const launch = useLaunchActive();
  const [qty, setLocalQty] = useState(1);
  const [color, setColor] = useState("");
  const [withEngrave, setWithEngrave] = useState(false);
  const [engrave, setEngrave] = useState("");
  const [error, setError] = useState("");
  const inCart = qtyOf(item.id);
  const max = item.maxQty ?? 99;
  const engr = item.engraving;
  const unit = itemPrice(item, launch) + (withEngrave && engr ? engr.price : 0);

  const add = () => {
    setError("");
    if (item.colors?.length && !color) return setError("נא לבחור צבע.");
    const text = engr ? cleanEngrave(engrave, engr.maxLength) : "";
    if (withEngrave && !text) return setError("נא לכתוב את הטקסט להטבעה.");
    addToCart({ id: item.id, qty: Math.min(max, qty), ...(color ? { color } : {}), ...(withEngrave && text ? { engrave: text } : {}) });
    track("AddToCart", { ...productParams({ ...item, price: unit }), value: unit * qty, num_items: qty });
    openCart();
  };

  return (
    <div>
      {item.colors?.length ? (
        <fieldset className="mb-5">
          <legend className="mb-2 font-medium">
            צבע{color && <span className="font-normal text-muted">: {color}</span>}
          </legend>
          <div className="flex flex-wrap gap-2">
            {item.colors.map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface py-1.5 ps-1.5 pe-3.5 text-[0.95rem] has-[:checked]:border-ink has-[:checked]:ring-1 has-[:checked]:ring-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-strong"
              >
                <input type="radio" name={`color-${item.id}`} value={c} checked={color === c} onChange={() => setColor(c)} className="sr-only" />
                <span aria-hidden className="h-6 w-6 rounded-full border border-black/10" style={{ background: SWATCH[c] ?? "#e9e1d5" }} />
                {c}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {engr && (
        <div className="mb-5 rounded-[2px] border border-line bg-surface p-3.5">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" checked={withEngrave} onChange={(e) => setWithEngrave(e.target.checked)} className="h-4 w-4 accent-[var(--color-text)]" />
            <span>
              הוספת הטבעה אישית <span className="text-muted">(בתוספת {money(engr.price)})</span>
            </span>
          </label>
          {withEngrave && (
            <div className="mt-3">
              <label htmlFor={`engrave-${item.id}`} className="mb-1.5 block text-[0.92rem] font-medium">
                מה להטביע? (שם או שם האירוע)
              </label>
              <input
                id={`engrave-${item.id}`}
                value={engrave}
                maxLength={engr.maxLength}
                onChange={(e) => setEngrave(e.target.value)}
                placeholder="למשל: לבת ישראל"
                className="h-12 w-full rounded-[2px] border border-line bg-bg px-3.5 text-[1rem] focus:border-accent focus:outline-none"
              />
              <p className="mt-1 text-[0.82rem] text-muted">
                {engrave.length}/{engr.maxLength} תווים. נקפיד להטביע בדיוק כפי שנכתב.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-stretch gap-3">
        <Stepper value={qty} onChange={(n) => setLocalQty(Math.max(1, n))} max={max} name={item.name} />
        <button type="button" onClick={add} className="btn btn-primary flex-1">
          הוספה לסל{(withEngrave || item.colors?.length) ? ` · ${money(unit * qty)}` : ""}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[0.92rem] font-medium text-[#9b3b2a]">
          {error}
        </p>
      )}
      <p className="mt-2 min-h-5 text-[0.88rem] text-muted" aria-live="polite">
        {inCart > 0 && (
          <>
            בסל: {inCart} ·{" "}
            <button type="button" onClick={openCart} className="underline decoration-accent underline-offset-4">
              לצפייה בסל ולתשלום
            </button>
          </>
        )}
      </p>
    </div>
  );
}
