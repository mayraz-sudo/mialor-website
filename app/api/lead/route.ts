import { EVENT_TYPES, productById } from "@/lib/site";
import { isValidPhone } from "@/lib/phone";
import { sendToSystem } from "@/lib/mialor-system";

/**
 * טופס ההזמנה בעמוד מוצר (מארזים, עיצוב, הדפסות) → ליד במערכת הניהול.
 * הלקוחה ממשיכה לוואטסאפ כרגיל; זה קורה במקביל, ולא משנה לה כלום אם נכשל.
 */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  // שדה מלכודת לבוטים – אנשים לא רואים אותו ולא ממלאים
  if (String(b.website ?? "").trim()) return Response.json({ ok: true });

  const product = productById(String(b.product_id ?? ""));
  const name = String(b.name ?? "").trim().slice(0, 120);
  const phone = String(b.phone ?? "").trim().slice(0, 30);
  if (!product || !name || !isValidPhone(phone)) return Response.json({ error: "missing details" }, { status: 400 });

  const quantity = Number(b.quantity);
  const date = String(b.date ?? "");
  const eventType = String(b.eventType ?? "");
  const notes = String(b.notes ?? "").trim().slice(0, 1500);
  const delivery = String(b.delivery ?? "").trim().slice(0, 80);
  const city = String(b.city ?? "").trim().slice(0, 80);
  const utm = (b.utm ?? {}) as Record<string, unknown>;

  await sendToSystem("/api/public/lead", {
    name,
    phone,
    site_product_id: product.id,
    product_name: product.name,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : null,
    event_date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
    event_type: EVENT_TYPES.includes(eventType) ? eventType : null,
    delivery: [delivery, city].filter(Boolean).join(" – ") || null,
    message: notes || null,
    source: "אתר",
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
  });
  return Response.json({ ok: true });
}
