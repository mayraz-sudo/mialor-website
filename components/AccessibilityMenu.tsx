"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * תפריט נגישות: גודל טקסט, ניגודיות גבוהה, הדגשת קישורים, גופן קריא, עצירת תנועה והקראה.
 * ההקראה משתמשת במנוע הדיבור המובנה במכשיר (Web Speech API) – בלי שירות חיצוני ובלי עלות.
 * ההגדרות נשמרות במכשיר של המשתמש.
 */

type Settings = { text: 0 | 1 | 2; contrast: boolean; links: boolean; readable: boolean; noMotion: boolean };
const DEFAULTS: Settings = { text: 0, contrast: false, links: false, readable: false, noMotion: false };
const KEY = "mialor-a11y";

function apply(s: Settings) {
  const h = document.documentElement;
  h.classList.toggle("a11y-text-1", s.text === 1);
  h.classList.toggle("a11y-text-2", s.text === 2);
  h.classList.toggle("a11y-contrast", s.contrast);
  h.classList.toggle("a11y-links", s.links);
  h.classList.toggle("a11y-readable", s.readable);
  h.classList.toggle("a11y-nomotion", s.noMotion);
  document.querySelectorAll("video").forEach((v) => (s.noMotion ? v.pause() : v.play().catch(() => {})));
}

/** מחלק טקסט ארוך לקטעים קצרים – חלק מהדפדפנים קוטעים הקראה ארוכה */
function chunks(text: string) {
  const parts = text.replace(/\s+/g, " ").match(/[^.!?״"\n]+[.!?״"]*/g) ?? [];
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > 180 && cur) {
      out.push(cur.trim());
      cur = "";
    }
    cur += p + " ";
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** טקסט העמוד להקראה: כותרות, פסקאות ופריטי רשימה – בלי אפשרויות של רשימות בחירה ושדות טופס */
function pageText() {
  const main = document.getElementById("main") ?? document.body;
  const SEL = "h1,h2,h3,p,li,dt,dd,label,legend,figcaption,blockquote,summary";
  const els = [...main.querySelectorAll<HTMLElement>(SEL)].filter(
    (el) =>
      el.offsetParent !== null &&
      !el.closest('[aria-hidden="true"], select, [aria-label="מיקום בעמוד"]') &&
      !el.parentElement?.closest(SEL),
  );
  return els
    .map((el) => el.innerText.trim())
    .filter(Boolean)
    .map((t) => (/[.!?:]$/.test(t) ? t : `${t}.`))
    .join(" ");
}

