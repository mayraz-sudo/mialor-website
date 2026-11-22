/**
 * חנות – פריטים בודדים לקנייה באשראי.
 * כאן מוסיפים פריטים, מחירים ומחיר משלוח. הכול במקום אחד.
 */

export type ShopItem = {
  /** מזהה קבוע באנגלית – משמש בכתובת המוצר, בקטלוג של מטא ובפיקסל. לא משנים אחרי שנוצר. */
  id: string;
  name: string;
  description: string;
  /** מחיר מלא בשקלים (לפני מחירי השקה) */
  price: number;
  /** על מה המחיר: "pair" = לזוג, "unit" = ליחידה (לא חובה) */
  per?: "pair" | "unit";
  /** תמונות – הראשונה היא התמונה הראשית */
  images: string[];
  /** כמות מקסימלית להזמנה אחת (לא חובה) */
  maxQty?: number;
  /** מוסתר מהחנות (למשל כשאזל) */
  hidden?: boolean;
  /** צבעים לבחירה (אם יש – הלקוחה חייבת לבחור צבע) */
  colors?: string[];
  /** הטבעה אישית בתוספת תשלום (לא חובה) */
  engraving?: { price: number; maxLength: number };
  /** חומר, אם המוצר לא מגבס (למשל "כריכת בד קורדרוי") */
  material?: string;
  /** לא נכלל במבצעים (מחירי השקה וכו') */
  noDiscount?: boolean;
};

