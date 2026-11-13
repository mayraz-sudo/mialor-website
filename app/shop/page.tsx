import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShopClient from "@/components/shop/ShopClient";
import { SHOP, shopItems } from "@/lib/shop";

export const metadata: Metadata = {
  title: `${SHOP.title} | MIALOR`,
  description: SHOP.intro,
  // כל עוד החנות בבנייה – לא להופיע בגוגל
  robots: SHOP.enabled ? undefined : { index: false, follow: false },
};

export default function ShopPage() {
  return (
    <>
      {!SHOP.enabled && (
        <p className="bg-[#fff4d6] px-5 py-2.5 text-center text-[0.9rem] text-ink">
          העמוד בבנייה ועדיין לא מופיע בתפריט ובגוגל. אפשר לבצע בו תשלום ניסיון.
        </p>
      )}
      <PageHeader eyebrow="MIALOR" title={SHOP.title} intro={SHOP.intro} />
      <section className="bg-bg">
        <ShopClient items={shopItems()} />
      </section>
    </>
  );
}
