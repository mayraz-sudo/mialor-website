import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

/** סיכום הזמנה לעמוד התודה (לפיקסל): סכום ומזהי מוצרים בלבד – בלי פרטים אישיים */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("o") || "";
  if (!/^M\d{6}-[A-F0-9]{4}$/.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const o = await getOrder(id).catch(() => null);
  if (!o) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(
    { paid: o.pay === "paid", total: o.total, ids: o.items.map((i) => i.id), items: o.items.reduce((a, i) => a + i.qty, 0) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
