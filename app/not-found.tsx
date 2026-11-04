import Link from "next/link";

// עמוד זמני לכל עמוד שעדיין לא נבנה (קטגוריה, מוצר, חיפוש וכו'), עד לאישור דף הבית.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-3xl font-light md:text-4xl">העמוד הזה ייבנה בשלב הבא</h1>
      <p className="mt-4 text-muted">כרגע בונים ומאשרים את דף הבית. שאר העמודים יתווספו אחרי האישור.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-md bg-ink px-8 font-medium text-white hover:bg-accent-strong"
      >
        חזרה לדף הבית
      </Link>
    </section>
  );
}
