import type { NextConfig } from "next";

// STATIC_EXPORT=1 בונה עותק סטטי של האתר (לתצוגה מקדימה בלבד) בתיקייה out
const isExport = process.env.STATIC_EXPORT === "1";

// מגדיר את תיקיית הפרויקט כשורש, כדי ש־Next לא יחפש חבילות בתיקייה שמעליה
const base: NextConfig = { turbopack: { root: process.cwd() } };

const nextConfig: NextConfig = isExport
  ? { ...base, output: "export", distDir: ".next-export", images: { unoptimized: true } }
  : base;

export default nextConfig;
