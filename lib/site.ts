/**
 * כל התוכן של האתר במקום אחד.
 * placeholder: true = תמונה או טקסט זמני שיוחלף בחומרים המקוריים של MIALOR.
 * הסימון לא מוצג באתר; הוא רק עוזר למצוא מה עוד צריך להחליף (חפשו "placeholder").
 * להחלפת תמונה: שמים קובץ חדש בתיקייה public/images ומעדכנים כאן את הנתיב.
 */

export const SITE = {
  name: "MIALOR",
  nameHe: "מיאלור",
  /** וואטסאפ בפורמט בינלאומי (בלי 0 ובלי מקפים) – לקישורים */
  whatsappNumber: "972528709088",
  whatsappDisplay: "052-870-9088",
  instagram: "mialor__",
  instagramUrl: "https://www.instagram.com/mialor__/",
  /** שם העמוד בפייסבוק. כשיהיה קישור מלא לעמוד – למלא את facebookUrl */
  facebook: "מיאלור / MIALOR",
  facebookUrl: null as string | null,
  email: "mialor555@gmail.com",
};

export const whatsappLink = (text = "שלום מיאלור, אשמח לקבל פרטים") =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const LOGO = {
  // קובץ הלוגו מתוך תיקיית "מארזים - שיווק", עם רקע שקוף
  full: { src: "/images/logo-gold.png", width: 658, height: 593 },
  mark: { src: "/images/mark-logo-gold.png", width: 360, height: 256 },
};

/** תמונות אווירה – מהתמונות בתיקייה שלא שויכו למוצר */
export const ATMOSPHERE = {
  eventRoundTable: { src: "/images/atmosphere/event-round-table.jpg", alt: "שולחן אירוע עגול עם מארזים בשקיות לבנות לכל אורחת" },
  rachelRow: { src: "/images/atmosphere/rachel-row.jpg", alt: "שורת מארזי נר סגולת רחל אמנו עם סרטי סאטן לבנים" },
  calla: { src: "/images/atmosphere/save-the-date-calla.jpg", alt: "הזמנת Save the Date בצורת קשת לצד פרח קאלה לבן" },
};

export const HERO = {
  eyebrow: "עיצוב אישי לאירועים",
  title: "עיצוב אישי לכל רגע מיוחד",
  subtitle: "מארזים לאירועים, הזמנות, הדפסות ועיצוב גרפי",
  cta: "לצפייה במוצרים",
  secondaryCta: "לשיחה בוואטסאפ",
  image: ATMOSPHERE.eventRoundTable.src,
  imageAlt: ATMOSPHERE.eventRoundTable.alt,
  /** איזה חלק של התמונה במרכז (CSS object-position) */
  imagePosition: "center 72%",
};

export type CategorySlug = "packages" | "invitations" | "branding";

export type Category = {
  slug: CategorySlug;
  title: string;
  navLabel: string;
  description: string;
  /** תיאור קצר לנייד (כמה מילים) */
  shortDescription: string;
  image: string;
  imageAlt: string;
};

/** ארבע הקטגוריות הראשיות, בסדר שבאפיון. חשיבות שווה לכולן. */
export const CATEGORIES: Category[] = [
  {
    slug: "packages",
    title: "מארזים וברכונים לאירועים",
    navLabel: "מארזים וברכונים",
    description: "מארזי שבת, פמוטים, נרות, סגולות וברכונים עם סרט תחרה – עם מיתוג אישי והקדשה.",
    shortDescription: "מתנות לאורחים בעיצוב אישי",
    image: "/images/products/round-candlesticks-blessing-1.jpg",
    imageAlt: "מארז פמוטים עגולים וברכת שבת שלום עטוף בצלופן וסרט סאטן",
  },
  {
    slug: "invitations",
    title: "הזמנות לאירועים",
    navLabel: "הזמנות",
    description: "הזמנות דיגיטליות בעיצוב אישי, גם עם סרטון מונפש.",
    shortDescription: "הזמנות בעיצוב אישי",
    image: "/images/products/digital-invitation-2.jpg",
    imageAlt: "הזמנת Save the Date עם מעטפת נייר וסרט תחרה",
  },
  {
    slug: "branding",
    title: "עיצוב גרפי ומיתוג",
    navLabel: "מיתוג ועיצוב",
    description: "לוגו זוגי, הזמנות ותפריטים בשפה גרפית אחת.",
    shortDescription: "לוגו זוגי ושפה גרפית",
    image: "/images/products/wedding-logo-2.jpg",
    imageAlt: "לוגו זוגי בזהב עם עיטורים על בד שמנת",
  },
];

