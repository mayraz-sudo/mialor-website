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
  /** על מה המחיר: "pair" = לזוג, "unit" = ליחידה (לא חובה) */
  per?: "pair" | "unit";
  /** null = תמונה בקרוב (Coming soon) */
  image: string | null;
  /** תמונה נוספת (לא חובה) – מתחלפת במעבר עכבר או בלחיצה */
  image2?: string;
  /** כמות מקסימלית להזמנה אחת (לא חובה) */
  maxQty?: number;
  /** פריט נסתר – מופיע רק בכתובת /shop?test=1 (לתשלום ניסיון) */
  hidden?: boolean;
  /** פריט לדוגמה – מוצג רק בזמן הבנייה, לא באתר החי */
  sample?: boolean;
};

export const SHOP = {
  /** false = העמוד לא מופיע בתפריט ולא בגוגל (עדיין בבנייה) */
  enabled: true,
  title: "קנייה אונליין",
  intro: "פריטים בודדים לקנייה מיידית באשראי. משלוח לכל הארץ בדואר ישראל, או איסוף בחינם מחולון.",
  /** מחיר משלוח בדואר ישראל בשקלים. null = עדיין לא נקבע */
  postPrice: null as number | null,
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "rachel-candle-holder",
    name: "פמוט רחל אמנו",
    description: "פמוט בעבודת יד בהשראת סגולת רחל אמנו.",
    price: 120,
    per: "unit",
    image: "/images/products/rachel-candle-1.jpg", // placeholder – כדאי תמונה של הפמוט לבד
  },
  {
    id: "round-candlestick",
    name: "פמוט עגול",
    description: "זוג פמוטים עגולים בעבודת יד, בעיצוב מינימליסטי ועל־זמני.",
    price: 80,
    per: "pair",
    image: "/images/products/shop-round-candlesticks-1.jpg",
    image2: "/images/products/round-candlesticks-1.jpg", // באריזה
  },
  {
    id: "square-candlestick",
    name: "פמוט ריבוע",
    description: "זוג פמוטים מרובעים בעבודת יד, בעיצוב נקי ומוקפד.",
    price: 100,
    per: "pair",
    image: "/images/products/square-candlesticks-1.jpg", // placeholder – כדאי תמונה של הפמוט לבד
  },
  {
    id: "gypsum-stand-candlesticks",
    name: "מעמד ופמוטים מגבס",
    description: "מעמד ופמוטים מגבס בעבודת יד.",
    price: 200,
    image: "/images/products/shop-gypsum-stand-1.jpg",
    image2: "/images/products/shop-gypsum-stand-2.jpg", // באריזה
  },
  {
    id: "blessing-stand",
    name: "מעמד ברכה בלבד",
    description: "מעמד לברכה, בלי פמוטים.",
    price: 150,
    image: null, // תמונה בקרוב
  },
  {
    id: "plate",
    name: "צלחת בלבד",
    description: "צלחת בעבודת יד, בלי פמוטים וברכה.",
    price: 80,
    image: null, // תמונה בקרוב
  },
  {
    id: "plate-candlesticks-blessing",
    name: "צלחת, פמוטים וברכה",
    description: "סט מלא: צלחת, פמוטים וברכה.",
    price: 199,
    image: null, // תמונה בקרוב
  },
  {
    // לתשלום ניסיון בלבד: mialorshop.com/shop?test=1 – למחוק אחרי הבדיקה
    id: "test-item",
    name: "מוצר לניסיון",
    description: "לבדיקת תשלום בלבד.",
    price: 1,
    image: null,
    maxQty: 1,
    hidden: true,
  },
];

/** הפריטים שמוצגים: פריטים לדוגמה רק כשהחנות עוד לא פעילה */
export const perLabel = (i: ShopItem) => (i.per === "pair" ? "לזוג" : i.per === "unit" ? "ליחידה" : "");

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
