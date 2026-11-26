import type { NextConfig } from "next";

// STATIC_EXPORT=1 בונה עותק סטטי של האתר (לתצוגה מקדימה בלבד) בתיקייה out
const isExport = process.env.STATIC_EXPORT === "1";

// מגדיר את תיקיית הפרויקט כשורש, כדי ש־Next לא יחפש חבילות בתיקייה שמעליה
// תאריך הבנייה – כדי שמבצע שתלוי בתאריך יוצג נכון כבר בטעינה הראשונה
const base: NextConfig = {
  turbopack: { root: process.cwd() },
  env: { NEXT_PUBLIC_BUILD_DATE: new Date().toISOString() },
};

// כתובות ישנות שאוחדו – מפנות לצמיתות (301/308) לעמוד הקיים, כדי שקישורים וגוגל לא יאבדו
const redirects: NextConfig["redirects"] = async () => [
  // "מארז פמוטים מרובעים וברכה" אוחד עם "מארז פמוטים מגבס להפרשת חלה" (עגולים או מרובעים לבחירה)
  { source: "/product/square-candlesticks-blessing", destination: "/product/round-candlesticks-blessing", permanent: true },
];

const nextConfig: NextConfig = isExport
  ? { ...base, output: "export", distDir: ".next-export", images: { unoptimized: true } }
  : { ...base, redirects };

export default nextConfig;
