import { NextResponse } from "next/server";
import { cleanItem, getCatalog, saveCatalog } from "@/lib/catalog";
import { isAdminRequest } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  return NextResponse.json({ items: await getCatalog() }, { headers: { "Cache-Control": "no-store" } });
}

/** שמירת כל רשימת המוצרים (כולל הסדר). מזהה של מוצר קיים לא משתנה. */
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { items?: unknown[] } | null;
  if (!body || !Array.isArray(body.items) || body.items.length > 300) return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });
  const items = body.items.map(cleanItem);
  const bad = items.findIndex((i) => !i);
  if (bad >= 0) return NextResponse.json({ error: `מוצר מספר ${bad + 1} לא תקין: צריך שם ומחיר.` }, { status: 400 });
  const ids = new Set<string>();
  for (const i of items) {
    if (ids.has(i!.id)) return NextResponse.json({ error: "יש שני מוצרים עם אותו מזהה." }, { status: 400 });
    ids.add(i!.id);
  }
  await saveCatalog(items as NonNullable<(typeof items)[number]>[]);
  return NextResponse.json({ ok: true, items });
}
