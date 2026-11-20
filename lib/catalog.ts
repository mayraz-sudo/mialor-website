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
      const items = await applyMigrations(store, res.v);
      cache = { at: Date.now(), items };
      return items;
    }
    // פעם ראשונה: שומרים את הרשימה ההתחלתית באחסון, כדי שכל קריאה הבאה תהיה מהירה
    await withTimeout(store.setJSON(KEY, SHOP_ITEMS), 4000, undefined);
    await withTimeout(store.setJSON("migrations", MIGRATIONS.map((m) => m.id)), 4000, undefined);
    cache = { at: Date.now(), items: SHOP_ITEMS };
    return SHOP_ITEMS;
  }
  // האחסון לא ענה בזמן – משתמשים במה שיש (בלי לדרוס כלום)
  const items = cache?.items ?? SHOP_ITEMS;
  cache = { at: Date.now() - TTL + 15000, items };
  return items;
}

/**
 * מוצרים שאני (Claude) מוסיף מהקוד לרשימה שכבר שמורה באתר.
 * כל שינוי רץ פעם אחת בלבד – אם מאי מוחקת את המוצר אחר כך, הוא לא יחזור.
 */
const MIGRATIONS: { id: string; apply: (items: ShopItem[]) => ShopItem[] }[] = [
  {
    id: "2026-11-18-corduroy-siddur",
    apply: (items) => {
      const seed = SHOP_ITEMS.find((i) => i.id === "corduroy-siddur");
      return seed && !items.some((i) => i.id === seed.id) ? [...items, seed] : items;
    },
  },
  {
    // אין הטבעה על הסידורים הצבעוניים
    id: "2026-11-18-siddur-no-engraving",
    apply: (items) =>
      items.map((i) =>
        i.id === "corduroy-siddur"
          ? {
              ...i,
              engraving: undefined,
              description: i.description.replace(/\s*אפשר להוסיף הטבעה אישית[^.]*\./, "").trim(),
              images: i.images.filter((s) => !s.includes("siddur-pink-engraved")),
            }
          : i,
      ),
  },
  {
    // סידורים וספרים לא נכללים במבצעים
    id: "2026-11-18-books-no-discount",
    apply: (items) =>
      items.map((i) => (i.id === "corduroy-siddur" || /סידור|ספר דברים/.test(i.name) ? { ...i, noDiscount: true } : i)),
  },
  {
    id: "2026-11-18-prices-siddur-120-dvarim-100",
    apply: (items) =>
      items.map((i) => (i.id === "corduroy-siddur" ? { ...i, price: 120 } : i.id === "p-mwls55jrm7t" ? { ...i, price: 100 } : i)),
  },
  {
    id: "2026-11-18-tehillim",
    apply: (items) => {
      const seed = SHOP_ITEMS.find((i) => i.id === "tehillim");
      return seed && !items.some((i) => i.id === seed.id) ? [...items, seed] : items;
    },
  },
  {
    id: "2026-11-20-rachel-segula-set",
    apply: (items) => {
      const seed = SHOP_ITEMS.find((i) => i.id === "rachel-segula-set");
      return seed && !items.some((i) => i.id === seed.id) ? [...items, seed] : items;
    },
  },
  {
    // הסט הוא מארז מתנה, לא מוצר גבס – בלי הנחת ההשקה, מחיר 50 ₪
    id: "2026-11-20-rachel-segula-set-no-discount",
    apply: (items) => items.map((i) => (i.id === "rachel-segula-set" ? { ...i, material: "מארז מתנה", noDiscount: true } : i)),
  },
  {
    // קנייה בודדת 130 ₪ (בכמות לאירוע – 50 ₪, בעמוד האירועים). נכלל בהנחת ההשקה כמו כל מוצרי החנות
    id: "2026-11-20-rachel-segula-set-single-130",
    apply: (items) => items.map((i) => (i.id === "rachel-segula-set" ? { ...i, price: 130, noDiscount: undefined } : i)),
  },
];

let migrationsChecked = false;

async function applyMigrations(store: Awaited<ReturnType<typeof blobStore>>, items: ShopItem[]) {
  if (migrationsChecked) return items;
  // באחסון של Netlify קריאה של מפתח שלא קיים לפעמים לא חוזרת – לכן "לא ענה" = עוד לא נוצר
  const read = await withTimeout<string[] | null>(store.getJSON<string[]>("migrations"), 1500, null);
  const done = read ?? [];
  const pending = MIGRATIONS.filter((m) => !done.includes(m.id));
  migrationsChecked = true;
  if (!pending.length) return items;
  const next = pending.reduce((acc, m) => m.apply(acc), items);
  await withTimeout(store.setJSON(KEY, next), 4000, undefined);
  await withTimeout(store.setJSON("migrations", [...done, ...pending.map((m) => m.id)]), 4000, undefined);
  return next;
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
    colors: Array.isArray(r.colors)
      ? [...new Set(r.colors.map((c) => str(c, 30)).filter(Boolean))].slice(0, 20)
      : undefined,
    engraving:
      r.engraving && typeof r.engraving === "object" && Number((r.engraving as Record<string, unknown>).price) >= 0
        ? {
            price: Math.round(Number((r.engraving as Record<string, unknown>).price) * 100) / 100,
            maxLength: Math.min(60, Math.max(5, Number((r.engraving as Record<string, unknown>).maxLength) || 25)),
          }
        : undefined,
    material: str(r.material, 60) || undefined,
    noDiscount: r.noDiscount === true ? true : undefined,
  };
}

export async function saveCatalog(items: ShopItem[]) {
  const store = await blobStore("catalog");
  await store.setJSON(KEY, items);
  cache = { at: Date.now(), items };
}
