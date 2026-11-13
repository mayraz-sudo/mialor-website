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
  title: "חנות מוצרים",
  intro: "מוצרי גבס איכותי בעבודת יד, לקנייה מיידית באשראי. משלוח לכל הארץ בדואר ישראל, או איסוף בחינם מחולון.",
  /** מחיר משלוח בדואר ישראל בשקלים. null = עדיין לא נקבע */
  postPrice: 35 as number | null,
  /** זמן הכנה ומשלוח */
  leadTime: "עד 7 ימי עסקים",
  shippingNote: "משלוח לכל הארץ באמצעות דואר ישראל (₪35), עד 7 ימי עסקים כולל הכנה ושילוח",
  material: "כל המוצרים עשויים מגבס איכותי, בעבודת יד.",
  handmadeNote:
    "כל המוצרים מיוצרים בעבודת יד מתוך תשומת לב מלאה לפרטים. המידות המצוינות הן גודל ממוצע של פריט מסוג זה, וייתכנו סטיות קטנות בגודל המוצר בפועל ואי־שלמויות האופייניות לעבודת יד, בשל חומרי הגלם ואופי הייצור. ייתכנו גם הבדלים קלים בגוון, במרקם ובגימור – אלו חלק מהייחודיות של כל פריט.",
};

/** הוראות שימוש ושמירה על מוצרי גבס */
export const CARE = {
  title: "הוראות שימוש ושמירה על מוצרי גבס",
  intro: "המוצר מיוצר בעבודת יד, באהבה ובתשומת לב לכל פרט. כדי לשמור על יופיו ואיכותו לאורך זמן, מומלץ להקפיד על ההנחיות הבאות:",
  items: [
    { title: "ניקוי", text: "יש לנקות בעדינות באמצעות מטלית רכה ויבשה בלבד." },
    { title: "מים ולחות", text: "יש להימנע ממגע ישיר עם מים ומחשיפה ממושכת ללחות." },
    { title: "שמירה על המוצר", text: "הגבס הוא חומר עדין. יש להימנע מנפילות, מכות ושריטות." },
    { title: "שימוש בפמוטים", text: "יש להשתמש בנרות בתוך בתי קיבול מתאימים ועמידים לחום בלבד. אין להניח להבה ישירות על הגבס." },
    { title: "בטיחות", text: "אין להשאיר נרות דולקים ללא השגחה. יש להרחיק מילדים, מבעלי חיים ומחומרים דליקים." },
    { title: "שימוש במגשים", text: "מיועדים לפריטי נוי ולאחסון אביזרים יבשים בלבד. אינם מיועדים למגע ישיר עם מזון." },
  ],
  footer: "חשוב לדעת: כל מוצר מיוצר בעבודת יד, ולכן ייתכנו הבדלים קלים בגוון, במרקם ובגימור. אלו חלק מהייחודיות של כל פריט.",
  signature: "MIALOR | מתנות עם משמעות 🤍",
};

const img = (n: string) => `/images/shop/${n}.jpg`;

/** המוצרים בחנות – לפי הקובץ "MIALOR – פרטים לאתר" (גיליון מוצרים) */
export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "rachel-candle",
    name: "פמוט רחל אמנו",
    description: "פמוט מגבס עם הכיתוב \"הריני מדליקה נר זה לכבוד רחל אמנו\".",
    price: 120,
    per: "unit",
    image: img("rachel-1"),
    image2: img("rachel-2"),
  },
  {
    id: "hanukkiah",
    name: "חנוכייה",
    description: "חנוכייה מגבס בעיצוב נקי ומודרני.",
    price: 199,
    image: img("hanukkiah-1"),
  },
  {
    id: "round-pair-shabbat-shalom",
    name: "זוג פמוטים עגולים שבת שלום",
    description: "זוג פמוטים עגולים מגבס, עם הכיתוב \"שבת\" ו\"שלום\".",
    price: 80,
    per: "pair",
    image: img("round-pair-1"),
    image2: img("round-pair-2"),
  },
  {
    id: "square-pair-shabbat-shalom",
    name: "זוג פמוטים מרובעים שבת שלום",
    description: "זוג פמוטים מרובעים מגבס, עם הכיתוב \"שבת\" ו\"שלום\".",
    price: 99,
    per: "pair",
    image: img("square-pair-1"),
    image2: img("square-pair-2"),
  },
  {
    id: "stand-round-candlesticks",
    name: "מעמד הדלקת נרות ופמוטים עגולים",
    description: "מעמד עם ברכת הדלקת נרות שבת וזוג פמוטים עגולים \"שבת שלום\". המעמד בגודל 16 ס\"מ.",
    price: 129,
    image: img("stand-round-1"),
  },
  {
    id: "stand-candlesticks-rachel",
    name: "מעמד הדלקת נרות, פמוטים שבת שלום ונר רחל אמנו",
    description: "מעמד עם ברכת הדלקת נרות שבת, זוג פמוטים \"שבת שלום\" ופמוט רחל אמנו. המעמד בגודל 16 ס\"מ.",
    price: 249,
    image: img("stand-rachel-1"),
  },
  {
    id: "blessing-stand",
    name: "מעמד הדלקת נרות",
    description: "מעמד עם ברכת הדלקת נרות שבת. המעמד בגודל 16 ס\"מ.",
    price: 119,
    image: img("blessing-stand-1"),
    image2: img("blessing-stand-2"),
  },
  {
    id: "my-fire-stand",
    name: "מעמד הדלקת נרות האש שלי",
    description: "מעמד בצורת להבה עם שני פמוטים מחוברים.",
    price: 149,
    image: img("fire-stand-1"),
    image2: img("fire-stand-2"),
  },
  {
    id: "braid-candlesticks-tray",
    name: "פמוטים צמה ומגש",
    description: "פמוטים בעיצוב צמה, עם מגש אובלי.",
    price: 149,
    image: img("braid-tray-1"),
  },
  {
    id: "braid-candlesticks",
    name: "פמוטים צמה",
    description: "פמוטים בעיצוב צמה.",
    price: 99,
    image: img("braid-tray-1"), // התמונה בדרייב זהה לזו של "פמוטים צמה ומגש" – כדאי תמונה בלי המגש
  },
  {
    id: "tray",
    name: "מגש בלבד",
    description: "מגש אובלי מגבס.",
    price: 70,
    image: img("tray-1"),
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

export const shopItemById = (id: string) => shopItems().find((i) => i.id === id && !i.hidden);
export const shopItemHref = (id: string) => `/shop/${id}`;
/** כל התמונות של פריט, לגלריה */
export const shopItemImages = (i: ShopItem) => [i.image, i.image2].filter((s): s is string => Boolean(s));
