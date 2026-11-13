import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, passwordMatches, sessionToken } from "@/lib/orders";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "עוד לא הוגדרה סיסמה לניהול (ADMIN_PASSWORD ב-Netlify, לפחות 8 תווים)." }, { status: 503 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  await new Promise((r) => setTimeout(r, 600)); // האטה נגד ניחושים
  if (typeof password !== "string" || !passwordMatches(password)) {
    return NextResponse.json({ error: "סיסמה שגויה." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
