/** כותרת אחידה לעמודי מידע (שאלות נפוצות, נגישות וכו') */
export default function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto max-w-[760px] px-5 pt-10 pb-8 text-center md:pt-16 md:pb-12">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="t-h2 mt-2.5">{title}</h1>
        <span aria-hidden className="rule mx-auto mt-4" />
        {intro && <p className="t-lead mx-auto mt-4 max-w-xl">{intro}</p>}
      </div>
    </section>
  );
}
