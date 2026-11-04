/**
 * כל התוכן של דף הבית במקום אחד.
 * placeholder: true = תמונה או נתון זמני שיוחלף בחומרים המקוריים של MIALOR.
 * להחלפת תמונה: שמים קובץ חדש בתיקייה public/images ומעדכנים כאן את הנתיב.
 */

export const SITE = {
  name: "MIALOR",
  nameHe: "מיאלור",
  // TODO: להחליף במספר הוואטסאפ האמיתי (בפורמט בינלאומי, בלי 0 ובלי מקפים)
  whatsappNumber: "972500000000",
  whatsappDisplay: "050-000-0000",
  instagram: "@mialor",
  hours: "א׳–ה׳ 9:00–19:00",
  dataIsPlaceholder: true,
};

export const whatsappLink = (text = "שלום מיאלור, אשמח לקבל פרטים") =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const LOGO = {
  // קובץ הלוגו מתוך תיקיית "מארזים - שיווק", עם רקע שקוף
  full: { src: "/images/logo-gold.png", width: 658, height: 593 },
  mark: { src: "/images/mark-logo-gold.png", width: 360, height: 256 },
};

export const HERO = {
  title: "עיצוב אישי לכל רגע מיוחד",
  subtitle: "מארזים לאירועים, הזמנות, הדפסות ועיצוב גרפי",
  cta: "לצפייה במוצרים",
  image: "/images/favors.jpg",
  imageAlt: "שולחן מארזים בקופסאות שקופות עם תווית אישית",
  placeholder: true,
};

export type Category = {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  image: string;
  imageAlt: string;
  placeholder: boolean;
};

/** ארבע הקטגוריות הראשיות, בסדר שבאפיון. חשיבות שווה לכולן. */
export const CATEGORIES: Category[] = [
  {
    slug: "packages",
    title: "מארזים לאירועים",
    navLabel: "מארזים",
    description: "מארזים ומתנות לאורחים עם שם האירוע ועיצוב אישי.",
    image: "/images/favor-close.jpg",
    imageAlt: "קופסה שקופה עם ממתקים לבנים ותווית שבת חתן",
    placeholder: true,
  },
  {
    slug: "invitations",
    title: "הזמנות לאירועים",
    navLabel: "הזמנות",
    description: "הזמנות לחתונה ולכל אירוע, בהטבעה ובגימור יוקרתי.",
    image: "/images/std-zm.jpg",
    imageAlt: "הזמנת Save the Date עם מעטפת נייר וסרט תחרה",
    placeholder: true,
  },
  {
    slug: "branding",
    title: "עיצוב גרפי ומיתוג",
    navLabel: "מיתוג ועיצוב",
    description: "מונוגרמה אישית ושפה גרפית אחת לכל פרטי האירוע.",
    image: "/images/monogram-mz.jpg",
    imageAlt: "מונוגרמה מוטבעת על נייר בגוון שמנת",
    placeholder: true,
  },
  {
    slug: "prints",
    title: "ברכונים והדפסות",
    navLabel: "ברכונים והדפסות",
    description: "ברכונים, סדרי הדלקה, תוויות והדפסות לאירוע.",
    image: "/images/shabbat-booklet.jpg",
    imageAlt: "חוברת סדר הדלקת נרות עם סרט תחרה",
    placeholder: true,
  },
];

export type Product = {
  id: string;
  name: string;
  category: Category["slug"];
  image: string;
  imageAlt: string;
  /** מחיר אמיתי בשקלים. null = "לקבלת הצעת מחיר". לא להמציא מחירים. */
  price: number | null;
  placeholder: boolean;
};

/** מוצרים נבחרים: 2 מכל תחום. */
export const FEATURED: Product[] = [
  { id: "shabbat-chatan-box", name: "קופסת שבת חתן", category: "packages", image: "/images/favor-close.jpg", imageAlt: "קופסה שקופה עם ממתקים ותווית שבת חתן", price: null, placeholder: true },
  { id: "rachel-candle", name: "מארז נר סגולת רחל אמנו", category: "packages", image: "/images/rachel-candle.jpg", imageAlt: "מארזי נר בקופסת חלון עם דף סגולה", price: null, placeholder: true },
  { id: "std-monogram", name: "Save the Date עם מונוגרמה", category: "invitations", image: "/images/std-oa.jpg", imageAlt: "כרטיס Save the Date עם מסגרת מונוגרמה", price: null, placeholder: true },
  { id: "lace-invitation", name: "הזמנה עם מעטפת תחרה", category: "invitations", image: "/images/std-zm.jpg", imageAlt: "הזמנה עם עטיפת נייר וסרט תחרה", price: null, placeholder: true },
  { id: "couple-monogram", name: "מונוגרמה אישית לזוג", category: "branding", image: "/images/monogram-la.jpg", imageAlt: "מונוגרמה בעיטורים על רקע שחור", price: null, placeholder: true },
  { id: "event-branding", name: "מיתוג שולחנות לאירוע", category: "branding", image: "/images/event-table.jpg", imageAlt: "שולחן אירוע עם שקיות ממותגות לכל אורח", price: null, placeholder: true },
  { id: "candle-lighting", name: "סדר הדלקת נרות", category: "prints", image: "/images/shabbat-booklet.jpg", imageAlt: "חוברת סדר הדלקת נרות עם סרט תחרה", price: null, placeholder: true },
  { id: "event-labels", name: "תוויות ומדבקות לאירוע", category: "prints", image: "/images/favors.jpg", imageAlt: "תוויות עגולות עם שם האירוע על קופסאות", price: null, placeholder: true },
];

export const ABOUT = {
  title: "אודות MIALOR",
  text: [
    "MIALOR מעצבת ומפיקה מארזים, הזמנות והדפסות לאירועים, עם עיצוב אישי בכל פרט.",
    "כל הזמנה מתחילה בשיחה ובהדמיה לאישור, ומסתיימת במוצר מוכן שמגיע עד אליכם.",
  ],
  placeholder: true,
};

export const NAV = [
  { label: "בית", href: "/" },
  ...CATEGORIES.map((c) => ({ label: c.navLabel, href: `/category/${c.slug}` })),
  { label: "אודות", href: "/#about" },
  { label: "צור קשר", href: "/#contact" },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug)!;
export const categoryHref = (slug: string) => `/category/${slug}`;
export const productHref = (id: string) => `/product/${id}`;
