import type { Metadata, Viewport } from "next";
import { Bellefair, Heebo } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { PromoBar } from "@/components/Promo";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import "./globals.css";

/** טקסט רגיל */
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-heebo",
  display: "swap",
});

/** כותרות – פונט עברי אלגנטי ודק עם סריפים */
const bellefair = Bellefair({
  subsets: ["hebrew", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mialorshop.com"),
  title: "MIALOR | מארזים, הזמנות, הדפסות ועיצוב גרפי לאירועים",
  description:
    "MIALOR – מארזים לאירועים, הזמנות, ברכונים והדפסות ועיצוב גרפי ומיתוג בהתאמה אישית. פנייה מהירה בוואטסאפ.",
  openGraph: {
    title: "MIALOR | עיצוב אישי לכל רגע מיוחד",
    description: "מארזים לאירועים, הזמנות, הדפסות ועיצוב גרפי",
    locale: "he_IL",
    url: "https://mialorshop.com",
    siteName: "MIALOR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${bellefair.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          דילוג לתוכן
        </a>
        <PromoBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <AccessibilityMenu />
      </body>
    </html>
  );
}
