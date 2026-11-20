import { sendToSystem } from "@/lib/mialor-system";

const TYPES = new Set(["product_view", "add_to_cart", "checkout", "whatsapp_click"]);

/** אירועי מדידה מהדפדפן → מסך הקמפיינים במערכת הניהול */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 204 });
  }
  const events = (Array.isArray(b.events) ? b.events : [])
    .slice(0, 10)
    .filter((e: Record<string, unknown>) => TYPES.has(String(e?.event_type)))
    .map((e: Record<string, unknown>) => ({
      event_type: String(e.event_type),
      site_product_id: /^[a-z0-9-]{1,80}$/.test(String(e.site_product_id ?? "")) ? String(e.site_product_id) : undefined,
      value: Number.isFinite(Number(e.value)) && Number(e.value) >= 0 ? Number(e.value) : undefined,
      utm_source: b.utm_source,
      utm_medium: b.utm_medium,
      utm_campaign: b.utm_campaign,
    }));
  if (events.length) await sendToSystem("/api/public/event", events);
  return new Response(null, { status: 204 });
}
