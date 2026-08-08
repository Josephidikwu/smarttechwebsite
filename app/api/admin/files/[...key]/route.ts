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

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `attachment; filename="${key.split("/").pop()}"`);
  headers.set("Cache-Control", "private, no-store");

  return new Response(object.body, { headers });
}
