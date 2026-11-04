import { ABOUT } from "@/lib/site";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-14 md:py-20">
      <div className="mx-auto max-w-[720px] px-5 text-center">
        <h2 id="about-title" className="text-3xl font-light md:text-4xl">
          {ABOUT.title}
        </h2>
        <span aria-hidden className="mx-auto mt-4 block h-px w-12 bg-accent" />
        <div className="mt-6 space-y-3 text-lg leading-relaxed text-muted">
          {ABOUT.text.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        {ABOUT.placeholder && <p className="mt-4 text-xs text-muted">טקסט זמני לאישור</p>}
      </div>
    </section>
  );
}