export const SHOP = {
  /** false = העמוד לא מופיע בתפריט ולא בגוגל (עדיין בבנייה) */
  enabled: true,
  title: "חנות מוצרים",
  intro: "מוצרי גבס איכותי בעבודת יד וסידורים בהטבעה אישית, לקנייה מיידית באשראי. משלוח לכל הארץ בדואר ישראל, או איסוף בחינם מחולון.",
  /** מחיר משלוח בדואר ישראל בשקלים. null = עדיין לא נקבע */
  postPrice: 35 as number | null,
  /** משלוח חינם מסכום פריטים זה (אחרי מחירי ההשקה). null = בלי משלוח חינם */
  freeShippingFrom: 249 as number | null,
  /** זמן הכנה ומשלוח */
  leadTime: "עד 7 ימי עסקים",
  shippingNote: "משלוח לכל הארץ באמצעות דואר ישראל (₪35, חינם בהזמנה מ־₪249), עד 7 ימי עסקים כולל הכנה ושילוח",
  material: "מוצרי הגבס עשויים מגבס איכותי, בעבודת יד.",
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

/**
 * רשימת המוצרים ההתחלתית. מרגע שמאי עורכת מוצרים במערכת הניהול, הרשימה נשמרת באחסון של האתר
 * (lib/catalog.ts) – והרשימה כאן משמשת רק כגיבוי אם האחסון ריק.
 */
export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "rachel-candle",
    name: "פמוט רחל אמנו",
    description: "פמוט בלבד, מגבס, עם הכיתוב \"הריני מדליקה נר זה לכבוד רחל אמנו\". (לסט המלא עם 40 נרות, ברכה וקופת צדקה – ראו \"סט סגולת רחל אמנו\".)",
    price: 119,
    per: "unit",
    images: [img("rachel-1"), img("rachel-2")],
  },
  {
    id: "hanukkiah",
    name: "חנוכייה",
    description: "חנוכייה מגבס בעיצוב נקי ומודרני.",
    price: 199,
    images: [img("hanukkiah-1")],
  },
  {
    id: "round-pair-shabbat-shalom",
    name: "זוג פמוטים עגולים שבת שלום",
    description: "זוג פמוטים עגולים מגבס, עם הכיתוב \"שבת\" ו\"שלום\".",
    price: 80,
    per: "pair",
    images: [img("round-pair-1"), img("round-pair-2")],
  },
  {
    id: "square-pair-shabbat-shalom",
    name: "זוג פמוטים מרובעים שבת שלום",
    description: "זוג פמוטים מרובעים מגבס, עם הכיתוב \"שבת\" ו\"שלום\".",
    price: 99,
    per: "pair",
    images: [img("square-pair-1"), img("square-pair-2")],
  },
  {
    id: "stand-round-candlesticks",
    name: "מעמד הדלקת נרות ופמוטים עגולים",
    description: "מעמד עם ברכת הדלקת נרות שבת וזוג פמוטים עגולים \"שבת שלום\". המעמד בגודל 16 ס\"מ.",
    price: 199,
    images: [img("stand-round-1")],
  },
  {
    id: "stand-candlesticks-rachel",
    name: "מעמד הדלקת נרות, פמוטים שבת שלום ונר רחל אמנו",
    description: "מעמד עם ברכת הדלקת נרות שבת, זוג פמוטים \"שבת שלום\" ופמוט רחל אמנו. המעמד בגודל 16 ס\"מ.",
    price: 249,
    images: [img("stand-rachel-1")],
  },
  {
    id: "blessing-stand",
    name: "מעמד הדלקת נרות",
    description: "מעמד עם ברכת הדלקת נרות שבת. המעמד בגודל 16 ס\"מ.",
    price: 119,
    images: [img("blessing-stand-1"), img("blessing-stand-2")],
  },
  {
    id: "my-fire-stand",
    name: "מעמד הדלקת נרות האש שלי",
    description: "מעמד בצורת להבה עם שני פמוטים מחוברים.",
    price: 149,
    images: [img("fire-stand-1"), img("fire-stand-2")],
  },
  {
    id: "braid-candlesticks-tray",
    name: "פמוטים צמה ומגש",
    description: "פמוטים בעיצוב צמה, עם מגש אובלי.",
    price: 149,
    images: [img("braid-tray-1")],
  },
  {
    id: "braid-candlesticks",
    name: "פמוטים צמה",
    description: "פמוטים בעיצוב צמה.",
    price: 99,
    images: [img("braid-tray-1")],
  },
  {
    id: "tray",
    name: "מגש בלבד",
    description: "מגש אובלי מגבס.",
    price: 70,
    images: [img("tray-1")],
  },
  {
    id: "corduroy-siddur",
    name: "סידור בכריכת בד קורדרוי",
    description: "סידור בכריכת בד קורדרוי, לבחירה בשישה צבעים.",
    price: 120,
    per: "unit",
    images: [img("siddur-colors"), img("siddur-orange")],
    colors: ["ורוד", "בז׳", "תכלת", "כתום", "חום", "כחול כהה"],
    material: "כריכת בד קורדרוי",
    noDiscount: true,
  },
  {
    id: "tehillim",
    name: "תהילים",
    description: "ספר תהילים בכריכת בד מהודרת, לבחירה בשלושה צבעים.",
    price: 100,
    per: "unit",
    images: [img("tehillim-white"), img("tehillim-navy"), img("tehillim-beige")],
    colors: ["לבן", "כחול כהה", "בז׳"],
    material: "כריכת בד",
    noDiscount: true,
  },
  {
    id: "rachel-segula-set",
    name: "סט סגולת רחל אמנו",
    description:
      "הסט המלא לסגולת רחל אמנו – 40 ימים רצופים: פמוט מגבס, 40 נרות שבת, כרטיס עם סדר הסגולה ותפילת רחל אמנו וקופת צדקה שקופה. ארוז בשקית מתנה עם חלון וסרט סאטן.",
    price: 149,
    per: "unit",
    images: [img("rachel-segula-1")],
    material: "מארז מתנה",
  },
  {
    id: "sefer-dvarim-stone",
    name: "ספר דברים בסגנון אבן ירושלמית",
    description: "ספר דברים בכריכה בעיצוב אבני הכותל, עם הטבעה מבריקה. לבחירה בשלושה צבעים.",
    price: 105,
    per: "unit",
    images: [img("dvarim-stone-white"), img("dvarim-stone-pink"), img("dvarim-stone-beige")],
    colors: ["ורוד", "לבן", "בז׳"],
    material: "כריכה בעיצוב אבן ירושלמית",
    noDiscount: true,
  },
];

export const perLabel = (i: Pick<ShopItem, "per">) => (i.per === "pair" ? "לזוג" : i.per === "unit" ? "ליחידה" : "");

