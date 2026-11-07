import { categoryBySlug, formatPrice, orderMessage, whatsappLink, type Product } from "@/lib/site";
import ProductMedia from "./ProductMedia";

/** כרטיס מוצר אחיד – בדף הבית ובעמוד המוצרים */
export default function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const href = whatsappLink(orderMessage(product));
  const comingSoon = product.images.length === 0;
  return (
    <article className="flex h-full flex-col">
      <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-surface">
          <ProductMedia product={product} sizes={sizes} />
        </div>
      </a>
      <div className="flex flex-1 flex-col pt-3.5 md:pt-5">
        <p className="t-label hidden md:block">{categoryBySlug(product.categories[0]).title}</p>
        <h3 className="t-h3 text-[1.2rem] leading-snug md:mt-1.5 md:text-[1.35rem]">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-[0.95rem] leading-relaxed text-muted md:text-[0.94rem]">{product.description}</p>
        <p className="mt-2 text-[0.95rem] text-ink tabular-nums md:mt-2.5">
          <span className="font-medium">{formatPrice(product)}</span>{" "}
          {product.priceFrom !== null && <span className="text-muted">{product.unit}</span>}
        </p>
        <div className="mt-auto pt-3.5 md:pt-5">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${comingSoon ? "לפרטים" : "לפרטים והזמנה"}: ${product.name} (נפתח בוואטסאפ)`}
            className="btn btn-secondary btn-sm w-full"
          >
            לפרטים והזמנה
          </a>
        </div>
      </div>
    </article>
  );
}
