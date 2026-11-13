import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cartTotals, perLabel, type CartLine, type Delivery } from "@/lib/shop";
import { createHandshake, iframeAction, tranzilaTerminal } from "@/lib/tranzila";
import { saveOrder } from "@/lib/orders";

/**
 * פתיחת תשלום בטרנזילה.
 * הסכום מחושב כאן בשרת לפי המחירים שבקובץ lib/shop.ts – לא לפי מה שהדפדפן שולח.
 * מחזיר לדפדפן את כתובת דף התשלום ואת השדות לשליחה (POST) לתוך ה־iframe.
 */
const clean = (v: unknown, max = 120) =>
  (typeof v === "string" ? v : "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

export async function POST(req: Request) {
  let body: { lines?: CartLine[]; delivery?: Delivery; customer?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });
  }

  const lines = Array.isArray(body.lines) ? body.lines.filter((l) => typeof l?.id === "string" && Number.isFinite(l?.qty)) : [];
  const delivery: Delivery = body.delivery === "post" ? "post" : "pickup";
  const totals = cartTotals(lines, delivery);
  if (!totals.rows.length) return NextResponse.json({ error: "הסל ריק." }, { status: 400 });
  if (totals.total === null) return NextResponse.json({ error: "מחיר המשלוח עוד לא נקבע. אפשר לבחור איסוף עצמי." }, { status: 400 });

  const c = body.customer ?? {};
  const customer = {
    name: clean(c.name, 80),
    phone: clean(c.phone, 20).replace(/[^\d+]/g, ""),
    email: clean(c.email, 100),
    address: clean(c.address, 120),
    city: clean(c.city, 60),
    zip: clean(c.zip, 10).replace(/\D/g, ""),
    notes: clean(c.notes, 300),
  };
  if (!customer.name || !/^0\d{8,9}$/.test(customer.phone)) return NextResponse.json({ error: "נא למלא שם וטלפון תקין." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return NextResponse.json({ error: "נא למלא כתובת מייל תקינה (לאישור ההזמנה)." }, { status: 400 });
  if (delivery === "post" && (!customer.address || !customer.city)) return NextResponse.json({ error: "נא למלא כתובת ועיר למשלוח." }, { status: 400 });

  const terminal = tranzilaTerminal();
  if (!terminal) {
    return NextResponse.json({ error: "התשלום באשראי יחובר בקרוב. בינתיים אפשר להזמין דרך הוואטסאפ." }, { status: 503 });
  }

  // מספר הזמנה קצר, כדי לזהות את ההזמנה בטרנזילה
  const d = new Date();
  const orderId = `M${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${randomBytes(2).toString("hex").toUpperCase()}`;
  const items = totals.rows.map((r) => `${r.item.name} ×${r.qty}${r.item.per ? ` (${perLabel(r.item)})` : ""}`).join(", ");
  const deliveryText = delivery === "post" ? `משלוח בדואר ישראל: ${customer.address}, ${customer.city}` : "איסוף עצמי מחולון";
  const sum = totals.total;

  const base = (process.env.URL || new URL(req.url).origin).replace(/\/$/, "");
  const fields: Record<string, string> = {
    sum: sum.toFixed(2),
    currency: "1",
    tranmode: "A",
    cred_type: "1",
    lang: "il",
    contact: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: delivery === "post" ? customer.address : "",
    city: delivery === "post" ? customer.city : "",
    zip: customer.zip,
    country: "ישראל",
    pdesc: `הזמנה ${orderId}: ${items}`.slice(0, 250),
    remarks: [deliveryText, customer.notes && `הערות: ${customer.notes}`].filter(Boolean).join(" | ").slice(0, 250),
    success_url_address: `${base}/api/tranzila/return?r=ok&o=${orderId}`,
    fail_url_address: `${base}/api/tranzila/return?r=fail&o=${orderId}`,
    notify_url_address: `${base}/api/tranzila/notify?o=${orderId}`,
    nologo: "1",
    trButtonColor: "3a2a20",
    trBgColor: "fffdfa",
    trTextColor: "3a2a20",
    buttonLabel: "לתשלום",
  };

  try {
    const thtk = await createHandshake(terminal, Number(fields.sum), { order: orderId });
    if (thtk) {
      fields.thtk = thtk;
      fields.new_process = "1";
    }
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "לא הצלחנו לפתוח את דף התשלום. נסו שוב בעוד רגע או כתבו לנו בוואטסאפ." }, { status: 502 });
  }

  // שמירת ההזמנה במערכת הניהול (ממתינה לתשלום עד שטרנזילה מאשרת)
  const now = new Date().toISOString();
  try {
    await saveOrder({
      id: orderId,
      createdAt: now,
      updatedAt: now,
      items: totals.rows.map((r) => ({ id: r.item.id, name: r.item.name, qty: r.qty, price: r.item.price, per: perLabel(r.item) || undefined, sum: r.sum })),
      subtotal: totals.subtotal,
      shipping: totals.shipping ?? 0,
      total: sum,
      delivery,
      customer,
      pay: "pending",
      stage: "new",
    });
  } catch (err) {
    console.error("[checkout] could not save order", orderId, err);
  }

  console.log(`[checkout] ${orderId} ₪${fields.sum} – ${items} – ${deliveryText}`);
  return NextResponse.json({ orderId, action: iframeAction(terminal), fields });
}
