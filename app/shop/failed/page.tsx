import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "התשלום לא הושלם | MIALOR", robots: { index: false, follow: false } };

export default async function FailedPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const safe = (code || "").replace(/\D/g, "").slice(0, 6);
  return (
    <>
      <PageHeader eyebrow="MIALOR" title="התשלום לא הושלם" intro="לא חויבתם. אפשר לנסות שוב, או לכתוב לנו בוואטסאפ ונשמח לעזור." />
      <section className="bg-bg">
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 px-5 py-12 text-center">
          {safe && <p className="text-[0.9rem] text-muted">קוד מטרנזילה: {safe}</p>}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">
              חזרה לסל ולתשלום
            </Link>
            <a href={whatsappLink(`שלום מיאלור, ניסיתי לשלם באתר והתשלום לא עבר${safe ? ` (קוד ${safe})` : ""}`)} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              כתבו לנו בוואטסאפ
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
