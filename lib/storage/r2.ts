import { getCloudflareContext } from "@opennextjs/cloudflare";

const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadKind = "document" | "image";

/**
 * Validates and stores a file under a private, non-guessable R2 key —
 * objects are never served from a public/predictable path (see
 * docs/SETUP.md security notes). Returns the object key to persist on the
 * owning row, or an error string.
 */
export async function uploadToR2(
  file: File,
  { prefix, kind }: { prefix: string; kind: UploadKind },
): Promise<{ key: string } | { error: string }> {
  if (file.size === 0) return { error: "No file was provided." };
  if (file.size > MAX_FILE_BYTES) return { error: "File is too large (max 10MB)." };

  const allowed = kind === "document" ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES;
  if (!allowed.has(file.type)) {
    return {
      error:
        kind === "document"
          ? "Only PDF or Word documents are accepted."
          : "Only JPG, PNG or WEBP images are accepted.",
    };
  }

  const { env } = getCloudflareContext();
  const extension = file.name.split(".").pop()?.toLowerCase().slice(0, 10) ?? "bin";
  const key = `${prefix}/${crypto.randomUUID()}.${extension}`;

  await env.UPLOADS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return { key };
}

/** Short-lived signed access for admin routes — objects are never public. */
export async function getSignedDownloadUrl(key: string, expiresInSeconds = 300) {
  const { env } = getCloudflareContext();
  const object = await env.UPLOADS.get(key);
  if (!object) return null;
  // R2 bindings don't presign directly; admin download routes stream the
  // object through an authenticated Route Handler instead (built in M2/M3
  // alongside the admin auth that gates it) rather than a public signed URL.
  void expiresInSeconds;
  return object;
}
