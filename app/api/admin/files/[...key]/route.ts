import { get } from "@vercel/blob";
import { requireUser } from "@/lib/auth/rbac";

/**
 * The only way an uploaded document (CV, cover letter, quote attachment...)
 * is ever served — Blob objects are private, never public. Auth-gated,
 * streams the object through rather than issuing a public URL.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  await requireUser();

  const { key: keyParts } = await params;
  const key = keyParts.map(decodeURIComponent).join("/");

  const result = await get(key, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", result.blob.contentType);
  headers.set("Content-Disposition", `attachment; filename="${key.split("/").pop()}"`);
  headers.set("Cache-Control", "private, no-store");

  return new Response(result.stream, { headers });
}
