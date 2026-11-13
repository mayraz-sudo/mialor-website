import { blobStore } from "@/lib/blobstore";

/** תמונות מוצרים שהועלו במערכת הניהול: /media/<מזהה>.jpg */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9-]{8,64}\.(jpg|png|webp)$/.test(file)) return new Response("Not found", { status: 404 });
  const data = await (await blobStore("media")).getBytes(file).catch(() => null);
  if (!data) return new Response("Not found", { status: 404 });
  const type = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return new Response(data, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
}
