import { NextResponse } from "next/server";
import { cleanCoupon, listCoupons, saveCoupons } from "@/lib/coupon-store";
import { isAdminRequest } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  return NextResponse.json({ coupons: await listCoupons() }, { headers: { "Cache-Control": "no-store" } });
}

/** שמירת כל רשימת הקופונים. מספר השימושים נשמר מהשרת ולא מהדפדפן. */
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { coupons?: unknown[] } | null;
  if (!body || !Array.isArray(body.coupons) || body.coupons.length > 500) return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });
  const prev = await listCoupons();
  const out = [];
  const seen = new Set<string>();
  for (const raw of body.coupons) {
    const code = typeof (raw as { code?: unknown })?.code === "string" ? String((raw as { code: string }).code).toUpperCase() : "";
    const c = cleanCoupon(raw, prev.find((p) => p.code === code));
    if (!c) return NextResponse.json({ error: "קופון לא תקין: צריך קוד (לפחות 3 תווים באנגלית או ספרות) וסכום." }, { status: 400 });
    if (seen.has(c.code)) return NextResponse.json({ error: `הקוד ${c.code} כבר קיים.` }, { status: 400 });
    seen.add(c.code);
    out.push(c);
  }
  await saveCoupons(out);
  return NextResponse.json({ ok: true, coupons: out });
}
