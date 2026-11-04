# MIALOR – אתר

אתר בעברית (RTL) למותג MIALOR, בנוי ב־Next.js, TypeScript ו־Tailwind CSS.
**שלב נוכחי:** דף בית בלבד, לאישור עיצוב. אין סליקה ואין סל קניות. פנייה דרך WhatsApp.

## איך פותחים את האתר במחשב

צריך פעם אחת להתקין את Node.js (גרסה 20 ומעלה) מ־https://nodejs.org.

1. פותחים טרמינל בתיקייה `mialor`.
2. מתקינים את החבילות (פעם אחת):
   ```bash
   npm install
   ```
3. מפעילים את האתר:
   ```bash
   npm run dev
   ```
4. פותחים בדפדפן את הכתובת: http://localhost:3000

### בדיקה במובייל

- **בדפדפן במחשב:** ב־Chrome לוחצים F12, ואז על אייקון הטלפון (Toggle device toolbar) ובוחרים דגם טלפון.
- **בטלפון אמיתי:** הטלפון והמחשב באותה רשת Wi‑Fi. מריצים `npm run dev -- -H 0.0.0.0`, ופותחים בטלפון את הכתובת שמופיעה בטרמינל בשורה `Network` (למשל `http://192.168.1.20:3000`).

## איפה משנים מה

| מה | קובץ |
|---|---|
| קטגוריות, מוצרים נבחרים, טקסטים, מספר WhatsApp, נתיבי תמונות | `lib/site.ts` |
| צבעים | `app/globals.css` (משתני CSS בראש הקובץ) |
| פונט | `app/layout.tsx` |
| תמונות | `public/images` |

כל תמונה ונתון זמני מסומנים ב־`placeholder: true` ב־`lib/site.ts`, ומוצגת עליהם תגית "תמונה זמנית". כשמחליפים בחומר המקורי, משנים ל־`false` והתגית נעלמת.

## מבנה

```
app/
  layout.tsx       מבנה כללי, RTL, פונט Heebo, SEO
  page.tsx         דף הבית
  not-found.tsx    עמוד זמני לעמודים שעוד לא נבנו
components/
  Header.tsx  Hero.tsx  CategoryGrid.tsx  FeaturedProducts.tsx
  About.tsx   ContactCTA.tsx  Footer.tsx
lib/site.ts        כל הנתונים
review/            צילומי מסך של דף הבית (מחשב ומובייל)
```

## עמודים הבאים (ממתינים לאישור דף הבית)

עמוד קטגוריה ועמוד מוצר, לפי האפיון.
