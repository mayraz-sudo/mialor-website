import { getOrder, saveOrder } from "@/lib/orders";
import { sendOrderEmails } from "@/lib/email";

/** עדכון סטטוס התשלום של הזמנה לפי מה שטרנזילה שלחה */
export async function recordPayment(params: URLSearchParams, orderIdHint: string | null) {
  const fromDesc = (params.get("pdesc") || "").match(/M\d{6}-[A-F0-9]{4}/)?.[0] ?? null;
  const id = (orderIdHint && /^M\d{6}-[A-F0-9]{4}$/.test(orderIdHint) ? orderIdHint : null) ?? fromDesc;
  if (!id) return null;
  const order = await getOrder(id);
  if (!order) return null;
  const response = (params.get("Response") || "").slice(0, 6);
  const ok = response === "000";
  if (order.pay === "paid" && !ok) return order; // לא דורסים תשלום שכבר אושר
  const paidSum = params.get("sum") || "";
  const mismatch = ok && Math.abs(Number(paidSum) - order.total) > 0.009;
  const next = {
    ...order,
    pay: ok ? ("paid" as const) : ("failed" as const),
    payment: {
      index: (params.get("index") || params.get("transaction_id") || order.payment?.index || "").slice(0, 20) || undefined,
      last4: (params.get("ccno") || "").replace(/\D/g, "").slice(-4) || order.payment?.last4,
      response,
      sum: paidSum || undefined,
      at: new Date().toISOString(),
      mismatch,
    },
  };
  await saveOrder(next);
  // מיילים רק בפעם הראשונה שההזמנה עוברת ל"שולם"
  if (ok && order.pay !== "paid") {
    try {
      await sendOrderEmails(next);
    } catch (err) {
      console.error("[email]", err);
    }
  }
  return next;
}
