import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { PromoNote, PromoPrice } from "@/components/Promo";
import {
  ALL_PRODUCTS_HREF,
  DELIVERY,
  PRODUCTS,
  categoryBySlug,
  categoryHref,
  productById,
  relatedProducts,
} from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = productById((await params).id);
  if (!p) return {};
  return {
    title: `${p.name} | MIALOR`,
    description: p.description,
    openGraph: { title: p.name, description: p.description, images: p.images[0] ? [p.images[0]] : [] },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = productById((await params).id);
  if (!product) notFound();
  const category = categoryBySlug(product.categories[0]);
  const related = relatedProducts(product);

  const facts = [
    { label: "כמות מינימלית", value: product.minQty > 1 ? `${product.minQty} יחידות` : "עיצוב אחד" },
    { label: "זמן הכנה", value: product.leadTime },
    ...(product.customization ? [{ label: "התאמה אישית", value: product.customization }] : []),
    ...(product.minQty > 1 ? [{ label: "משלוח ואיסוף", value: `${DELIVERY.pickup}, או ${DELIVERY.shipping}` }] : []),
  ];

  return (
    <>
      <section className="bg-bg">
        <div className="mx-auto max-w-[1180px] px-5 pt-5 pb-12 md:pt-8 md:pb-20">
          {/* פירורי לחם */}
          <nav aria-label="מיקום בעמוד" className="mb-5 text-[0.88rem] text-muted md:mb-8">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-ink">
                  בית
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={ALL_PRODUCTS_HREF} className="hover:text-ink">
                  כל המוצרים
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <a href={categoryHref(category.slug)} className="hover:text-ink">
                  {category.title}
                </a>
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <ProductGallery product={product} />

            <div>
              <p className="t-label">{category.title}</p>
              <h1 className="mt-2 font-serif text-[1.9rem] leading-[1.2] text-balance md:text-[2.4rem]">{product.name}</h1>
              <p className="mt-3 text-[1.15rem] tabular-nums">
                <PromoPrice product={product} large />
              </p>
              <PromoNote product={product} />
              <span aria-hidden className="rule mt-5" />
              <p className="mt-5 text-[1.05rem] leading-[1.85] text-muted">{product.description}</p>

              <dl className="mt-6 divide-y divide-line border-y border-line">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[8.5rem_1fr] gap-3 py-3 text-[0.97rem]">
                    <dt className="font-medium">{f.label}</dt>
                    <dd className="text-muted">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7">
                <OrderForm product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-bg-alt py-12 md:py-16">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-5">
            <h2 id="related-title" className="t-h2 mb-8 text-center md:mb-10">
              עוד מ{category.title}
            </h2>
            <ul className="grid grid-cols-2 gap-x-3.5 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-7">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
