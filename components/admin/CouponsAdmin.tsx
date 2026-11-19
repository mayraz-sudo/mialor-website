"use client";

import { useEffect, useState } from "react";
import { couponLabel, couponProblem, normalizeCode, type Coupon } from "@/lib/coupons";

const field = "h-11 w-full rounded-[2px] border border-line bg-bg px-3 text-[1rem]";
const label = "mb-1 block text-[0.9rem] font-medium";

/** קוד אקראי קריא, למשל MIALOR-7K2Q */
function randomCode() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return `MIALOR-${s}`;
}

const fmtDate = (d?: string) => (d ? d.split("-").reverse().join(".") : "");

export default function CouponsAdmin({ onAuthLost }: { onAuthLost: () => void }) {
  const [list, setList] = useState<Coupon[] | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; msg?: string }>({ kind: "idle" });
  const [copied, setCopied] = useState("");
  // טופס קופון חדש
  const [code, setCode] = useState(randomCode());
  const [kind, setKind] = useState<"percent" | "amount">("percent");
  const [value, setValue] = useState("10");
  const [maxUses, setMaxUses] = useState("1");
  const [expires, setExpires] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/admin/coupons", { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onAuthLost();
      const d = await r.json();
      setList(d.coupons ?? []);
    });
  }, [onAuthLost]);

  const save = async (next: Coupon[]) => {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/admin/coupons", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coupons: next }) });
    if (res.status === 401) return onAuthLost();
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ kind: "error", msg: d.error || "השמירה נכשלה." });
      return false;
    }
    setList(d.coupons);
    setStatus({ kind: "saved" });
    setTimeout(() => setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s)), 2500);
    return true;
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!list) return;
    const c = normalizeCode(code);
    const v = Number(value.replace(",", "."));
    if (c.length < 3) return setStatus({ kind: "error", msg: "הקוד צריך לפחות 3 תווים (אותיות באנגלית או ספרות)." });
    if (!Number.isFinite(v) || v <= 0 || (kind === "percent" && v > 100)) return setStatus({ kind: "error", msg: "הסכום או האחוז לא תקינים." });
    const item: Coupon = {
      code: c,
      kind,
      value: v,
      note: note.trim() || undefined,
      expires: expires || undefined,
      maxUses: Number(maxUses) > 0 ? Math.floor(Number(maxUses)) : undefined,
      uses: 0,
      active: true,
      createdAt: new Date().toISOString(),
    };
    if (await save([item, ...list])) {
      setCode(randomCode());
      setNote("");
    }
  };

  const toggle = (c: Coupon) => list && save(list.map((x) => (x.code === c.code ? { ...x, active: !x.active } : x)));
  const remove = (c: Coupon) => list && confirm(`למחוק את הקופון ${c.code}?`) && save(list.filter((x) => x.code !== c.code));

  const shareText = (c: Coupon) =>
    `היי! קיבלת קופון מתנה ממיאלור 🤍\n${couponLabel(c)} על חנות המוצרים${c.expires ? `, בתוקף עד ${fmtDate(c.expires)}` : ""}.\nהקוד: ${c.code}\nמזינים אותו בסל לפני התשלום: https://mialorshop.com/shop`;
  const copy = async (c: Coupon) => {
    try {
      await navigator.clipboard.writeText(shareText(c));
      setCopied(c.code);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  };

  if (!list) return <p className="py-16 text-center text-muted">טוען קופונים…</p>;

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={create} className="space-y-3.5 self-start rounded-[2px] border border-line bg-surface p-4">
        <h2 className="font-serif text-[1.3rem]">קופון חדש</h2>
        <div>
          <label htmlFor="cp-code" className={label}>הקוד</label>
          <div className="flex gap-2">
            <input id="cp-code" dir="ltr" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={`${field} flex-1 text-right uppercase`} />
            <button type="button" onClick={() => setCode(randomCode())} className="h-11 rounded-[2px] border border-line px-3 text-[0.88rem]">חדש</button>
          </div>
          <p className="mt-1 text-[0.8rem] text-muted">אותיות באנגלית, ספרות ומקף. אפשר גם לכתוב קוד משלך, למשל DANA10.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cp-kind" className={label}>סוג</label>
            <select id="cp-kind" value={kind} onChange={(e) => setKind(e.target.value as "percent" | "amount")} className={field}>
              <option value="percent">אחוז הנחה</option>
              <option value="amount">סכום בשקלים</option>
            </select>
          </div>
          <div>
            <label htmlFor="cp-value" className={label}>{kind === "percent" ? "כמה אחוז" : "כמה ₪"}</label>
            <input id="cp-value" inputMode="decimal" dir="ltr" value={value} onChange={(e) => setValue(e.target.value)} className={`${field} text-right`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cp-uses" className={label}>כמה פעמים אפשר</label>
            <input id="cp-uses" inputMode="numeric" dir="ltr" value={maxUses} onChange={(e) => setMaxUses(e.target.value.replace(/\D/g, ""))} placeholder="ריק = בלי הגבלה" className={`${field} text-right`} />
          </div>
          <div>
            <label htmlFor="cp-exp" className={label}>בתוקף עד (לא חובה)</label>
            <input id="cp-exp" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={field} />
          </div>
        </div>
        <div>
          <label htmlFor="cp-note" className={label}>למי / למה (רק בשבילך)</label>
          <input id="cp-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="למשל: דנה – יום הולדת" className={field} />
        </div>
        <button className="btn btn-primary w-full" disabled={status.kind === "saving"}>
          {status.kind === "saving" ? "שומר…" : "יצירת קופון"}
        </button>
        {status.kind === "error" && <p role="alert" className="text-[0.9rem] text-[#9b2c2c]">{status.msg}</p>}
        {status.kind === "saved" && <p role="status" className="text-[0.9rem] text-[#2f5d2a]">נשמר ✓</p>}
        <p className="text-[0.8rem] leading-relaxed text-muted">
          הקופון חל על חנות המוצרים, על סכום הפריטים (בלי המשלוח). אם הוא מכסה את כל הסכום – ההזמנה נקלטת בלי תשלום.
        </p>
      </form>

      <div>
        <h2 className="font-serif text-[1.3rem]">הקופונים שלי</h2>
        {list.length === 0 ? (
          <p className="py-10 text-muted">עדיין אין קופונים.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {list.map((c) => {
              const problem = couponProblem(c);
              return (
                <li key={c.code} className={`rounded-[2px] border border-line p-3.5 ${problem ? "bg-bg-alt" : "bg-surface"}`}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span dir="ltr" className="font-mono text-[1.05rem] font-medium">{c.code}</span>
                    <span className="rounded-full bg-bg px-2.5 py-0.5 text-[0.85rem]">{couponLabel(c)}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[0.8rem] ${problem ? "bg-[#fde2e2] text-[#9b2c2c]" : "bg-[#e3f0e1] text-[#2f5d2a]"}`}>
                      {problem ? (c.active ? (c.maxUses && c.uses >= c.maxUses ? "נוצל" : "פג תוקף") : "כבוי") : "פעיל"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[0.88rem] text-muted">
                    שימושים: {c.uses}
                    {c.maxUses ? ` מתוך ${c.maxUses}` : " (בלי הגבלה)"}
                    {c.expires && ` · עד ${fmtDate(c.expires)}`}
                    {c.note && ` · ${c.note}`}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareText(c))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 rounded-[2px] bg-ink px-3 text-[0.88rem] leading-9 text-bg"
                    >
                      שליחה בוואטסאפ
                    </a>
                    <button onClick={() => copy(c)} className="h-9 rounded-[2px] border border-line px-3 text-[0.88rem]">
                      {copied === c.code ? "הועתק ✓" : "העתקת הודעה"}
                    </button>
                    <button onClick={() => toggle(c)} className="h-9 rounded-[2px] border border-line px-3 text-[0.88rem]">
                      {c.active ? "כיבוי" : "הפעלה"}
                    </button>
                    <button onClick={() => remove(c)} className="h-9 rounded-[2px] border border-line px-3 text-[0.88rem] text-[#9b2c2c]">
                      מחיקה
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
