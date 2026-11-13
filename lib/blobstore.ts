import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * אחסון קבצים ונתונים – Netlify Blobs באתר החי, ותיקיית .data בהרצה מקומית.
 */
const onNetlify = () => Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.DEPLOY_ID);

export type BlobStore = {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getBytes(key: string): Promise<ArrayBuffer | null>;
  setBytes(key: string, data: ArrayBuffer, contentType: string): Promise<void>;
  remove(key: string): Promise<void>;
};

const stores = new Map<string, BlobStore>();

export async function blobStore(name: string): Promise<BlobStore> {
  const hit = stores.get(name);
  if (hit) return hit;
  let s: BlobStore;
  if (onNetlify()) {
    const { getStore } = await import("@netlify/blobs");
    const b = getStore({ name, consistency: "strong" });
    s = {
      getJSON: async (k) => ((await b.get(k, { type: "json" })) as never) ?? null,
      setJSON: async (k, v) => {
        await b.setJSON(k, v);
      },
      getBytes: async (k) => (await b.get(k, { type: "arrayBuffer" })) ?? null,
      setBytes: async (k, d, contentType) => {
        await b.set(k, d, { metadata: { contentType } });
      },
      remove: async (k) => {
        await b.delete(k);
      },
    };
  } else {
    const dir = path.join(process.cwd(), ".data", name);
    await fs.mkdir(dir, { recursive: true });
    const f = (k: string) => path.join(dir, k.replace(/[^\w.-]/g, "_"));
    s = {
      getJSON: async (k) => fs.readFile(f(k), "utf8").then(JSON.parse).catch(() => null),
      setJSON: (k, v) => fs.writeFile(f(k), JSON.stringify(v, null, 2)),
      getBytes: async (k) =>
        fs
          .readFile(f(k))
          .then((b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer)
          .catch(() => null),
      setBytes: (k, d) => fs.writeFile(f(k), Buffer.from(d)),
      remove: (k) => fs.rm(f(k), { force: true }),
    };
  }
  stores.set(name, s);
  return s;
}

/** הגבלת זמן המתנה לאחסון */
export const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race([p.catch(() => fallback), new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
