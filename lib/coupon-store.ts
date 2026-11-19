import { blobStore, withTimeout } from "@/lib/blobstore";
import { normalizeCode, type Coupon } from "@/lib/coupons";

/** קופונים שמורים באחסון של האתר (נערכים במערכת הניהול) */
const KEY = "list";

export async function listCoupons(): Promise<Coupon[]> {
  const store = await blobStore("coupons");
  // קריאה של מפתח שעוד לא קיים לפעמים לא חוזרת – "לא ענה" = אין עדיין קופונים
  const v = await withTimeout(store.getJSON<Coupon[]>(KEY), 2500, null);
  return Array.isArray(v) ? v : [];
}

export async function saveCoupons(list: Coupon[]) {
  await (await blobStore("coupons")).setJSON(KEY, list);
}

export async function findCoupon(code: string) {
  const c = normalizeCode(code);
  if (!c) return null;
  return (await listCoupons()).find((x) => x.code === c) ?? null;
}

/** סימון שימוש בקופון (אחרי תשלום מוצלח) */
export async function markCouponUsed(code: string) {
  const list = await listCoupons();
  const i = list.findIndex((x) => x.code === normalizeCode(code));
  if (i < 0) return;
  list[i] = { ...list[i], uses: (list[i].uses ?? 0) + 1 };
  await saveCoupons(list);
}

/** בדיקה וניקוי של קופון שהגיע מהניהול */
export function cleanCoupon(raw: unknown, prev?: Coupon): Coupon | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const code = normalizeCode(r.code);
  const kind = r.kind === "amount" ? "amount" : "percent";
  const value = Number(r.value);
  if (code.length < 3 || !Number.isFinite(value) || value <= 0) return null;
  if (kind === "percent" && value > 100) return null;
  if (kind === "amount" && value > 100000) return null;
  const maxUses = Number(r.maxUses);
  const expires = typeof r.expires === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.expires) ? r.expires : undefined;
  return {
    code,
    kind,
    value: Math.round(value * 100) / 100,
    note: typeof r.note === "string" && r.note.trim() ? r.note.trim().slice(0, 120) : undefined,
    expires,
    maxUses: Number.isInteger(maxUses) && maxUses > 0 ? maxUses : undefined,
    uses: prev?.uses ?? 0,
    active: r.active !== false,
    createdAt: prev?.createdAt ?? new Date().toISOString(),
  };
}
