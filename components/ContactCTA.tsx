import { whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "./Icons";

export default function ContactCTA() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink text-bg">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center px-5 py-14 text-center md:py-20">
        <p className="eyebrow !text-accent">הצעת מחיר אישית</p>
        <h2 id="contact-title" className="t-h2 mt-3 max-w-[22ch]">
          מתכננים אירוע? נשמח ללוות אתכם בכל פרט
        </h2>
        <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-bg/75 md:text-[1.1rem]">
          שלחו לנו הודעה בוואטסאפ עם סוג האירוע והתאריך, ונחזור אליכם עם רעיונות והצעת מחיר.
        </p>
        <a
          href={whatsappLink("שלום MIALOR, אשמח לקבל הצעת מחיר לאירוע")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-light mt-8 min-w-[260px]"
        >
          <IconWhatsApp className="h-[18px] w-[18px]" />
          לקבלת הצעת מחיר בוואטסאפ
        </a>
      </div>
    </section>
  );
}
