import { recordPayment } from "@/lib/payment-result";

/**
 * טרנזילה שולחת לכאן (מאחורי הקלעים) את פרטי כל עסקה.
 * ההזמנה מתעדכנת במערכת הניהול (/admin) כ"שולם" או "נכשל".
 */
export async function POST(req: Request) {
  let p = new URLSearchParams();
  try {
    const form = await req.formData();
    p = new URLSearchParams([...form].map(([k, v]) => [k, String(v)] as [string, string]));
  } catch {}
  const ok = p.get("Response") === "000";
  try {
    const o = await recordPayment(p, new URL(req.url).searchParams.get("o"));
    console.log(`[tranzila notify] ${ok ? "OK" : `FAIL ${p.get("Response") ?? ""}`} ₪${p.get("sum") ?? "?"} order=${o?.id ?? "?"}${o?.payment?.mismatch ? " SUM MISMATCH" : ""}`);
  } catch (err) {
    console.error("[tranzila notify]", err);
  }
  return new Response("OK");
}
export const GET = () => new Response("OK");
