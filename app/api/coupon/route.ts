import { NextResponse } from "next/server";
import { couponProblem } from "@/lib/coupons";
import { findCoupon } from "@/lib/coupon-store";

/** בדיקת קוד קופון מהסל (החישוב הסופי נעשה שוב בתשלום) */
export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };
  await new Promise((r) => setTimeout(r, 400)); // האטה נגד ניחוש קודים
  const c = await findCoupon(code ?? "");
  const problem = couponProblem(c);
  if (problem || !c) return NextResponse.json({ error: problem }, { status: 400 });
  return NextResponse.json({ coupon: { code: c.code, kind: c.kind, value: c.value } });
}
