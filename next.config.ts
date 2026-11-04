import type { NextConfig } from "next";

// STATIC_EXPORT=1 בונה עותק סטטי של האתר (לתצוגה מקדימה בלבד) בתיקייה out
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isExport
  ? { output: "export", distDir: ".next-export", images: { unoptimized: true } }
  : {};

export default nextConfig;
