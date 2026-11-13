"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order, Stage } from "@/lib/orders";

const STAGES: { id: Stage; label: string }[] = [
  { id: "new", label: "חדשה" },
  { id: "in_progress", label: "בהכנה" },
  { id: "ready", label: "מוכנה" },
  { id: "sent", label: "נשלחה" },
  { id: "picked_up", label: "נאספה" },
  { id: "cancelled", label: "בוטלה" },
];
const stageLabel = (s: Stage) => STAGES.find((x) => x.id === s)?.label ?? s;
const money = (n: number) => `₪${n.toLocaleString("he-IL", { maximumFractionDigits: 2 })}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
const wa = (phone: string, text: string) => `https://wa.me/972${phone.replace(/\D/g, "").replace(/^0/, "")}?text=${encodeURIComponent(text)}`;

type Filter = "open" | "paid" | "all";

export default function AdminClient() {
  const [state, setState] = useState<"loading" | "login" | "ready">("loading");
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("open");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (res.status === 401) return setState("login");
    const data = await res.json();
    setOrders(data.orders ?? []);
    setState("ready");
  }, []);
  useEffect(() => {
    load().catch(() => setState("login"));
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "שגיאה");
    setPassword("");
    load();
  };
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setOrders([]);
    setState("login");
  };
  const update = async (id: string, patch: { stage?: Stage; adminNote?: string }) => {
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (res.status === 401) return setState("login");
    const data = await res.json();
    if (data.order) setOrders((list) => list.map((o) => (o.id === id ? data.order : o)));
  };

  const shown = useMemo(() => {
    const term = q.trim();
    return orders.filter((o) => {
      if (filter === "paid" && o.pay !== "paid") return false;
      if (filter === "open" && (o.pay !== "paid" || ["sent", "picked_up", "cancelled"].includes(o.stage))) return false;
      if (!term) return true;
      return [o.id, o.customer.name, o.customer.phone, o.customer.city, ...o.items.map((i) => i.name)].some((v) => v?.includes(term));
    });
  }, [orders, filter, q]);

  const paid = orders.filter((o) => o.pay === "paid" && o.stage !== "cancelled");
  const month = new Date().toISOString().slice(0, 7);
  const monthTotal = paid.filter((o) => o.createdAt.startsWith(month)).reduce((a, o) => a + o.total, 0);
  const openCount = paid.filter((o) => !["sent", "picked_up"].includes(o.stage)).length;

  if (state === "loading") return <p className="py-24 text-center text-muted">טוען…</p>;

  if (state === "login")
    return (
      <section className="bg-bg">
        <form onSubmit={login} className="mx-auto flex max-w-[360px] flex-col gap-3 px-5 py-20">
          <h1 className="t-h2 text-center">ניהול הזמנות</h1>
          <label htmlFor="pw" className="mt-4 text-[0.92rem] font-medium">
            סיסמה
          </label>
          <input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-[2px] border border-line bg-surface px-3.5" />
          {error && <p role="alert" className="text-[0.92rem] text-[#9b2c2c]">{error}</p>}
          <button className="btn btn-primary mt-2">כניסה</button>
        </form>
      </section>
    );

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-5 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="t-h2">ניהול הזמנות</h1>
          <div className="flex gap-2">
            <button onClick={load} className="btn btn-secondary btn-sm">רענון</button>
            <button onClick={logout} className="btn btn-secondary btn-sm">יציאה</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            ["הזמנות פתוחות", String(openCount)],
            ["שולמו החודש", money(monthTotal)],
            ["סה״כ הזמנות ששולמו", String(paid.length)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[2px] border border-line bg-surface p-3 text-center">
              <p className="text-[0.82rem] text-muted">{k}</p>
              <p className="mt-1 text-[1.3rem] font-medium tabular-nums">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {([["open", "לטיפול"], ["paid", "כל ששולמו"], ["all", "הכול (כולל לא שולמו)"]] as [Filter, string][]).map(([id, l]) => (
            <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}
              className={`rounded-full border px-3.5 py-1.5 text-[0.9rem] ${filter === id ? "border-ink bg-ink text-bg" : "border-line bg-surface"}`}>
              {l}
            </button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש: שם, טלפון, מספר הזמנה…" aria-label="חיפוש הזמנה"
            className="h-10 min-w-[220px] flex-1 rounded-[2px] border border-line bg-surface px-3 text-[0.95rem]" />
        </div>

        {shown.length === 0 ? (
          <p className="py-16 text-center text-muted">{orders.length ? "אין הזמנות בסינון הזה." : "עדיין אין הזמנות."}</p>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {shown.map((o) => {
              const open = openId === o.id;
              return (
                <li key={o.id} className="rounded-[2px] border border-line bg-surface">
                  <button onClick={() => setOpenId(open ? null : o.id)} aria-expanded={open}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-right">
                    <span className="font-medium">{o.customer.name}</span>
                    <span className="text-[0.88rem] text-muted tabular-nums">{when(o.createdAt)}</span>
                    <span className="text-[0.88rem] text-muted">{o.id}</span>
                    <span className="ms-auto font-medium tabular-nums">{money(o.total)}</span>
                    <PayBadge o={o} />
                    <span className="rounded-full bg-bg px-2.5 py-0.5 text-[0.82rem]">{stageLabel(o.stage)}</span>
                    <span className="w-full text-[0.88rem] text-muted">
                      {o.items.map((i) => `${i.name} ×${i.qty}`).join(" · ")} — {o.delivery === "post" ? `משלוח: ${o.customer.city}` : "איסוף עצמי"}
                    </span>
                  </button>
                  {open && <Details o={o} onUpdate={(p) => update(o.id, p)} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function PayBadge({ o }: { o: Order }) {
  if (o.pay === "paid")
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-[0.82rem] ${o.payment?.mismatch ? "bg-[#fde2e2] text-[#9b2c2c]" : "bg-[#e3f0e1] text-[#2f5d2a]"}`}>
        {o.payment?.mismatch ? "שולם – סכום לא תואם!" : "שולם"}
      </span>
    );
  if (o.pay === "failed") return <span className="rounded-full bg-[#fde2e2] px-2.5 py-0.5 text-[0.82rem] text-[#9b2c2c]">תשלום נכשל</span>;
  return <span className="rounded-full bg-[#fff4d6] px-2.5 py-0.5 text-[0.82rem]">לא שולם</span>;
}

function Details({ o, onUpdate }: { o: Order; onUpdate: (p: { stage?: Stage; adminNote?: string }) => void }) {
  const [note, setNote] = useState(o.adminNote ?? "");
  const c = o.customer;
  return (
    <div className="grid gap-6 border-t border-line p-4 md:grid-cols-2">
      <div className="flex flex-col gap-1.5 text-[0.95rem]">
        <h3 className="font-medium">לקוחה</h3>
        <p>{c.name}</p>
        <p>
          <a href={`tel:${c.phone}`} className="underline">{c.phone}</a>
          {" · "}
          <a href={wa(c.phone, `שלום ${c.name}, כאן מאי ממיאלור לגבי ההזמנה שלך (${o.id})`)} target="_blank" rel="noopener noreferrer" className="underline">וואטסאפ</a>
        </p>
        {c.email && <p><a href={`mailto:${c.email}`} className="underline">{c.email}</a></p>}
        <p>{o.delivery === "post" ? `משלוח בדואר ישראל: ${c.address}, ${c.city}${c.zip ? ` ${c.zip}` : ""}` : "איסוף עצמי מחולון"}</p>
        {c.notes && <p className="text-muted">הערות הלקוחה: {c.notes}</p>}

        <h3 className="mt-3 font-medium">פריטים</h3>
        <ul>
          {o.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3 tabular-nums">
              <span>{i.name} ×{i.qty}{i.per ? ` (${money(i.price)} ${i.per})` : ""}</span>
              <span>{money(i.sum)}</span>
            </li>
          ))}
          <li className="flex justify-between text-muted"><span>משלוח</span><span>{o.shipping ? money(o.shipping) : "חינם"}</span></li>
          <li className="flex justify-between font-medium"><span>סה״כ</span><span>{money(o.total)}</span></li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 text-[0.95rem]">
        <div>
          <h3 className="font-medium">תשלום</h3>
          {o.pay === "paid" ? (
            <p className="mt-1">
              שולם {o.payment?.sum ? `₪${o.payment.sum}` : ""} {o.payment?.last4 ? `· כרטיס …${o.payment.last4}` : ""} {o.payment?.index ? `· עסקה ${o.payment.index}` : ""}
            </p>
          ) : (
            <p className="mt-1 text-muted">{o.pay === "failed" ? `התשלום נכשל (קוד ${o.payment?.response || "?"})` : "הלקוחה פתחה תשלום אבל הוא לא הושלם."}</p>
          )}
          {o.payment?.mismatch && <p className="mt-1 text-[#9b2c2c]">הסכום ששולם לא תואם להזמנה. לבדוק בטרנזילה לפני משלוח!</p>}
          <p className="mt-1 text-[0.82rem] text-muted">לפני שליחה, כדאי לוודא שהעסקה מופיעה גם בטרנזילה.</p>
        </div>

        <div>
          <h3 className="font-medium">סטטוס</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <button key={s.id} onClick={() => onUpdate({ stage: s.id })} aria-pressed={o.stage === s.id}
                className={`rounded-full border px-3 py-1.5 text-[0.88rem] ${o.stage === s.id ? "border-ink bg-ink text-bg" : "border-line bg-bg"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={`note-${o.id}`} className="font-medium">הערה פנימית</label>
          <textarea id={`note-${o.id}`} value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            className="mt-2 w-full rounded-[2px] border border-line bg-bg p-2.5" />
          <button onClick={() => onUpdate({ adminNote: note })} disabled={note === (o.adminNote ?? "")} className="btn btn-secondary btn-sm mt-2 disabled:opacity-50">
            שמירת הערה
          </button>
        </div>
      </div>
    </div>
  );
}
