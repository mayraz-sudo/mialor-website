import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import BrandBand from "@/components/BrandBand";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactCTA from "@/components/ContactCTA";

// דף הבית: פתיחה, קטגוריות, החתימה של MIALOR, מוצרים מובילים, אודות, המלצות, פנייה בוואטסאפ.
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <BrandBand />
      <FeaturedProducts />
      <About />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
