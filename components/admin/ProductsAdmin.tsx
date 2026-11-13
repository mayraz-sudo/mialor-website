"use client";

import { useEffect, useRef, useState } from "react";
import { isLaunchActive, itemPrice, perLabel, type ShopItem } from "@/lib/shop";

const money = (n: number) => `₪${n.toLocaleString("he-IL", { maximumFractionDigits: 2 })}`;
const field = "h-11 w-full rounded-[2px] border border-line bg-bg px-3 text-[1rem]";
const label = "mb-1 block text-[0.9rem] font-medium";

/** מקטין תמונה בדפדפן (עד 1600 פיקסלים) ודוחס ל-JPEG – כדי שההעלאה תהיה מהירה גם מהטלפון */
async function prepareImage(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("image"))), "image/jpeg", 0.85));
}

const newId = () => `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const empty = (): ShopItem => ({ id: newId(), name: "", description: "", price: 0, images: [] });

export default function ProductsAdmin({ onAuthLost }: { onAuthLost: () => void }) {
  const [items, setItems] = useState<ShopItem[] | null>(null);
  const [editing, setEditing] = useState<{ item: ShopItem; isNew: boolean } | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; msg?: string }>({ kind: "idle" });
  const launch = isLaunchActive();

  useEffect(() => {
    fetch("/api/admin/catalog", { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onAuthLost();
      const d = await r.json();
      setItems(d.items ?? []);
    });
  }, [onAuthLost]);

  /** שמירת כל הרשימה */
  const save = async (next: ShopItem[]) => {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/admin/catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: next }),
    });
    if (res.status === 401) return onAuthLost();
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ kind: "error", msg: d.error || "השמירה נכשלה. נסי שוב." });
      return false;
    }
    setItems(d.items);
    setStatus({ kind: "saved" });
    setTimeout(() => setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s)), 2500);
    return true;
  };

  const move = (i: number, dir: -1 | 1) => {
    if (!items) return;
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };
  const toggleHidden = (id: string) => items && save(items.map((p) => (p.id === id ? { ...p, hidden: !p.hidden || undefined } : p)));
  const remove = (p: ShopItem) => {
    if (!items || !confirm(`למחוק את "${p.name}"? אפשר במקום זה להסתיר אותו.`)) return;
    save(items.filter((x) => x.id !== p.id));
  };
  const submitEdit = async (item: ShopItem, isNew: boolean) => {
    if (!items) return;
    const next = isNew ? [...items, item] : items.map((p) => (p.id === item.id ? item : p));
    if (await save(next)) setEditing(null);
  };

  if (!items) return <p className="py-16 text-center text-muted">טוען מוצרים…</p>;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.92rem] text-muted">
          {items.filter((i) => !i.hidden).length} מוצרים מוצגים בחנות{items.some((i) => i.hidden) ? ` · ${items.filter((i) => i.hidden).length} מוסתרים` : ""}
        </p>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <button onClick={() => setEditing({ item: empty(), isNew: true })} className="btn btn-primary btn-sm">
            + מוצר חדש
          </button>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((p, i) => (
          <li key={p.id} className={`flex flex-wrap items-center gap-3 rounded-[2px] border border-line bg-surface p-2.5 ${p.hidden ? "bg-bg-alt" : ""}`}>
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[2px] bg-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-medium leading-snug">{p.name}</p>
              <p className="text-[0.88rem] text-muted tabular-nums">
                {money(p.price)} {perLabel(p)}
                {launch && <span> · בהשקה {money(itemPrice(p, true))}</span>}
                {p.hidden && <span className="ms-2 rounded-full bg-bg-alt px-2 py-0.5 text-ink">מוסתר</span>}
                {!p.images.length && <span className="ms-2 rounded-full bg-[#fde2e2] px-2 py-0.5 text-[#9b2c2c]">אין תמונה – לא מוצג</span>}
              </p>
            </div>
            <div className="flex w-full items-center justify-end gap-1 sm:w-auto sm:shrink-0">
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`הזזת ${p.name} למעלה`} className="grid h-9 w-9 place-items-center rounded-[2px] border border-line disabled:opacity-30">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`הזזת ${p.name} למטה`} className="grid h-9 w-9 place-items-center rounded-[2px] border border-line disabled:opacity-30">↓</button>
              <button onClick={() => toggleHidden(p.id)} className="h-9 rounded-[2px] border border-line px-2.5 text-[0.88rem]">{p.hidden ? "הצגה" : "הסתרה"}</button>
              <button onClick={() => setEditing({ item: { ...p, images: [...p.images] }, isNew: false })} className="h-9 flex-1 rounded-[2px] bg-ink px-3 text-[0.88rem] text-bg sm:flex-none">עריכה</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <Editor
          key={editing.item.id}
          initial={editing.item}
          isNew={editing.isNew}
          onCancel={() => setEditing(null)}
          onSave={(it) => submitEdit(it, editing.isNew)}
          onDelete={editing.isNew ? undefined : () => (remove(editing.item), setEditing(null))}
          saving={status.kind === "saving"}
          error={status.kind === "error" ? status.msg : undefined}
          onAuthLost={onAuthLost}
        />
      )}
    </div>
  );
}

function SaveStatus({ status }: { status: { kind: string; msg?: string } }) {
  if (status.kind === "saving") return <span className="text-[0.88rem] text-muted">שומר…</span>;
  if (status.kind === "saved") return <span className="text-[0.88rem] text-[#2f5d2a]">נשמר ✓ ומופיע באתר</span>;
  if (status.kind === "error") return <span role="alert" className="text-[0.88rem] text-[#9b2c2c]">{status.msg}</span>;
  return null;
}

function Editor({
  initial,
  isNew,
  onCancel,
  onSave,
  onDelete,
  saving,
  error,
  onAuthLost,
}: {
  initial: ShopItem;
  isNew: boolean;
  onCancel: () => void;
  onSave: (item: ShopItem) => void;
  onDelete?: () => void;
  saving: boolean;
  error?: string;
  onAuthLost: () => void;
}) {
  const [item, setItem] = useState<ShopItem>(initial);
  const [price, setPrice] = useState(initial.price ? String(initial.price) : "");
  const [uploading, setUploading] = useState(0);
  const [localError, setLocalError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    first.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setLocalError("");
    for (const file of Array.from(files).slice(0, 8)) {
      setUploading((n) => n + 1);
      try {
        const blob = await prepareImage(file);
        const res = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob });
        if (res.status === 401) return onAuthLost();
        const d = await res.json();
        if (!res.ok || !d.url) throw new Error(d.error || "upload");
        setItem((it) => ({ ...it, images: [...it.images, d.url].slice(0, 8) }));
      } catch {
        setLocalError(`לא הצלחנו להעלות את "${file.name}". נסי תמונה אחרת (JPG או PNG).`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const moveImage = (i: number, dir: -1 | 1) =>
    setItem((it) => {
      const imgs = [...it.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return it;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...it, images: imgs };
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(price.replace(",", "."));
    if (!item.name.trim()) return setLocalError("נא למלא שם מוצר.");
    if (!Number.isFinite(p) || p <= 0) return setLocalError("נא למלא מחיר תקין.");
    if (!item.images.length) return setLocalError("נא להעלות לפחות תמונה אחת.");
    onSave({ ...item, name: item.name.trim(), description: item.description.trim(), price: p });
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="editor-title" className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/45 sm:items-center sm:p-6">
      <form onSubmit={submit} className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[14px] bg-surface sm:max-w-[620px] sm:rounded-[4px]">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 id="editor-title" className="font-serif text-[1.4rem]">{isNew ? "מוצר חדש" : "עריכת מוצר"}</h2>
          <button type="button" onClick={onCancel} aria-label="סגירה בלי לשמור" className="grid h-10 w-10 place-items-center text-xl">×</button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label htmlFor="p-name" className={label}>שם המוצר</label>
            <input ref={first} id="p-name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} className={field} />
          </div>
          <div>
            <label htmlFor="p-desc" className={label}>תיאור</label>
            <textarea id="p-desc" rows={3} value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} className={`${field} h-auto py-2.5`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-price" className={label}>מחיר (₪)</label>
              <input id="p-price" inputMode="decimal" dir="ltr" value={price} onChange={(e) => setPrice(e.target.value)} className={`${field} text-right`} />
            </div>
            <div>
              <label htmlFor="p-per" className={label}>המחיר הוא</label>
              <select id="p-per" value={item.per ?? ""} onChange={(e) => setItem({ ...item, per: (e.target.value || undefined) as ShopItem["per"] })} className={field}>
                <option value="">בלי ציון</option>
                <option value="unit">ליחידה</option>
                <option value="pair">לזוג</option>
              </select>
            </div>
          </div>

          <fieldset>
            <legend className={label}>תמונות (הראשונה היא התמונה הראשית)</legend>
            <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {item.images.map((src, i) => (
                <li key={src} className="relative">
                  <div className="aspect-square overflow-hidden rounded-[2px] bg-bg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`תמונה ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                  {i === 0 && <span className="absolute top-1.5 right-1.5 rounded-full bg-ink px-2 py-0.5 text-[0.72rem] text-bg">ראשית</span>}
                  <div className="mt-1 flex justify-between">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="להקדים" className="h-8 w-8 rounded-[2px] border border-line disabled:opacity-30">→</button>
                    <button type="button" onClick={() => setItem({ ...item, images: item.images.filter((s) => s !== src) })} aria-label={`הסרת תמונה ${i + 1}`} className="h-8 rounded-[2px] border border-line px-2 text-[0.82rem]">הסרה</button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === item.images.length - 1} aria-label="לאחר" className="h-8 w-8 rounded-[2px] border border-line disabled:opacity-30">←</button>
                  </div>
                </li>
              ))}
              {item.images.length < 8 && (
                <li>
                  <label className="grid aspect-square cursor-pointer place-items-center rounded-[2px] border border-dashed border-accent bg-bg text-center text-[0.88rem] text-muted">
                    <span>{uploading ? "מעלה…" : "+ הוספת תמונות"}</span>
                    <input ref={fileInput} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
                  </label>
                </li>
              )}
            </ul>
          </fieldset>

          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={!!item.hidden} onChange={(e) => setItem({ ...item, hidden: e.target.checked || undefined })} className="h-4 w-4 accent-[var(--color-text)]" />
            <span>להסתיר מהחנות (למשל כשהמוצר אזל)</span>
          </label>

          <p className="text-[0.8rem] text-muted" dir="ltr">id: {item.id}</p>
        </div>

        <div className="border-t border-line px-5 py-3.5">
          {(localError || error) && <p role="alert" className="mb-2.5 text-[0.92rem] text-[#9b2c2c]">{localError || error}</p>}
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving || uploading > 0} className="btn btn-primary flex-1 disabled:opacity-50">
              {saving ? "שומר…" : uploading ? "מחכה להעלאת התמונות…" : "שמירה"}
            </button>
            {onDelete && (
              <button type="button" onClick={onDelete} className="btn btn-secondary text-[#9b2c2c]">
                מחיקה
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
