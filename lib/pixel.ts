/**
 * Meta Pixel (פייסבוק / אינסטגרם).
 * מזהה הפיקסל מוגדר כאן. אירועים נשלחים רק בדפדפן, ובשקלים (ILS).
 */
export const META_PIXEL_ID = "1691108089278533";

import { sendSiteEvent, type SiteEvent } from "@/lib/attribution";

type Fbq = (...args: unknown[]) => void;

/** אירועי הפיקסל שנספרים גם במערכת הניהול (מסך הקמפיינים) */
const SYSTEM_EVENTS: Record<string, SiteEvent> = {
  ViewContent: "product_view",
  AddToCart: "add_to_cart",
  InitiateCheckout: "checkout",
};
const EXCLUDED = new Set(["test-item"]); // מוצר לניסיון – לא שולחים עליו אירועים

/** שליחת אירוע לפיקסל. לא נכשל אם הפיקסל חסום או עוד לא נטען. */
export function track(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined") return;
  const ids = (params?.content_ids as string[] | undefined) ?? [];
  if (ids.length && ids.every((id) => EXCLUDED.has(id))) return;
  // גם אם הפיקסל חסום (חוסם פרסומות) – המדידה במערכת הניהול עדיין עובדת
  const sys = SYSTEM_EVENTS[event];
  if (sys) sendSiteEvent(sys, ids.length === 1 ? ids[0] : undefined, typeof params?.value === "number" ? params.value : undefined);
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  try {
    fbq("track", event, { currency: "ILS", ...params }, eventId ? { eventID: eventId } : undefined);
  } catch {}
}

export const productParams = (item: { id: string; name: string; price: number }) => ({
  content_ids: [item.id],
  content_name: item.name,
  content_type: "product",
  value: item.price,
});