export type CartLine = { id: string; qty: number; color?: string; engrave?: string };
/** מפתח לשורה בסל: אותו מוצר בצבע או בהטבעה אחרים = שורה נפרדת */
export const lineKey = (l: Pick<CartLine, "id" | "color" | "engrave">) => [l.id, l.color ?? "", l.engrave ?? ""].join("|");
/** האם למוצר יש אפשרויות לבחירה (צבע / הטבעה) */
export const hasOptions = (i: ShopItem) => Boolean(i.colors?.length || i.engraving);
/** ניקוי טקסט הטבעה */
export const cleanEngrave = (s: unknown, max: number) =>
  typeof s === "string" ? s.replace(/[\u0000-\u001f<>"]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
/** תיאור האפשרויות שנבחרו, לתצוגה */
export const optionsLabel = (l: { color?: string; engrave?: string }) =>
  [l.color && `צבע: ${l.color}`, l.engrave && `הטבעה: "${l.engrave}"`].filter(Boolean).join(" · ");
export type Delivery = "pickup" | "post";

/**
 * מחירי השקה – הנחה באחוזים על כל מוצרי החנות, לפי תאריכים (שעון ישראל).
 * המחיר אחרי ההנחה מעוגל כלפי מטה לשקל שלם, כך שההנחה תמיד לפחות האחוז שכתוב.
 * כדי לבטל: active: false.
 */
export const LAUNCH = {
  active: true,
  percent: 15,
  start: "2026-11-13",
  end: "2026-11-30",
  name: "מחירי השקה",
  bar: "מחירי השקה: 15% הנחה על מוצרי הגבס בחנות, עד סוף נובמבר (לא כולל סידורים וספרים)",
  barShort: "מחירי השקה: 15% על מוצרי הגבס (לא כולל סידורים)",
  badge: "15% הנחה",
};

export function isLaunchActive(date: Date = new Date()) {
  if (!LAUNCH.active) return false;
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(date);
  return day >= LAUNCH.start && day <= LAUNCH.end;
}

/** המחיר לתשלום לפריט (עם הנחת ההשקה אם פעילה) */
export const itemPrice = (item: Pick<ShopItem, "price" | "noDiscount">, launch: boolean) =>
  launch && !item.noDiscount ? Math.floor((item.price * (100 - LAUNCH.percent)) / 100) : item.price;

/** חישוב סכום ההזמנה – משמש גם בדפדפן וגם בשרת (בשרת זה המחיר הקובע) */
export function cartTotals(lines: CartLine[], delivery: Delivery, launch: boolean, items: ShopItem[]) {
  type Row = { key: string; item: ShopItem; qty: number; unit: number; sum: number; color?: string; engrave?: string };
  const rows = lines
    .map((l): Row | null => {
      const item = items.find((i) => i.id === l.id && !i.hidden);
      if (!item) return null;
      // צבע: חייב להיות אחד מהצבעים של המוצר
      const color = item.colors?.length ? (item.colors.includes(l.color ?? "") ? l.color : undefined) : undefined;
      if (item.colors?.length && !color) return null;
      const engrave = item.engraving ? cleanEngrave(l.engrave, item.engraving.maxLength) || undefined : undefined;
      const qty = Math.max(1, Math.min(Math.floor(l.qty), item.maxQty ?? 99));
      const unit = itemPrice(item, launch) + (engrave && item.engraving ? item.engraving.price : 0);
      return { key: lineKey({ id: item.id, color, engrave }), item, qty, unit, sum: unit * qty, color, engrave };
    })
    .filter((r): r is Row => Boolean(r));
  const subtotal = rows.reduce((a, r) => a + r.sum, 0);
  const freeShipping = SHOP.freeShippingFrom !== null && subtotal >= SHOP.freeShippingFrom;
  const shipping = delivery === "post" ? (freeShipping ? 0 : SHOP.postPrice) : 0;
  return { rows, subtotal, shipping, total: shipping === null ? null : subtotal + shipping };
}

export const shopItemHref = (id: string) => `/shop/${id}`;
/** תמונות שהועלו במערכת הניהול מוגשות מהאתר עצמו (בלי עיבוד נוסף של Next) */
export const isUploadedImage = (src: string) => src.startsWith("/media/");
