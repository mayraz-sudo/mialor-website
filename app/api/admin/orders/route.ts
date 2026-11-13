import { NextResponse } from "next/server";
import { isAdminRequest, listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  return NextResponse.json({ orders: await listOrders() }, { headers: { "Cache-Control": "no-store" } });
}
