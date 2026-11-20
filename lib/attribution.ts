/**
 * מדידה למערכת הניהול (בדפדפן): מאיזה קמפיין הגיעה הלקוחה (utm), ושליחת
 * אירועים – צפייה במוצר, הוספה לסל, מעבר לתשלום, לחיצה על וואטסאפ.
 * לא משפיע על הפיקסל של מטא, ולא נכשל אם משהו חסום.
 */
const KEY = "mialor_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** שומר את ה-utm מהכתובת לכל משך הביקור */
export function captureUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    const u: Utm = {};
    for (const k of UTM_KEYS) {
      const v = p.get(k);
      if (v) u[k] = v.slice(0, 100);
    }
    if (Object.keys(u).length) sessionStorage.setItem(KEY, JSON.stringify(u));
  } catch {}
}

export function getUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Utm;
  } catch {
    return {};
  }
}

export type SiteEvent = "product_view" | "add_to_cart" | "checkout" | "whatsapp_click";

export function sendSiteEvent(type: SiteEvent, productId?: string, value?: number) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ events: [{ event_type: type, site_product_id: productId, value }], ...getUtm() });
    const sent = navigator.sendBeacon?.("/api/event", new Blob([body], { type: "application/json" }));
    if (!sent) {
      fetch("/api/event", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
    }
  } catch {}
}

/** מזהה המוצר מהכתובת: /product/<id> או /shop/<id> */
export function productIdFromPath(pathname: string) {
  return pathname.match(/^\/(?:product|shop)\/([a-z0-9-]+)/)?.[1];
}
