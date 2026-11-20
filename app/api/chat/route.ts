import { systemConfigured } from "@/lib/mialor-system";

/**
 * צ'אט באתר ↔ מערכת הניהול (הבוט / מאי עונים מתוך מסך "שיחות").
 * הדפדפן מדבר רק עם האתר; המפתח הסודי נשאר בשרת.
 */
const VISITOR = /^[a-f0-9]{32,64}$/;
const base = () => process.env.MIALOR_SYSTEM_URL!.trim().replace(/\/+$/, "");
const key = () => process.env.MIALOR_INGEST_SECRET!.trim();

export async function POST(req: Request) {
  if (!systemConfigured()) return Response.json({ error: "chat unavailable" }, { status: 503 });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const visitor = String(b.visitor ?? "");
  const text = String(b.text ?? "").trim().slice(0, 1000);
  const messageId = String(b.message_id ?? "");
  if (!VISITOR.test(visitor) || !text || !/^[a-f0-9-]{8,64}$/.test(messageId)) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  try {
    const res = await fetch(`${base()}/api/public/chat`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-mialor-key": key() },
      body: JSON.stringify({ visitor, text, message_id: messageId }),
      signal: AbortSignal.timeout(8000),
    });
    return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}

export async function GET(req: Request) {
  if (!systemConfigured()) return Response.json({ messages: [] });
  const visitor = new URL(req.url).searchParams.get("visitor") ?? "";
  if (!VISITOR.test(visitor)) return Response.json({ error: "bad request" }, { status: 400 });
  try {
    const res = await fetch(`${base()}/api/public/chat?visitor=${visitor}`, {
      headers: { "x-mialor-key": key() },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return Response.json({ messages: [] }, { status: 502 });
    return Response.json(await res.json(), { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ messages: [] }, { status: 502 });
  }
}