export type Product = {
  id: string;
  name: string;
  /** תיאור מלא מהקובץ של MIALOR */
  description: string;
  /** קטגוריה ראשית; מוצר יכול להופיע בכמה קטגוריות */
  categories: CategorySlug[];
  /** מחיר התחלתי בשקלים. null = "מחיר לפי הזמנה". */
  priceFrom: number | null;
  /** ליחידה / לעיצוב */
  unit: string;
  minQty: number;
  customization: string | null;
  leadTime: string;
  /** תמונות המוצר. מערך ריק = "Coming soon" */
  images: string[];
  /** סרטון קצר (אופציונלי) – מוצג במקום התמונה, בלי קול */
  video?: { src: string; poster: string };
};

/** זמן הכנה להזמנות כמות */
const EVENT_LEAD_TIME = "עד 20 יחידות – כשבועיים; מעל 20 יחידות – כחודש. מומלץ לבדוק זמינות מראש.";
const PACKAGE_CUSTOM = "ניתן להוסיף מדבקה במיתוג אישי על המארז והקדשה אישית בתחתית הברכה המצורפת.";
const BOOKLET_CUSTOM = "ניתן להוסיף הקדשה אישית בתחתית הברכון, בהתאמה לאירוע שלכם.";
const img = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/images/products/${slug}-${i + 1}.jpg`);

/** כל המוצרים – לפי הקובץ "MIALOR – פרטים לאתר" */
export const PRODUCTS: Product[] = [
  { id: "rachel-segula-set-event", name: "סט סגולת רחל אמנו", categories: ["packages"], priceFrom: 50, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("rachel-segula-set", 1),
    description: "הסט המלא לסגולת רחל אמנו – 40 ימים רצופים: פמוט מגבס, 40 נרות שבת, כרטיס עם סדר הסגולה ותפילת רחל אמנו וקופת צדקה שקופה, ארוז בשקית מתנה עם חלון וסרט סאטן. מתנה מרגשת לאורחות בהפרשת חלה ובאירועים." },
  { id: "hamsa-candle-mizmor", name: "מארז נר חמסה ומזמור לתודה", categories: ["packages"], priceFrom: 19, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: "מדבקה אישית עם שם האירוע או השמות שלכם. נר החמסה בשלושה צבעים לבחירה: לבן, אדום וצהוב – כתבו בהערות איזה צבע תרצו.", images: ["/images/products/hamsa-candle-mizmor-2.jpg", "/images/products/hamsa-candle-mizmor-1.jpg"],
    description: "נר בצורת חמסה עם כרטיס מזמור לתודה מעוצב, ארוז בשקית שקופה עם סרט סאטן ומדבקה אישית. מזכרת צבעונית ומשמחת לחינה, לחתונה ולכל אירוע. בשלושה צבעים: לבן, אדום וצהוב." },
  { id: "rachel-candle", name: "מארז נר סגולת רחל אמנו", categories: ["packages"], priceFrom: 40, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("rachel-candle", 1),
    description: "מארז לאירועים בהזמנה בכמות: פמוט רחל אמנו מגבס, ברכה תואמת ואריזה יוקרתית, עם אפשרות למיתוג אישי. מתנה מרגשת לאורחות בהפרשת חלה ובאירועים. (לסט המלא עם 40 נרות וקופת צדקה – ראו \"סט סגולת רחל אמנו\".)" },
  // בקובץ סומן "הזמנות לאירועים" – הועבר למארזים כי זה מארז (לאישור)
  { id: "round-candlesticks-blessing", name: "מארז פמוטים עגולים מגבס וברכה שבת שלום", categories: ["packages"], priceFrom: 33, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("round-candlesticks-blessing", 1),
    description: "מארז שבת אלגנטי הכולל זוג פמוטים עגולים מגבס בעבודת יד וברכה מעוצבת להדלקת נרות שבת. מתנה אישית ומלאת משמעות, עם אפשרות למיתוג בהתאמה לאירוע." },
  { id: "digital-invitation", name: "עיצוב הזמנה דיגיטלית", categories: ["invitations", "branding"], priceFrom: 100, unit: "לעיצוב", minQty: 1, leadTime: "יום עסקים אחד", customization: null, images: img("digital-invitation", 4),
    description: "הזמנה דיגיטלית בעיצוב אישי ומוקפד, המותאמת לסגנון ולפרטי האירוע שלכם. דרך אלגנטית ומיוחדת להזמין את האורחים ולשתף את ההתרגשות לקראת היום הגדול." },
  { id: "wedding-logo", name: "לוגו לחתונה", categories: ["branding"], priceFrom: 100, unit: "לעיצוב", minQty: 1, leadTime: "יום עסקים אחד", customization: null, images: img("wedding-logo", 5),
    description: "לוגו זוגי בעיצוב אישי, המשלב את ראשי התיבות או שמות בני הזוג בסגנון אלגנטי ועל־זמני. מושלם למיתוג הזמנות, תפריטים, מזכרות ופריטים נוספים לחתונה." },
  { id: "digital-invitation-video", name: "הזמנה דיגיטלית עם סרטון", categories: ["invitations", "branding"], priceFrom: 130, unit: "לעיצוב", minQty: 1, leadTime: "יום עסקים אחד", customization: null,
    images: ["/images/products/digital-invitation-video-poster.jpg"],
    video: { src: "/images/products/digital-invitation-video.mp4", poster: "/images/products/digital-invitation-video-poster.jpg" },
    description: "הזמנה דיגיטלית מונפשת בעיצוב אישי, המשלבת תנועה, אלמנטים גרפיים ופרטי האירוע. דרך מרשימה ומקורית להזמין את האורחים וליצור ציפייה לקראת האירוע." },
  { id: "square-candlesticks-blessing", name: "מארז פמוטים מרובעים מגבס וברכה שבת שלום", categories: ["packages"], priceFrom: 35, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("square-candlesticks-blessing", 1),
    description: "מארז שבת קלאסי הכולל זוג פמוטים מרובעים מגבס בעבודת יד וברכה מעוצבת להדלקת נרות שבת. מתנה שימושית ומרגשת עם אפשרות למיתוג אישי." },
  { id: "shabbat-candles-blessing", name: "מארז ברכה ונרות שבת", categories: ["packages"], priceFrom: 10, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("shabbat-candles-blessing", 1),
    description: "מארז עדין ומלא משמעות הכולל נרות שבת וברכה מעוצבת להדלקת נרות. מתנה מקסימה להפרשת חלה, שבת חתן ואירועים משפחתיים, עם אפשרות להקדשה אישית." },
  { id: "glass-candlesticks-blessing", name: "מארז פמוטים מזכוכית וברכה", categories: ["packages"], priceFrom: 22, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("glass-candlesticks-blessing", 1),
    description: "מארז אלגנטי הכולל פמוטים מזכוכית וברכה בעיצוב נקי וקלאסי. מזכרת מיוחדת ושימושית לאורחים, המשלבת יופי ועדינות ומתאימה למגוון אירועים." },
  { id: "havdalah", name: "מארז הבדלה", categories: ["packages"], priceFrom: 20, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("havdalah", 1),
    description: "מארז מיוחד בהשראת מסורת ההבדלה, הכולל נר הבדלה וברכון מעוצב עם סדר ההבדלה. מתנה בעלת משמעות לסיום השבת, עם אפשרות למיתוג אישי." },
  { id: "eshet-chayil-scarf", name: "מארז מטפחת לראש אשת חיל", categories: ["packages"], priceFrom: 25, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("eshet-chayil-scarf", 2),
    description: "מארז נשי ואלגנטי הכולל מטפחת לראש בהשראת ברכת אשת חיל. מתנה אישית ומרגשת להפרשת חלה, שבת חתן ואירועים מיוחדים, עם אפשרות למיתוג והקדשה." },
  { id: "round-candlesticks", name: "מארז פמוטים עגולים מגבס שבת שלום", categories: ["packages"], priceFrom: 26, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("round-candlesticks", 1),
    description: "זוג פמוטים עגולים מגבס בעבודת יד, בעיצוב מינימליסטי ועל־זמני. מתנה אלגנטית ושימושית לאורחים, עם אפשרות לאריזה ומיתוג בהתאמה לאירוע." },
  { id: "square-candlesticks", name: "מארז פמוטים מרובעים מגבס שבת שלום", categories: ["packages"], priceFrom: 28, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("square-candlesticks", 1),
    description: "זוג פמוטים מרובעים מגבס בעבודת יד, בעיצוב נקי ומוקפד. מזכרת מיוחדת מאירוע מרגש, המשלבת שימושיות, יופי ואפשרות למיתוג אישי." },
  { id: "booklet-mizmor-candles", name: "ברכון מזמור לתודה וסדר הדלקת נרות עם סרט תחרה", categories: ["packages"], priceFrom: 20, unit: "ליחידה", minQty: 10, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-mizmor-candles-1-lia.jpg", "/images/products/booklet-mizmor-candles-2-lia.jpg", "/images/products/booklet-mizmor-candles-3.jpg"],
    description: "ברכון מעוצב המשלב את מזמור לתודה וסדר הדלקת נרות שבת. בעיצוב קלאסי ועדין, עם סרט תחרה למראה חגיגי ואלגנטי. מזכרת מרגשת עם אפשרות להקדשה אישית." },
  { id: "booklet-mini-tehillim", name: "ברכון סדר הדלקת נרות ומזמור לתודה עם תהילים קטן", categories: ["packages"], priceFrom: 25, unit: "ליחידה", minQty: 20, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-mini-tehillim-1-lia.jpg"],
    description: "ברכון סדר הדלקת נרות שבת ומזמור לתודה עם סרט תחרה, יחד עם ספר תהילים קטן בשקית אורגנזה, ארוז בשקית שקופה עם פפיון. מזכרת מרגשת עם אפשרות להקדשה אישית." },
  { id: "booklet-tealights", name: "ברכון סדר הדלקת נרות ומזמור לתודה עם נרות שבת", categories: ["packages"], priceFrom: 22, unit: "ליחידה", minQty: 20, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-tealights-1-lia.jpg"],
    description: "ברכון סדר הדלקת נרות שבת ומזמור לתודה עם סרט תחרה, יחד עם זוג נרות שבת, ארוז בשקית שקופה עם פפיון. מזכרת מרגשת עם אפשרות להקדשה אישית." },
  { id: "booklet-shacharit", name: "ברכון ברכת השחר וברכות התורה עם סרט תחרה", categories: ["packages"], priceFrom: 20, unit: "ליחידה", minQty: 10, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-shacharit-1-lia.jpg", "/images/products/booklet-shacharit-2.jpg"],
    description: "ברכון מעוצב הכולל את ברכות השחר וברכות התורה, בעיצוב מוקפד עם סרט תחרה עדין. מתנה בעלת משמעות, המתאימה למגוון אירועים ולמיתוג אישי." },
  { id: "booklet-candles-eshet-chayil", name: "ברכון סדר הדלקת נרות שבת ואשת חיל עם סרט תחרה", categories: ["packages"], priceFrom: 20, unit: "ליחידה", minQty: 10, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-candles-eshet-chayil-1-lia.jpg"],
    description: "ברכון אלגנטי המשלב את סדר הדלקת נרות שבת ומזמור אשת חיל. מעוטר בסרט תחרה עדין, ומשמש מזכרת אישית ומרגשת מאירוע מיוחד." },
  { id: "booklet-mizmor-candles-challah", name: "ברכון מזמור לתודה, סדר הדלקת נרות והפרשת חלה עם סרט תחרה", categories: ["packages"], priceFrom: 20, unit: "ליחידה", minQty: 10, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-mizmor-candles-challah-1-lia.jpg"],
    description: "ברכון חגיגי המשלב את מזמור לתודה, סדר הדלקת נרות שבת וסדר הפרשת חלה. מעוצב בסגנון קלאסי עם סרט תחרה, ומתאים במיוחד כמתנה לאורחות בערב הפרשת חלה." },
  { id: "booklet-rachel-candles", name: "ברכון רחל אמנו וסדר הדלקת נרות שבת עם סרט תחרה", categories: ["packages"], priceFrom: 20, unit: "ליחידה", minQty: 10, leadTime: "3 ימי עסקים", customization: BOOKLET_CUSTOM, images: ["/images/products/booklet-rachel-candles-1-lia.jpg"],
    description: "ברכון מעוצב המשלב את סגולת רחל אמנו וסדר הדלקת נרות שבת. עם סרט תחרה עדין ואפשרות להקדשה אישית, ליצירת מזכרת מרגשת ומלאת משמעות." },
  { id: "menu-design", name: "עיצוב תפריט (קובץ בלבד)", categories: ["branding"], priceFrom: 169, unit: "לעיצוב", minQty: 1, leadTime: "יום עסקים אחד", customization: null, images: img("menu-design", 2),
    description: "תפריט לאירוע בעיצוב אישי ואלגנטי, המותאם לקונספט, לצבעים ולמיתוג שלכם. הקובץ נשלח בפורמט דיגיטלי מוכן להדפסה, ללא שירותי הדפסה." },
  { id: "round-candlesticks-bag", name: "מארז פמוטים עגולים מגבס שבת שלום וברכה בשקית יוקרתית", categories: ["packages"], priceFrom: 37, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("round-candlesticks-bag", 1),
    description: "מארז שבת אלגנטי הכולל זוג פמוטים עגולים מגבס בעבודת יד וברכה מעוצבת להדלקת נרות שבת. המארז מגיע בשקית יוקרתית ומוקפדת, עם אפשרות למיתוג אישי בהתאמה לאירוע." },
  { id: "square-candlesticks-bag", name: "מארז פמוטים מרובעים מגבס שבת שלום וברכה בשקית יוקרתית", categories: ["packages"], priceFrom: 38, unit: "ליחידה", minQty: 20, leadTime: EVENT_LEAD_TIME, customization: PACKAGE_CUSTOM, images: img("square-candlesticks-bag", 1),
    description: "מארז שבת קלאסי ומוקפד הכולל זוג פמוטים מרובעים מגבס בעבודת יד וברכה מעוצבת להדלקת נרות שבת. מוגש בשקית יוקרתית עם אפשרות למיתוג והקדשה אישית." },
  { id: "corduroy-siddur-event", name: "סידור בכריכת בד קורדרוי", categories: ["packages"], priceFrom: 50, unit: "ליחידה", minQty: 40, leadTime: EVENT_LEAD_TIME, customization: "במגוון צבעים: ורוד, בז׳, תכלת, כתום, חום וכחול כהה. כתבו בהערות איזה צבע תרצו. (בסידור הזה אין אפשרות להטבעה.)", images: img("corduroy-siddur", 2),
    description: "סידור בכריכת בד קורדרוי, מתנה מכובדת ושימושית לאורחים. קיים במגוון צבעים. ₪50 ליחידה, מחיר כמות, מ־40 יחידות." },
  { id: "sefer-dvarim-event", name: "ספר דברים", categories: ["packages"], priceFrom: 40, unit: "ליחידה", minQty: 40, leadTime: EVENT_LEAD_TIME, customization: "במגוון צבעים. אפשר להוסיף הטבעה מיוחדת של שם האירוע – ₪45 ליחידה במקום ₪40. כתבו בהערות את הצבע ואת הנוסח להטבעה.", images: img("sefer-dvarim", 3),
    description: "ספר דברים בכריכה מהודרת, מתנה מכובדת לאורחים. קיים במגוון צבעים, ויש אפשרות להטבעה מיוחדת של שם האירוע. ₪40 ליחידה, או ₪45 ליחידה עם הטבעה. מחיר כמות, מ־40 יחידות." },
  { id: "tehillim-event", name: "תהילים", categories: ["packages"], priceFrom: 40, unit: "ליחידה", minQty: 40, leadTime: EVENT_LEAD_TIME, customization: "בשלושה צבעים: לבן, כחול כהה ובז׳. אפשר להוסיף הטבעה מיוחדת של שם האירוע – ₪45 ליחידה במקום ₪40. כתבו בהערות את הצבע ואת הנוסח להטבעה.", images: img("tehillim", 3),
    description: "ספר תהילים בכריכת בד מהודרת, מתנה מכובדת לאורחים. קיים בשלושה צבעים, ויש אפשרות להטבעה מיוחדת של שם האירוע. ₪40 ליחידה, או ₪45 ליחידה עם הטבעה. מחיר כמות, מ־40 יחידות." },
];

/** אילו מוצרים מוצגים בדף הבית ובאיזה סדר (6 מובילים). אפשר להחליף מזהים כאן. */
export const HOME_FEATURED_IDS = [
  "rachel-candle",
  "round-candlesticks-bag",
  "digital-invitation-video",
  "eshet-chayil-scarf",
  "booklet-mizmor-candles",
  "wedding-logo",
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const homeFeatured = () =>
  HOME_FEATURED_IDS.map(productById).filter((p): p is Product => Boolean(p));

/** עובדות על העסק – רק מה שמופיע בקובץ של MIALOR */
export const PROMISES = [
  { title: "מיתוג והקדשה אישית", text: "מדבקה ממותגת על המארז והקדשה בתחתית הברכה" },
  { title: "עבודת יד", text: "פמוטים בעבודת יד ועטיפה מוקפדת לכל מארז" },
  { title: "מארזים החל מ־20 יחידות", text: "מתאים גם לאירועים קטנים ואינטימיים" },
  { title: "עיצוב דיגיטלי מהיר", text: "הזמנה, לוגו או תפריט תוך יום עסקים אחד" },
];

export const ABOUT = {
  eyebrow: "הסיפור שלי",
  title: "נעים להכיר, אני מאי",
  text: [
    "הסיפור של MIALOR התחיל כשהייתי כלה בעצמי. חיפשתי מתנה ייחודית לערב הפרשת החלה שלי, משהו שאני באמת אוהבת – ופשוט לא מצאתי משהו שהיה בול מה שחיפשתי. אז החלטתי לעשות אותו בעצמי.",
    "יום אחד, כשגללתי בפייסבוק, ראיתי פוסט של מישהי ששאלה: \"איזה מתנות עשיתן להפרשת חלה שלכן?\" העליתי את שלי בתמימות, וכמות ההודעות שקיבלתי בפרטי – כמה זה עולה והאם אני מוכרת – הייתה מטורפת. לא נשארה לי ברירה אלא להתחיל למכור.",
    "ושם נולדה האהבה שלי לעולם היצירה והעשייה.",
  ],
  signature: "באהבה, מאי",
  cta: "לשיחה אישית בוואטסאפ",
  /** תמונה אישית או של הסטודיו. null = האזור יוצג בלי תמונה. */
  image: "/images/products/digital-invitation-1.jpg" as string | null, // placeholder – עד שתגיע תמונה אישית
  imageAlt: "הזמנת Save the Date עם סרט סאטן ומעטפה בגוון שמנת",
  placeholder: true, // התמונה עדיין זמנית – הטקסט אמיתי
};

export type Testimonial = { quote: string; name: string; event: string };

/**
 * המלצות לקוחות.
 * testimonialsAreSamples: true = המלצות לדוגמה. באתר שעולה לאוויר האזור מוסתר אוטומטית עד שיוחלפו בהמלצות אמיתיות
 * ומשנים כאן ל־false. בתצוגה המקדימה ובהרצה מקומית האזור מוצג.
 */
export const testimonialsAreSamples = true; // placeholder

export const TESTIMONIALS: Testimonial[] = [
  { quote: "המארזים היו מושלמים, כל אורח שאל מאיפה הזמנו. הכול הגיע ארוז ומוכן לשולחן.", name: "שם הלקוחה", event: "חתונה" },
  { quote: "קיבלנו הדמיה מהירה, תיקנו פרט אחד קטן, והתוצאה הייתה בדיוק מה שדמיינו.", name: "שם הלקוחה", event: "בר מצווה" },
  { quote: "ההזמנות יצאו עדינות ויוקרתיות, והמונוגרמה ליוותה אותנו בכל פרטי האירוע.", name: "שם הלקוחה", event: "אירוסין" },
];

export type FaqItem = { q: string; a: string | null };

/**
 * שאלות ותשובות. התשובות מבוססות רק על הפרטים שבקובץ של MIALOR.
 * שאלה עם a: null לא מוצגת באתר – ממלאים תשובה והיא מופיעה אוטומטית.
 */
export const FAQ: FaqItem[] = [
  {
    q: "איך מזמינים?",
    a: "נכנסים לעמוד המוצר, ממלאים כמות, תאריך האירוע ופרטים נוספים, ולוחצים על \"שליחת ההזמנה בוואטסאפ\". ההודעה מגיעה אלינו עם כל הפרטים, ואנחנו חוזרים אליכם עם אישור.",
  },
  {
    q: "האם משלמים באתר?",
    a: "בחנות המוצרים – כן: בוחרים פריטים לסל ומשלמים באשראי בדף מאובטח של טרנזילה. במארזים, בהזמנות, בעיצוב ובברכונים – לא: שולחים את פרטי ההזמנה בוואטסאפ, ואנחנו חוזרים אליכם עם אישור והמשך התהליך.",
  },
  {
    q: "מה יש בחנות המוצרים?",
    a: "פריטים בודדים מגבס איכותי בעבודת יד – פמוטים, מעמדי הדלקת נרות, חנוכייה ומגשים – לקנייה מיידית באתר. ייתכנו הבדלים קלים בגוון, במרקם ובמידות, כי כל פריט נעשה ביד.",
  },
  {
    q: "תוך כמה זמן מגיע מוצר מהחנות?",
    a: "עד 7 ימי עסקים, כולל ההכנה והשילוח. המשלוח באמצעות דואר ישראל לכל הארץ, בעלות ₪35 – וחינם בהזמנה מ־₪249. אפשר גם לאסוף בחינם מחולון בתיאום מראש.",
  },
  {
    q: "אפשר להחזיר מוצר שקניתי בחנות?",
    a: "כן, לפי חוק הגנת הצרכן: תוך 14 ימים מקבלת המוצר, כשהוא שלם, ללא שימוש ובאריזתו המקורית. כל הפרטים בתקנון.",
  },
  { q: "אפשר לקנות פחות מהכמות לאירוע?", a: "כן. המחירים בעמודי האירועים הם מחירי כמות: במארזים מ־20 יחידות (בסידורים, בספר דברים ובתהילים – מ־40), ובברכונים מ־10 (בברכונים עם תהילים או נרות – מ־20). במארזים ובספרים אפשר לקנות גם בבודדים, במחיר אחר – בחנות או בפנייה אלינו. ברכונים נמכרים בהזמנת כמות בלבד. בעיצוב גרפי (הזמנה דיגיטלית, לוגו לחתונה, תפריט) – המחיר הוא לעיצוב אחד." },
  {
    q: "אפשר להתאים את המארז אישית?",
    a: "כן. אפשר להוסיף מדבקה במיתוג אישי על המארז והקדשה אישית בתחתית הברכה המצורפת. בברכונים אפשר להוסיף הקדשה אישית בתחתית הברכון.",
  },
  {
    q: "כמה זמן לוקחת ההכנה?",
    a: "עיצוב דיגיטלי (הזמנה, לוגו, תפריט) – יום עסקים אחד. ברכונים – 3 ימי עסקים. במארזים – עד 20 יחידות כשבועיים, ומעל 20 יחידות כחודש. מומלץ לבדוק איתנו זמינות לפני ההזמנה. מוצרי החנות (קנייה אישית) – עד 7 ימי עסקים.",
  },
  {
    q: "מה המחירים?",
    a: "ליד כל מוצר מופיע מחיר התחלתי (\"החל מ־\"). המחיר הסופי נקבע לפי הכמות והתאמות אישיות, ונשלח אליכם לפני אישור ההזמנה.",
  },
  {
    q: "מה ההבדל בין הזמנה דיגיטלית להזמנה עם סרטון?",
    a: "הזמנה דיגיטלית היא עיצוב אישי כתמונה לשליחה לאורחים. הזמנה עם סרטון היא הזמנה מונפשת, עם תנועה ואלמנטים גרפיים.",
  },
  { q: "עיצוב התפריט כולל הדפסה?", a: "לא. עיצוב התפריט נשלח כקובץ דיגיטלי מוכן להדפסה, ללא שירותי הדפסה." },
  { q: "איך יוצרים קשר?", a: "בוואטסאפ 052-870-9088, באינסטגרם mialor__ או במייל mialor555@gmail.com." },
  {
    q: "יש משלוחים? לאן ובכמה?",
    a: "במוצרי החנות (קנייה אישית) – משלוח לכל הארץ דרך דואר ישראל ב־₪35, וחינם בהזמנה מ־₪249; עד 7 ימי עסקים. בהזמנות כמות לאירועים – בדרך כלל איסוף עצמי בחינם מחולון, ומשלוחים בתיאום מראש לאזורים מסוימים, בעיקר באזור המרכז; העלות נמסרת לפני אישור ההזמנה.",
  },
  { q: "אפשר לאסוף בעצמי?", a: "כן, אפשר לאסוף מחולון בחינם. רוב הלקוחות שלנו בוחרות באיסוף עצמי." },
  { q: "איך משלמים?", a: "בחנות המוצרים – באשראי באתר. בשאר ההזמנות – איך שנוח לכם: ביט, אשראי או העברה בנקאית. תשלום במזומן אפשרי רק באיסוף עצמי." },
  {
    q: "אפשר לבטל הזמנה?",
    a: "אפשר לבטל הזמנה עד שבועיים לפני האירוע, ובמקרה כזה המקדמה אינה מוחזרת. ביטול פחות משבועיים לפני האירוע כרוך בתשלום של 50% מסכום ההזמנה.",
  },
  {
    q: "כמה זמן מראש כדאי להזמין?",
    a: "כמה שיותר מראש, ולפחות חודש לפני האירוע. מומלץ להתייעץ איתנו בוואטסאפ לגבי לוח הזמנים.",
  },
];

/** משלוח ואיסוף – למוצרים פיזיים */
export const DELIVERY = {
  pickup: "איסוף עצמי מחולון (בחינם)",
  shipping: "משלוח בתיאום מראש לאזורים מסוימים, בעיקר באזור המרכז",
};

/** פרטים לתקנון */
export const TERMS = {
  updated: "13.11.2026",
  /** מספר עוסק / ח.פ. – יוצג בתקנון כשיתמלא */
  businessId: "214008385" as string | null,
  /** עוסק פטור – לא גובים מע"מ, המחירים סופיים */
  businessType: "עוסק פטור",
  ownerName: "מאי",
  city: "חולון",
};

export const ACCESSIBILITY = {
  /** תאריך עדכון ההצהרה */
  updated: "07.11.2026",
  /** רכזת הנגישות */
  coordinatorName: "מאי" as string | null,
};

export const ALL_PRODUCTS_HREF = "/products";

/** בתצוגה המקדימה (קובץ סטטי בלי תיקיות) עמודי המוצר נשמרים כ־product-<id>.html */
const FLAT_PREVIEW = process.env.NEXT_PUBLIC_FLAT_PREVIEW === "1";
export const productHref = (id: string) => (FLAT_PREVIEW ? `./product-${id}.html` : `/product/${id}`);

export const EVENT_TYPES = ["חתונה", "חינה", "אירוסין", "הפרשת חלה", "שבת חתן", "בר מצווה", "בת מצווה", "ברית / בריתה", "אחר"];
/** קטגוריה = עמוד המוצרים מסונן לפי הקטגוריה */
export const categoryHref = (slug: CategorySlug) => `/products#${slug}`;
export const categoryBySlug = (slug: CategorySlug) => CATEGORIES.find((c) => c.slug === slug)!;

