import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";

// דף הבית – הסדר תואם לאפיון: Hero, קטגוריות, מוצרים נבחרים, אודות, פנייה בוואטסאפ.
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <About />
      <ContactCTA />
    </>
  );
}
