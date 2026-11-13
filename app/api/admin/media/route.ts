import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { blobStore } from "@/lib/blobstore";
import { isAdminRequest } from "@/lib/orders";

/** העלאת תמונת מוצר (הדפדפן כבר מקטין ודוחס אותה ל-JPEG) */
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "לא מחוברת." }, { status: 401 });
  const type = req.headers.get("content-type") || "";
  if (!/^image\/(jpeg|png|webp)$/.test(type)) return NextResponse.json({ error: "סוג קובץ לא נתמך." }, { status: 400 });
  const data = await req.arrayBuffer();
  if (data.byteLength < 1000 || data.byteLength > 4_500_000) return NextResponse.json({ error: "הקובץ גדול מדי." }, { status: 413 });
  const ext = type.endsWith("png") ? "png" : type.endsWith("webp") ? "webp" : "jpg";
  const file = `${randomUUID()}.${ext}`;
  await (await blobStore("media")).setBytes(file, data, type);
  return NextResponse.json({ url: `/media/${file}` });
}
