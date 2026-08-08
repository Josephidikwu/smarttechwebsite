import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireUser } from "@/lib/auth/rbac";

/**
 * The only way an uploaded document (CV, cover letter, quote attachment...)
 * is ever served — R2 objects are never public. Auth-gated, streams the
 * object through rather than issuing a public URL.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  await requireUser();

  const { key: keyParts } = await params;
  const key = keyParts.map(decodeURIComponent).join("/");

  const { env } = getCloudflareContext();
  const object = await env.UPLOADS.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  // Read metadata as plain data rather than object.writeHttpMetadata(headers) —
  // over the dev-mode Workers RPC bridge, passing a live Headers instance as
  // an RPC argument fails ("non-POJO"). Plain property reads are fine.
  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set("Content-Type", object.httpMetadata.contentType);
  }
  headers.set("Content-Disposition", `attachment; filename="${key.split("/").pop()}"`);
  headers.set("Cache-Control", "private, no-store");

  return new Response(object.body, { headers });
}
