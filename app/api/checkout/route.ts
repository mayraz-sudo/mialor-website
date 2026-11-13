import { NextResponse } from "next/server";
import { SHOP, cartTotals, type CartLine, type Delivery } from "@/lib/shop";

/**
 * יצירת תשלום בטרנזילה.
 * הסכום מחושב כאן בשרת לפי המחירים שבקובץ lib/shop.ts – לא לפי מה שהדפדפן שולח.
 *
 * ⚠️ החיבור לטרנזילה יושלם לפי מסמך ההוראות שלהם (iframe + נעילת סכום).
 * עד אז הנתיב מחזיר הודעה שהתשלום עוד לא מחובר.
 * פרטי המסוף והסיסמה יוגדרו כמשתני סביבה ב־Netlify (לא בקוד):
 *   TRANZILA_TERMINAL – שם המסוף
 *   TRANZILA_PW       – סיסמה / מפתח לנעילת הסכום
 */
export async function POST(req: Request) {
  let body: { lines?: CartLine[]; delivery?: Delivery; customer?: Record<string, string> };
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

  if (!SHOP.enabled || !process.env.TRANZILA_TERMINAL) {
    return NextResponse.json(
      { error: "התשלום באשראי יחובר בקרוב. בינתיים אפשר להזמין דרך הוואטסאפ." },
      { status: 503 },
    );
  }

  // כאן ייבנה הקישור לדף התשלום של טרנזילה, עם הסכום הנעול (totals.total).
  return NextResponse.json({ error: "התשלום באשראי יחובר בקרוב." }, { status: 503 });
}
