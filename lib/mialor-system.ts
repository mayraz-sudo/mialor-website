/**
 * חיבור למערכת הניהול של MIALOR (mialor-business-manager).
 * רץ רק בשרת. המפתח הסודי לא נשלח לדפדפן אף פעם.
 *
 * הגדרות ב-Netlify (Site configuration → Environment variables):
 *   MIALOR_SYSTEM_URL     כתובת מערכת הניהול, למשל https://mialor-business-manager.vercel.app
 *   MIALOR_INGEST_SECRET  אותו מפתח סודי שמוגדר ב-Vercel של מערכת הניהול
 * בלי שני המשתנים – החיבור כבוי, והאתר ממשיך לעבוד בדיוק כמו קודם.
 */
import type { Order } from "@/lib/orders";

const systemUrl = () => process.env.MIALOR_SYSTEM_URL?.trim().replace(/\/+$/, "") || "";
const secret = () => process.env.MIALOR_INGEST_SECRET?.trim() || "";

// https בלבד (מותר http רק מול המחשב המקומי, לבדיקות)
export const systemConfigured = () =>
  (/^https:\/\//.test(systemUrl()) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(systemUrl())) && secret().length >= 24;

/** שליחה למערכת הניהול. לא זורק שגיאות ולא מעכב את האתר יותר מ-5 שניות. */
export async function sendToSystem(path: string, body: unknown): Promise<boolean> {
  if (!systemConfigured()) return false;
  try {
    const res = await fetch(`${systemUrl()}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-mialor-key": secret() },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[mialor-system] ${path} → ${res.status} ${await res.text().catch(() => "")}`);
    return res.ok;
  } catch (err) {
    console.error(`[mialor-system] ${path}`, err);
    return false;
  }
}

const TEST_ITEMS = new Set(["test-item"]);

/** הזמנה ששולמה באתר → מערכת הניהול (הזמנה + פריטים + תשלום) */
export async function sendPaidOrderToSystem(o: Order) {
  if (o.items.length && o.items.every((i) => TEST_ITEMS.has(i.id))) return false; // הזמנת ניסיון
  return sendToSystem("/api/public/order", {
    external_ref: o.id,
    created_at: o.createdAt,
    customer: {
      name: o.customer.name,
      phone: o.customer.phone,
      email: o.customer.email,
      address: o.customer.address,
      city: o.customer.city,
      notes: o.customer.notes,
    },
    items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, sum: i.sum, color: i.color, engrave: i.engrave })),
    shipping: o.shipping,
    discount: o.coupon?.discount ?? 0,
    coupon: o.coupon?.code,
    total: o.total,
    delivery: o.delivery,
    payment: { amount: Number(o.payment?.sum) || o.total, reference: o.payment?.index, last4: o.payment?.last4, paid_at: o.payment?.at },
  });
}