/** group: "events" = מוצרים לאירועים (הזמנה בכמויות), "shop" = קנייה אישית של פריט בודד */
export type NavItem = { label: string; href: string; group?: "events" | "shop" };
export const NAV: NavItem[] = [
  { label: "בית", href: "/" },
  ...CATEGORIES.map((c) => ({ label: c.navLabel, href: categoryHref(c.slug), group: "events" as const })),
  { label: "קנייה אישית", href: "/shop", group: "shop" },
  { label: "אודות", href: "/#about" },
  { label: "צור קשר", href: "/#contact" },
];

/** שני "העולמות" של האתר – כדי שיהיה ברור מה נקנה בכמויות ומה אפשר לקנות כפריט בודד */
export const PATHS = {
  events: {
    title: "מתנות לאורחים באירוע",
    short: "לאירועים",
    note: "הזמנה בכמויות",
    points: ["מחירי כמות: מארזים מ־20 יחידות, ברכונים מ־10", "מיתוג והקדשה אישית לאירוע שלכם", "גם עיצוב הזמנות, לוגו ותפריטים"],
    cta: "למוצרים לאירועים",
    href: ALL_PRODUCTS_HREF,
    image: "/images/products/round-candlesticks-blessing-1.jpg",
    imageAlt: "מארז פמוטים וברכת שבת שלום לאורחים",
  },
  shop: {
    title: "קנייה אישית",
    short: "קנייה אישית",
    note: "גם פריט אחד",
    points: ["קונים גם פריט אחד – בלי מינימום", "תשלום מאובטח באשראי", "משלוח עד הבית או איסוף מחולון"],
    cta: "לחנות",
    href: "/shop",
    image: "/images/shop/round-pair-1.jpg",
    imageAlt: "זוג פמוטים מגבס שבת שלום",
  },
};

