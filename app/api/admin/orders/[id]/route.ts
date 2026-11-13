import { NextResponse } from "next/server";
import { isAdminRequest, updateOrder, type Stage } from "@/lib/orders";

const STAGES: Stage[] = ["new", "in_progress", "ready", "sent", "picked_up", "cancelled"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { stage?: string; adminNote?: string };
  const patch: { stage?: Stage; adminNote?: string } = {};
  if (body.stage && STAGES.includes(body.stage as Stage)) patch.stage = body.stage as Stage;
  if (typeof body.adminNote === "string") patch.adminNote = body.adminNote.slice(0, 1000);
  const order = await updateOrder(id, patch);
  if (!order) return NextResponse.json({ error: "ההזמנה לא נמצאה." }, { status: 404 });
  return NextResponse.json({ order });
}
