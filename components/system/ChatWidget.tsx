"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/lib/site";
import { IconWhatsApp } from "@/components/Icons";

/**
 * צ'אט באתר. ההודעות נכנסות למסך "שיחות" במערכת הניהול; עונים הבוט או מאי.
 * מזהה המבקרת הוא מספר אקראי שנשמר בדפדפן שלה בלבד.
 */
type Msg = { id: string; from: "visitor" | "mialor"; text: string; at: string; pending?: boolean };

const STORE = "mialor_chat_visitor";
const hex = (bytes: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, "0")).join("");

function visitorId() {
  try {
    let v = localStorage.getItem(STORE);
    if (!v || !/^[a-f0-9]{32}$/.test(v)) {
      v = hex(16);
      localStorage.setItem(STORE, v);
    }
    return v;
  } catch {
    return hex(16); // בלי אחסון – הצ'אט עובד רק לביקור הנוכחי
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const visitor = useRef<string>("");
  const listRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    if (!visitor.current) return;
    try {
      const res = await fetch(`/api/chat?visitor=${visitor.current}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { messages: Msg[] };
      setMessages((prev) => {
        const server = data.messages ?? [];
        // הודעות שנשלחו ועוד לא הגיעו מהשרת נשארות מוצגות
        const stillPending = prev.filter((m) => m.pending && !server.some((s) => s.from === "visitor" && s.text === m.text));
        return [...server, ...stillPending];
      });
    } catch {}
  }, []);

  useEffect(() => {
    visitor.current = visitorId();
  }, []);

  // בזמן שהחלון פתוח – בודקים תשובות חדשות כל 4 שניות
  useEffect(() => {
    if (!open) return;
    load();
    const t = setInterval(load, 4000);
    inputRef.current?.focus();
    return () => clearInterval(t);
  }, [open, load]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    const id = crypto.randomUUID();
    setText("");
    setError("");
    setMessages((m) => [...m, { id, from: "visitor", text: t, at: new Date().toISOString(), pending: true }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitor: visitor.current, text: t, message_id: id }),
      });
      if (!res.ok) throw new Error();
      setTimeout(load, 1500);
    } catch {
      setError("ההודעה לא נשלחה. אפשר לנסות שוב או לכתוב לנו בוואטסאפ.");
      setMessages((m) => m.filter((x) => x.id !== id));
      setText(t);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mialor-chat"
        aria-label={open ? "סגירת הצ'אט" : "צ'אט עם MIALOR"}
        className="fixed bottom-[calc(max(0.875rem,env(safe-area-inset-bottom))+3.5rem)] left-3.5 z-40 grid h-11 w-11 place-items-center rounded-full bg-ink text-bg shadow-[0_6px_18px_-6px_rgba(58,42,32,0.5)] ring-1 ring-bg/40 transition-colors hover:bg-ink-hover md:bottom-5 md:left-5 md:h-12 md:w-12"
      >
        {open ? (
          <span aria-hidden className="text-lg leading-none">✕</span>
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5z" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <section
          id="mialor-chat"
          role="dialog"
          aria-label="צ'אט עם MIALOR"
          className="fixed bottom-[calc(max(0.875rem,env(safe-area-inset-bottom))+7rem)] left-3.5 z-[80] flex h-[min(70vh,520px)] w-[min(360px,calc(100vw-1.75rem))] flex-col rounded-[2px] border border-line bg-bg text-ink shadow-[0_18px_50px_-18px_rgba(58,42,32,0.45)] md:bottom-20 md:left-5"
        >
          <header className="border-b border-line px-4 py-3">
            <p className="font-serif text-[1.15rem] leading-tight">MIALOR</p>
            <p className="text-[0.82rem] text-muted">שאלות על מארזים, מחירים וזמינות – נענה כאן בהקדם</p>
          </header>

          <ol ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3" aria-live="polite">
            <li className="max-w-[85%] rounded-[2px] bg-bg-alt px-3 py-2 text-[0.95rem]">
              היי! 👋 איך אפשר לעזור? ספרי לנו על האירוע, התאריך והכמות – ונחזור עם הצעה.
            </li>
            {messages.map((m) => (
              <li
                key={m.id}
                className={`max-w-[85%] whitespace-pre-wrap rounded-[2px] px-3 py-2 text-[0.95rem] ${
                  m.from === "visitor" ? "mr-auto bg-ink text-bg" : "bg-bg-alt"
                } ${m.pending ? "opacity-70" : ""}`}
              >
                {m.text}
              </li>
            ))}
          </ol>

          {error && (
            <p role="alert" className="px-4 pb-1 text-[0.85rem] text-[#9b3b2a]">
              {error}
            </p>
          )}

          <form onSubmit={send} className="flex items-end gap-2 border-t border-line p-3">
            <label htmlFor="mialor-chat-input" className="sr-only">
              הודעה
            </label>
            <textarea
              id="mialor-chat-input"
              ref={inputRef}
              rows={1}
              maxLength={1000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="כתבי הודעה…"
              className="max-h-28 min-h-11 flex-1 resize-none rounded-[2px] border border-line bg-surface px-3 py-2.5 text-[1rem] focus:border-accent focus:outline-none"
            />
            <button type="submit" className="btn btn-primary h-11 shrink-0 px-4" disabled={!text.trim()}>
              שליחה
            </button>
          </form>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border-t border-line py-2 text-[0.85rem] text-muted hover:text-ink"
          >
            <IconWhatsApp className="h-[15px] w-[15px]" />
            מעדיפה וואטסאפ? לחצי כאן
          </a>
        </section>
      )}
    </>
  );
}
