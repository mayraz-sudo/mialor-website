import { createHmac, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * הזמנות – נשמרות באחסון של Netlify (Netlify Blobs), חלק מהאתר עצמו.
 * בהרצה מקומית (בלי Netlify) נשמרות בתיקייה .data/orders לבדיקות.
 */

export type PayStatus = "pending" | "paid" | "failed";
export type Stage = "new" | "in_progress" | "ready" | "sent" | "picked_up" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: { id: string; name: string; qty: number; price: number; per?: string; sum: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  delivery: "pickup" | "post";
  customer: { name: string; phone: string; email: string; address: string; city: string; zip: string; notes: string };
  pay: PayStatus;
  payment?: { index?: string; last4?: string; response?: string; sum?: string; at?: string; mismatch?: boolean };
  stage: Stage;
  adminNote?: string;
};

type Store = {
  get(key: string): Promise<Order | null>;
  set(key: string, value: Order): Promise<void>;
  list(): Promise<string[]>;
};

let cached: Store | null = null;

async function store(): Promise<Store> {
  if (cached) return cached;
  const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.DEPLOY_ID);
  if (onNetlify) {
    const { getStore } = await import("@netlify/blobs");
    const s = getStore({ name: "orders", consistency: "strong" });
    cached = {
      get: async (k) => ((await s.get(k, { type: "json" })) as Order | null) ?? null,
      set: async (k, v) => {
        await s.setJSON(k, v);
      },
      list: async () => (await s.list()).blobs.map((b) => b.key),
    };
  } else {
    const dir = path.join(process.cwd(), ".data", "orders");
    await fs.mkdir(dir, { recursive: true });
    const file = (k: string) => path.join(dir, `${k.replace(/[^\w-]/g, "")}.json`);
    cached = {
      get: async (k) => fs.readFile(file(k), "utf8").then(JSON.parse).catch(() => null),
      set: (k, v) => fs.writeFile(file(k), JSON.stringify(v, null, 2)),
      list: async () => (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)),
    };
  }
  return cached;
}

export const saveOrder = async (o: Order) => (await store()).set(o.id, { ...o, updatedAt: new Date().toISOString() });
export const getOrder = async (id: string) => (await store()).get(id);

export async function listOrders() {
  const s = await store();
  const keys = await s.list();
  const all = await Promise.all(keys.map((k) => s.get(k)));
  return all.filter((o): o is Order => Boolean(o)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOrder(id: string, patch: Partial<Pick<Order, "stage" | "adminNote" | "pay" | "payment">>) {
  const o = await getOrder(id);
  if (!o) return null;
  const next = { ...o, ...patch };
  await saveOrder(next);
  return next;
}

/* ---------- כניסה לניהול (סיסמה אחת, מוגדרת ב-Netlify: ADMIN_PASSWORD) ---------- */

export const ADMIN_COOKIE = "mialor_admin";
const adminPassword = () => process.env.ADMIN_PASSWORD?.trim() || "";
const sessionValue = () => createHmac("sha256", adminPassword()).update("mialor-admin-session-v1").digest("hex");

export const adminConfigured = () => adminPassword().length >= 8;

export function passwordMatches(input: string) {
  const a = Buffer.from(createHmac("sha256", "cmp").update(input).digest("hex"));
  const b = Buffer.from(createHmac("sha256", "cmp").update(adminPassword()).digest("hex"));
  return adminConfigured() && timingSafeEqual(a, b);
}

export const sessionToken = () => sessionValue();

export function isAdminRequest(req: Request) {
  if (!adminConfigured()) return false;
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([a-f0-9]{64})`));
  if (!m) return false;
  return timingSafeEqual(Buffer.from(m[1]), Buffer.from(sessionValue()));
}