/** מוצר שנמכר בכמויות לאירוע (ולא עיצוב אחד) */
export const isBulk = (p: Pick<Product, "minQty">) => p.minQty > 1;

/** אותו מוצר בשני העולמות: מזהה המוצר לאירועים ← מזהה הפריט בחנות */
export const SHOP_TWINS: Record<string, string> = {
  "corduroy-siddur-event": "corduroy-siddur",
  "tehillim-event": "tehillim",
  "sefer-dvarim-event": "p-mwls55jrm7t",
  "rachel-segula-set-event": "rachel-segula-set",
};
export const eventTwinOf = (shopId: string) => Object.keys(SHOP_TWINS).find((k) => SHOP_TWINS[k] === shopId);

/**
 * מבצע לפי תאריכים. מחוץ לטווח – לא מוצג באתר בכלל.
 * כדי לבטל: active: false. כדי לשנות: אחוז, תאריכים וטקסטים.
 */
export const PROMO = {
  active: true,
  percent: 5,
  /** כולל, לפי שעון ישראל, בפורמט YYYY-MM-DD */
  start: "2026-11-01",
  end: "2026-11-30",
  name: "מבצע נובמבר",
  /** על אילו קטגוריות חלה ההנחה */
  categories: ["packages"] as CategorySlug[],
  bar: "מבצע נובמבר: 5% הנחה על מארזים וברכונים בהזמנות שנשלחות בחודש נובמבר (לא כולל סידורים וספרים)",
  /** נוסח קצר לטלפון */
  barShort: "5% על מארזים וברכונים (לא כולל סידורים)",
  /** מוצרים שלא נכללים במבצע */
  excludeIds: ["corduroy-siddur-event", "sefer-dvarim-event", "tehillim-event"],
  badge: "5% הנחה",
};

