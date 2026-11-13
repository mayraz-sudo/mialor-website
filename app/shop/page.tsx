import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShopClient from "@/components/shop/ShopClient";
import { IconChevron, IconGift, IconPen, IconTruck } from "@/components/Icons";
import { CARE, SHOP } from "@/lib/shop";
import { getVisibleItems } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SHOP.title} | MIALOR`,
  description: SHOP.intro,
  // כל עוד החנות בבנייה – לא להופיע בגוגל
  robots: SHOP.enabled ? undefined : { index: false, follow: false },
};

const FACTS = [
  { icon: IconPen, title: "גבס איכותי בעבודת יד", text: "כל פריט נוצק ומעובד ביד" },
  { icon: IconTruck, title: "משלוח בדואר ישראל", text: `לכל הארץ ב־₪${SHOP.postPrice}, ${SHOP.leadTime}` },
  { icon: IconGift, title: "איסוף עצמי מחולון", text: "בחינם, בתיאום מראש" },
];

export default async function ShopPage() {
  const items = await getVisibleItems();
  return (
    <>
      <PageHeader eyebrow="MIALOR" title={SHOP.title} intro={SHOP.intro} />

      <section aria-label="מידע על המוצרים" className="border-b border-line bg-bg-alt">
        <ul className="mx-auto grid max-w-[1180px] gap-4 px-4 py-5 sm:grid-cols-3 sm:px-5">
          {FACTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3 sm:justify-center">
              <Icon className="h-6 w-6 shrink-0 text-accent-strong" />
              <span>
                <span className="block font-medium">{title}</span>
                <span className="text-[0.88rem] text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-bg">
        <ShopClient items={items} />
      </section>

      <section aria-labelledby="good-to-know" className="border-t border-line bg-bg">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-12 sm:px-5 md:grid-cols-2 md:py-16">
          <div>
            <h2 id="good-to-know" className="t-h3">חשוב לדעת</h2>
            <ul className="mt-4 space-y-3 leading-relaxed text-muted">
              <li>{SHOP.material}</li>
              <li>{SHOP.handmadeNote}</li>
              <li>{SHOP.shippingNote}, או איסוף עצמי בחינם מחולון בתיאום מראש.</li>
            </ul>
          </div>

          <details className="group self-start rounded-[2px] border border-line bg-surface" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
              <h2 className="t-h3 text-[1.25rem]">{CARE.title}</h2>
              <IconChevron className="shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 leading-relaxed">
              <p className="text-muted">{CARE.intro}</p>
              <ul className="mt-4 space-y-2.5">
                {CARE.items.map((c) => (
                  <li key={c.title}>
                    <span className="font-medium">{c.title}:</span> <span className="text-muted">{c.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-muted">{CARE.footer}</p>
              <p className="mt-3 font-serif text-[1.1rem]">{CARE.signature}</p>
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
