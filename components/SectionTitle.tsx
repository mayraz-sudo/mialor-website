export default function SectionTitle({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center md:mb-10">
      <h2 id={id} className="text-3xl font-light md:text-4xl">
        {title}
      </h2>
      <span aria-hidden className="mx-auto mt-4 block h-px w-12 bg-accent" />
      {subtitle && <p className="mx-auto mt-4 max-w-xl text-muted">{subtitle}</p>}
    </div>
  );
}
