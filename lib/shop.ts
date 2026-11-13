/**
 * חנות – פריטים בודדים לקנייה באשראי.
 * כאן מוסיפים פריטים, מחירים ומחיר משלוח. הכול במקום אחד.
 */

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  /** מחיר ליחידה בשקלים (כולל הכול) */
  price: number;
  image: string;
  /** כמות מקסימלית להזמנה אחת (לא חובה) */
  maxQty?: number;
  /** פריט לדוגמה – מוצג רק בזמן הבנייה, לא באתר החי */
  sample?: boolean;
};

export const SHOP = {
  /** false = העמוד לא מופיע בתפריט ולא בגוגל (עדיין בבנייה) */
  enabled: false,
  title: "קנייה אונליין",
  intro: "פריטים בודדים לקנייה מיידית באשראי. משלוח לכל הארץ בדואר ישראל, או איסוף בחינם מחולון.",
  /** מחיר משלוח בדואר ישראל בשקלים. null = עדיין לא נקבע */
  postPrice: null as number | null,
};

export const SHOP_ITEMS: ShopItem[] = [
  // ⚠️ פריטים לדוגמה בלבד – יוחלפו ברשימה של MIALOR
  {
    id: "sample-round-candlesticks",
    name: "זוג פמוטים עגולים (לדוגמה)",
    description: "פריט לדוגמה – יוחלף בפריטים ובמחירים האמיתיים.",
    price: 50,
    image: "/images/products/round-candlesticks-1.jpg",
    sample: true,
  },
  {
    id: "sample-booklet",
    name: "ברכון מזמור לתודה (לדוגמה)",
    description: "פריט לדוגמה – יוחלף בפריטים ובמחירים האמיתיים.",
    price: 25,
    image: "/images/products/booklet-mizmor-candles-1.jpg",
    sample: true,
  },
  {
    id: "sample-havdalah",
    name: "מארז הבדלה (לדוגמה)",
    description: "פריט לדוגמה – יוחלף בפריטים ובמחירים האמיתיים.",
    price: 30,
    image: "/images/products/havdalah-1.jpg",
    sample: true,
  },
];

/** הפריטים שמוצגים: פריטים לדוגמה רק כשהחנות עוד לא פעילה */
export const shopItems = () => SHOP_ITEMS.filter((i) => !i.sample || !SHOP.enabled);

export type CartLine = { id: string; qty: number };
export type Delivery = "pickup" | "post";

/** חישוב סכום ההזמנה – משמש גם בדפדפן וגם בשרת (בשרת זה המחיר הקובע) */
export function cartTotals(lines: CartLine[], delivery: Delivery) {
  const items = shopItems();
  const rows = lines
    .map((l) => {
      const item = items.find((i) => i.id === l.id);
      if (!item) return null;
      const qty = Math.max(1, Math.min(Math.floor(l.qty), item.maxQty ?? 99));
      return { item, qty, sum: item.price * qty };
    })
    .filter((r): r is { item: ShopItem; qty: number; sum: number } => Boolean(r));
  const subtotal = rows.reduce((a, r) => a + r.sum, 0);
  const shipping = delivery === "post" ? SHOP.postPrice : 0;
  return { rows, subtotal, shipping, total: shipping === null ? null : subtotal + shipping };
}
