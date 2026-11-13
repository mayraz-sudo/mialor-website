import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/shop/BuyBox";
import { IconChevron } from "@/components/Icons";
import { CARE, SHOP, perLabel, shopItemById, shopItemHref, shopItemImages, shopItems } from "@/lib/shop";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return shopItems()
    .filter((i) => !i.hidden)
    .map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const item = shopItemById((await params).id);
  if (!item) return {};
  return {
    title: `${item.name} | חנות מוצרים | MIALOR`,
    description: `${item.description} ${SHOP.material}`,
    openGraph: { title: item.name, description: item.description, images: item.image ? [item.image] : [] },
  };
}

const money = (n: number) => `₪${n.toLocaleString("he-IL")}`;

export default async function ShopItemPage({ params }: Params) {
  const item = shopItemById((await params).id);
  if (!item) notFound();
  const images = shopItemImages(item);
  const others = shopItems()
    .filter((i) => i.id !== item.id && !i.hidden)
    .slice(0, 4);

  const facts = [
    { label: "חומר", value: "גבס איכותי, בעבודת יד" },
    { label: "זמן הכנה ומשלוח", value: `${SHOP.leadTime}, כולל ההכנה והשילוח` },
    { label: "משלוח", value: `דואר ישראל לכל הארץ – ${money(SHOP.postPrice ?? 0)}` },
    { label: "איסוף עצמי", value: "מחולון, בחינם ובתיאום מראש" },
  ];

  return (
    <>
      <section className="bg-bg">
        <div className="mx-auto max-w-[1180px] px-5 pt-5 pb-12 md:pt-8 md:pb-20">
          <nav aria-label="מיקום בעמוד" className="mb-5 text-[0.88rem] text-muted md:mb-8">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-ink">בית</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/shop" className="hover:text-ink">{SHOP.title}</Link>
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <ProductGallery product={{ name: item.name, images }} square />

            <div>
              <p className="t-label">{SHOP.title}</p>
              <h1 className="mt-2 font-serif text-[1.9rem] leading-[1.2] text-balance md:text-[2.4rem]">{item.name}</h1>
              <p className="mt-3 text-[1.35rem] tabular-nums">
                {money(item.price)}
                {item.per && <span className="ms-2 text-[1rem] text-muted">{perLabel(item)}</span>}
              </p>
              <span aria-hidden className="rule mt-5" />
              <p className="mt-5 text-[1.05rem] leading-[1.85] text-muted">{item.description}</p>

              <div className="mt-6">
                <BuyBox item={item} />
              </div>

              <dl className="mt-6 divide-y divide-line border-y border-line">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[8.5rem_1fr] gap-3 py-3 text-[0.97rem]">
                    <dt className="font-medium">{f.label}</dt>
                    <dd className="text-muted">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-[0.92rem] leading-relaxed text-muted">{SHOP.handmadeNote}</p>

              <details className="group mt-5 rounded-[2px] border border-line bg-surface">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-medium [&::-webkit-details-marker]:hidden">
                  {CARE.title}
                  <IconChevron className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-[0.95rem] leading-relaxed">
                  <ul className="space-y-2">
                    {CARE.items.map((c) => (
                      <li key={c.title}>
                        <span className="font-medium">{c.title}:</span> <span className="text-muted">{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="more-title" className="bg-bg-alt py-12 md:py-16">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-5">
            <h2 id="more-title" className="t-h2 mb-8 text-center md:mb-10">עוד מהחנות</h2>
            <ul className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={shopItemHref(o.id)} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-[2px] bg-surface">
                      {o.image && (
                        <Image src={o.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      )}
                    </div>
                    <p className="mt-3 leading-snug">{o.name}</p>
                    <p className="mt-1 font-medium tabular-nums">{money(o.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center">
              <Link href="/shop" className="btn btn-secondary">לכל המוצרים בחנות</Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
