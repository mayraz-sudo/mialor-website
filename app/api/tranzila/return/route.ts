/**
 * טרנזילה מחזירה לכאן את הלקוח בסוף התשלום (בתוך ה־iframe).
 * הדף רק מוציא את הלקוח מה־iframe לדף "תודה" או "התשלום לא עבר".
 */
async function handle(req: Request) {
  const url = new URL(req.url);
  let params = url.searchParams;
  if (req.method === "POST") {
    try {
      const form = await req.formData();
      params = new URLSearchParams([...url.searchParams, ...[...form].map(([k, v]) => [k, String(v)] as [string, string])]);
    } catch {}
  }
  const ok = url.searchParams.get("r") === "ok" && params.get("Response") === "000";
  const code = (params.get("Response") || "").replace(/\D/g, "").slice(0, 6);
  const target = ok ? "/shop/thanks" : `/shop/failed${code ? `?code=${code}` : ""}`;
  const html = `<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><title>MIALOR</title>
<body style="font-family:sans-serif;text-align:center;padding:40px;color:#3a2a20">
<p>${ok ? "התשלום התקבל, מעבירים אתכם…" : "מעבירים אתכם…"}</p>
<p><a href="${target}" target="_top">להמשך</a></p>
<script>try{window.top.location.href=${JSON.stringify(target)}}catch(e){location.href=${JSON.stringify(target)}}</script>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
export const GET = handle;
export const POST = handle;
