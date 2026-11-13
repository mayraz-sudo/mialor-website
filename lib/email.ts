import type { Order } from "@/lib/orders";
import { SITE } from "@/lib/site";

/**
 * מיילים אחרי תשלום מוצלח – דרך Resend (resend.com).
 * פועל רק כשמוגדר ב-Netlify:  RESEND_API_KEY
 * לא חובה:  MAIL_FROM  (ברירת מחדל: "MIALOR <orders@mialorshop.com>" – הדומיין צריך להיות מאומת ב-Resend)
 *           ORDERS_EMAIL (לאן נשלחת התראה על הזמנה חדשה; ברירת מחדל: המייל של העסק)
 */

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const money = (n: number) => `₪${n.toLocaleString("he-IL", { maximumFractionDigits: 2 })}`;

function orderTable(o: Order) {
  const rows = o.items
    .map((i) => `<tr><td style="padding:6px 0">${esc(i.name)} ×${i.qty}${i.per ? ` <span style="color:#8a7a6a">(${money(i.price)} ${esc(i.per)})</span>` : ""}</td><td style="padding:6px 0;text-align:left">${money(i.sum)}</td></tr>`)
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:15px">${rows}
<tr><td style="padding:6px 0;color:#8a7a6a">משלוח</td><td style="padding:6px 0;text-align:left;color:#8a7a6a">${o.shipping ? money(o.shipping) : "חינם"}</td></tr>
<tr><td style="padding:8px 0;border-top:1px solid #e6dccf;font-weight:bold">סה״כ שולם</td><td style="padding:8px 0;border-top:1px solid #e6dccf;text-align:left;font-weight:bold">${money(o.total)}</td></tr></table>`;
}

const wrap = (body: string) => `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;background:#faf6f0">
<div style="max-width:560px;margin:0 auto;padding:28px 22px;font-family:Arial,Helvetica,sans-serif;color:#3a2a20;direction:rtl;text-align:right;line-height:1.6">
<p style="font-size:22px;letter-spacing:2px;margin:0 0 18px;text-align:center">MIALOR · מיאלור</p>${body}
<p style="margin-top:28px;font-size:13px;color:#8a7a6a;text-align:center">mialorshop.com · וואטסאפ ${SITE.whatsappDisplay}</p></div></body></html>`;

const deliveryLine = (o: Order) =>
  o.delivery === "post" ? `משלוח בדואר ישראל ל: ${esc(o.customer.address)}, ${esc(o.customer.city)}` : "איסוף עצמי מחולון (נתאם איתך מועד)";

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || !to) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM?.trim() || "MIALOR <orders@mialorshop.com>",
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) console.error("[email] send failed", res.status, await res.text().catch(() => ""));
}

/** אישור ללקוחה + התראה לעסק. לא זורק שגיאות – תשלום לא ייכשל בגלל מייל. */
export async function sendOrderEmails(o: Order) {
  if (!process.env.RESEND_API_KEY) return;
  const c = o.customer;
  const tasks: Promise<void>[] = [];
  if (c.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) {
    tasks.push(
      send(
        c.email,
        `תודה על ההזמנה! (${o.id})`,
        wrap(`<p style="font-size:18px">היי ${esc(c.name)}, תודה רבה על ההזמנה 🤍</p>
<p>התשלום התקבל בהצלחה. מספר ההזמנה: <b>${o.id}</b></p>${orderTable(o)}
<p style="margin-top:16px">${deliveryLine(o)}</p>
<p>ניצור איתך קשר בקרוב. לכל שאלה אפשר להשיב למייל הזה או לכתוב לנו בוואטסאפ.</p><p>באהבה, מאי</p>`),
        SITE.email,
      ),
    );
  }
  tasks.push(
    send(
      process.env.ORDERS_EMAIL?.trim() || SITE.email,
      `הזמנה חדשה ששולמה: ${money(o.total)} – ${c.name}`,
      wrap(`<p style="font-size:18px">הזמנה חדשה באתר 🎉 (${o.id})</p>
<p><b>${esc(c.name)}</b> · ${esc(c.phone)}${c.email ? ` · ${esc(c.email)}` : ""}</p>
<p>${deliveryLine(o)}</p>${c.notes ? `<p>הערות: ${esc(c.notes)}</p>` : ""}${orderTable(o)}
<p style="margin-top:16px"><a href="https://mialorshop.com/admin" style="color:#3a2a20">לכל ההזמנות במערכת הניהול</a></p>`),
      c.email || undefined,
    ),
  );
  for (const r of await Promise.allSettled(tasks)) if (r.status === "rejected") console.error("[email] send error", r.reason);
}
