import { pruneExpiredGalleries } from "@/lib/data/galleries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Triggered daily by Vercel Cron (see vercel.json). Vercel automatically sends
 * `Authorization: Bearer ${CRON_SECRET}` when that env var is configured.
 */
export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return new Response("CRON_SECRET non configuré", { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${expected}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await pruneExpiredGalleries();
    return Response.json({ ok: true, ...result });
  } catch (err) {
    console.error("cron cleanup failed", err);
    return new Response("Erreur lors du nettoyage", { status: 500 });
  }
}
