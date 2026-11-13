/**
 * טרנזילה שולחת לכאן (מאחורי הקלעים) את פרטי כל עסקה.
 * כרגע רושם ביומן של Netlify (Logs → Functions). פרטי ההזמנה המלאים מופיעים גם בממשק של טרנזילה.
 */
export async function POST(req: Request) {
  let p = new URLSearchParams();
  try {
    const form = await req.formData();
    p = new URLSearchParams([...form].map(([k, v]) => [k, String(v)] as [string, string]));
  } catch {}
  const ok = p.get("Response") === "000";
  console.log(
    `[tranzila notify] ${ok ? "OK" : `FAIL ${p.get("Response") ?? ""}`} ₪${p.get("sum") ?? "?"} index=${p.get("index") ?? ""} – ${p.get("pdesc") ?? ""}`,
  );
  return new Response("OK");
}
export const GET = () => new Response("OK");
