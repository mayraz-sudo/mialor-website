/**
 * Meta Pixel (פייסבוק / אינסטגרם).
 * מזהה הפיקסל מוגדר כאן. אירועים נשלחים רק בדפדפן, ובשקלים (ILS).
 */
export const META_PIXEL_ID = "1691108089278533";

type Fbq = (...args: unknown[]) => void;
const EXCLUDED = new Set(["test-item"]); // מוצר לניסיון – לא שולחים עליו אירועים

/** שליחת אירוע לפיקסל. לא נכשל אם הפיקסל חסום או עוד לא נטען. */
export function track(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined") return;
  const ids = (params?.content_ids as string[] | undefined) ?? [];
  if (ids.length && ids.every((id) => EXCLUDED.has(id))) return;
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
