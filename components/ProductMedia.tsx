"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LOGO, type Product } from "@/lib/site";

/** תמונה ל"Coming soon" – למוצרים שעוד אין להם צילום */
export function ComingSoon({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`${name} – תמונה בקרוב`}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-bg-alt to-[#e9dfd1] px-4 text-center"
    >
      <Image src={LOGO.mark.src} width={LOGO.mark.width} height={LOGO.mark.height} alt="" className="h-auto w-[42%] max-w-[150px] opacity-70" />
      <span aria-hidden className="block h-px w-8 bg-accent" />
      <span lang="en" className="font-serif text-[0.95rem] tracking-[0.3em] text-accent-strong uppercase md:text-[1.05rem]">
        Coming soon
      </span>
    </div>
  );
}

/** תמונת מוצר, סרטון שקט (אם יש), או Coming soon */
export default function ProductMedia({ product, sizes }: { product: Product; sizes: string }) {
  // סרטון מתנגן רק אם המשתמש לא ביקש להפחית תנועה
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    setPlayVideo(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  // React לא מגדיר muted כמאפיין HTML, ולכן מפעילים את הסרטון מהקוד (דפדפנים מאפשרים ניגון אוטומטי רק בלי קול)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [playVideo]);

  if (product.images.length === 0) return <ComingSoon name={product.name} />;

  if (product.video && playVideo) {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={product.video.src}
        poster={product.video.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={product.name}
      />
    );
  }

  return (
    <Image
      src={product.images[0]}
      alt={product.name}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}