const Icon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="4" r="2" />
    <path d="M20 8.5c0 .6-.4 1-1 1.1l-4.5.6V13l1.9 6.7a1.1 1.1 0 0 1-2.1.6L12.6 15h-1.2l-1.7 5.3a1.1 1.1 0 0 1-2.1-.6L9.5 13v-2.8L5 9.6a1.1 1.1 0 0 1 .3-2.2l5.2.6h3l5.2-.6c.7-.1 1.3.4 1.3 1.1Z" />
  </svg>
);

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [speaking, setSpeaking] = useState(false);
  const [notice, setNotice] = useState("");
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // טעינת הגדרות שמורות
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) {
        const merged = { ...DEFAULTS, ...saved };
        setS(merged);
        apply(merged);
      }
    } catch {}
  }, []);

  const update = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);
    apply(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const read = () => {
    if (!("speechSynthesis" in window)) {
      setNotice("הדפדפן הזה לא תומך בהקראה. אפשר להשתמש בהקראה המובנית בטלפון או בקורא מסך.");
      return;
    }
    stop();
    const selected = window.getSelection()?.toString().trim();
    const text = selected || pageText();
    const voices = window.speechSynthesis.getVoices();
    const he = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("he"));
    if (voices.length > 0 && !he) {
      setNotice("לא נמצא קול בעברית במכשיר הזה, ולכן ההקראה עשויה להישמע לא ברורה. אפשר להוסיף קול עברי בהגדרות הנגישות של המכשיר.");
    } else {
      setNotice(selected ? "מקריא את הטקסט שסימנתם." : "מקריא את העמוד. כדי להקריא קטע מסוים – סמנו אותו ולחצו שוב.");
    }
    const parts = chunks(text);
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p);
      u.lang = "he-IL";
      try {
        if (he) u.voice = he;
      } catch {
        // אם הדפדפן לא מקבל את הקול – ממשיכים עם קול ברירת המחדל בעברית
      }
      u.rate = 0.95;
      if (i === parts.length - 1) u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    });
    setSpeaking(true);
  };

  // עצירת הקראה במעבר עמוד
  useEffect(() => stop, [stop]);

  // סגירה ב־Escape והחזרת המיקוד לכפתור
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = "flex min-h-12 w-full items-center justify-between gap-3 rounded-[2px] border border-line bg-surface px-3.5 text-right text-[0.95rem] transition-colors hover:border-accent aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg";
  const Check = ({ on }: { on: boolean }) => (
    <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full border ${on ? "border-bg" : "border-line"}`}>
      {on && "✓"}
    </span>
  );

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        className="fixed right-3.5 bottom-[max(0.875rem,env(safe-area-inset-bottom))] z-40 grid h-11 w-11 place-items-center rounded-full bg-ink text-bg shadow-[0_6px_18px_-6px_rgba(58,42,32,0.5)] ring-1 ring-bg/40 transition-colors hover:bg-ink-hover md:right-5 md:bottom-5 md:h-12 md:w-12"
      >
        <Icon />
      </button>

      {open && (
        <div
          ref={panel}
          id="a11y-panel"
          role="dialog"
          aria-label="תפריט נגישות"
          className="fixed right-3.5 bottom-[calc(max(0.875rem,env(safe-area-inset-bottom))+3.5rem)] z-[80] max-h-[min(80vh,620px)] w-[min(340px,calc(100vw-1.75rem))] overflow-y-auto rounded-[2px] border border-line bg-bg p-4 text-ink shadow-[0_18px_50px_-18px_rgba(58,42,32,0.45)] md:right-5 md:bottom-20"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-[1.3rem]">נגישות</h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                button.current?.focus();
              }}
              aria-label="סגירת תפריט הנגישות"
              className="grid h-10 w-10 place-items-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          {/* הקראה */}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={read} className={toggle} aria-pressed={speaking}>
              הקראה
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
              </svg>
            </button>
            <button type="button" onClick={stop} disabled={!speaking} className={`${toggle} disabled:opacity-40`}>
              עצירה
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          </div>
          {notice && (
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted" role="status">
              {notice}
            </p>
          )}

          {/* גודל טקסט */}
          <div className="mt-4">
            <p className="mb-2 text-[0.9rem] font-medium" id="a11y-text-label">
              גודל טקסט
            </p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="a11y-text-label">
              {(["רגיל", "גדול", "גדול מאוד"] as const).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={s.text === i}
                  onClick={() => update({ text: i as Settings["text"] })}
                  className={`${toggle} justify-center px-2 whitespace-nowrap`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <button type="button" aria-pressed={s.contrast} onClick={() => update({ contrast: !s.contrast })} className={toggle}>
              ניגודיות גבוהה <Check on={s.contrast} />
            </button>
            <button type="button" aria-pressed={s.links} onClick={() => update({ links: !s.links })} className={toggle}>
              הדגשת קישורים <Check on={s.links} />
            </button>
            <button type="button" aria-pressed={s.readable} onClick={() => update({ readable: !s.readable })} className={toggle}>
              גופן קריא <Check on={s.readable} />
            </button>
            <button type="button" aria-pressed={s.noMotion} onClick={() => update({ noMotion: !s.noMotion })} className={toggle}>
              עצירת אנימציות וסרטונים <Check on={s.noMotion} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-[0.9rem]">
            <button type="button" onClick={() => update(DEFAULTS)} className="min-h-10 underline decoration-accent underline-offset-4">
              איפוס הגדרות
            </button>
            <Link href="/accessibility" onClick={() => setOpen(false)} className="min-h-10 py-2 underline decoration-accent underline-offset-4">
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
