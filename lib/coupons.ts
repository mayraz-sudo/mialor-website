/**
 * קופונים – חישובים משותפים לדפדפן ולשרת (בשרת זה הקובע).
 */
export type Coupon = {
  /** הקוד שהלקוחה מקלידה (אותיות באנגלית, ספרות ומקף) */
  code: string;
  /** אחוז הנחה או סכום קבוע בשקלים */
  kind: "percent" | "amount";
  value: number;
  /** למי / למה (רק לך, לא מוצג ללקוחה) */
  note?: string;
  /** תוקף עד (כולל), YYYY-MM-DD לפי שעון ישראל */
  expires?: string;
  /** כמה פעמים אפשר להשתמש (ריק = בלי הגבלה) */
  maxUses?: number;
  uses: number;
  active: boolean;
  createdAt: string;
};

export const normalizeCode = (s: unknown) =>
  typeof s === "string" ? s.trim().toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9-]/g, "").slice(0, 24) : "";

const today = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(d);

/** למה אי אפשר להשתמש בקופון (או null אם אפשר) */
export function couponProblem(c: Coupon | null | undefined, now = new Date()): string | null {
  if (!c) return "הקוד לא קיים. כדאי לבדוק שהוקלד נכון.";
  if (!c.active) return "הקופון הזה כבר לא פעיל.";
  if (c.expires && today(now) > c.expires) return "תוקף הקופון הסתיים.";
  if (c.maxUses && c.uses >= c.maxUses) return "הקופון הזה כבר נוצל.";
  return null;
}

/** סכום ההנחה על סכום הפריטים (בלי משלוח) */
export function couponDiscount(c: Pick<Coupon, "kind" | "value">, subtotal: number) {
  const d = c.kind === "percent" ? Math.floor(subtotal * c.value) / 100 : c.value;
  return Math.max(0, Math.min(subtotal, Math.round(d * 100) / 100));
}

export const couponLabel = (c: Pick<Coupon, "kind" | "value">) => (c.kind === "percent" ? `${c.value}% הנחה` : `₪${c.value} הנחה`);
