import { createHmac, randomBytes } from "node:crypto";

/**
 * חיבור לטרנזילה (DirectNG iframe) – רץ רק בשרת.
 * לפי https://docs.tranzila.com/docs/payments-and-billing/iframe-integration-directng
 *
 * משתני סביבה ב־Netlify (לא בקוד!):
 *   TRANZILA_TERMINAL   – שם המסוף (חובה כדי שהתשלום יפעל)
 *   TRANZILA_APP_KEY    – מפתח API ציבורי   } לא חובה. אם שניהם קיימים – הסכום ננעל
 *   TRANZILA_SECRET     – מפתח API סודי     } מראש בטרנזילה (Handshake), וכך אי אפשר לשנות אותו.
 */

export const tranzilaTerminal = () => process.env.TRANZILA_TERMINAL?.trim() || null;
const apiKeys = () => {
  const appKey = process.env.TRANZILA_APP_KEY?.trim();
  const secret = process.env.TRANZILA_SECRET?.trim();
  return appKey && secret ? { appKey, secret } : null;
};

/** נעילת הסכום (Handshake V2). מחזיר thtk, או null אם אין מפתחות API. */
export async function createHandshake(terminal: string, sum: number, params: Record<string, string>) {
  const keys = apiKeys();
  if (!keys) return null;
  const time = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(40).toString("hex");
  const token = createHmac("sha256", keys.secret + time + nonce).update(keys.appKey).digest("hex");
  const res = await fetch("https://api.tranzila.com/v2/handshake/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-tranzila-api-app-key": keys.appKey,
      "X-tranzila-api-request-time": time,
      "X-tranzila-api-nonce": nonce,
      "X-tranzila-api-access-token": token,
    },
    body: JSON.stringify({ terminal_name: terminal, sum, request_params: params }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error_code?: number; message?: string; thtk?: string };
  if (!res.ok || data.error_code !== 0 || !data.thtk) {
    throw new Error(`handshake failed: ${res.status} ${data.error_code ?? ""} ${data.message ?? ""}`);
  }
  return data.thtk;
}

export const iframeAction = (terminal: string) => `https://directng.tranzila.com/${encodeURIComponent(terminal)}/iframenew.php`;
