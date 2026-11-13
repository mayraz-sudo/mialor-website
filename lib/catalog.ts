import { SHOP_ITEMS, type ShopItem } from "@/lib/shop";
import { blobStore, withTimeout } from "@/lib/blobstore";

/**
 * קטלוג המוצרים של החנות – נשמר באחסון של האתר ונערך במערכת הניהול (/admin).
 * כל עוד לא נשמר כלום, משתמשים ברשימה ההתחלתית שבקוד (SHOP_ITEMS).
 */
const KEY = "items";
let cache: { at: number; items: ShopItem[] } | null = null;
const TTL = 3000;

/** כל המוצרים, כולל מוסתרים, לפי הסדר שנקבע בניהול */
export async function getCatalog(): Promise<ShopItem[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.items;
  let store: Awaited<ReturnType<typeof blobStore>>;
  try {
    store = await blobStore("catalog");
  } catch {
    // אין גישה לאחסון (למשל בזמן בניית האתר) – הרשימה שבקוד
    return SHOP_ITEMS;
  }
  type Res = { v: ShopItem[] | null } | { timeout: true };
  const res = await withTimeout<Res>(store.getJSON<ShopItem[]>(KEY).then((v) => ({ v })), 4000, { timeout: true });
  if ("v" in res) {
    if (Array.isArray(res.v) && res.v.length) {
      cache = { at: Date.now(), items: res.v };
      return res.v;
    }
    // פעם ראשונה: שומרים את הרשימה ההתחלתית באחסון, כדי שכל קריאה הבאה תהיה מהירה
    await withTimeout(store.setJSON(KEY, SHOP_ITEMS), 4000, undefined);
    cache = { at: Date.now(), items: SHOP_ITEMS };
    return SHOP_ITEMS;
  }
  // האחסון לא ענה בזמן – משתמשים במה שיש (בלי לדרוס כלום)
  const items = cache?.items ?? SHOP_ITEMS;
  cache = { at: Date.now() - TTL + 15000, items };
  return items;
}

/** המוצרים שמוצגים בחנות */
export const getVisibleItems = async () => (await getCatalog()).filter((i) => !i.hidden && i.images.length > 0);
export const getItem = async (id: string) => (await getVisibleItems()).find((i) => i.id === id);

/** בדיקה וניקוי של מוצר שהגיע מהניהול */
export function cleanItem(raw: unknown): ShopItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "");
  const id = str(r.id, 60);
  const name = str(r.name, 120);
  const price = Number(r.price);
  if (!/^[a-z0-9][a-z0-9-]{1,59}$/.test(id) || !name || !Number.isFinite(price) || price <= 0 || price > 100000) return null;
  const images = Array.isArray(r.images)
    ? r.images.filter((s): s is string => typeof s === "string" && /^\/(images\/shop|media)\/[\w.-]+$/.test(s)).slice(0, 8)
    : [];
  const maxQty = Number(r.maxQty);
  return {
    id,
    name,
    description: str(r.description, 1000),
    price: Math.round(price * 100) / 100,
    per: r.per === "pair" || r.per === "unit" ? r.per : undefined,
    images,
    maxQty: Number.isInteger(maxQty) && maxQty > 0 && maxQty < 1000 ? maxQty : undefined,
    hidden: r.hidden === true ? true : undefined,
  };
}

export async function saveCatalog(items: ShopItem[]) {
  const store = await blobStore("catalog");
  await store.setJSON(KEY, items);
  cache = { at: Date.now(), items };
}
