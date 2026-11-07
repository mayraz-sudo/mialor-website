import { categoryBySlug, productHref, type Product } from "@/lib/site";
import { PromoBadge, PromoPrice } from "./Promo";
import ProductMedia from "./ProductMedia";

/** כרטיס מוצר אחיד – בדף הבית, בעמוד המוצרים ובעמוד מוצר. לחיצה מובילה לעמוד המוצר. */
export default function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const href = productHref(product.id);
  return (
    <article className="group relative flex h-full flex-col">
      <a href={href} tabIndex={-1} aria-hidden className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-surface">
          <ProductMedia product={product} sizes={sizes} />
          <PromoBadge product={product} />
        </div>
      </a>
      <div className="flex flex-1 flex-col pt-3.5 md:pt-5">
        <p className="t-label hidden md:block">{categoryBySlug(product.categories[0]).title}</p>
        <h3 className="t-h3 text-[1.2rem] leading-snug md:mt-1.5 md:text-[1.35rem]">
          <a href={href} className="hover:text-accent-strong">
            {product.name}
          </a>
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.95rem] leading-relaxed text-muted md:text-[0.94rem]">{product.description}</p>
        <p className="mt-2 text-[0.95rem] text-ink tabular-nums md:mt-2.5">
          <PromoPrice product={product} />
        </p>
        <div className="mt-auto pt-3.5 md:pt-5">
          <a href={href} aria-label={`לפרטים והזמנה: ${product.name}`} className="btn btn-secondary btn-sm w-full">
            לפרטים והזמנה
          </a>
        </div>
      </div>
    </article>
  );
}
