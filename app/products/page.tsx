import type { Metadata } from "next";
import ProductsBrowser from "@/components/ProductsBrowser";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "כל המוצרים | MIALOR",
  description: "מארזים לאירועים, הזמנות דיגיטליות, לוגו לחתונה וברכונים עם סרט תחרה – כל המוצרים של MIALOR.",
};

export default function ProductsPage() {
  return (
    <>
      <ProductsBrowser />
      <ContactCTA />
    </>
  );
}
