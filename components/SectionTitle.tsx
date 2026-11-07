type Props = { id: string; title: string; eyebrow?: string; subtitle?: string };

/** כותרת אזור אחידה לכל דף הבית: תווית קטנה, כותרת וקו זהב דק */
export default function SectionTitle({ id, title, eyebrow, subtitle }: Props) {
  return (
    <div className="mb-8 text-center md:mb-11">
      {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      <span aria-hidden className="rule mx-auto mt-4" />
      {subtitle && <p className="t-lead mx-auto mt-4 max-w-xl">{subtitle}</p>}
    </div>
  );
}