/** האם המבצע פעיל בתאריך נתון (לפי שעון ישראל) */
export function isPromoActive(date: Date = new Date()) {
  if (!PROMO.active) return false;
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(date); // YYYY-MM-DD
  return day >= PROMO.start && day <= PROMO.end;
}

/** סכום בשקלים: בלי אגורות כשמדובר במספר שלם */
export const formatAmount = (n: number) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

/** האם ההנחה חלה על המוצר (לפי קטגוריה, ורק כשיש מחיר) */
export const isPromoProduct = (p: Product) =>
  p.priceFrom !== null && !PROMO.excludeIds.includes(p.id) && p.categories.some((c) => PROMO.categories.includes(c));

export const discounted = (price: number) => Math.round(price * (100 - PROMO.percent)) / 100;

export const formatPrice = (p: Product) =>
  p.priceFrom === null ? "מחיר לפי הזמנה" : `החל מ־₪${p.priceFrom.toLocaleString("he-IL")}`;

export const orderMessage = (p: Product) => `שלום MIALOR, אשמח לקבל פרטים ולהזמין: ${p.name}`;

export type OrderDetails = { quantity: string; date: string; eventType: string; name: string; notes: string; delivery?: string; city?: string };

/** הודעת וואטסאפ מלאה מטופס ההזמנה בעמוד המוצר – כך כל הפרטים מגיעים מראש */
export function detailedOrderMessage(p: Product, d: OrderDetails, pageUrl?: string) {
  const lines = ["שלום MIALOR, אשמח להזמין:", "", `מוצר: ${p.name}`];
  if (d.quantity) lines.push(`כמות: ${d.quantity}`);
  if (d.date) lines.push(`תאריך האירוע: ${d.date.split("-").reverse().join("/")}`);
  if (d.eventType) lines.push(`סוג האירוע: ${d.eventType}`);
  if (d.delivery) lines.push(`משלוח / איסוף: ${d.delivery}${d.city?.trim() ? ` – ${d.city.trim()}` : ""}`);
  if (d.name.trim()) lines.push(`שם: ${d.name.trim()}`);
  if (d.notes.trim()) lines.push(`הערות / הקדשה: ${d.notes.trim()}`);
  if (isPromoActive() && isPromoProduct(p)) lines.push(`${PROMO.name}: ${PROMO.percent}% הנחה`);
  if (pageUrl) lines.push("", pageUrl);
  return lines.join("\n");
}

export const relatedProducts = (p: Product, n = 4) =>
  PRODUCTS.filter((x) => x.id !== p.id && x.categories.some((c) => p.categories.includes(c))).slice(0, n);
