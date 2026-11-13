import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ClearCart from "@/components/shop/ClearCart";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "תודה על ההזמנה | MIALOR", robots: { index: false, follow: false } };

export default function ThanksPage() {
  return (
    <>
      <ClearCart />
      <PageHeader eyebrow="MIALOR" title="תודה, ההזמנה התקבלה" intro="התשלום עבר בהצלחה. ניצור איתכם קשר בקרוב לתיאום האיסוף או המשלוח." />
      <section className="bg-bg">
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 px-5 py-12 text-center">
          <p className="text-muted">יש שאלה? אנחנו כאן בוואטסאפ.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a href={whatsappLink("שלום מיאלור, ביצעתי עכשיו הזמנה באתר")} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              כתבו לנו בוואטסאפ
            </a>
            <Link href="/" className="btn btn-secondary">
              לדף הבית
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
